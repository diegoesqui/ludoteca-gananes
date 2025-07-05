# Guía Interactiva de Juegos de Mesa

Este proyecto es una aplicación web de una sola página (SPA) diseñada para visualizar y explorar de forma interactiva una lista de recomendaciones de juegos de mesa. La aplicación permite a los usuarios filtrar los juegos por complejidad, número de jugadores y tiempo de partida, y presenta los datos de forma visual a través de gráficos dinámicos.

## Arquitectura del Proyecto

Este proyecto utiliza una arquitectura moderna conocida como **JAMstack**, que desacopla el frontend de la aplicación del backend.

* **Frontend (Sitio Estático):**
    * **Tecnologías:** HTML5, Tailwind CSS y JavaScript puro (Vanilla JS).
    * **Alojamiento:** La aplicación está alojada como un sitio estático en **GitHub Pages**, lo que garantiza un rendimiento rápido y un despliegue gratuito y sencillo.
    * **Funcionalidad:** Se encarga de toda la interfaz de usuario, la interactividad (filtros, gráficos) y la comunicación con el backend.

* **Backend (Base de Datos Externa):**
    * **Servicio:** Se utiliza **Supabase** como Backend-as-a-Service (BaaS).
    * **Base de Datos:** Un proyecto de Supabase con una base de datos **PostgreSQL** aloja toda la información de los juegos (nombres, jugadores, complejidad, etc.).
    * **Conexión:** La aplicación web (frontend) se comunica directamente con la API de Supabase a través de JavaScript para leer y (en futuras versiones) escribir datos. La seguridad se gestiona mediante la clave `anon` pública de Supabase y las políticas de **Seguridad a Nivel de Fila (RLS)**.

## Estado Actual

Actualmente, la aplicación cuenta con las siguientes funcionalidades:

* Visualización completa de la lista de juegos desde la base de datos de Supabase.
* Filtrado dinámico por complejidad, número de jugadores y tiempo de partida.
* Gráficos interactivos (Chart.js) que se actualizan en tiempo real según los filtros aplicados.
* Diseño "gamer" con tema oscuro, totalmente responsivo.
* Enlaces directos a la página de cada juego en BoardGameGeek.

## Futuras Mejoras

El plan de desarrollo incluye la implementación de funcionalidades dinámicas que permitirán a los usuarios interactuar con los datos:

1.  **Sistema de Autenticación:** Permitir que los usuarios (amigos) se registren e inicien sesión.
2.  **Gestión de Contenido (CRUD):**
    * **Crear:** Los usuarios autenticados podrán añadir nuevos juegos a la base de datos.
    * **Modificar:** Los usuarios autenticados podrán editar la información de los juegos existentes.
3.  **Sistema de Comentarios Avanzado:** Evolucionar la sección de "opiniones" a un sistema de comentarios relacional completo, donde cada comentario esté asociado a un usuario y una fecha.
