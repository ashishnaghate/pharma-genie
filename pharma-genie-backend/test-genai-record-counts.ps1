# Test GenAI Chatbot - Record Count Display
# PowerShell script to test GenAI endpoint

Write-Host "🧪 Testing GenAI Chatbot - Record Count Display`n" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Gray

$queries = @(
    "Show all active clinical trials",
    "List all drugs in database",
    "How many participants are enrolled?",
    "Show all adverse events"
)

$testNumber = 1
foreach ($query in $queries) {
    Write-Host "`n📝 Test $testNumber`: `"$query`"" -ForegroundColor Yellow
    Write-Host ("-" * 80) -ForegroundColor Gray
    
    try {
        $body = @{
            message = $query
            sessionId = "test-$(Get-Date -Format 'yyyyMMddHHmmss')"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/genai/chat" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body
        
        Write-Host "`n📊 Statistics Returned:" -ForegroundColor Green
        if ($response.statistics) {
            Write-Host "   Total Records: $($response.statistics.totalRecords)" -ForegroundColor White
            Write-Host "   Breakdown:" -ForegroundColor White
            Write-Host "      - Trials: $($response.statistics.breakdown.trials)" -ForegroundColor White
            Write-Host "      - Drugs: $($response.statistics.breakdown.drugs)" -ForegroundColor White
            Write-Host "      - Sites: $($response.statistics.breakdown.sites)" -ForegroundColor White
            Write-Host "      - Participants: $($response.statistics.breakdown.participants)" -ForegroundColor White
            Write-Host "      - Adverse Events: $($response.statistics.breakdown.adverseEvents)" -ForegroundColor White
        } else {
            Write-Host "   ⚠️ No statistics in response!" -ForegroundColor Yellow
        }
        
        Write-Host "`n💬 GenAI Response:" -ForegroundColor Green
        $truncatedReply = if ($response.reply.Length -gt 300) { 
            $response.reply.Substring(0, 300) + "..." 
        } else { 
            $response.reply 
        }
        Write-Host "   $truncatedReply" -ForegroundColor White
        
        Write-Host "`n✅ Response Metadata:" -ForegroundColor Green
        Write-Host "   Model: $($response.model)" -ForegroundColor White
        Write-Host "   Tokens: $($response.tokens.total)" -ForegroundColor White
        Write-Host "   Latency: $($response.latencyMs)ms" -ForegroundColor White
        
        # Check if response mentions record counts
        $lowerReply = $response.reply.ToLower()
        $mentionsCount = $lowerReply -match 'record|total|found|\d+.*trial|\d+.*drug|\d+.*site'
        
        if ($mentionsCount) {
            Write-Host "   ✅ Response mentions record counts" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Response may not mention record counts clearly" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Message -match "Unable to connect") {
            Write-Host "   💡 Make sure backend server is running: npm start" -ForegroundColor Yellow
        }
    }
    
    $testNumber++
}

Write-Host "`n$("=" * 80)" -ForegroundColor Gray
Write-Host "✅ All tests completed!`n" -ForegroundColor Green

Write-Host "📌 Expected Behavior:" -ForegroundColor Cyan
Write-Host "   - statistics.totalRecords should show total count" -ForegroundColor White
Write-Host "   - statistics.breakdown should show per-category counts" -ForegroundColor White
Write-Host "   - GenAI reply should mention 'X records found' or similar`n" -ForegroundColor White
