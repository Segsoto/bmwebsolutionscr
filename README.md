# BM Web Solutions — Rediseño

Sitio estático bilingüe. El contenido final está en `dist/`, listo para alojarse en cualquier servidor de archivos estáticos. Ejecutar `node generate.cjs` actualiza las 12 páginas a partir de los textos y componentes compartidos. Ejecutar `node serve.cjs` abre la vista previa en http://127.0.0.1:4173.

## Publicación en Vercel

El repositorio de GitHub es `Segsoto/bmwebsolutionscr`. Vercel genera las páginas con `node generate.cjs`, valida sus enlaces con `node check.cjs` y publica `dist/`, según `vercel.json`. No requiere dependencias ni variables de entorno. La rama de producción es `main`.

La cuenta de Vercel es `segsoto`, con el equipo `brandon-s-projects-cc03ed1c` (Brandon 's projects). La web de producción está en https://www.bmwebsolutionscr.com y el proyecto está conectado a GitHub para desplegar los cambios de `main` automáticamente. Antes de operar desde la terminal, comprobar que `vercel whoami` muestre `segsoto` y seleccionar ese equipo.

El contenido de los servicios, soluciones, proyectos y plantillas se define en `generate.cjs`. La portada, navegación, invitación a reservar, tarjetas de proyectos y formulario se definen en `experience.cjs`. Los estilos y la interacción compartida están en `dist/styles.css` y `dist/app.js`. Las capturas y los demás recursos están en `dist/assets/`. Antes de subir cambios, ejecutar `node generate.cjs` y `node check.cjs`.

## Experiencia y recorrido de reserva

Dirección visual: estudio digital de Costa Rica, con fondos claros, azul de marca, acentos verdes y tipografía Manrope / DM Sans. La portada presenta una pieza interactiva para explorar diseño web, software y soporte de TI. El diseño web muestra un proyecto real; el software se identifica como ejemplo visual y la pestaña de TI explica el alcance del servicio.

El recorrido prioriza objetivos del cliente, proyectos reales, proceso de trabajo, equipo, preguntas frecuentes y solicitud de sesión. La navegación y la barra inferior móvil mantienen visible la acción de reservar. Las llamadas de cada objetivo y servicio preseleccionan la solución en el formulario.

La reserva es una **solicitud por WhatsApp**, con nombre, necesidad, descripción y fecha/horario preferidos opcionales. El correo es opcional. No existe calendario de disponibilidad ni confirmación automática: el visitante envía la solicitud y el equipo coordina la cita. El formulario valida los datos, rechaza fechas anteriores al día actual en Costa Rica y ofrece un enlace alternativo si el navegador bloquea la apertura de WhatsApp. Los datos no se guardan en el sitio.

La imagen principal `featured-web.webp` es una versión optimizada de la captura real de Fuck Face (132 KB). El resto de las capturas se carga de forma diferida. Las pestañas admiten flechas, Home y End; el menú se cierra con Escape. Se respeta la preferencia de movimiento reducido.

La franja de confianza de la portada muestra ocho negocios reales con enlaces a sus webs en otra pestaña, en ambos idiomas. Se mueve continuamente con un bucle sin salto y sin flechas de navegación. No muestra controles y se detiene al explorar con el cursor, mientras se toca, fuera de pantalla y al ocultar la pestaña. Con teclado o movimiento reducido muestra la lista original con scroll horizontal y enlaces accesibles. Sin JavaScript también conserva los enlaces y el scroll.

## Alcance

- Inicio, servicios, proyectos, planes, contacto y plantillas, en español e inglés.
- Los 10 proyectos actuales y las 5 plantillas del sitio original. Fuck Face aparece primero como el proyecto más reciente.
- Soluciones para sitios de presentación, sitios de crecimiento, tiendas en línea y software a medida, sin precios publicados.
- Equipo actual: Brandon Soto, Manfred Zuñiga y Brandon Garro.
- Logotipo, fotografía y capturas reales de AlmaBela, Abogados de la Guácima, Charlie Mensajería, CR Granimar, La Camisa del 10, AroArte, AP Signature Travel y Fuck Face. El Sistema de Barbería muestra su pantalla pública de acceso. Barber Magic CR conserva su aviso de vista previa pendiente. Los videos originales permanecen como recursos, sin reproducirse en la nueva portada.
- Bot flotante con seis opciones de consulta, campo para añadir contexto y enlaces a WhatsApp.
- Formulario accesible de solicitud de sesión, con servicio preseleccionado, preferencia de fecha y horario, validación y mensaje preparado para WhatsApp. El visitante revisa y envía el mensaje desde WhatsApp; la sesión se confirma con el equipo.

## Fuentes y decisiones

Se revisaron todas las URLs del sitemap público el 24 de septiembre de 2026, incluyendo `/plantillas` y las cinco páginas en inglés. La versión española actual contiene el correo `equipoventas@bmwebsolutionscr.com` y WhatsApp `+506 6023 3159`. Se usaron estos datos en ambos idiomas para sustituir el contacto antiguo que aún aparece en inglés.

La ruta `/planes` sigue accesible por compatibilidad, pero se presenta como «Soluciones» y no publica montos.

Se corrigieron ortografía y descripciones cruzadas de proyectos. No se añadieron promesas sobre rankings, métricas de conversión ni resultados comerciales no verificados. Los retratos no disponibles del equipo se sustituyen por nombres y roles reales, sin inventar fotografías.

## Recursos originales

- Logotipo y capturas: assets.zyrosite.com/AoPJJLZ8Zefwpvj1, referenciados por el sitio original.
- Video principal: Pexels 2887463, utilizado en la portada original.
- Video del estudio: Pexels 852421, utilizado en el sitio original.
- Fotografía de servicios: Unsplash photo-1507238691740-187a5b1d37b8, utilizada en el sitio original.
- Tipografía: Manrope y DM Sans mediante Google Fonts, con alternativas locales.

La rama `main` publica el sitio en `www.bmwebsolutionscr.com` mediante la conexión existente con Vercel.

## Oferta de TI para negocios

Se incorporó la propuesta de equipo de TI externo en español e inglés: soporte puntual, acompañamiento mensual y proyectos tecnológicos. La portada presenta la oferta junto con los servicios web existentes; servicios y soluciones explican el alcance y el proceso. El formulario incluye las consultas de TI. Los horarios, visitas y tiempos de respuesta se acuerdan por servicio; no se publican precios ni soporte ilimitado.


## Presentación y contacto

La página usa descripciones concretas de desarrollo web, software y soporte de TI en ambos idiomas. El bot flotante conserva su personaje SVG, saludo, parpadeo y seguimiento del cursor. Ofrece seis opciones de consulta y prepara un mensaje para WhatsApp, con posibilidad de añadir contexto. No envía mensajes por sí solo. Los iconos de navegación son SVG. La portada muestra capturas reales, sin efectos de profundidad ni destellos. Las animaciones del bot se conservan y respetan movimiento reducido. Se conserva el carrusel de clientes, con pausa al interactuar y compatibilidad con movimiento reducido.
