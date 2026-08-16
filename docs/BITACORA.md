# 🏝️ Bitácora de Desarrollo: Proyecto Fisiodar

Este documento sirve como un historial narrativo ("DevLog") de la construcción de Fisiodar. Aquí registramos nuestro día a día: las victorias, los obstáculos técnicos y los aprendizajes fundamentales como ingenieros de software.

---

## Día 1: El Desembarco y los Cimientos
*Fecha: Agosto 2026*

**El Contexto:** 
Llegamos a la "isla" con la misión de construir un sistema de gestión de citas médicas de nivel profesional para un centro de fisioterapia. Decidimos usar un stack moderno y rápido: **Go (Golang)** para el backend, **PostgreSQL** en la nube (Neon) para los datos, y **Next.js** para el frontend.

**Las Dificultades:** 
La base de datos nos dio algo de pelea al principio. Tuvimos que asegurarnos de que la conexión a Neon usara SSL estricto (`sslmode=require`) y configurar correctamente el esquema de tablas (UUIDs, relaciones). Además, al implementar la seguridad JWT (Tokens), tuvimos que lidiar con el almacenamiento persistente en el navegador para que el usuario no perdiera su sesión al recargar la página.

**Los Logros:** 
¡Levantamos toda la estructura! Creamos un sistema completo de roles: Pacientes y Especialistas (Lic. Dariana). Desarrollamos los endpoints RESTful, protegimos las rutas del frontend, y logramos guardar exitosamente datos complejos como el nivel de dolor y los antecedentes médicos. 

**El Aprendizaje del Día:** 
Adoptamos el **Spec-Driven Development**. Aprendimos que diseñar primero el "Contrato" en el archivo `openapi.yaml` antes de escribir código en Go o React, evita muchísimos dolores de cabeza porque ambos lados (Front y Back) saben exactamente qué esperar.

---

## Día 2: Puliendo la Experiencia de Usuario (UX)
*Fecha: Agosto 2026*

**El Contexto:** 
El sistema funcionaba, pero el formulario de reserva era genérico. Necesitábamos adaptarlo a las reglas de negocio reales de la clínica: Solo Lunes, Miércoles y Viernes, y con un solo terapeuta (Dariana).

**Las Dificultades:** 
Eliminar un campo de un formulario (el selector de terapeuta) parece fácil, pero tuvimos que reestructurar la lógica de React para que capturara automáticamente el ID de Dariana sin que el usuario lo viera. Luego vino el mayor reto visual: construir un Calendario Semanal Interactivo en Next.js desde cero, calculando dinámicamente los días, ocultando los días inactivos y manejando zonas horarias (UTC vs Local) para no registrar turnos en horas equivocadas.

**Los Logros:** 
El calendario quedó espectacular. Logramos implementar un panel que se siente premium, con bloques de colores, botones interactivos y navegación de hasta 4 semanas en el futuro. También creamos la función de "Ficha Médica Rápida" para Dariana: al seleccionar un paciente en su panel, el sistema inyecta en la pantalla instantáneamente el peso y las condiciones médicas de ese paciente. ¡Pura magia visual!

---

## Día 3: Despliegue en la Nube y Resolución de Problemas Arquitectónicos
*Fecha: Agosto 2026*

**El Contexto:** 
Al finalizar la UI del Landing y las subpáginas (Servicios, Nosotros, Ubícanos), decidimos hacer un despliegue de la arquitectura completa antes de dormir. La estrategia elegida fue un modelo desacoplado "Full-Stack Real": Frontend en **Vercel**, Backend en **Railway** (mediante Docker), y la Base de Datos Serverless en **Neon**.

**Las Dificultades (El "Crash" en Producción):** 
1. **El fallo del Dockerfile:** Inicialmente, el servidor de Go en Railway compilaba bien, pero se estrellaba ("Crashed") 57 segundos después de arrancar. El problema fue que el `Dockerfile` solo copiaba el binario compilado `main` a la imagen final de Alpine, olvidando la carpeta `db/migrations`. Como el servidor de Go intenta leer los archivos `.sql` al iniciarse para verificar migraciones, entraba en pánico (panic) por archivo no encontrado.
2. **Las barreras de CORS:** Identificamos de manera proactiva que el servidor de Go estaba limitando los orígenes cruzados (CORS) estrictamente a `http://localhost:3000`. Si no lo arreglábamos, el frontend en Vercel jamás habría podido obtener los datos de Railway.

**Los Logros:** 
Actualizamos el `Dockerfile` para incluir la carpeta de migraciones y flexibilizamos la cabecera `Access-Control-Allow-Origin` a `*` en `server.go`. Esto nos enseñó una valiosa lección: **siempre hay que empaquetar los archivos estáticos o de configuración junto con el binario en Docker, y jamás olvidar ajustar el CORS para el entorno de producción.**
**El Aprendizaje del Día:** 
Comprobamos que las interfaces rígidas matan la experiencia del usuario. Cambiar unos simples `<input type="date">` por un calendario visual interactivo eleva el proyecto de "un simple ejercicio de programación" a "un producto listo para producción". Además, aprendimos a dejar de lado la ansiedad por programar y en su lugar usar un flujo de **Planificar y Ejecutar (Artifacts)**.

## Día 4: Panel de Administración, TDD y Despliegue en Vercel
*Fecha: Agosto 2026*

**El Contexto:** 
Con el Backend asegurado en Railway, procedimos a desplegar el Frontend en **Vercel**. Aprovechamos la oportunidad para aplicar metodologías rigurosas y construir el Panel de Administración de Fisiodar, el lugar donde la clínica verá las métricas de su negocio.

**Las Dificultades (El Error del Paquete Olvidado):** 
1. **Despliegue del Frontend:** Configurar variables de entorno (`NEXT_PUBLIC_API_URL`) fue sencillo gracias a la UI de Vercel, pero cometimos un error de "novatos" durante el desarrollo de la UI del dashboard. 
2. **Dependencias "Fantasma":** Diseñamos un componente visual premium (`StatCard`) y utilizamos íconos de la librería `lucide-react`. Sin embargo, olvidamos registrar esa dependencia en el `package.json`. Como resultado, el código funcionaba en nuestra mente, pero al llegar a Vercel, el proceso de compilación abortó por un error de "Módulo no encontrado".

**Los Logros:** 
Aplicamos **TDD (Test-Driven Development)** de forma ejemplar en el backend. Escribimos pruebas en Go que deliberadamente fallaban para los "Pacientes" y permitían acceso a los "Admins". Luego, escribimos el código necesario en `admin.go` para conectar PostgreSQL y extraer las estadísticas (Total de pacientes, citas completadas, etc). El Frontend también fue blindado: si no hay sesión iniciada, redirige al Login.

**El Aprendizaje del Día (Actualización del Spec):** 
Los errores de dependencias son inaceptables en un flujo maduro de Spec-Driven Development (SDD). 
**Nueva Regla de SDD:** "Jamás importar una librería en un componente sin antes verificar explícitamente el archivo `package.json` e instalarla". Hemos codificado esta regla en el comportamiento del agente para evitar fallas silenciosas en producción.

---
*Continuará...*
