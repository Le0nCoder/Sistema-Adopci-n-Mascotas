// Middleware para restringir acceso exclusivo a Administradores
module.exports = function (req, res, next) {
    // 💡 req.usuario fue inyectado previamente por el authMiddleware
    if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({ 
            msg: 'Acceso denegado. Se requieren permisos de administrador.' 
        });
    }
    
    // Si es admin, avanzamos al controlador
    next();
};