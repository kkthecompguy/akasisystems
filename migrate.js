const createPool = require('@databases/pg');
const { sql } = require('@databases/pg');

const db = createPool('postgres://postgres:postgres@localhost:5432/akasidb');

db.query(sql.file('database.sql')).catch(ex => {
    console.error(ex);
    process.exitCode = 1;
}).then(() => db.dispose());