const { Pool } = require('pg');
const pool = new Pool({
  host:     process.env.PGHOST     || 'localhost',
  user:     process.env.PGUSER     || 'postgres',
  password: process.env.PGPASSWORD || 'admin123',
  database: process.env.PGDATABASE || 'TestComprensionVerbal',
  port:     parseInt(process.env.PGPORT || '5432')
});

async function dropAndRecreate() {
  try {
    await pool.query('DROP TABLE IF EXISTS resultados;');
    console.log('Tabla resultados eliminada. Se volvera a crear al iniciar el servidor.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
dropAndRecreate();
