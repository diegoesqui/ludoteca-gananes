# Plan de Acción: Guía Interactiva de Juegos de Mesa

Este documento detalla el progreso del proyecto hasta la fecha y establece los próximos pasos para el desarrollo de nuevas funcionalidades.

---

### **FASE 1: Creación y Despliegue Inicial (Completado ✅)**

En esta fase inicial, el objetivo era transformar una lista de texto estática en una aplicación web funcional y visualmente atractiva.

* **1.1. Extracción de Datos:** Se resumió la información de la conversación de WhatsApp en una lista estructurada.
* **1.2. Diseño de la Aplicación Estática:** Se creó un único fichero `index.html` con HTML, Tailwind CSS y JavaScript.
* **1.3. Implementación de Interactividad:** Se añadieron filtros y gráficos (Chart.js) para explorar los datos de forma dinámica.
* **1.4. Despliegue en GitHub Pages:** La aplicación estática se publicó con éxito en GitHub Pages, haciéndola accesible a través de una URL pública.

---

### **FASE 2: Conexión a Base de Datos Externa (Completado ✅)**

El objetivo de esta fase era migrar los datos locales a una base de datos real para centralizar la información y prepararse para futuras funcionalidades.

* **2.1. Creación del Backend:** Se creó un nuevo proyecto en **Supabase**.
* **2.2. Diseño de la Base de Datos:** Se diseñó y creó la tabla `juegos` en PostgreSQL, definiendo las columnas y tipos de datos (`text`, `int4`, `jsonb`, etc.).
* **2.3. Importación de Datos:** Se preparó un fichero CSV con toda la información de los juegos y se importó masivamente a la tabla de Supabase.
* **2.4. Conexión Frontend-Backend:** Se actualizó el código `index.html` para que, en lugar de leer los datos de una variable local, realizara una petición a la API de Supabase para obtener y mostrar los juegos.
* **2.5. Debugging y Correcciones:** Se solucionaron problemas de conexión, formato de datos (arrays, JSON) y codificación de caracteres (`UTF-8`).

---

### **FASE 3: Funcionalidades Dinámicas y Colaborativas (Pendiente ⏳)**

Esta es la fase actual y futura del proyecto, centrada en permitir que los usuarios interactúen y modifiquen los datos.

* **3.1. Implementación de Autenticación de Usuarios (Próximo Paso 🎯):**
    * **Tarea:** Añadir la lógica de `supabase.auth.signInWithPassword()` al formulario de login existente.
    * **Tarea:** Implementar la función de `signOut()`.
    * **Tarea:** Actualizar la interfaz para mostrar el estado del usuario (logueado / no logueado) y ocultar/mostrar los elementos correspondientes (ej. botón "Añadir Juego").

* **3.2. Habilitar Creación y Edición de Juegos (Pendiente ⏳):**
    * **Tarea:** Implementar la lógica del formulario modal para que use `supabase.from('juegos').insert()` para juegos nuevos y `supabase.from('juegos').update()` para juegos existentes.
    * **Tarea:** **Activar la Seguridad a Nivel de Fila (RLS)** en la tabla `juegos` de Supabase.
    * **Tarea:** Crear políticas RLS para permitir `INSERT` y `UPDATE` **solo a usuarios autenticados**. La política de `SELECT` debe seguir permitiendo la lectura a todo el mundo.

* **3.3. Sistema de Comentarios Relacional (Futuro ✨):**
    * **Tarea:** Crear una nueva tabla `comentarios` con columnas como `contenido`, `juego_id` (Foreign Key a `juegos.id`) y `usuario_id` (Foreign Key a `auth.users.id`).
    * **Tarea:** Reemplazar la sección de "opiniones" en la interfaz para que muestre los comentarios de la nueva tabla.
    * **Tarea:** Añadir un formulario para que los usuarios logueados puedan añadir comentarios.
