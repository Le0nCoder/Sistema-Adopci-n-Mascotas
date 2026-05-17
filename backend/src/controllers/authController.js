const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro Completo de Usuario (Amigos Salvajes)
exports.registrarUsuario = async (req, res) => {
    // 🔍 Ponemos este log para espiar en la terminal exactamente qué campos están llegando de React
    console.log("Payload recibido desde el Frontend:", req.body);

    const {
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        diaNacimiento,
        mesNacimiento,
        anioNacimiento,
        correoElectronico,
        telefono,
        ciudad,
        colonia,
        codigoPostal,
        genero,
        nombreUsuario,
        contrasena,       // Nombre que declaramos en el estado de React
        contraseña        // Por si acaso React lo mandó con 'ñ'
    } = req.body;

    // 🛡️ SOLUCIÓN AL CRASH: Validamos cuál de las dos variables trae la clave real
    const passwordReal = contrasena || contraseña;

    // Si por alguna razón ambas llegan vacías, respondemos limpiamente sin tumbar el servidor con un crash
    if (!passwordReal) {
        return res.status(400).json({ 
            msg: 'La contraseña es requerida y no fue recibida correctamente por el servidor.' 
        });
    }

    try {
        // 1. Validar si el Nombre de Usuario o el Correo ya existen
        const [usuarioExistente] = await db.query(
            'SELECT * FROM usuarios WHERE Nombre_Usuario = ? OR Correo_Electronico = ?',
            [nombreUsuario, correoElectronico]
        );

        if (usuarioExistente.length > 0) {
            return res.status(400).json({ 
                msg: 'El nombre de usuario o el correo electrónico ya están registrados' 
            });
        }

        // 2. Darle formato a la fecha de nacimiento (AAAA-MM-DD) para MySQL
        const pad = (num) => String(num).padStart(2, '0');
        const fechaNacimiento = `${anioNacimiento}-${pad(mesNacimiento)}-${pad(diaNacimiento)}`;

        // 3. Encriptar la contraseña de forma segura usando la variable validada
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(passwordReal, salt);

        // 4. Insertar el registro en la base de datos de XAMPP
        const querySQL = `
            INSERT INTO usuarios (
                Nombres, Apellido_Paterno, Apellido_Materno, 
                Fecha_Nacimiento, Correo_Electronico, Telefono, 
                Ciudad, Colonia, Codigo_Postal, 
                Genero, Nombre_Usuario, Contrasena, Rol
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            fechaNacimiento,
            correoElectronico,
            telefono,
            ciudad,
            colonia,
            codigoPostal,
            genero,
            nombreUsuario,
            contrasenaEncriptada,
            'adoptante'
        ];

        await db.query(querySQL, valores);

        // 5. Responder con éxito
        res.status(201).json({ 
            success: true, 
            msg: '¡Usuario registrado exitosamente en Amigos Salvajes!' 
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ 
            msg: 'Error interno en el servidor al procesar el registro' 
        });
    }
};

// Iniciar Sesión de Usuario (Amigos Salvajes) - Sincronizado con Login.jsx
// Iniciar Sesión de Usuario (Amigos Salvajes) - Versión con JWT Real
exports.loginUsuario = async (req, res) => {
    console.log("Intento de Login recibido desde el Frontend:", req.body);

    const { Nombre_Usuario, Contrasena } = req.body;

    if (!Nombre_Usuario || !Contrasena) {
        return res.status(400).json({ 
            msg: 'Por favor, ingresa tu usuario (o correo) y contraseña.' 
        });
    }

    try {
        // 1. Buscar al usuario en la BD
        const [usuarios] = await db.query(
            'SELECT * FROM usuarios WHERE Nombre_Usuario = ? OR Correo_Electronico = ?',
            [Nombre_Usuario, Nombre_Usuario]
        );

        if (usuarios.length === 0) {
            return res.status(400).json({ 
                msg: 'El nombre de usuario o correo electrónico no existe.' 
            });
        }

        const usuario = usuarios[0];

        // 2. Verificar contraseña
        const contrasenaCorrecta = await bcrypt.compare(Contrasena, usuario.Contrasena);

        if (!contrasenaCorrecta) {
            return res.status(400).json({ 
                msg: 'La contraseña es incorrecta.' 
            });
        }

        // =========================================================================
        // 🔐 ¡AQUÍ GENERAMOS EL JWT REAL!
        // =========================================================================
        // El "payload" es la información pública que guardaremos dentro del token
        const payload = {
            id: usuario.id,
            rol: usuario.Rol
        };

        // Firmamos el token usando nuestra clave secreta del .env y le damos 2 horas de vida
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });

        // 3. Responder enviando el Token Real al Frontend
        res.status(200).json({
            success: true,
            token: token, // 👈 Este ya es un token JWT real, largo y encriptado
            msg: `¡Bienvenido de vuelta, ${usuario.Nombres}!`,
            usuario: {
                id: usuario.id,
                nombres: usuario.Nombres,
                nombreUsuario: usuario.Nombre_Usuario,
                rol: usuario.Rol
            }
        });

    } catch (error) {
        console.error('Error en el loginUsuario:', error);
        res.status(500).json({ 
            msg: 'Error interno en el servidor al procesar el inicio de sesión.' 
        });
    }
};