const http = require('http');

const PORT = 5000;

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Accept': 'application/json'
      }
    };

    if (payload) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('--- 🚀 Starting Task 4 Verification Tests ---');
  let allPassed = true;

  const testEmail = `test.task4.${Date.now()}@example.com`;
  const testText = 'This platform is absolutely amazing and best in class! Loved the fast onboarding.';

  try {
    // 1. Test Unique Submission & Sentiment Analysis
    console.log('\n1. Testing Unique Submission & AI Sentiment Analysis...');
    const res1 = await makeRequest('POST', '/api/testimonials', {
      name: 'Task 4 Verifier',
      email: testEmail,
      company: 'AI Solutions Inc',
      rating: 5,
      testimonial: testText
    });

    if (res1.status === 201 && res1.body.success) {
      const sentiment = res1.body.data.sentiment;
      console.log(`   ✅ PASS: Unique testimonial created with status 201.`);
      console.log(`   ✅ PASS: AI Sentiment detected -> "${sentiment}"`);
      if (!['Positive', 'Neutral', 'Negative', 'Unknown'].includes(sentiment)) {
        console.error(`   ❌ FAIL: Invalid sentiment string returned: ${sentiment}`);
        allPassed = false;
      }
    } else {
      console.error(`   ❌ FAIL: Expected 201 Created, got ${res1.status}`, res1.body);
      allPassed = false;
    }

    // 2. Test Duplicate Submission Prevention (409 Conflict)
    console.log('\n2. Testing Duplicate Submission Prevention...');
    const res2 = await makeRequest('POST', '/api/testimonials', {
      name: 'Duplicate Hacker',
      email: testEmail, // same email
      company: 'Spam Co',
      rating: 5,
      testimonial: testText // same review text
    });

    if (res2.status === 409) {
      console.log(`   ✅ PASS: Duplicate submission rejected with HTTP 409 Conflict.`);
      console.log(`   💬 Error message: "${res2.body.message}"`);
    } else {
      console.error(`   ❌ FAIL: Expected 409 Conflict, got ${res2.status}`, res2.body);
      allPassed = false;
    }

    // 3. Test Pagination on Dashboard Endpoint
    console.log('\n3. Testing Backend Pagination on GET /api/testimonials?page=1&limit=2...');
    const res3 = await makeRequest('GET', '/api/testimonials?page=1&limit=2');

    if (res3.status === 200 && res3.body.success) {
      const { items, totalItems, totalPages, currentPage } = res3.body;
      if (Array.isArray(items) && typeof totalItems === 'number' && typeof totalPages === 'number' && currentPage === 1) {
        console.log(`   ✅ PASS: Pagination payload valid! (page 1 of ${totalPages}, total items: ${totalItems})`);
        console.log(`   📦 Items returned in this page: ${items.length}`);
      } else {
        console.error(`   ❌ FAIL: Malformed pagination structure:`, res3.body);
        allPassed = false;
      }
    } else {
      console.error(`   ❌ FAIL: Failed to get paginated testimonials: status ${res3.status}`);
      allPassed = false;
    }

    console.log('\n-----------------------------------------------');
    if (allPassed) {
      console.log('🎉 ALL TASK 4 TESTS PASSED SUCCESSFULY!');
      process.exit(0);
    } else {
      console.log('💥 SOME TESTS FAILED.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal Test Error:', err);
    process.exit(1);
  }
}

runTests();
