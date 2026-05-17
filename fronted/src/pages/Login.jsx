import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Archivo que contiene la maquetación visual y proporciones

const Login = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiamos errores previos al intentar ingresar
        
        try {
            // Envia los campos 'Nombre_Usuario' y 'Contrasena' tal como los espera tu API en Node
            const respuesta = await API.post('/auth/login', {
                Nombre_Usuario: nombreUsuario,
                Contrasena: contrasena
            });
            
            // Verificamos que el backend responda exitosamente
            if (respuesta.data.success) {
                // 1. Guardamos el token JWT para peticiones seguras intermedias
                localStorage.setItem('token', respuesta.data.token);
                
                // 2. Guardamos el rol extrayéndolo directamente del objeto anidado 'usuario'
                localStorage.setItem('rol', respuesta.data.usuario.rol);
                
                alert(`¡Bienvenido a Amigos Salvajes, ${respuesta.data.usuario.nombres || nombreUsuario}!`);
                
                // Redirección inmediata al catálogo dinámico
                navigate('/dashboard'); 
            }
        } catch (err) {
            // Manejo de errores preciso basado en las respuestas de tu authController
            console.error("Error en el login: ", err);
            setError(err.response?.data?.msg || 'Usuario o contraseña incorrectos. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="login-container">
            {/* Encabezado idéntico a tu mockup visual */}
            <div className="marca-header">
                <h1 className="titulo-amigos">A M I G O S</h1>
                <h2 className="subtitulo-salvajes">S A L V A J E S<span className="com">.COM</span></h2>
                <h3 className="seccion-actual">Inicio de Sesión</h3>
            </div>

            <form onSubmit={handleSubmit} className="form-login">
                {/* Alerta visual en caso de credenciales inválidas */}
                {error && <p className="error-mensaje">{error}</p>}

                {/* Campo: Nombre de Usuario */}
                <div className="input-group">
                    <label>
                        <span className="icono-label">👤</span> Nombre de Usuario
                    </label>
                    <input 
                        type="text" 
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                        placeholder="Ej. paul_leon"
                        autoComplete="username"
                    />
                </div>

                {/* Campo: Contraseña */}
                <div className="input-group">
                    <label>
                        <span className="icono-label">🔒</span> Contraseña
                    </label>
                    <input 
                        type="password" 
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </div>

                {/* Botones estilo Maqueta (Simulando las patitas abajo) */}
                <div className="botones-footer">
                    <button type="button" className="btn-paw btn-cancelar" onClick={() => navigate('/')}>
                        <span className="paw-icon">🐾</span>
                        <span className="btn-text">Cancelar</span>
                    </button>
                    
                    <button type="submit" className="btn-paw btn-ingresar">
                        <span className="paw-icon">🐾</span>
                        <span className="btn-text">Ingresar</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;