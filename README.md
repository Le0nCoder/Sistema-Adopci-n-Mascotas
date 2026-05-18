```markdown
# 🐾 Sistema de Adopción de Mascotas

Sistema web **full-stack** para la gestión de adopciones de mascotas. Permite a los usuarios registrarse, publicar mascotas en adopción, explorar animales disponibles y gestionar el proceso de adopción.

## ✨ Características

- Registro e inicio de sesión de usuarios
- Autenticación segura con **JWT**
- Publicación de mascotas con subida de múltiples imágenes
- Almacenamiento de imágenes en **Cloudinary**
- Protección de rutas privadas
- Diseño completamente responsive
- API REST con Express

## 🛠️ Tecnologías Utilizadas

### **Backend**
- **Node.js** + **Express**
- **MySQL2**
- **JWT** + **bcryptjs**
- **Multer** + **Cloudinary**
- **CORS** + **dotenv**

### **Frontend**
- **React 19** + **Vite**
- **React Router DOM**
- **Axios**

## 📁 Estructura del Proyecto

```
Sistema-Adopci-n-Mascotas/
├── backend/             # API REST (Node.js + Express)
├── fronted/             # Frontend (React + Vite)
└── README.md
```

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/Le0nCoder/Sistema-Adopci-n-Mascotas.git
cd Sistema-Adopci-n-Mascotas
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd ../fronted
npm install
npm run dev
```

## 📋 Variables de Entorno (backend/.env)

```env
# Database
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=sistema_adopcion

# Server
PORT=5000
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 📌 Próximas Mejoras

- Filtros avanzados (edad, tamaño, raza, ubicación)
- Sistema de favoritos
- Panel de administración
- Notificaciones por correo
- Chat entre usuarios
- Deploy del proyecto

## 🤝 Contribuir

Las contribuciones son bienvenidas. Haz un Fork, crea una rama y envía un Pull Request.

## 👨‍💻 Autor

**Le0nCoder**  
[GitHub](https://github.com/Le0nCoder)

⭐ ¡Si el proyecto te gusta, no olvides dejar una estrella!
```
