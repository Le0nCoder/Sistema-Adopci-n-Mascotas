const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Leer el token que viene en el encabezado (Header) de la petición HTTP
    const tokenHeader = req.header('Authorization');

    // 2. Si no viene ningún token, denegar el acceso de inmediato
    if (!tokenHeader) {
        return res.status(401).json({ msg: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // El formato estándar suele ser "Bearer <TOKEN>". 
        // Vamos a separar la palabra 'Bearer' del token real.
        const token = tokenHeader.split(' ')[1] || tokenHeader;

        // 3. Verificar que el token sea auténtico usando tu firma secreta (.env)
        // 💡 Ajustado para que use PRINCIPALMENTE tu variable de entorno ultra segura
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Inyectar los datos del usuario dentro del objeto de la petición (req)
        // 🔄 CORRECCIÓN: Como pusimos id y rol en la raíz del payload, asignamos todo el objeto 'cifrado'
        req.usuario = cifrado; 
        
        // 5. Todo chido, pasamos a la siguiente función o controlador
        next();
    } catch (error) {
        console.error('Error al validar el token:', error.message);
        res.status(401).json({ msg: 'Token inválido o expirado.' });
    }
};