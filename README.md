# Proyecto Frontend

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Usadas](#tecnologías-usadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribuir](#Contribución)

## Descripción

Este proyecto es el frontend de una aplicación web que ofrece funcionalidades de redes sociales, mensajería y organización de eventos. La aplicación está desarrollada con React y cuenta con integraciones avanzadas como mapas interactivos y componentes reutilizables.

## Características

- Navegación protegida y pública con React Router.
- Autenticación de usuarios.
- Visualización y creación de publicaciones y eventos.
- Chat en tiempo real con Socket.IO.
- Mapas interactivos utilizando Leaflet.
- Sistema de comunidades y mensajería grupal.
- Interfaces responsivas y personalizables con TailwindCSS y Flowbite.

## Tecnologías Usadas

- **React** (Framework principal del frontend)
- **React Router** (Manejo de rutas)
- **TailwindCSS** (Estilos)
- **Flowbite y Flowbite React** (Componentes UI predefinidos)
- **Leaflet y React Leaflet** (Mapas interactivos)
- **Axios** (Solicitudes HTTP)
- **Socket.IO Client** (Mensajería en tiempo real)
- **FontAwesome** (Iconos)
- **SweetAlert2** (Alertas personalizadas)
- **Swiper** (Carruseles interactivos)
- **Vite** (Herramienta de desarrollo y construcción)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/MiguelSJimenezV/RideHubFrontendProject.git
   cd frontend
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Crear un archivo `.env` en el directorio raíz con las variables necesarias (e.g., URL del backend).

## Uso

### Modo Desarrollo

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

### Modo Producción

Construir los archivos para producción:

```bash
npm run build
```

Previsualizar la construcción:

```bash
npm run preview
```

## Contribución

¡Las contribuciones son bienvenidas! Si deseas colaborar, por favor:

1. Realiza un fork del repositorio.
2. Crea una rama para tu feature/bugfix:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y realiza un commit:
   ```bash
   git commit -m "Añadida nueva funcionalidad"
   ```
4. Envía un pull request.

---

**Desarrollado por Miguel Jiménez**
