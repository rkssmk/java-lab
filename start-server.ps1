$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

try {
    $javaCommand = Get-Command java -ErrorAction Stop
    Write-Host 'Starting Java Lab local server...' -ForegroundColor Green
    Write-Host 'Keep this window open while using the site.' -ForegroundColor Yellow
    & $javaCommand.Source --add-modules jdk.httpserver (Join-Path $PSScriptRoot 'SiteServer.java')
    if ($LASTEXITCODE -ne 0) {
        throw "Java server exited with code $LASTEXITCODE"
    }
}
catch {
    Write-Host ''
    Write-Host 'Could not start Java Lab:' -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ''
    Read-Host 'Press Enter to close this window'
}
