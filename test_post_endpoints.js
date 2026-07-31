const fetch = require('node-fetch');

async function run() {
  let hasErrors = false;

  const endpoints = [
    { method: 'POST', url: '/api/posts', body: {} },
    { method: 'POST', url: '/api/applications', body: {} }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`http://localhost:3000${ep.url}`, {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ep.body)
      });
      const text = await res.text();
      try {
        JSON.parse(text);
        console.log(`✓ ${ep.method} ${ep.url}`);
      } catch (e) {
        console.error(`X ${ep.method} ${ep.url} returned non-JSON: ${text.substring(0, 50)}...`);
        hasErrors = true;
      }
    } catch (e) {
      console.error(`X ${ep.method} ${ep.url} failed: ${e.message}`);
      hasErrors = true;
    }
  }

  process.exit(hasErrors ? 1 : 0);
}
run();
