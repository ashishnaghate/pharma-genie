# Convert TypeScript files to JavaScript by removing type annotations
# This script converts .ts files to .js files while preserving ES module syntax

$filesToConvert = @(
    "providers/genai-provider.interface",
    "providers/azure-openai-provider",
    "providers/openai-provider",
    "providers/anthropic-provider",
    "providers/mock-provider",
    "providers/provider-factory",
    "routes/genai.routes",
    "middleware/validation.middleware",
    "middleware/rate-limiter.middleware",
    "middleware/logger.middleware",
    "utils/sanitizer",
    "utils/request-id"
)

foreach ($file in $filesToConvert) {
    $tsFile = "$file.ts"
    $jsFile = "$file.js"
    
    if (Test-Path $tsFile) {
        Write-Host "Converting $tsFile -> $jsFile"
        
        # Read content
        $content = Get-Content $tsFile -Raw
        
        # Remove type annotations (basic approach)
        # Remove `: Type` patterns
        $content = $content -replace ':\s*\w+(\[\])?(\s*[|&]\s*\w+)*(?=[,;)\{\}=])', ''
        # Remove `<Type>` generics
        $content = $content -replace '<[^>]+>', ''
        # Remove interface definitions but keep exports
        $content = $content -replace 'export\s+interface\s+\w+\s*\{[^}]+\}', ''
        # Remove type exports
        $content = $content -replace 'export\s+type\s+\w+\s*=\s*[^;]+;', ''
        # Remove abstract class keywords
        $content = $content -replace 'abstract\s+class', 'class'
        # Remove async return types
        $content = $content -replace 'async\s+(\w+)\([^)]*\)\s*:\s*Promise<[^>]+>', 'async $1()'
        
        # Save as .js file
        $content | Out-File -FilePath $jsFile -Encoding UTF8
        
        # Delete .ts file
        Remove-Item $tsFile
    } else {
        Write-Host "File not found: $tsFile" -ForegroundColor Yellow
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Green