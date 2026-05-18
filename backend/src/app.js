const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/authRoutes');     // 🌟 CORREGIDO: Quitamos el '/src' sobrante
const mascotaRoutes = require('./routers/mascotaRoutes'); // 🌟 CORREGIDO: Quitamos el '/src' sobrante
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // <-- Procesa JSON perfectamente

// Ruta de prueba de salud
app.get('/api/health', (req, res) => {
    res.json({ status: 'Servidor funcionando correctamente' });
});

// Enlazar las rutas de autenticación de Amigos Salvajes
app.use('/api/auth', authRoutes);

// Enlazar las rutas del catálogo de Mascotas (adopcion_mascotas)
app.use('/api/mascotas', mascotaRoutes); 

// Configuración y encendido del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});