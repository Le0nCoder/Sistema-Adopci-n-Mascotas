import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Crearemos este archivo para los detalles visuales

const Login = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ajustado a 'Nombre_Usuario' como está en tu diagrama del proyecto
            const respuesta = await API.post('/auth/login', {
                Nombre_Usuario: nombreUsuario,
                Contrasena: contrasena
            });
            
            // 🔐 GUARDAR CREDENCIALES Y ACCESOS EN EL NAVEGADOR
            localStorage.setItem('token', respuesta.data.token);
            localStorage.setItem('rol', respuesta.data.usuario.rol); // 👈 ¡ESTA ES LA LÍNEA NUEVA!
            
            alert('¡Bienvenido a Amigos Salvajes!');
            navigate('/dashboard'); // O la ruta principal de tu catálogo
        } catch (err) {
            setError(err.response?.data?.msg || 'Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-container">
            {/* Encabezado idéntico a tu mockup */}
            <div className="marca-header">
                <h1 className="titulo-amigos">A M I G O S</h1>
                <h2 className="subtitulo-salvajes">S A L V A J E S<span className="com">.COM</span></h2>
                <h3 className="seccion-actual">Inicio de Sesión</h3>
            </div>

            <form onSubmit={handleSubmit} className="form-login">
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