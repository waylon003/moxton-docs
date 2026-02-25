param(
  [switch]$FixProcess
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ($FixProcess) {
  chcp 65001 > $null
  [Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $env:PYTHONUTF8 = "1"
  $env:PYTHONIOENCODING = "utf-8"
  $PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
  $PSDefaultParameterValues['Set-Content:Encoding'] = 'utf8'
  $PSDefaultParameterValues['Add-Content:Encoding'] = 'utf8'
}

$warnings = 0
$failures = 0

function OK([string]$msg) {
  Write-Output "[OK] $msg"
}

function WARN([string]$msg) {
  $script:warnings += 1
  Write-Output "[WARN] $msg"
}

function FAIL([string]$msg) {
  $script:failures += 1
  Write-Output "[FAIL] $msg"
}

function Get-ActiveCodePage {
  try {
    $line = (cmd /c chcp) | Select-Object -First 1
    if ($line -match ":\s*(\d+)\s*$") {
      return [int]$Matches[1]
    }
  } catch {}
  return $null
}

Write-Output "[UTF8-DOCTOR] PowerShell/Codex encoding preflight"

$cp = Get-ActiveCodePage
if ($null -eq $cp) {
  WARN "Unable to read active code page."
} elseif ($cp -eq 65001) {
  OK "Code page is 65001 (UTF-8)."
} else {
  WARN "Code page is $cp (expected 65001)."
}

$inEnc = [Console]::InputEncoding.WebName
$outEnc = [Console]::OutputEncoding.WebName
$pipeEnc = if ($OutputEncoding) { $OutputEncoding.WebName } else { "<null>" }

if ($inEnc -eq "utf-8") { OK "Console input encoding is utf-8." } else { WARN "Console input encoding is $inEnc (expected utf-8)." }
if ($outEnc -eq "utf-8") { OK "Console output encoding is utf-8." } else { WARN "Console output encoding is $outEnc (expected utf-8)." }
if ($pipeEnc -eq "utf-8") { OK "PowerShell pipeline encoding is utf-8." } else { WARN "PowerShell pipeline encoding is $pipeEnc (expected utf-8)." }

$python = Get-Command python -ErrorAction SilentlyContinue
if ($null -eq $python) {
  FAIL "python not found in PATH. utf8 pipeline verification skipped."
} else {
  OK ("python found: " + $python.Source)

  # "中文测试" in Unicode code points to avoid literal non-ASCII in this script.
  $sample = ([char]0x4E2D) + ([char]0x6587) + ([char]0x6D4B) + ([char]0x8BD5)
  $expected = "e4b8ade69687e6b58be8af95"

  try {
    $hex = $sample | python -c "import sys;print(sys.stdin.buffer.read().hex())"
    $hex = ($hex | Select-Object -First 1).Trim().ToLowerInvariant()
    if ($hex.StartsWith($expected)) {
      OK "Pipe roundtrip sample is UTF-8."
    } elseif ($hex.StartsWith("d6d0cec4b2e2cad4")) {
      WARN "Pipe roundtrip sample is GBK/CP936 (risk of mojibake for UTF-8 text)."
    } elseif ($hex.Length -gt 0) {
      WARN "Pipe roundtrip sample is unexpected hex: $hex"
    } else {
      WARN "Pipe roundtrip sample produced empty output."
    }
  } catch {
    WARN ("Pipe roundtrip check failed: " + $_.Exception.Message)
  }

  # Check default Set-Content behavior (without explicit -Encoding).
  $tmp = Join-Path $env:TEMP ("codex-utf8-doctor-" + [guid]::NewGuid().ToString("N") + ".txt")
  try {
    $sample | Set-Content -Path $tmp
    $bytes = [System.IO.File]::ReadAllBytes($tmp)
    $hexFile = ([System.BitConverter]::ToString($bytes)).Replace("-", "").ToLowerInvariant()
    if ($hexFile.StartsWith($expected)) {
      OK "Set-Content default wrote UTF-8 bytes for sample."
    } elseif ($hexFile.StartsWith("efbbbf" + $expected)) {
      OK "Set-Content default wrote UTF-8 BOM bytes for sample."
    } elseif ($hexFile.StartsWith("d6d0cec4b2e2cad4")) {
      WARN "Set-Content default wrote CP936 bytes. Use -Encoding UTF8 explicitly."
    } elseif ($hexFile.StartsWith("fffe2d4e87654b6dd58b")) {
      WARN "Set-Content default wrote UTF-16LE BOM. Prefer -Encoding UTF8 for repo files."
    } else {
      WARN "Set-Content default wrote unexpected bytes: $hexFile"
    }
  } catch {
    WARN ("Set-Content check failed: " + $_.Exception.Message)
  } finally {
    Remove-Item -Force -ErrorAction SilentlyContinue $tmp
  }
}

Write-Output "[UTF8-DOCTOR] summary: failures=$failures warnings=$warnings"

if ($failures -gt 0 -or $warnings -gt 0) {
  Write-Output ""
  Write-Output "Recommended quick fix for current session:"
  Write-Output "  powershell -ExecutionPolicy Bypass -File scripts/enable_utf8_session.ps1"
  Write-Output ""
  Write-Output "Recommended persistent profile snippet:"
  Write-Output "  powershell -ExecutionPolicy Bypass -File scripts/enable_utf8_session.ps1 -PrintProfileSnippet"
}

if ($failures -gt 0) { exit 1 }
if ($warnings -gt 0) { exit 2 }
exit 0
