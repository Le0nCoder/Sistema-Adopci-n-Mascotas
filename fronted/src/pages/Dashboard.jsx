import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [mascotas, setMascotas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [rolUsuario, setRolUsuario] = useState(''); // Estado para identificar el rol del usuario

    // Lista simulada de mascotas en lo que conectamos el endpoint final del backend
    const mascotasMock = [
        { id: 1, nombre: 'Thor', especie: 'Perro', raza: 'Golden Retriever', edad: '2 años', foto: '🐾' },
        { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siamés', edad: '6 meses', foto: '🐾' },
        { id: 3, nombre: 'Simba', especie: 'Perro', raza: 'Chihuahua', edad: '1 año', foto: '🐾' },
        { id: 4, nombre: 'Mimi', especie: 'Gato', raza: 'Persa', edad: '3 años', foto: '🐾' }
    ];

    useEffect(() => {
        // Verificar si el usuario realmente está logueado
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('rol'); // Leer el rol guardado en el Login

        if (!token) {
            alert('Acceso denegado. Por favor, inicia sesión.');
            navigate('/login');
            return;
        }

        // Convertimos a minúsculas para asegurar que la condición 'admin' siempre haga match perfecto
        if (rol) {
            setRolUsuario(rol.toLowerCase().trim());
        } else {
            setRolUsuario('usuario');
        }
        
        // Aquí haríamos la petición real al backend usando el middleware de protección:
        // API.get('/mascotas', { headers: { Authorization: `Bearer ${token}` } })
        
        setMascotas(mascotasMock);
        setCargando(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Limpia el JWT de seguridad
        localStorage.removeItem('rol');   // Limpia también el rol al salir por seguridad
        navigate('/login');
    };

    // Filtrar mascotas según lo que escriba el usuario
    const mascotasFiltradas = mascotas.filter(mascota =>
        mascota.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        mascota.especie.toLowerCase().includes(busqueda.toLowerCase()) ||
        mascota.raza.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            {/* Barra de Navegación Superior */}
            <header className="dashboard-nav">
                <div className="nav-logo">
                    <span className="logo-icon">🐾</span> AMIGOS SALVAJES
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    Cerrar Sesión 🚪
                </button>
            </header>

            {/* Contenido Principal */}
            <main className="dashboard-content">
                <section className="welcome-banner">
                    <h1>¡Bienvenido a tu Panel de Adopciones! 🏡</h1>
                    {/* Indicador visual dinámico del tipo de cuenta activa */}
                    <p>Sesión activa con permisos de: <strong>{rolUsuario === 'admin' ? 'Administrador 🛠️' : 'Adoptante ✨'}</strong></p>
                </section>

                {/* 🛠️ ACCIONES EXCLUSIVAS DE ADMINISTRADOR (Aparece solo si rol es 'admin') */}
                {rolUsuario === 'admin' && (
                    <div className="admin-actions-bar">
                        <h3>Gestión de Catálogo</h3>
                        <button className="btn-admin-add" onClick={() => alert('Abriendo modal para registrar nueva mascota...')}>
                            ➕ Agregar Nueva Mascota
                        </button>
                    </div>
                )}

                {/* Barra de Búsqueda */}
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="🔍 Buscar por nombre, especie (perro, gato) o raza..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {/* Grid de Tarjetas de Mascotas */}
                {cargando ? (
                    <p className="loading-text">Cargando peluditos...</p>
                ) : (
                    <div className="mascotas-grid">
                        {mascotasFiltradas.length > 0 ? (
                            mascotasFiltradas.map(mascota => (
                                <div key={mascota.id} className="mascota-card">
                                    <div className="card-avatar">{mascota.foto}</div>
                                    <div className="card-info">
                                        <h3>{mascota.nombre}</h3>
                                        <p><strong>Especie:</strong> {mascota.especie}</p>
                                        <p><strong>Raza:</strong> {mascota.raza}</p>
                                        <p><strong>Edad:</strong> {mascota.edad}</p>
                                    </div>
                                    
                                    {/* BOTONES MUTABLES SEGÚN EL ROL DETECTADO */}
                                    {rolUsuario === 'admin' ? (
                                        <div className="admin-card-buttons">
                                            <button className="btn-card-edit" onClick={() => alert(`Editando a ${mascota.nombre}`)}>✏️ Editar</button>
                                            <button className="btn-card-delete" onClick={() => alert(`Eliminando a ${mascota.nombre}`)}>❌ Eliminar</button>
                                        </div>
                                    ) : (
                                        <button className="btn-adoptar">Conóceme 🐾</button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="no-results">No se encontraron mascotas que coincidan con tu búsqueda. 😿</p>
                        )
                    }
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;