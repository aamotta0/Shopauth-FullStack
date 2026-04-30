# 🛍️ Shopauth

Proyecto fullstack de autenticación y tienda online.

## 🚀 Tecnologías

### Backend (`shopauth-api`)

* Node.js
* Express
* Base de datos MongoDB.

### Frontend (`shopauth-client-frontend`)

* React / Next.js 
* CSS / Tailwind / etc.

---

## 📁 Estructura del proyecto

```
Shopauth/
├── shopauth-api/
└── shopauth-client-frontend/
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/aamotta0/Shopauth-FullStack
cd Shopauth
```

### 2. Backend

```bash
cd shopauth-api
npm install
npm run dev
```

### 3. Frontend

```bash
cd ../shopauth-client-frontend
npm install
npm run dev
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` en cada proyecto:

### Backend

```
PORT=3000
DATABASE_URL=tu_database_url
JWT_SECRET=tu_secreto
```

### Frontend

```
VITE_API_URL=http://localhost:5173
```

---

## 📌 Funcionalidades

* Registro de usuarios
* Login con autenticación
* Gestión de productos (CRUD Completo)
* Manejo de secciones
* Acceso según el Rol

---

## 🧑‍💻 Autor

Andrés Motta

--

