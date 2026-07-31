const fs = require('fs');
let code = fs.readFileSync('api/index.ts', 'utf8');
code = code.replace(/app\.get\('\/api\/github-profile', async \(req, res\) => \{/g, "app.get('/api/github-profile', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/taxonomy\/add', async \(req, res\) => \{/g, "app.post('/api/taxonomy/add', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/posts\/secret', async \(req, res\) => \{/g, "app.post('/api/posts/secret', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/posts\/secret\/applications', async \(req, res\) => \{/g, "app.post('/api/posts/secret/applications', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/posts\/secret\/accept', async \(req, res\) => \{/g, "app.post('/api/posts/secret/accept', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/posts\/secret\/cancel-accept', async \(req, res\) => \{/g, "app.post('/api/posts/secret/cancel-accept', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/posts\/secret\/reject', async \(req, res\) => \{/g, "app.post('/api/posts/secret/reject', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/posts\/secret\/confirm', async \(req, res\) => \{/g, "app.post('/api/posts/secret/confirm', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/applications\/secret', async \(req, res\) => \{/g, "app.post('/api/applications/secret', async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/admin\/login', async \(req, res\) => \{/g, "app.post('/api/admin/login', async (req, res, next) => {");
code = code.replace(/app\.get\('\/api\/admin\/pending-posts', requireAdminAuth, async \(req, res\) => \{/g, "app.get('/api/admin/pending-posts', requireAdminAuth, async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/admin\/approve-post', requireAdminAuth, async \(req, res\) => \{/g, "app.post('/api/admin/approve-post', requireAdminAuth, async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/admin\/reject-post', requireAdminAuth, async \(req, res\) => \{/g, "app.post('/api/admin/reject-post', requireAdminAuth, async (req, res, next) => {");
code = code.replace(/app\.post\('\/api\/admin\/recover-code', requireAdminAuth, async \(req, res\) => \{/g, "app.post('/api/admin/recover-code', requireAdminAuth, async (req, res, next) => {");
code = code.replace(/app\.put\('\/api\/posts\/secret', async \(req, res\) => \{/g, "app.put('/api/posts/secret', async (req, res, next) => {");

code = code.replace(/res\.status\(500\)\.json\(\{ error: [^}]+\} \);/g, "next(err);");
code = code.replace(/res\.status\(500\)\.json\(\{ error: [^\n]+\}\);/g, "next(err);");

fs.writeFileSync('api/index.ts', code);
