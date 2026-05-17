---

# 🐾 Sistema de Adopción de Mascotas

Sistema web full-stack para gestionar adopciones de mascotas. Permite a los usuarios registrarse, explorar mascotas disponibles, publicar mascotas en adopción y realizar el proceso de adopción de forma sencilla.

## ✨ Características

- Registro e inicio de sesión de usuarios con JWT
- Publicar mascotas en adopción con múltiples fotos
- Subida de imágenes a Cloudinary
- Visualización detallada y filtrado de mascotas
- Gestión de perfil de usuario
- Protección de rutas privadas
- Diseño responsive

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js + Express
- MySQL
- JWT (autenticación)
- bcryptjs
- Multer + Cloudinary
- dotenv

### Frontend
- React 19 + Vite
- React Router DOM
- Axios

## 📁 Estructura del Proyecto

```
Sistema-Adopci-n-Mascotas/
├── backend/                  # API con Node.js + Express
├── fronted/                  # Frontend con React (nota: nombre actual)
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
cp .env.example .env    # Configura tus variables
npm run dev
```

### 3. Frontend
```bash
cd ../fronted
npm install
npm run dev
```

## 📋 Variables de Entorno (.env)

```env
# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=sistema_adopcion

# Servidor
PORT=5000
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 📌 Próximas Mejoras

- Panel de administración
- Filtros avanzados (edad, tamaño, raza, ubicación)
- Sistema de favoritos
- Notificaciones
- Chat entre usuarios
- Deploy del proyecto

## 🤝 Contribuir

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto, haz un fork y envía un Pull Request.

## 👨‍💻 Autor

**Le0nCoder**  
[GitHub](https://github.com/Le0nCoder)

---

⭐ ¡Si te gusta el proyecto, no olvides dejar una estrella!

---
