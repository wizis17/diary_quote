# Quick Deployment to Vercel

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Flashh Card - Vercel Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend\package.json")) {
    Write-Host "Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path "frontend\.env")) {
    Write-Host "Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Please create frontend\.env with your Supabase credentials" -ForegroundColor Yellow
    Write-Host "See frontend\.env.example for reference" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Ask for deployment method
Write-Host "Choose deployment method:" -ForegroundColor Cyan
Write-Host "1. Open Vercel website (recommended for first time)"
Write-Host "2. Deploy using Vercel CLI"
Write-Host ""
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Opening Vercel dashboard..." -ForegroundColor Green
    Start-Process "https://vercel.com/new"
    Write-Host ""
    Write-Host "Steps to deploy:" -ForegroundColor Cyan
    Write-Host "1. Sign in with GitHub"
    Write-Host "2. Import your 'flashh-card' repository"
    Write-Host "3. Configure:"
    Write-Host "   - Framework: Vite"
    Write-Host "   - Root Directory: frontend"
    Write-Host "   - Build Command: npm run build"
    Write-Host "   - Output Directory: dist"
    Write-Host "4. Add Environment Variables:"
    Write-Host "   - VITE_SUPABASE_URL"
    Write-Host "   - VITE_SUPABASE_ANON_KEY"
    Write-Host "5. Click Deploy!"
    Write-Host ""
}
elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Checking Vercel CLI..." -ForegroundColor Cyan
    
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
    
    if (-not $vercelInstalled) {
        Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
        npm install -g vercel
    }
    
    Write-Host "Deploying to Vercel..." -ForegroundColor Green
    Set-Location frontend
    vercel --prod
    Set-Location ..
    
    Write-Host ""
    Write-Host "Deployment complete!" -ForegroundColor Green
    Write-Host "Don't forget to add environment variables in Vercel dashboard!" -ForegroundColor Yellow
}
else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Deployment process completed!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
