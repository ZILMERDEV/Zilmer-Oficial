# Script para limpar cache do Next.js e node_modules
Write-Host "Limpando cache do Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Cache .next removido" -ForegroundColor Green
} else {
    Write-Host "✓ Cache .next não existe" -ForegroundColor Green
}

Write-Host "`nLimpando cache do npm..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✓ Cache do npm removido" -ForegroundColor Green
} else {
    Write-Host "✓ Cache do npm não existe" -ForegroundColor Green
}

Write-Host "`nPronto! Agora execute: npm run dev" -ForegroundColor Cyan












