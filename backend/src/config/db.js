const mysql = require('mysql2');
require('dotenv').config();

// Crear un pool de conexiones usando las variables del archivo .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convertir el pool para que soporte Promesas (async/await)
const promisePool = pool.promise();

// Probar la conexión de inmediato al iniciar el servidor
promisePool.getConnection()
    .then(connection => {
        console.log('✅ ¡Conexión exitosa a la base de datos de XAMPP (MySQL)!');
        connection.release(); // Liberar la conexión de vuelta al pool
    })
    .catch(error => {
        console.error('❌ Error crítico al conectar a MySQL:', error.message);
    });

module.exports = promisePool;