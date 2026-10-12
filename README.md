# BM Web Solutions — Rediseño

Sitio estático bilingüe. El contenido final está en `dist/`, listo para alojarse en cualquier servidor de archivos estáticos. Ejecutar `node generate.cjs` actualiza las 12 páginas a partir de los textos y componentes compartidos. Ejecutar `node serve.cjs` abre la vista previa en http://127.0.0.1:4173.

## Publicación en Vercel

El repositorio de GitHub es `Segsoto/bmwebsolutionscr`. Vercel genera las páginas con `node generate.cjs`, valida sus enlaces con `node check.cjs` y publica `dist/`, según `vercel.json`. No requiere dependencias ni variables de entorno. La rama de producción es `main`.

La cuenta de Vercel es `segsoto`, con el equipo `brandon-s-projects-cc03ed1c` (Brandon 's projects). La web de producción está en https://bmwebsolutionscr-eta.vercel.app y el proyecto está conectado a GitHub para desplegar los cambios de `main` automáticamente. Antes de operar desde la terminal, comprobar que `vercel whoami` muestre `segsoto` y seleccionar ese equipo.

El contenido de los servicios, soluciones, proyectos y plantillas se define en `generate.cjs`. La portada, navegación, invitación a reservar, tarjetas de proyectos y formulario se definen en `experience.cjs`. Los estilos y la interacción compartida están en `dist/styles.css` y `dist/app.js`. Las capturas y los demás recursos están en `dist/assets/`. Antes de subir cambios, ejecutar `node generate.cjs` y `node check.cjs`.

## Experiencia y recorrido de reserva

Dirección visual: estudio digital de Costa Rica, con fondos claros, azul de marca, acentos verdes y tipografía Manrope / DM Sans. La portada presenta una pieza interactiva para explorar diseño web, software y soporte de TI. El diseño web muestra un proyecto real; el software se identifica como ejemplo visual y la pestaña de TI explica el alcance del servicio.

El recorrido prioriza objetivos del cliente, proyectos reales, proceso de trabajo, equipo, preguntas frecuentes y solicitud de sesión. La navegación y la barra inferior móvil mantienen visible la acción de reservar. Las llamadas de cada objetivo y servicio preseleccionan la solución en el formulario.

La reserva es una **solicitud por WhatsApp**, con nombre, necesidad, descripción y fecha/horario preferidos opcionales. El correo es opcional. No existe calendario de disponibilidad ni confirmación automática: el visitante envía la solicitud y el equipo coordina la cita. El formulario valida los datos, rechaza fechas anteriores al día actual en Costa Rica y ofrece un enlace alternativo si el navegador bloquea la apertura de WhatsApp. Los datos no se guardan en el sitio.

La imagen principal `featured-web.webp` es una versión optimizada de la captura real de Fuck Face (132 KB). El resto de las capturas se carga de forma diferida. Las pestañas admiten flechas, Home y End; el menú y el asistente se cierran con Escape. Se respeta la preferencia de movimiento reducido.

La franja de confianza de la portada muestra ocho negocios reales con enlaces a sus webs en otra pestaña, en ambos idiomas. Se mueve continuamente con un bucle sin salto y sin flechas de navegación. No muestra controles y se detiene al explorar con el cursor, mientras se toca, fuera de pantalla y al ocultar la pestaña. Con teclado o movimiento reducido muestra la lista original con scroll horizontal y enlaces accesibles. Sin JavaScript también conserva los enlaces y el scroll.

## Alcance

- Inicio, servicios, proyectos, planes, contacto y plantillas, en español e inglés.
- Los 10 proyectos actuales y las 5 plantillas del sitio original. Fuck Face aparece primero como el proyecto más reciente.
- Soluciones para sitios de presentación, sitios de crecimiento, tiendas en línea y software a medida, sin precios publicados.
- Equipo actual: Brandon Soto, Manfred Zuñiga y Brandon Garro.
- Logotipo, fotografía y capturas reales de AlmaBela, Abogados de la Guácima, Charlie Mensajería, CR Granimar, La Camisa del 10, AroArte, AP Signature Travel y Fuck Face. El Sistema de Barbería muestra su pantalla pública de acceso. Barber Magic CR conserva su aviso de vista previa pendiente. Los videos originales permanecen como recursos, sin reproducirse en la nueva portada.
- Asistente flotante con opciones de servicio y texto libre; prepara un mensaje contextual para WhatsApp. No envía mensajes por sí solo ni simula una conversación con IA.
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

La copia de revisión es independiente de `www.bmwebsolutionscr.com`. No se cambió el dominio, DNS ni el sitio existente.

## Oferta de TI para negocios

Se incorporó la propuesta de equipo de TI externo en español e inglés: soporte puntual, acompañamiento mensual y proyectos tecnológicos. La portada presenta la oferta junto con los servicios web existentes; servicios y soluciones explican el alcance y el proceso. El formulario y el asistente de WhatsApp incluyen las consultas de TI. Los horarios, visitas y tiempos de respuesta se acuerdan por servicio; no se publican precios ni soporte ilimitado.


## Copiloto BM y movimiento

El asistente de la esquina es un personaje SVG original, animado con CSS: flota, saluda con la mano, parpadea y mueve los ojos hacia el cursor con un máximo de una actualización por frame. En móvil conserva el saludo y su llamada a la acción queda por encima de la barra de reserva. La burbuja de invitación se retira al avanzar por la página.

Al abrirlo, la guía ofrece seis objetivos. Cada elección muestra una recomendación, su alcance orientativo y un botón principal de WhatsApp con el objetivo incluido en el mensaje. También ofrece acceso directo a WhatsApp sin elegir un objetivo. Es posible cambiar de objetivo o añadir contexto antes de abrir WhatsApp. Todos los enlaces de contacto del robot llevan a WhatsApp. La guía usa contenido definido; no simula inteligencia artificial ni confirma compras o reservas.

Se añadieron entradas escalonadas en la portada, revelado al hacer scroll, movimiento de las vistas de proyecto, profundidad y luz al pasar el cursor sobre proyectos, trazado del proceso y un cierre con movimiento orbital. Se respeta movimiento reducido y se pausan las animaciones continuas cuando la pestaña está oculta.


El contacto se presenta como una nota del estudio: logo real de BM, fondo cálido, opciones en una lista sin tarjetas numeradas y los nombres del equipo. Las respuestas usan lenguaje cercano y piden contexto concreto para la conversación en WhatsApp. El robot conserva mano y ojos animados, con materiales planos, sin halo, propulsión ni órbitas decorativas.
