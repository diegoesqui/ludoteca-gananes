# Ludoteca Gañanes

**Descubre tu próxima obsesión en la ludoteca de juegos de mesa de los Gañanes Frikis.**

Este proyecto es una guía interactiva de juegos de mesa, creada para que el grupo de "Gañanes Frikis" pueda compartir sus opiniones, descubrir nuevas joyas y votar por sus juegos preferidos.

## Características

*   **Visualización de Juegos:** Explora tarjetas de juegos con información clave como el número de jugadores, tiempo de juego y complejidad.
*   **Filtrado Avanzado:** Filtra la lista de juegos por nombre, número de jugadores, tiempo máximo, complejidad y quién lo recomienda.
*   **Ordenación Personalizada:** Ordena los juegos por nombre, número de jugadores (mínimo), tiempo de juego (mínimo) y complejidad, tanto de forma ascendente como descendente.
*   **Detalles del Juego:** Haz clic en cualquier tarjeta para ver una vista detallada del juego, incluyendo su imagen, rango de jugadores, tiempo, complejidad, recomendaciones y un enlace a BoardGameGeek (BGG).
*   **Autenticación de Usuarios:** Inicia sesión para acceder a funcionalidades adicionales.
*   **Gestión de Juegos (para usuarios autenticados):**
    *   **Añadir Nuevos Juegos:** Contribuye a la ludoteca añadiendo nuevos títulos.
    *   **Editar Juegos Existentes:** Modifica la información de los juegos ya existentes.
    *   **Eliminar Juegos:** Elimina juegos de la lista.
*   **Comentarios y Votación (para usuarios autenticados):**
    *   **Añadir Comentarios:** Comparte tus opiniones sobre cada juego.
    *   **Editar/Eliminar Comentarios:** Gestiona tus propios comentarios.

## Tecnologías Utilizadas

*   **Frontend:** HTML, CSS (con TailwindCSS para estilos), JavaScript.
*   **Backend & Base de Datos:** [Supabase](https://supabase.com/) (para la base de datos, autenticación y almacenamiento).

## Configuración y Ejecución

Para poner en marcha este proyecto localmente, sigue estos pasos:

1.  **Clona el Repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd guia_juegos_de_mesa
    ```

2.  **Configura Supabase:**
    *   Crea un nuevo proyecto en [Supabase](https://supabase.com/).
    *   Crea una tabla llamada `juegos` con las columnas necesarias (ej: `id`, `name`, `players_min`, `players_max`, `time_min`, `time_max`, `complexity`, `bgg_url`, `image_url`, `recommended_by`).
    *   Crea una tabla llamada `comentarios` con las columnas necesarias (ej: `id`, `content`, `game_id` (FK a `juegos`), `user_id` (FK a `auth.users`), `created_at`, `updated_at`).
    *   **Importante:** Configura las políticas de Row Level Security (RLS) en Supabase para tus tablas `juegos` y `comentarios`. Asegúrate de que la política `SELECT` para la tabla `juegos` permita el acceso público (por ejemplo, usando `true` en la expresión) para que los juegos sean visibles sin autenticación. Para las operaciones de `INSERT`, `UPDATE`, `DELETE` y los comentarios, configura las políticas según tus necesidades de seguridad (normalmente, permitiendo solo a usuarios autenticados o con roles específicos).

3.  **Configura las Credenciales de Supabase:**
    *   En `js/supabase.js`, actualiza `SUPABASE_URL` y `SUPABASE_ANON_KEY` con las credenciales de tu proyecto Supabase. Puedes encontrarlas en la sección "Settings" -> "API" de tu panel de Supabase.

    ```javascript
    // js/supabase.js
    const SUPABASE_URL = 'TU_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';
    ```

4.  **Abre el Proyecto:**
    *   Simplemente abre el archivo `index.html` en tu navegador web preferido.

## Uso

*   **Navegación:** Utiliza los filtros y la opción de ordenación para explorar la ludoteca.
*   **Detalles del Juego:** Haz clic en cualquier tarjeta de juego para ver más detalles y los comentarios.
*   **Añadir/Editar/Eliminar:** Si estás autenticado, verás botones para añadir nuevos juegos o editar/eliminar los existentes desde la vista de detalles.
*   **Comentarios:** Si estás autenticado, podrás añadir, editar o eliminar tus propios comentarios en la vista de detalles del juego.

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un "issue" o envía un "pull request" con tus mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.
