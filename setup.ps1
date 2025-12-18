#!/usr/bin/env pwsh
# PharmaGenie Setup Script for Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PharmaGenie GenAI Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js 20.x+" -ForegroundColor Red
    exit 1
}

# Check npm
$npmVersion = npm --version
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
Write-Host ""

# Install Backend Dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location pharma-genie-backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit .env with your MongoDB credentials" -ForegroundColor Yellow
    Write-Host "   File location: pharma-genie-backend\.env" -ForegroundColor Yellow
    Write-Host ""
}

# Install Frontend Dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../pharma-genie-demo
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Return to root
Set-Location ..

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure MongoDB in pharma-genie-backend\.env" -ForegroundColor White
Write-Host "2. Run database seed:" -ForegroundColor White
Write-Host "   cd pharma-genie-backend" -ForegroundColor Cyan
Write-Host "   npm run seed" -ForegroundColor Cyan
Write-Host "3. Start backend:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host "4. In another terminal, start frontend:" -ForegroundColor White
Write-Host "   cd pharma-genie-demo" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host "5. Open http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "See QUICK_START.md for detailed instructions" -ForegroundColor Green
