#!/usr/bin/env node

/**
 * Quick Testing Script for Sentence Builder
 * Run this to verify critical functionality before student use
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const TEST_LEVELS = [1, 5, 10, 20, 30, 47]; // Test various difficulty levels

console.log('🧪 SENTENCE BUILDER - QUICK TESTING SCRIPT');
console.log('==========================================\n');

// Test helper function
async function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === 200;
        console.log(`${success ? '✅' : '❌'} ${description} (${res.statusCode})`);
        if (!success) {
          console.log(`   Error: ${data.substring(0, 100)}...`);
        }
        resolve(success);
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${description} (Connection Error)`);
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${description} (Timeout)`);
      req.destroy();
      resolve(false);
    });
  });
}

// Main testing function
async function runQuickTests() {
  console.log('🔍 Testing Core Endpoints...\n');
  
  const tests = [
    { url: `${BASE_URL}/`, description: 'Homepage' },
    { url: `${BASE_URL}/auth`, description: 'Authentication Page' },
    { url: `${BASE_URL}/game/levels`, description: 'Levels List' },
    { url: `${BASE_URL}/api/test-connection`, description: 'Database Connection' },
  ];
  
  // Test core endpoints
  let passedTests = 0;
  for (const test of tests) {
    const passed = await testEndpoint(test.url, test.description);
    if (passed) passedTests++;
  }
  
  console.log('\n🎮 Testing Game Levels...\n');
  
  // Test individual levels
  for (const levelId of TEST_LEVELS) {
    const passed = await testEndpoint(`${BASE_URL}/game/level/${levelId}`, `Level ${levelId}`);
    if (passed) passedTests++;
  }
  
  console.log('\n📊 Testing Results Summary');
  console.log('==========================');
  console.log(`Total Tests: ${tests.length + TEST_LEVELS.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${tests.length + TEST_LEVELS.length - passedTests}`);
  
  if (passedTests === tests.length + TEST_LEVELS.length) {
    console.log('\n🎉 ALL TESTS PASSED! Your app is ready for students!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Test the demo account: testuser@example.com / demo123');
  console.log('3. Try building sentences on different levels');
  console.log('4. Test on mobile devices');
  console.log('5. Complete the full STUDENT_READINESS_CHECKLIST.md');
  
  console.log('\n✨ Happy testing!');
}

// Run the tests
runQuickTests().catch(console.error);
