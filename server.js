const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

app.use(express.json());

// Servir archivos estáticos (como WebPrueba.html) desde esta misma carpeta
app.use(express.static(__dirname));

// Conexión a PostgreSQL (Rellena con tus datos)
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',       // tu usuario
  password: 'admin123',   // tu contraseña (cambiar a la tuya, ej: 'admin' o 'postgres')
  database: 'TestComprensionVerbal',   // tu base de datos (antes 'registro')
  port: 5432
});

// Ruta para insertar estudiante
app.post('/api/estudiantes', async (req, res) => {
  const { nombre, edad, genero, casco_urbano, tipo_colegio } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO estudiantes (nombre, edad, genero, casco_urbano, tipo_colegio) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nombre, edad, genero, casco_urbano, tipo_colegio]
    );

    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error al insertar estudiante:', err);
    res.json({ ok: false, error: err.message });
  }
});

// Ruta para recibir y procesar los resultados del test
app.post('/api/resultados', async (req, res) => {
  const payload = req.body;
  console.log('Resultados recibidos:', payload);
  
  // Aquí puedes agregar la lógica para guardar en la tabla de resultados/respuestas
  try {
    // Ejemplo de respuesta exitosa para que la interfaz no falle
    res.json({ ok: true, id: 'res-' + Date.now() });
  } catch (err) {
    console.error('Error al guardar resultados:', err);
    res.json({ ok: false, error: err.message });
  }
});

// Ruta por defecto para abrir la página del test directamente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'WebPrueba.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Puedes abrir el test en: http://localhost:${PORT}/WebPrueba.html`);
});
