import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- 1. Importamos tu nueva pantalla de Registro

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el Inicio de Sesión de Amigos Salvajes */}
        <Route path="/login" element={<Login />} />
        
        {/* 2. Ruta para el Formulario de Registro Dinámico */}
        <Route path="/registro" element={<Register />} />
        
        {/* Ruta por defecto que te manda al login al abrir la app */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;