const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// 1. Importación ordenada de rutas
const authRoutes = require('./routers/authRoutes');
const mascotaRoutes = require('./routers/mascotaRoutes');
const adopcionRoutes = require('./routers/adopcionRoutes'); 

// 2. Montaje de endpoints
app.use('/api/auth', authRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/adopciones', adopcionRoutes);

// 3. Levantar el servidor en el puerto 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo con éxito en http://localhost:${PORT}`);
});

module.exports = app;