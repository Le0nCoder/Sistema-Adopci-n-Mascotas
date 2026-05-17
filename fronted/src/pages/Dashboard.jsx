import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [mascotas, setMascotas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

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
        if (!token) {
            alert('Acceso denegado. Por favor, inicia sesión.');
            navigate('/login');
            return;
        }

        // Aquí haríamos la petición real al backend usando el middleware de protección:
        // API.get('/mascotas', { headers: { Authorization: `Bearer ${token}` } })
        
        setMascotas(mascotasMock);
        setCargando(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Limpia el JWT de seguridad
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
                    <p>Encuentra a tu compañero ideal entre nuestros amigos rescatados.</p>
                </section>

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
                                    <button className="btn-adoptar">Conóceme 🐾</button>
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