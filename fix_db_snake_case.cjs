const fs = require('fs');
let code = fs.readFileSync('src/server/db.ts', 'utf8');

// The instruction was:
// Verify every column name. Compare every query with the real database schema.
// Detect mismatches such as: camelCase vs snake_case. Example: parentPhone vs parent_phone

// Actually looking at db.ts, all mapToRow/mapFromRow do the conversion.
// However, the query filters (.eq) might use camelCase. Let's fix them.
code = code.replace(/\.eq\('postId', /g, ".eq('post_id', ");
code = code.replace(/\.eq\('secretCode', /g, ".eq('secret_code', ");

fs.writeFileSync('src/server/db.ts', code);
