# Leandro Baterías - Sistema E-Commerce 🔋

Sistema integral de tienda en línea orientado a la venta y gestión de baterías para vehículos, incluyendo inventario y carrito de compras relacional robusto.

## 🚀 Arquitectura del Proyecto
1. **Frontend Core**: React 18+ con Vite.
2. **Lenguaje**: TypeScript para garantizar tipos estáticos seguros (Product, Order, OrderItem).
3. **Estilos**: Tailwind CSS (Diseño utilitario móvil-primero y responsivo).
4. **Base de Datos**: Supabase (PostgreSQL) con esquema relacional para Catálogos, Carritos, Pedidos (Boletas/Facturas) y Pagos.

## 💻 Guía de Instalación Local (Visual Studio Code)
Sigue estos pasos para descargar, configurar y ejecutar este proyecto de IA en tu entorno local:

### 1. Clonar o Descargar
Descarga los archivos del proyecto (Si estás en Google AI Studio, usa la opción **"Export to ZIP"** o **"Export to GitHub"**) y descomprímelos en tu computadora.

### 2. Abrir en Visual Studio Code
Abre tu programa Visual Studio Code (o OpenCode) y selecciona `Archivo -> Abrir Carpeta...` y elige la carpeta descomprimida.

### 3. Instalar Dependencias
Abre la terminal integrada en VS Code (puedes usar el atajo `` Ctrl + ` `` o ir a `Terminal > Nuevo Terminal`) y ejecuta:
```bash
npm install
```

### 4. Configurar Entorno (Variables)
En la carpeta principal de tu proyecto hay un archivo llamado `.env.example`. 
1. Crea un archivo nuevo y llámalo **`.env`** (sin nada más).
2. Abre este nuevo archivo `.env` y pega tus credenciales de Supabase:
```env
VITE_SUPABASE_URL="https://aggvvockhkmnlxpaqanr.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOi..." # (Tu llave completa aquí)
```

### 5. Iniciar el Servidor de Desarrollo
En la terminal de VS Code, ejecuta:
```bash
npm run dev
```
Haz `Ctrl + Clic` en el enlace que aparezca en consola (usualmente http://localhost:3000 o similar) para ver el proyecto corriendo en tu máquina.

## 📄 Agentes de IA
Este proyecto incluye instrucciones preconfiguradas (`AGENTS.md`) para que los asistentes de IA, al momento de seguir programando, comprendan la arquitectura de la base de datos relacional de Supabase y las reglas del negocio automáticamente.
