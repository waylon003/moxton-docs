Param(
    [switch]$Doctor,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Message
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot

Push-Location $repoRoot
try {
    if ($Doctor) {
        python scripts/assign_task.py --doctor
        if ($LASTEXITCODE -ne 0) {
            exit $LASTEXITCODE
        }
    }

    $text = ($Message -join " ").Trim()
    if ([string]::IsNullOrWhiteSpace($text)) {
        python scripts/assign_task.py --standard-entry
        exit $LASTEXITCODE
    }

    python scripts/assign_task.py --intake "$text"
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
