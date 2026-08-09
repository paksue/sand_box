param(
    [Parameter(Mandatory = $true)]
    [string]$WindowsDrive,

    [Parameter(Mandatory = $true)]
    [string]$GameIso,

    [string]$DosBoxXPath = "dosbox-x.exe",
    [string]$OutputDir = ".\otii-reference-output"
)

$ErrorActionPreference = "Stop"

function Resolve-ExistingPath([string]$PathValue, [string]$Label) {
    if (-not (Test-Path -LiteralPath $PathValue)) {
        throw "$Label was not found: $PathValue"
    }
    return (Resolve-Path -LiteralPath $PathValue).Path
}

$windowsRoot = Resolve-ExistingPath $WindowsDrive "Windows 3.1 virtual C: directory"
$isoPath = Resolve-ExistingPath $GameIso "Oregon Trail II CD image"

if (-not (Test-Path -LiteralPath (Join-Path $windowsRoot "WINDOWS\WIN.COM"))) {
    throw "The supplied WindowsDrive does not contain WINDOWS\WIN.COM. Point -WindowsDrive at the directory that should be mounted as C:."
}

$dosboxCommand = Get-Command $DosBoxXPath -ErrorAction SilentlyContinue
if (-not $dosboxCommand) {
    if (-not (Test-Path -LiteralPath $DosBoxXPath)) {
        throw "DOSBox-X was not found. Install DOSBox-X or pass -DosBoxXPath with the executable path."
    }
    $dosboxExe = (Resolve-Path -LiteralPath $DosBoxXPath).Path
} else {
    $dosboxExe = $dosboxCommand.Source
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$outputRoot = (Resolve-Path -LiteralPath $OutputDir).Path
$configPath = Join-Path $outputRoot "otii-reference.conf"
$sessionPath = Join-Path $outputRoot "session-notes.txt"

# MECC's published requirements for Oregon Trail II 1.0 call for a 486-class
# Windows 3.1 PC, 640x480 / 256-color SVGA, 4 MB RAM minimum (8 recommended),
# mouse, sound, and a double-speed CD-ROM. 16 MB leaves Windows comfortable
# without changing the period character of the reference machine.
$config = @"
[sdl]
fullscreen=false
output=opengl
windowresolution=960x720
autolock=true

[dosbox]
machine=svga_s3
memsize=16

[render]
aspect=true
scaler=normal2x

[cpu]
core=normal
cputype=486_slow
cycles=fixed 12000

[mixer]
rate=44100
blocksize=1024
prebuffer=25

[sblaster]
sbtype=sb16
sbbase=220
irq=7
dma=1
hdma=5

[autoexec]
@echo off
mount c "$windowsRoot"
imgmount d "$isoPath" -t iso
c:
cd \\WINDOWS
win
"@

Set-Content -LiteralPath $configPath -Value $config -Encoding ASCII

$notes = @"
Oregon Trail II reference session
Generated: $(Get-Date -Format o)
Virtual C: $windowsRoot
OT II CD:   $isoPath
DOSBox-X:   $dosboxExe
Config:     $configPath

Reference capture protocol after Windows starts:
1. Set Windows to 640x480, 256 colors if the installed display driver permits it.
2. Install/run Oregon Trail II from D: using your legally supplied media.
3. First benchmark: Greenhorn, Oregon-bound, normal spring departure, sensible guidebook supplies.
4. Second benchmark: Trail Guide with otherwise comparable setup.
5. Record: start configuration, wall-clock time, calendar days, travel interruptions,
   travel commands, hunts, rests, illnesses/injuries and treatments, obstacle choices,
   route forks, food/water trajectory, party deaths, arrival date, and score.
6. Do not copy the Windows or game media into the repository.
"@
Set-Content -LiteralPath $sessionPath -Value $notes -Encoding UTF8

Write-Host "Launching Oregon Trail II reference environment..."
Write-Host "Config: $configPath"
Write-Host "Notes:  $sessionPath"

& $dosboxExe -conf $configPath
