/**
 * Test GenAI Chatbot - Record Count Display
 * 
 * This script tests that GenAI responses include database record counts
 * Run: node test-genai-record-counts.js
 * 
 * Prerequisites: Backend server must be running on port 3000
 */

const testQueries = [
  {
    query: "Show all active clinical trials",
    expectedKeywords: ["record", "trial", "total", "found"]
  },
  {
    query: "List all drugs in database",
    expectedKeywords: ["record", "drug", "total", "found"]
  },
  {
    query: "How many participants are enrolled?",
    expectedKeywords: ["record", "participant", "total", "found"]
  },
  {
    query: "Show all adverse events",
    expectedKeywords: ["record", "adverse", "event", "total", "found"]
  }
];

async function testGenAIChatbot() {
  console.log('🧪 Testing GenAI Chatbot - Record Count Display\n');
  console.log('=' .repeat(80));
  
  for (let i = 0; i < testQueries.length; i++) {
    const test = testQueries[i];
    
    console.log(`\n📝 Test ${i + 1}: "${test.query}"`);
    console.log('-'.repeat(80));
    
    try {
      const response = await fetch('http://localhost:3000/api/genai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: test.query,
          sessionId: 'test-session-' + Date.now()
        })
      });
      
      if (!response.ok) {
        console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      
      console.log('\n📊 Statistics Returned:');
      if (data.statistics) {
        console.log(`   Total Records: ${data.statistics.totalRecords}`);
        console.log(`   Breakdown:`, data.statistics.breakdown);
      } else {
        console.log('   ⚠️ No statistics in response!');
      }
      
      console.log('\n💬 GenAI Response:');
      console.log(`   ${data.reply.substring(0, 200)}...`);
      
      console.log('\n✅ Response Metadata:');
      console.log(`   Model: ${data.model}`);
      console.log(`   Tokens: ${data.tokens?.total || 'N/A'}`);
      console.log(`   Latency: ${data.latencyMs}ms`);
      
      // Check if response includes record count keywords
      const lowerReply = data.reply.toLowerCase();
      const hasKeywords = test.expectedKeywords.some(keyword => 
        lowerReply.includes(keyword)
      );
      
      if (hasKeywords) {
        console.log('   ✅ Response mentions record counts');
      } else {
        console.log('   ⚠️ Response may not mention record counts clearly');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      if (error.message.includes('fetch')) {
        console.log('   💡 Make sure backend server is running: npm start');
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ All tests completed!\n');
  console.log('📌 Expected Behavior:');
  console.log('   - statistics.totalRecords should show total count');
  console.log('   - statistics.breakdown should show per-category counts');
  console.log('   - GenAI reply should mention "X records found" or similar');
}

// Run tests
testGenAIChatbot().catch(console.error);
