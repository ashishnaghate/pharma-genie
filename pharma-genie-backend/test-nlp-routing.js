/**
 * Test NLP Service - Table-Specific Routing
 * 
 * This script tests that queries are routed to only relevant database tables.
 * Run: node test-nlp-routing.js
 */

import NLPService from './nlp-service.js';

const nlp = new NLPService();

console.log('🧪 Testing NLP Table-Specific Routing\n');
console.log('=' .repeat(80));

// Test Case 1: Clinical Trials Only
console.log('\n📋 Test 1: "Show all active clinical trials"');
const test1 = nlp.analyzeQuery('Show all active clinical trials');
console.log('Detected collections:', test1.collections);
console.log('Expected: ["trials"]');
console.log('✅ Pass:', JSON.stringify(test1.collections) === JSON.stringify(['trials']));

// Test Case 2: Drugs Only
console.log('\n💊 Test 2: "List all drugs in database"');
const test2 = nlp.analyzeQuery('List all drugs in database');
console.log('Detected collections:', test2.collections);
console.log('Expected: ["drugs"]');
console.log('✅ Pass:', JSON.stringify(test2.collections) === JSON.stringify(['drugs']));

// Test Case 3: Sites Only
console.log('\n🏥 Test 3: "Show all trial sites in New York"');
const test3 = nlp.analyzeQuery('Show all trial sites in New York');
console.log('Detected collections:', test3.collections);
console.log('Expected: ["trials", "sites"] or ["sites"]');
console.log('✅ Pass:', test3.collections.includes('sites'));

// Test Case 4: Participants Only
console.log('\n👥 Test 4: "How many participants are enrolled?"');
const test4 = nlp.analyzeQuery('How many participants are enrolled?');
console.log('Detected collections:', test4.collections);
console.log('Expected: ["participants"]');
console.log('✅ Pass:', JSON.stringify(test4.collections) === JSON.stringify(['participants']));

// Test Case 5: Adverse Events Only
console.log('\n⚠️ Test 5: "Show all serious adverse events"');
const test5 = nlp.analyzeQuery('Show all serious adverse events');
console.log('Detected collections:', test5.collections);
console.log('Expected: ["adverseEvents"]');
console.log('✅ Pass:', JSON.stringify(test5.collections) === JSON.stringify(['adverseEvents']));

// Test Case 6: Multiple Collections
console.log('\n🔀 Test 6: "Show trials with drug ABC123 and their sites"');
const test6 = nlp.analyzeQuery('Show trials with drug ABC123 and their sites');
console.log('Detected collections:', test6.collections);
console.log('Expected: Multiple collections (trials, drugs, sites)');
console.log('✅ Pass:', test6.collections.length > 1);

// Test Case 7: Phase III Trials (specific filter)
console.log('\n📊 Test 7: "Find Phase III diabetes studies"');
const test7 = nlp.analyzeQuery('Find Phase III diabetes studies');
console.log('Detected collections:', test7.collections);
console.log('Filters:', test7.filters);
console.log('Expected: ["trials"] with phase filter');
console.log('✅ Pass:', JSON.stringify(test7.collections) === JSON.stringify(['trials']) && test7.filters.phase === 'Phase III');

// Test Case 8: Default to Trials
console.log('\n🎯 Test 8: "Show me everything" (generic query)');
const test8 = nlp.analyzeQuery('Show me everything');
console.log('Detected collections:', test8.collections);
console.log('Expected: ["trials"] (default)');
console.log('✅ Pass:', JSON.stringify(test8.collections) === JSON.stringify(['trials']));

console.log('\n' + '='.repeat(80));
console.log('✅ All tests completed! Check results above.\n');

// Summary
const allTests = [test1, test2, test3, test4, test5, test6, test7, test8];
console.log('📊 Summary:');
allTests.forEach((test, i) => {
  console.log(`Test ${i + 1}: Collections = [${test.collections.join(', ')}]`);
});
