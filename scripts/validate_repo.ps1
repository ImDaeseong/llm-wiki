$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot

function Resolve-LocalLink {
    param([string]$BaseDir, [string]$Target)

    $path = $Target.Split("#")[0].Split("?")[0]
    if ([string]::IsNullOrWhiteSpace($path) -or $path -match "^(https?://|mailto:|#|data:|javascript:)") {
        return
    }
    $resolved = Join-Path $BaseDir ([uri]::UnescapeDataString($path))
    if (-not (Test-Path -LiteralPath $resolved)) {
        throw "Broken local link: $resolved"
    }
}

$jsonFiles = @(
    "wiki-extension/manifest.json",
    "obsidian-mcp/claude_desktop_config.json"
)
foreach ($relativePath in $jsonFiles) {
    Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $repoRoot $relativePath) |
        ConvertFrom-Json | Out-Null
}

foreach ($relativePath in @("wiki-extension/background.js", "wiki-extension/content_script.js")) {
    & node --check (Join-Path $repoRoot $relativePath)
    if ($LASTEXITCODE -ne 0) {
        throw "JavaScript syntax check failed: $relativePath"
    }
}

$manifest = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $repoRoot "wiki-extension/manifest.json") |
    ConvertFrom-Json
$manifestRefs = @($manifest.background.service_worker) +
    @($manifest.action.default_popup) +
    @($manifest.content_scripts | ForEach-Object { $_.js })
foreach ($reference in $manifestRefs) {
    if (-not (Test-Path -LiteralPath (Join-Path $repoRoot "wiki-extension/$reference") -PathType Leaf)) {
        throw "Missing manifest file: $reference"
    }
}

foreach ($file in Get-ChildItem -Path $repoRoot -Recurse -File -Filter "*.md") {
    $text = Get-Content -Raw -Encoding UTF8 $file.FullName
    foreach ($match in [regex]::Matches($text, "(?<!!)\[[^\]]+\]\(([^)]+)\)")) {
        Resolve-LocalLink $file.DirectoryName $match.Groups[1].Value
    }
}

foreach ($file in Get-ChildItem -Path $repoRoot -Recurse -File -Filter "*.html") {
    $text = Get-Content -Raw -Encoding UTF8 $file.FullName
    foreach ($match in [regex]::Matches($text, "(?:src|href)=[`"']([^`"']+)[`"']")) {
        Resolve-LocalLink $file.DirectoryName $match.Groups[1].Value
    }
}

$utf8 = [System.Text.UTF8Encoding]::new($false, $true)
$textExtensions = @(".md", ".json", ".js", ".html", ".ps1")
foreach ($file in Get-ChildItem -Path $repoRoot -Recurse -File |
    Where-Object { $_.FullName -notmatch "[\\/]\.git[\\/]" -and $textExtensions -contains $_.Extension }) {
    $null = $utf8.GetString([IO.File]::ReadAllBytes($file.FullName))
}

$secretPattern = "(gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16})"
$secretHits = & rg -n --hidden -g "!.git/**" $secretPattern $repoRoot
if ($LASTEXITCODE -eq 0) {
    throw "Real-looking secret found:`n$($secretHits -join "`n")"
}
if ($LASTEXITCODE -gt 1) {
    throw "Secret scan failed with exit code $LASTEXITCODE"
}

$mcpConfig = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $repoRoot "obsidian-mcp/claude_desktop_config.json") |
    ConvertFrom-Json
$expectedArgs = @("/c", "npx", "-y", "@modelcontextprotocol/server-filesystem")
if ($mcpConfig.mcpServers.obsidian.command -ne "cmd" -or
    (Compare-Object $expectedArgs @($mcpConfig.mcpServers.obsidian.args[0..3]))) {
    throw "Obsidian MCP config must use the documented Windows filesystem-server command."
}

$obsidianGuide = Get-ChildItem -LiteralPath (Join-Path $repoRoot "docs") -File -Filter "04-obsidian-mcp-*.md"
if (@($obsidianGuide).Count -ne 1) {
    throw "Expected exactly one docs/04-obsidian-mcp-*.md guide."
}
$mcpDocs = @(
    $obsidianGuide.FullName,
    (Join-Path $repoRoot "obsidian-mcp/README.md")
)
foreach ($docPath in $mcpDocs) {
    $text = Get-Content -Raw -Encoding UTF8 -LiteralPath $docPath
    foreach ($required in @('"command": "cmd"', '"npx"', '"-y"', '"@modelcontextprotocol/server-filesystem"')) {
        if (-not $text.Contains($required)) {
            throw "$docPath is inconsistent with the Obsidian MCP template: missing $required"
        }
    }
}

Write-Output "PASS: repository JSON, JavaScript, manifest references, local links, UTF-8, secret patterns, and Obsidian MCP consistency."
