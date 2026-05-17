import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; 
import API from '../services/api'; 


export default function Register() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    diaNacimiento: '',
    mesNacimiento: '',
    anioNacimiento: '',
    correoElectronico: '',
    telefono: '',
    ciudad: '',
    colonia: '',
    codigoPostal: '',
    genero: '', 
    nombreUsuario: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); // Evita que la página se recargue
  
  if (formData.contrasena !== formData.confirmarContrasena) {
    alert('Las contraseñas no coinciden. Por favor, verifícalas.');
    return;
  }
  
  try {
    // 🔔 IMPORTANTE: Asegúrate de pasar 'formData' como segundo parámetro directo
    const respuesta = await API.post('/auth/registro', formData);
    
    if (respuesta.data.success) {
      alert(respuesta.data.msg);
      navigate('/login'); 
    }
  } catch (error) {
    console.error("Error completo en el frontend:", error);
    alert(error.response?.data?.msg || 'Hubo un error al registrar el usuario');
  }
};

  return (
    <div className="register-container">
      {/* Encabezado idéntico a tu maqueta */}
      <div className="marca-header">
        <h1 className="titulo-amigos">A M I G O S</h1>
        <h2 className="subtitulo-salvajes">S A L V A J E S<span className="com">.COM</span></h2>
        <h3 className="seccion-actual">Registro</h3>
      </div>

      <form onSubmit={step === 1 ? handleNext : handleSubmit} className="form-register">
        
        {/* ================= PASO 1: DATOS PERSONALES ================= */}
        {step === 1 && (
          <div className="step-group">
            <div className="input-group">
              <label>Nombres</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
            </div>

            <div className="grid-2-col">
              <div className="input-group">
                <label>Apellido Paterno</label>
                <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Apellido Materno</label>
                <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Fecha de Nacimiento</label>
              <div className="grid-fecha">
                <input type="number" name="diaNacimiento" placeholder="DD" min="1" max="31" value={formData.diaNacimiento} onChange={handleChange} required />
                <input type="number" name="mesNacimiento" placeholder="MM" min="1" max="12" value={formData.mesNacimiento} onChange={handleChange} required />
                <input type="number" name="anioNacimiento" placeholder="AAAA" min="1920" max="2026" value={formData.anioNacimiento} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Correo Electrónico</label>
              <input type="email" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Número Telefónico</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>

            <div className="grid-2-col">
              <div className="input-group">
                <label>Ciudad</label>
                <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Colonia</label>
                <input type="text" name="colonia" value={formData.colonia} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid-2-col">
              <div className="input-group">
                <label>Código Postal</label>
                <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label style={{ textAlign: 'center' }}>Género</label>
                <div className="genero-container">
                  <button 
                    type="button" 
                    className={`btn-genero ${formData.genero === 'femenino' ? 'activo' : ''}`}
                    onClick={() => setFormData({...formData, genero: 'femenino'})}
                  >femenino</button>
                  <button 
                    type="button" 
                    className={`btn-genero ${formData.genero === 'masculino' ? 'activo' : ''}`}
                    onClick={() => setFormData({...formData, genero: 'masculino'})}
                  >masculino</button>
                </div>
              </div>
            </div>

            <div className="botones-footer single-btn">
              <button type="submit" className="btn-paw btn-ingresar">
                <span className="paw-icon">🐾</span>
                <span className="btn-text">Siguiente</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PASO 2: CREDENCIALES ================= */}
        {step === 2 && (
          <div className="step-group">
            <div className="input-group">
              <label>Nombre de Usuario</label>
              <input type="text" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Confirma Contraseña</label>
              <input type="password" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange} required />
            </div>

            <div className="botones-footer">
              <button type="button" className="btn-paw btn-cancelar" onClick={handleBack}>
                <span className="paw-icon">🐾</span>
                <span className="btn-text">Atrás</span>
              </button>
              
              <button type="submit" className="btn-paw btn-ingresar">
                <span className="paw-icon">🐾</span>
                <span className="btn-text">Registrar</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}