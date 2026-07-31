const fetch = require('node-fetch');

async function run() {
  let hasErrors = false;
  const endpoints = [
    '/api/posts',
    '/api/stats',
    '/api/taxonomy',
    '/api/github-profile'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`);
      const text = await res.text();
      try {
        JSON.parse(text);
        console.log(`✓ GET ${endpoint}`);
      } catch (e) {
        console.error(`X GET ${endpoint} returned non-JSON: ${text.substring(0, 50)}...`);
        hasErrors = true;
      }
    } catch (e) {
      console.error(`X GET ${endpoint} failed: ${e.message}`);
      hasErrors = true;
    }
  }

  process.exit(hasErrors ? 1 : 0);
}
run();
