# PowerShell script to update all remaining TypeScript components for SSR meta tags
# This script adds SSR title/meta tags to constructor for all components

$ErrorActionPreference = "Continue"
$updatedCount = 0
$skippedCount = 0
$errorCount = 0

# Get all TypeScript component files that have titleService
$files = Get-ChildItem -Path "src\app" -Filter "*.component.ts" -Recurse | 
    Where-Object { (Get-Content $_.FullName -Raw) -match "titleService\.setTitle|title\.setTitle" }

Write-Host "Found $($files.Count) component files with title service`n" -ForegroundColor Cyan

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        
        # Skip if already has SSR comment
        if ($content -match "// SSR Title & Meta Render") {
            Write-Host "⏭️  SKIP: $($file.Name) (already updated)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Find constructor that ends with empty braces
        if ($content -notmatch "constructor\([^\)]*\)\s*\{\s*\}") {
            Write-Host "⏭️  SKIP: $($file.Name) (constructor not empty or not found)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Extract the title line from ngOnInit
        $titleMatch = [regex]::Match($content, "this\.(titleService|title)\.setTitle\(([^;]+)\);")
        if (-not $titleMatch.Success) {
            Write-Host "⚠️  WARN: $($file.Name) (no setTitle found)" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        $titleLine = $titleMatch.Value
        
        # Extract canonical URL if exists
        $canonicalMatch = [regex]::Match($content, "this\.seoService\.setCanonicalURL\(([^;]+)\);")
        $canonicalLine = if ($canonicalMatch.Success) { $canonicalMatch.Value } else { "" }
        
        # Extract first meta description
        $metaMatch = [regex]::Match($content, "this\.metaService\.updateTag\(\s*\{\s*name:\s*['""]description['""],\s*content:\s*([^}]+)\}\s*\);")
        $metaLine = if ($metaMatch.Success) { $metaMatch.Value } else { "" }
        
        # Build the constructor injection
        $injection = @"
 {
    // SSR Title & Meta Render (executes during prerender)
"@
        
        if ($canonicalLine) {
            $injection += "`n    $canonicalLine"
        }
        
        $injection += "`n    $titleLine"
        
        if ($metaLine) {
            $injection += "`n    $metaLine"
        }
        
        $injection += "`n  }"
        
        # Replace empty constructor
        $newContent = $content -replace "constructor\(([^\)]*)\)\s*\{\s*\}", "constructor(`$1)$injection"
        
        # Write back
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        
        Write-Host "✅ UPDATE: $($file.Name)" -ForegroundColor Green
        $updatedCount++
        
    } catch {
        Write-Host "❌ ERROR: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`n$('=' * 60)" -ForegroundColor Cyan
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  ✅ Updated: $updatedCount" -ForegroundColor Green
Write-Host "  ⏭️  Skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "  ❌ Errors: $errorCount" -ForegroundColor Red

Write-Host "`n✨ Done! Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review the changes in your IDE"
Write-Host "  2. Test with: npm run build:ssr"
Write-Host "  3. Verify meta tags in generated HTML"
Write-Host ""

