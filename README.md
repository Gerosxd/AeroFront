n# ✈️ AeroMaintain - Frontend (MRO & WMS)

Repositorio exclusivo del Frontend para el Sistema de Gestión de Taller Aeronáutico. Este proyecto maneja la interfaz de usuario para los módulos de Ingeniería (MRO) y Almacén (WMS).

**Stack Tecnológico Principal:**
- **Framework:** Vue 3 (Composition API) + TypeScript
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS (v3.4.17 - *Estable*)
- **Enrutamiento:** Vue Router 4
- **Iconos:** Lucide Vue Next

---

## 📦 1. Prerrequisitos de Instalación

Asegúrate de tener instaladas las siguientes herramientas en tu entorno local:

1. **Git:** [Descargar aquí](https://git-scm.com/downloads)
2. **Node.js (LTS v18 o v20):** [Descargar aquí](https://nodejs.org/)
   * *Verificación:* Ejecuta `node -v` en tu terminal.
3. **Editor Recomendado:** VS Code o IntelliJ IDEA Ultimate (con plugin de Vue.js).

---

## 🚀 2. Configuración y Ejecución del Frontend

Sigue estos pasos para levantar el entorno de desarrollo visual (Fase 1).

### Clonar el repositorio
```bash
git clone <URL_DEL_NUEVO_REPOSITORIO_FRONTEND>
cd frontend
```
## Instalar dependencias
Este comando descargará todas las librerías necesarias respetando el package-lock.json.

```bash
npm install
```
## Variables de Entorno
Crea un archivo .env en la raíz del frontend basándote en un posible .env.example:
```Properties
VITE_API_URL=http://localhost:8080/api
```
Levantar el servidor
```bash
npm run dev
```
Abre tu navegador en http://localhost:5173.

## 📂 3. Estructura del Proyecto (Fase 1)
Actualmente, el proyecto está estructurado de la siguiente manera para la visualización de maquetas:

```Plaintext
src/
├── assets/          # Recursos estáticos (imágenes, css global)
├── components/      # Componentes UI reutilizables (ej. TopNavbar.vue)
├── layouts/         # Plantillas maestras (ej. MainLayout.vue)
├── router/          # Configuración de Vue Router
└── views/           # Pantallas completas por módulo:
    ├── LoginView.vue
    ├── DashboardView.vue
    ├── AlmacenView.vue
    ├── ArticulosView.vue
    ├── ProveedoresView.vue
    └── IngenieriaView.vue
```
## ⚙️ 4. (Opcional) Ejecución del Backend Local
Para probar el sistema completo con datos reales, necesitarás correr el repositorio del Backend (Java 17, Spring Boot 3, MySQL 8).

Clona el repositorio del backend.

Abre MySQL Workbench y ejecuta:

```SQL
CREATE DATABASE taller_aeronautico_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Configura tus credenciales en application.properties:

```Properties
spring.datasource.url=jdbc:mysql://localhost:3306/taller_aeronautico_db
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA
```
Corre la aplicación desde IntelliJ (TallerAeronauticoApplication.java).



