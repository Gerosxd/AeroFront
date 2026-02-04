# AeroMaintain - Frontend

Módulo de interfaz de usuario para el sistema de gestión de taller aeronáutico AeroMaintain. Este proyecto interactúa con el backend Java para la gestión de inventarios, órdenes de trabajo y administración de personal.

## Stack Tecnológico

* **Core:** Vue 3 (Composition API)
* **Lenguaje:** TypeScript
* **Build Tool:** Vite
* **Estilos:** Tailwind CSS
* **Enrutamiento:** Vue Router
* **Iconos:** Lucide Vue

## Requisitos Previos

Para ejecutar este módulo localmente, se requiere tener instalado en el entorno de desarrollo:

* **Node.js**: Versión 18.0.0 o superior (LTS recomendada).
* **npm**: Gestor de paquetes (incluido normalmente con la instalación de Node.js).

## Guía de Instalación y Ejecución

Siga estos pasos para levantar el entorno de desarrollo local.

### 1. Ubicación del Proyecto
Asegúrese de situar la terminal en el directorio del frontend dentro del repositorio.
```bash
cd frontend

2. Instalación de Dependencias
Ejecute el siguiente comando para descargar e instalar las librerías necesarias:
npm install

3. Iniciar Servidor de Desarrollo
Para iniciar la aplicación en modo desarrollo:
npm run dev
Una vez iniciado, la aplicación estará accesible en: http://localhost:5173/

4. Estructura del Proyecto:
src/components: Componentes reutilizables de UI (Botones, Inputs, Navbars).
src/views: Páginas completas de la aplicación (Login, Dashboard, Almacén).
src/router: Configuración de navegación y rutas.
src/assets: Recursos estáticos (imágenes, fuentes).

Integración con Backend
Actualmente, el frontend utiliza datos simulados (mock data) para la interfaz de usuario. La integración con los endpoints del Backend Java se realizará a través de servicios configurados con Axios en futuras iteraciones.

