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

    useEffect(() => {
        // 1. Verificar si el usuario realmente está logueado
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('rol');

        if (!token) {
            alert('Acceso denegado. Por favor, inicia sesión.');
            navigate('/login');
            return;
        }

        if (rol) {
            setRolUsuario(rol.toLowerCase().trim());
        }

        // 2. Petición REAL al Backend para traer las mascotas de la Base de Datos
        const cargarMascotas = async () => {
            try {
                setCargando(true);
                
                // Enviamos el token en los headers como lo pide tu middleware
                const respuesta = await API.get('/mascotas', { 
                    headers: { Authorization: `Bearer ${token}` } 
                });

                // Imprime en consola para verificar qué estructura llega exactamente
                console.log("Respuesta del servidor:", respuesta.data);

                if (respuesta.data.success) {
                    // Seteamos las mascotas reales que vienen de la base de datos
                    setMascotas(respuesta.data.mascotas); 
                }
            } catch (error) {
                // Diagnóstico en consola para ver detalles del error (CORS, 401, 404, etc.)
                console.error("Error detallado al traer las mascotas:", error.response || error);
                alert("No se pudo cargar el catálogo de mascotas. Intenta de nuevo.");
            } finally {
                setCargando(false);
            }
        };

        cargarMascotas();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Limpia el JWT de seguridad
        localStorage.removeItem('rol');   // Limpia también el rol al salir por seguridad
        navigate('/login');
    };

    // ❌ Función para eliminar una mascota de la Base de Datos
    const handleEliminarMascota = async (id, nombre) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar a ${nombre}? Esta acción no se puede deshacer.`);
        
        if (!confirmar) return;

        try {
            const token = localStorage.getItem('token');
            
            // Petición DELETE enviando el ID en los parámetros de la URL
            const respuesta = await API.delete(`/mascotas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (respuesta.data.success) {
                alert(`${nombre} ha sido eliminado correctamente.`);
                
                // Actualizamos el estado local filtrando la mascota borrada para que desaparezca sin recargar la página
                setMascotas(prevMascotas => prevMascotas.filter(mascota => mascota.id !== id));
            }
        } catch (error) {
            console.error("Error al eliminar la mascota:", error.response || error);
            alert("No se pudo eliminar la mascota. Verifica el estado del backend o los permisos.");
        }
    };

    // Filtrar mascotas según lo que escriba el usuario (Adaptado a 'descripcion' de tu BD)
    const mascotasFiltradas = mascotas.filter(mascota => {
        const nombre = mascota.nombre ? mascota.nombre.toLowerCase() : '';
        const especie = mascota.especie ? mascota.especie.toLowerCase() : '';
        const descripcion = mascota.descripcion ? mascota.descripcion.toLowerCase() : '';
        const termino = busqueda.toLowerCase();

        return nombre.includes(termino) || especie.includes(termino) || descripcion.includes(termino);
    });

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
                        placeholder="🔍 Buscar por nombre, especie (perro, gato) o descripción..." 
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
                                    {/* 📸 Usamos 'foto_url' de tu BD o un emoji por defecto si está vacío */}
                                    <div className="card-avatar">
                                        {mascota.foto_url ? (
                                            <img src={mascota.foto_url} alt={mascota.nombre} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                                        ) : (
                                            '🐾'
                                        )}
                                    </div>
                                    
                                    <div className="card-info">
                                        <h3>{mascota.nombre}</h3>
                                        <p><strong>Especie:</strong> {mascota.especie}</p>
                                        {/* 📝 Mapeado a 'descripcion' para coincidir con tu BD */}
                                        <p><strong>Descripción:</strong> {mascota.descripcion || 'Sin descripción'}</p>
                                        <p><strong>Edad:</strong> {mascota.edad}</p>
                                        <p><strong>Estado:</strong> <span className="estado-badge">{mascota.estado || 'Disponible'}</span></p>
                                    </div>
                                    
                                    {/* Botones según el Rol */}
                                    {rolUsuario === 'admin' ? (
                                        <div className="admin-card-buttons">
                                            <button className="btn-card-edit" onClick={() => alert(`Editando a ${mascota.nombre}`)}>✏️ Editar</button>
                                            
                                            {/* Acción real asignada al botón Eliminar */}
                                            <button 
                                                className="btn-card-delete" 
                                                onClick={() => handleEliminarMascota(mascota.id, mascota.nombre)}
                                            >
                                                ❌ Eliminar
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="btn-adoptar">Conóceme 🐾</button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="no-results">No se encontraron mascotas que coincidan con tu búsqueda. 😿</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;