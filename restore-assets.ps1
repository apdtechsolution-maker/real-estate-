
$ErrorActionPreference = "Continue"

$baseUrl = "https://images.unsplash.com/"
$imageDir = Join-Path $PSScriptRoot "public\images"

New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

$images = @(
    @{ Name="bed-1.jpg"; Id="photo-1611892440504-42a792e24d32" },
    @{ Name="bed-2.jpg"; Id="photo-1616594039964-ae9021a400a0" },
    @{ Name="bed-city.jpg"; Id="photo-1600210492486-724fe5c67fb0" },
    @{ Name="city-sunset.jpg"; Id="photo-1519501025264-65ba15a82390" },
    @{ Name="facade-1.jpg"; Id="photo-1600607687939-ce8a6c25118c" },
    @{ Name="facade-2.jpg"; Id="photo-1600566753086-00f18fb6b3ea" },
    @{ Name="facade-3.jpg"; Id="photo-1600607687644-c7171b42498f" },
    @{ Name="gym.jpg"; Id="photo-1534438327276-14e5300c3a48" },
    @{ Name="hero-render-day.jpg"; Id="photo-1600607687920-4e2a09cf159d" },
    @{ Name="hero-render-night.jpg"; Id="photo-1600607687939-ce8a6c25118c" },
    @{ Name="int-black.jpg"; Id="photo-1600210492486-724fe5c67fb0" },
    @{ Name="int-chair.jpg"; Id="photo-1598300056393-4aac492f4344" },
    @{ Name="int-dining.jpg"; Id="photo-1600566753190-17f0baa2a6c3" },
    @{ Name="int-fireplace.jpg"; Id="photo-1600210491892-03d54c0aaf87" },
    @{ Name="int-light.jpg"; Id="photo-1600607687939-ce8a6c25118c" },
    @{ Name="landscape-1.jpg"; Id="photo-1511818966892-d7d671e672a2" },
    @{ Name="landscape-2.jpg"; Id="photo-1510798831971-661eb04b3739" },
    @{ Name="landscape-3.jpg"; Id="photo-1500530855697-b586d89ba3ee" },
    @{ Name="lounge.jpg"; Id="photo-1600210492486-724fe5c67fb0" },
    @{ Name="material-detail.jpg"; Id="photo-1600566753086-00f18fb6b3ea" },
    @{ Name="penthouse.jpg"; Id="photo-1600607687920-4e2a09cf159d" },
    @{ Name="pool-city.jpg"; Id="photo-1572331165267-854da2b10ccc" },
    @{ Name="pool-mountain.jpg"; Id="photo-1576013551627-0cc20b96c2a7" },
    @{ Name="pool-rooftop.jpg"; Id="photo-1572331165267-854da2b10ccc" },
    @{ Name="residence-interior.jpg"; Id="photo-1600566753190-17f0baa2a6c3" },
    @{ Name="seaside.jpg"; Id="photo-1518837695005-2083093ee35b" },
    @{ Name="spa.jpg"; Id="photo-1540555700478-4be289fbecef" },
    @{ Name="terrace-fire.jpg"; Id="photo-1600607687939-ce8a6c25118c" },
    @{ Name="terrace.jpg"; Id="photo-1600210492486-724fe5c67fb0" },
    @{ Name="twilight-apt.jpg"; Id="photo-1600607687644-c7171b42498f" },
    @{ Name="villa-cars.jpg"; Id="photo-1600607687939-ce8a6c25118c" },
    @{ Name="villa.jpg"; Id="photo-1613977257363-707ba9348227" },
    @{ Name="vision-1.jpg"; Id="photo-1600607687920-4e2a09cf159d" },
    @{ Name="vision-2.jpg"; Id="photo-1600566753086-00f18fb6b3ea" }
)

$success = 0
$failed = 0

foreach ($item in $images) {
    $destination = Join-Path $imageDir $item.Name

    if (Test-Path $destination) {
        Write-Host "SKIPPED: $($item.Name)" -ForegroundColor Yellow
        continue
    }

    $url = "$baseUrl$($item.Id)?auto=format&fit=crop&w=1600&q=85"

    try {
        Invoke-WebRequest -Uri $url -OutFile $destination -UseBasicParsing -TimeoutSec 30

        if ((Get-Item $destination).Length -gt 5000) {
            Write-Host "DOWNLOADED: $($item.Name)" -ForegroundColor Green
            $success++
        }
        else {
            Remove-Item $destination -Force
            Write-Host "FAILED: $($item.Name) - Invalid image" -ForegroundColor Red
            $failed++
        }
    }
    catch {
        if (Test-Path $destination) {
            Remove-Item $destination -Force
        }
        Write-Host "FAILED: $($item.Name)" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`nDownload Complete!"
Write-Host "Successful: $success"
Write-Host "Failed: $failed"
Write-Host "Location: $imageDir"
