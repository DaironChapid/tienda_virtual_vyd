# TIENDA VYD - Guía de Inicio del Proyecto

Este documento explica cómo configurar, instalar y ejecutar el proyecto completo (Frontend y Backend) desde cero. 

## Requisitos Previos

Antes de iniciar, asegúrate de tener instalado lo siguiente en tu sistema:
- **Node.js** (Se recomienda la versión LTS, v18 o superior)
- **npm** (Viene instalado con Node.js)
- **Base de datos** (PostgreSQL, MySQL, etc., dependiendo de la configuración de Prisma en el backend)

---

## 1. Configuración del Backend (NestJS + Prisma)

El backend está construido con NestJS y utiliza Prisma como ORM.

### Paso 1: Instalar dependencias
Abre una terminal, navega a la carpeta `backend` e instala las dependencias:
```bash
cd backend
npm install
```

### Paso 2: Variables de entorno
Debes tener un archivo `.env` en la raíz de la carpeta `backend`. Si no existe, créalo basándote en la configuración de Prisma. Normalmente necesita la URL de tu base de datos.
Ejemplo de `.env`:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/tienda_vyd?schema=public"
```

### Paso 3: Configurar la Base de Datos (Prisma)
Una vez que el archivo `.env` esté listo, ejecuta las migraciones para crear las tablas en tu base de datos:
```bash
npx prisma migrate dev
```
*(Opcional)* Si ya tienes la base de datos creada y solo necesitas generar el cliente de Prisma:
```bash
npx prisma generate
```

### Paso 4: Ejecutar el servidor
Para iniciar el backend en modo desarrollo (con recarga automática):
```bash
npm run start:dev
```
El backend normalmente correrá en `http://localhost:3000` (revisa tu configuración si cambia el puerto).

---

## 2. Configuración del Frontend (Next.js + React)

El frontend está construido con Next.js y React.

### Paso 1: Instalar dependencias
Abre **otra terminal**, navega a la carpeta `frontend` e instala las dependencias:
```bash
cd frontend
npm install
```

### Paso 2: Variables de entorno (si aplica)
Si el frontend necesita conectarse al backend y utiliza variables de entorno, asegúrate de crear un archivo `.env.local` en la carpeta `frontend` con la URL de tu API.
Ejemplo de `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Paso 3: Ejecutar el servidor de desarrollo
Para iniciar la aplicación frontend en modo desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000` (o `http://localhost:3001` si el backend ya está usando el puerto 3000).

> **Nota importante:** Si en algún momento ejecutas `npm start` en el frontend, ten en cuenta que este comando es para el entorno de **producción**. Antes de usarlo, deberás compilar el proyecto ejecutando `npm run build`.

---

## Resumen de Comandos Diarios

Para tu día a día, solo necesitarás abrir dos terminales:

**Terminal 1 (Backend):**
```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
