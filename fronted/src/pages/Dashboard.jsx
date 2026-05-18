import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [mascotas, setMascotas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [rolUsuario, setRolUsuario] = useState('');

    // 🪟 Estados para la Ventana Modal de Edición
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [mascotaAEditar, setMascotaAEditar] = useState(null);
    const [datosEditar, setDatosEditar] = useState({ nombre: '', especie: '', edad: '', descripcion: '' });

    // ➕ Estados para la Ventana Modal de Registro
    const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
    const [datosNuevaMascota, setDatosNuevaMascota] = useState({
        nombre: '',
        especie: 'perro',
        edad: '',
        descripcion: '',
        foto_url: ''
    });

    useEffect(() => {
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

        const cargarMascotas = async () => {
            try {
                setCargando(true);
                const respuesta = await API.get('/mascotas', { 
                    headers: { Authorization: `Bearer ${token}` } 
                });

                console.log("Respuesta del servidor:", respuesta.data);

                if (respuesta.data.success) {
                    setMascotas(respuesta.data.mascotas); 
                }
            } catch (error) {
                console.error("Error al traer las mascotas:", error.response || error);
                alert("No se pudo cargar el catálogo de mascotas. Intenta de nuevo.");
            } finally {
                setCargando(false);
            }
        };

        cargarMascotas();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        navigate('/login');
    };

    const handleEliminarMascota = async (id, nombre) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`);
        if (!confirmar) return;

        try {
            const token = localStorage.getItem('token');
            const respuesta = await API.delete(`/mascotas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (respuesta.data.success) {
                alert(`${nombre} eliminado correctamente.`);
                setMascotas(prev => prev.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar la mascota.");
        }
    };

    const handleAbrirEditar = (mascota) => {
        setMascotaAEditar(mascota);
        setDatosEditar({
            nombre: mascota.nombre,
            especie: mascota.especie,
            edad: mascota.edad,
            descripcion: mascota.descripcion || ''
        });
        setModalEditarAbierto(true);
    };

    const handleGuardarEdicion = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const respuesta = await API.put(`/mascotas/${mascotaAEditar.id}`, datosEditar, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (respuesta.data.success) {
                alert("Mascota actualizada con éxito.");
                setMascotas(prev => 
                    prev.map(m => m.id === mascotaAEditar.id ? { ...m, ...datosEditar } : m)
                );
                setModalEditarAbierto(false);
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("No se pudo actualizar la mascota.");
        }
    };

    const handleGuardarNuevaMascota = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const respuesta = await API.post('/mascotas', datosNuevaMascota, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (respuesta.data.success) {
                alert("¡Nueva mascota registrada con éxito! 🐾");
                
                const nuevaMascotaConId = {
                    id: respuesta.data.mascotaId,
                    ...datosNuevaMascota,
                    estado: 'disponible'
                };

                setMascotas(prev => [nuevaMascotaConId, ...prev]);
                setDatosNuevaMascota({ nombre: '', especie: 'perro', edad: '', descripcion: '', foto_url: '' });
                setModalAgregarAbierto(false);
            }
        } catch (error) {
            console.error("Error al registrar mascota:", error);
            alert("No se pudo registrar la mascota.");
        }
    };

    const mascotasFiltradas = mascotas.filter(mascota => {
        const nombre = mascota.nombre ? mascota.nombre.toLowerCase() : '';
        const especie = mascota.especie ? mascota.especie.toLowerCase() : '';
        const descripcion = mascota.descripcion ? mascota.descripcion.toLowerCase() : '';
        const termino = busqueda.toLowerCase();
        return nombre.includes(termino) || especie.includes(termino) || descripcion.includes(termino);
    });

    return (
        <div className="dashboard-container">
            <header className="dashboard-nav">
                <div className="nav-logo">
                    <span className="logo-icon">🐾</span> AMIGOS SALVAJES
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    Cerrar Sesión 🚪
                </button>
            </header>

            <main className="dashboard-content">
                <section className="welcome-banner">
                    <h1>¡Bienvenido a tu Panel de Adopciones! 🏡</h1>
                    <p>Sesión activa con permisos de: <strong>{rolUsuario === 'admin' ? 'Administrador 🛠️' : 'Adoptante ✨'}</strong></p>
                </section>

                {rolUsuario === 'admin' && (
                    <div className="admin-actions-bar">
                        <h3>Gestión de Catálogo</h3>
                        <button className="btn-admin-add" onClick={() => setModalAgregarAbierto(true)}>
                            ➕ Agregar Nueva Mascota
                        </button>
                    </div>
                )}

                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="🔍 Buscar por nombre, especie (perro, gato) o descripción..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando ? (
                    <p className="loading-text">Cargando peluditos...</p>
                ) : (
                    <div className="mascotas-grid">
                        {mascotasFiltradas.length > 0 ? (
                            mascotasFiltradas.map(mascota => (
                                <div key={mascota.id} className="mascota-card">
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
                                        <p><strong>Descripción:</strong> {mascota.descripcion || 'Sin descripción'}</p>
                                        <p><strong>Edad:</strong> {mascota.edad}</p>
                                        <p><strong>Estado:</strong> <span className="estado-badge">{mascota.estado || 'disponible'}</span></p>
                                    </div>
                                    
                                    {rolUsuario === 'admin' ? (
                                        <div className="admin-card-buttons">
                                            <button className="btn-card-edit" onClick={() => handleAbrirEditar(mascota)}>✏️ Editar</button>
                                            <button className="btn-card-delete" onClick={() => handleEliminarMascota(mascota.id, mascota.nombre)}>❌ Eliminar</button>
                                        </div>
                                    ) : (
                                        <button className="btn-adoptar">Conóceme 🐾</button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="no-results">No se encontraron mascotas. 😿</p>
                        )}
                    </div>
                )}
            </main>

            {/* Modal Editar */}
            {modalEditarAbierto && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar Datos de {mascotaAEditar?.nombre}</h2>
                        <form onSubmit={handleGuardarEdicion}>
                            <label>Nombre:</label>
                            <input type="text" required value={datosEditar.nombre} onChange={(e) => setDatosEditar({...datosEditar, nombre: e.target.value})} />

                            <label>Especie:</label>
                            <select value={datosEditar.especie} onChange={(e) => setDatosEditar({...datosEditar, especie: e.target.value})}>
                                <option value="perro">Perro</option>
                                <option value="gato">Gato</option>
                            </select>

                            <label>Edad:</label>
                            <input type="text" required value={datosEditar.edad} onChange={(e) => setDatosEditar({...datosEditar, edad: e.target.value})} />

                            <label>Descripción:</label>
                            <textarea rows="3" value={datosEditar.descripcion} onChange={(e) => setDatosEditar({...datosEditar, descripcion: e.target.value})} />

                            <div className="modal-actions">
                                <button type="submit" className="btn-save">💾 Guardar Cambios</button>
                                <button type="button" className="btn-cancel" onClick={() => setModalEditarAbierto(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Agregar */}
            {modalAgregarAbierto && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Registrar Nueva Mascota 🐾</h2>
                        <form onSubmit={handleGuardarNuevaMascota}>
                            <label>Nombre *:</label>
                            <input type="text" required placeholder="Ej. Max..." value={datosNuevaMascota.nombre} onChange={(e) => setDatosNuevaMascota({...datosNuevaMascota, nombre: e.target.value})} />

                            <label>Especie *:</label>
                            <select value={datosNuevaMascota.especie} onChange={(e) => setDatosNuevaMascota({...datosNuevaMascota, especie: e.target.value})}>
                                <option value="perro">Perro</option>
                                <option value="gato">Gato</option>
                            </select>

                            <label>Edad *:</label>
                            <input type="text" required placeholder="Ej. 2 años..." value={datosNuevaMascota.edad} onChange={(e) => setDatosNuevaMascota({...datosNuevaMascota, edad: e.target.value})} />

                            <label>URL de la Foto (Opcional):</label>
                            <input type="url" placeholder="https://ejemplo.com/foto.jpg" value={datosNuevaMascota.foto_url} onChange={(e) => setDatosNuevaMascota({...datosNuevaMascota, foto_url: e.target.value})} />

                            <label>Descripción:</label>
                            <textarea rows="3" placeholder="Descripción de la personalidad..." value={datosNuevaMascota.descripcion} onChange={(e) => setDatosNuevaMascota({...datosNuevaMascota, descripcion: e.target.value})} />

                            <div className="modal-actions">
                                <button type="submit" className="btn-save">🚀 Registrar Mascota</button>
                                <button type="button" className="btn-cancel" onClick={() => setModalAgregarAbierto(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;