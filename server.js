const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

app.use(express.json());

// Servir archivos estáticos (como WebPrueba.html) desde esta misma carpeta
app.use(express.static(__dirname));

// Conexión a PostgreSQL (Rellena con tus datos o usa variables de entorno)
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'admin123',
  database: process.env.PGDATABASE || 'TestComprensionVerbal',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432
});

// Inicializar las tablas necesarias si no existen
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id SERIAL PRIMARY KEY,
        nombre TEXT,
        cedula TEXT,
        edad INTEGER,
        sexo TEXT,
        departamento TEXT,
        municipio TEXT,
        zona TEXT,
        colegio TEXT,
        tipo_colegio TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS resultados (
        id SERIAL PRIMARY KEY,
        estudiante_id INTEGER REFERENCES estudiantes(id) ON DELETE CASCADE,
        pagina INTEGER,
        respuestas JSONB,
        puntaje INTEGER,
        tiempo_segundos INTEGER,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    console.log('Tablas verificadas/creadas');
  } catch (err) {
    console.error('Error inicializando la base de datos:', err);
    throw err;
  }
}

// Ruta para insertar estudiante
app.post('/api/estudiantes', async (req, res) => {
  // Acepta los campos que envía WebPrueba.html:
  // { nombre, cedula, edad, sexo, departamento, municipio, zona, colegio, tipo_colegio }
  const { nombre, cedula, edad, sexo, departamento, municipio, zona, colegio, tipo_colegio } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO estudiantes (nombre, cedula, edad, sexo, departamento, municipio, zona, colegio, tipo_colegio)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [nombre, cedula, edad, sexo, departamento, municipio, zona, colegio, tipo_colegio]
    );

    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error al insertar estudiante:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta para recibir y procesar los resultados del test
app.post('/api/resultados', async (req, res) => {
  // Espera un payload como:
  // { estudiante_id, pagina, respuestas, puntaje, tiempo_segundos, metadata }
  // - respuestas puede ser un objeto/array con las respuestas de esa página
  // - si no viene estudiante_id pero viene cedula, intentamos buscar el estudiante por cedula
  const { estudiante_id, cedula, pagina, respuestas, puntaje, tiempo_segundos, metadata } = req.body;

  try {
    let sid = estudiante_id;

    if (!sid && cedula) {
      const r = await pool.query('SELECT id FROM estudiantes WHERE cedula = $1 LIMIT 1', [cedula]);
      if (r.rowCount) sid = r.rows[0].id;
    }

    if (!sid) {
      return res.status(400).json({ ok: false, error: 'Falta estudiante_id o cedula en el payload' });
    }

    const insert = await pool.query(
      `INSERT INTO resultados (estudiante_id, pagina, respuestas, puntaje, tiempo_segundos, metadata)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [sid, pagina || null, respuestas ? respuestas : null, puntaje || null, tiempo_segundos || null, metadata ? metadata : null]
    );

    res.json({ ok: true, id: insert.rows[0].id });
  } catch (err) {
    console.error('Error al guardar resultados:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta por defecto para abrir la página del test directamente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'WebPrueba.html'));
});

// Inicialización y arranque
const PORT = process.env.PORT || 3000;
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Puedes abrir el test en: http://localhost:${PORT}/WebPrueba.html`);
    });
  })
  .catch(err => {
    console.error('No se pudo iniciar el servidor por error en DB:', err);
    process.exit(1);
  });
