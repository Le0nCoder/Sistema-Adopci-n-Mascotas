// 📁 Ubicación: backend/src/controllers/mascotaController.js
const db = require('../config/db'); //

// 1. OBTENER TODAS LAS MASCOTAS (Ya funcionando)
exports.obtenerMascotas = async (req, res) => { //
    try { //
        // Consulta a la tabla correcta 'mascotas' de tu BD 'adopcion_mascotas'
        const [rows] = await db.query('SELECT * FROM mascotas'); //

        return res.status(200).json({ //
            success: true, //
            mascotas: rows //
        }); //
    } catch (error) { //
        console.error("Error al obtener mascotas:", error); //
        return res.status(500).json({ //
            success: false, //
            msg: "Error en el servidor al obtener el catálogo." //
        }); //
    } //
}; //

// 2. ❌ ELIMINAR UNA MASCOTA DE LA BASE DE DATOS
exports.eliminarMascota = async (req, res) => {
    const { id } = req.params; // Captura el ID desde la URL (ej: /api/mascotas/9)
    
    try {
        // Ejecuta el borrado físico en la tabla mascotas
        const [result] = await db.query('DELETE FROM mascotas WHERE id = ?', [id]);

        // Si las filas afectadas son 0, significa que ese ID no existía
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                msg: "La mascota no existe o ya fue eliminada." 
            });
        }

        // Respuesta exitosa que espera Axios en el Frontend
        return res.status(200).json({ 
            success: true, 
            msg: "Mascota eliminada correctamente de la base de datos." 
        });

    } catch (error) {
        console.error("Error en el servidor al eliminar mascota:", error);
        return res.status(500).json({ 
            success: false, 
            msg: "Hubo un error en el servidor al intentar eliminar la mascota." 
        });
    }
};

// 3. ✏️ ACTUALIZAR/EDITAR LOS DATOS DE UNA MASCOTA (Para dejarlo listo)
exports.actualizarMascota = async (req, res) => {
    const { id } = req.params;
    const { nombre, especie, edad, descripcion } = req.body; // Datos que vienen del modal de React

    try {
        const [result] = await db.query(
            'UPDATE mascotas SET nombre = ?, especie = ?, edad = ?, descripcion = ? WHERE id = ?',
            [nombre, especie, edad, descripcion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                msg: "Mascota no encontrada para actualizar." 
            });
        }

        return res.status(200).json({ 
            success: true, 
            msg: "Mascota actualizada correctamente." 
        });

    } catch (error) {
        console.error("Error en el servidor al actualizar mascota:", error);
        return res.status(500).json({ 
            success: false, 
            msg: "Hubo un error en el servidor al intentar actualizar la mascota." 
        });
    }
};

// ➕ AGREGA ESTA FUNCIÓN AL FINAL DE TU ARCHIVO:
exports.crearMascota = async (req, res) => {
    // Capturamos los datos enviados desde el formulario de React
    const { nombre, especie, edad, descripcion, foto_url, estado } = req.body;

    // Validación básica por seguridad
    if (!nombre || !especie || !edad) {
        return res.status(400).json({ 
            success: false, 
            msg: "Por favor, completa los campos obligatorios (Nombre, Especie y Edad)." 
        });
    }

    try {
        // Insertamos el nuevo registro. Si foto_url o estado no vienen, usamos defaults
        const [result] = await db.query(
            'INSERT INTO mascotas (nombre, especie, edad, descripcion, foto_url, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, especie, edad, descripcion || null, foto_url || null, estado || 'Disponible']
        );

        return res.status(201).json({
            success: true,
            msg: "Mascota registrada exitosamente.",
            mascotaId: result.insertId // Retornamos el ID generado por MySQL
        });

    } catch (error) {
        console.error("Error en el servidor al crear mascota:", error);
        return res.status(500).json({
            success: false,
            msg: "Hubo un error en el servidor al intentar registrar la mascota."
        });
    }
};