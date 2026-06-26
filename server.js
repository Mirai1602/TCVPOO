const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

app.use(express.json());

// Servir archivos estáticos desde esta misma carpeta
app.use(express.static(__dirname));

// ─── Conexión a PostgreSQL ────────────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.PGHOST     || 'localhost',
  user:     process.env.PGUSER     || 'postgres',
  password: process.env.PGPASSWORD || 'admin123',
  database: process.env.PGDATABASE || 'TestComprensionVerbal',
  port:     parseInt(process.env.PGPORT || '5432')
});

// ─── Crear tablas si no existen ───────────────────────────────────────────────
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id            SERIAL PRIMARY KEY,
        nombre        VARCHAR(200) NOT NULL,
        cedula        VARCHAR(50),
        edad          INTEGER,
        sexo          VARCHAR(20),
        departamento  VARCHAR(100),
        municipio     VARCHAR(100),
        zona          VARCHAR(20),
        colegio       VARCHAR(200),
        tipo_colegio  VARCHAR(20),
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS resultados (
        id              SERIAL PRIMARY KEY,
        estudiante_id   INTEGER REFERENCES estudiantes(id),
        respuestas      JSONB,
        aciertos        INTEGER,
        total_preguntas INTEGER,
        porcentaje      INTEGER,
        tiempo_total    VARCHAR(20),
        completado      BOOLEAN DEFAULT TRUE,
        metadata        JSONB,
        created_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('✅ Tablas verificadas/creadas correctamente.');
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err.message);
  }
}

// ─── POST /api/estudiantes ────────────────────────────────────────────────────
// Registra un estudiante y devuelve { ok: true, id }
app.post('/api/estudiantes', async (req, res) => {
  const {
    nombre, cedula, edad, sexo,
    departamento, municipio, zona,
    colegio, tipo_colegio
  } = req.body;

  if (!nombre) {
    return res.status(400).json({ ok: false, error: 'El campo nombre es requerido.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO estudiantes
         (nombre, cedula, edad, sexo, departamento, municipio, zona, colegio, tipo_colegio)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [nombre, cedula, edad, sexo, departamento, municipio, zona, colegio, tipo_colegio]
    );
    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error al insertar estudiante:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── POST /api/resultados ─────────────────────────────────────────────────────
// Guarda los resultados del test en PostgreSQL
app.post('/api/resultados', async (req, res) => {
  const {
    estudiante_id,
    respuestas,
    aciertos,
    totalPreguntas,
    porcentaje,
    tiempo_total,
    completado,
    metadata
  } = req.body;

  // También acepta la estructura antigua { estudiante: {...}, respuestas, tiempo_total }
  const payload = req.body;
  const estId = estudiante_id
    ?? (payload.estudiante && payload.resultados && payload.resultados.estudiante_id)
    ?? null;

  try {
    const result = await pool.query(
      `INSERT INTO resultados
         (estudiante_id, respuestas, aciertos, total_preguntas, porcentaje, tiempo_total, completado, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        estId,
        JSON.stringify(respuestas ?? payload.respuestas ?? {}),
        aciertos   ?? (payload.resultados?.aciertos)          ?? null,
        totalPreguntas ?? (payload.resultados?.totalPreguntas) ?? null,
        porcentaje ?? (payload.resultados?.porcentaje)        ?? null,
        tiempo_total ?? payload.tiempo_total ?? null,
        completado  ?? true,
        JSON.stringify(metadata ?? {})
      ]
    );
    console.log('✅ Resultado guardado, id:', result.rows[0].id);
    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error al guardar resultados:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── Ruta raíz ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'WebPrueba.html'));
});

// ─── Arrancar servidor ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Abre el test en:    http://localhost:${PORT}/WebPrueba.html`);
  await initDB();
});
