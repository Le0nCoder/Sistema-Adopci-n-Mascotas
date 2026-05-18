const db = require('../config/db');

exports.solicitarAdopcion = async (req, res) => {
    const { mascota_id, motivos } = req.body;
    
    // Extrae el ID de usuario de cualquier variante que use tu JWT middleware
    const usuario_id = req.usuario?.id || req.user?.id || req.usuario?.id_usuario || req.user?.id_usuario; 

    if (!mascota_id) {
        return res.status(400).json({ success: false, msg: "Falta el ID de la mascota." });
    }

    if (!usuario_id) {
        return res.status(401).json({ 
            success: false, 
            msg: "No se pudo identificar al usuario autenticado. Token inválido o ausente." 
        });
    }

    try {
        // Inserción exacta en la tabla 'solicitudes_adopcion'
        const query = `
            INSERT INTO solicitudes_adopcion (usuario_id, mascota_id, motivos, estado) 
            VALUES (?, ?, ?, 'Pendiente')
        `;
        
        await db.query(query, [usuario_id, mascota_id, motivos || '']);

        return res.status(201).json({
            success: true,
            msg: "¡Solicitud de adopción enviada correctamente! El administrador revisará tu perfil."
        });

    } catch (error) {
        console.error("❌ ERROR REAL EN MYSQL:", error.message);
        return res.status(500).json({
            success: false,
            msg: "Error interno en el servidor al procesar la adopción."
        });
    }
};