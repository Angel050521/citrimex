# Script para comprimir imágenes de fondo (con blur) y beneficios
# Usa System.Drawing de .NET para recomprimir JPGs con menor calidad
# Ejecutar en PowerShell

Add-Type -AssemblyName System.Drawing

$sourceDir = "c:\wamp64\www\citrimex\images\unsplash"
$backupDir = "c:\wamp64\www\citrimex\images\unsplash\backup"

# Crear carpeta de backup si no existe
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Imágenes de fondo con blur - calidad baja (30%)
$blurImages = @(
    "hero-bg.jpg",
    "benefits-bg.jpg", 
    "market-bg.jpg",
    "contact-bg.jpg"
)

# Imágenes de valores/beneficios - calidad media (50%)
$benefitsImages = @(
    "mision.jpg",
    "vision.jpg",
    "calidad.jpg",
    "confianza.jpg",
    "equipo.jpg",
    "pasion.jpg",
    "consumidor.jpg",
    "eficiencia.jpg"
)

function Compress-Image {
    param (
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Quality
    )
    
    try {
        $image = [System.Drawing.Image]::FromFile($InputPath)
        
        # Crear encoder para JPEG
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
        Where-Object { $_.MimeType -eq 'image/jpeg' }
        
        # Configurar calidad
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
            [System.Drawing.Imaging.Encoder]::Quality, $Quality
        )
        
        # Guardar con nueva calidad
        $image.Save($OutputPath, $jpegCodec, $encoderParams)
        $image.Dispose()
        
        return $true
    }
    catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "=== Comprimiendo imagenes de fondo (blur) - Calidad 30% ===" -ForegroundColor Cyan

foreach ($img in $blurImages) {
    $inputPath = Join-Path $sourceDir $img
    $backupPath = Join-Path $backupDir $img
    $tempPath = Join-Path $sourceDir "temp_$img"
    
    if (Test-Path $inputPath) {
        $sizeBefore = (Get-Item $inputPath).Length / 1KB
        
        # Hacer backup
        Copy-Item $inputPath $backupPath -Force
        
        # Comprimir
        Write-Host "Comprimiendo $img..." -ForegroundColor Yellow
        
        if (Compress-Image -InputPath $inputPath -OutputPath $tempPath -Quality 30) {
            Remove-Item $inputPath -Force
            Rename-Item $tempPath $img
            
            $sizeAfter = (Get-Item $inputPath).Length / 1KB
            $saved = [math]::Round((1 - $sizeAfter / $sizeBefore) * 100, 1)
            Write-Host "  OK: $([math]::Round($sizeBefore, 1))KB -> $([math]::Round($sizeAfter, 1))KB (ahorro: $saved%)" -ForegroundColor Green
        }
    }
}

Write-Host "`n=== Comprimiendo imagenes de valores - Calidad 50% ===" -ForegroundColor Cyan

foreach ($img in $benefitsImages) {
    $inputPath = Join-Path $sourceDir $img
    $backupPath = Join-Path $backupDir $img
    $tempPath = Join-Path $sourceDir "temp_$img"
    
    if (Test-Path $inputPath) {
        $sizeBefore = (Get-Item $inputPath).Length / 1KB
        
        # Hacer backup
        Copy-Item $inputPath $backupPath -Force
        
        # Comprimir
        Write-Host "Comprimiendo $img..." -ForegroundColor Yellow
        
        if (Compress-Image -InputPath $inputPath -OutputPath $tempPath -Quality 50) {
            Remove-Item $inputPath -Force
            Rename-Item $tempPath $img
            
            $sizeAfter = (Get-Item $inputPath).Length / 1KB
            $saved = [math]::Round((1 - $sizeAfter / $sizeBefore) * 100, 1)
            Write-Host "  OK: $([math]::Round($sizeBefore, 1))KB -> $([math]::Round($sizeAfter, 1))KB (ahorro: $saved%)" -ForegroundColor Green
        }
    }
}

Write-Host "`n=== Compresion completada! ===" -ForegroundColor Cyan
Write-Host "Las imagenes originales se guardaron en: $backupDir" -ForegroundColor Gray
