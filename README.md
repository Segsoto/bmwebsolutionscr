# BM Web Solutions — Rediseño

Sitio estático bilingüe. El contenido final está en `dist/`, listo para alojarse en cualquier servidor de archivos estáticos. Ejecutar `node generate.cjs` actualiza las páginas a partir de los textos y componentes compartidos. Ejecutar `node serve.cjs` abre la vista previa en http://127.0.0.1:4173.

## Publicación en Vercel

El repositorio de GitHub es `Segsoto/bmwebsolutionscr`. Vercel genera las páginas con `node generate.cjs`, valida sus enlaces con `node check.cjs` y publica `dist/`, según `vercel.json`. No requiere dependencias ni variables de entorno. La rama de producción es `main`.

La cuenta de Vercel es `segsoto`, con el equipo `brandon-s-projects-cc03ed1c` (Brandon 's projects). La web de producción está en https://www.bmwebsolutionscr.com y el proyecto está conectado a GitHub para desplegar los cambios de `main` automáticamente. Antes de operar desde la terminal, comprobar que `vercel whoami` muestre `segsoto` y seleccionar ese equipo.

El contenido de los servicios, soluciones, proyectos y plantillas se define en `generate.cjs`. La portada, navegación, invitación a reservar, tarjetas de proyectos y contacto directo se definen en `experience.cjs`. Los estilos y la interacción compartida están en `dist/styles.css` y `dist/app.js`. Las capturas y los demás recursos están en `dist/assets/`. Antes de subir cambios, ejecutar `node generate.cjs` y `node check.cjs`.

## Experiencia y recorrido de reserva

Dirección visual: estudio digital de Costa Rica, con fondos claros, azul de marca, acentos verdes y tipografía Manrope / DM Sans. La portada presenta una pieza interactiva para explorar diseño web, software y soporte de TI. El diseño web muestra un proyecto real; el software se identifica como ejemplo visual y la pestaña de TI explica el alcance del servicio.

El recorrido prioriza objetivos del cliente, proyectos reales, proceso de trabajo, equipo, preguntas frecuentes y solicitud de sesión. La navegación y la barra inferior móvil mantienen visible WhatsApp. Las llamadas de cada objetivo, servicio, proyecto y plantilla abren una conversación con un mensaje contextual.

El contacto abre **WhatsApp directamente**, sin formularios, campos obligatorios ni pasos de validación. Los mensajes están preparados por servicio y el visitante decide si los edita y envía. Si se necesita una sesión, se coordina en la conversación; no existe confirmación automática. Los enlaces funcionan sin JavaScript.

La imagen principal `featured-web.webp` es una versión optimizada de la captura real de Fuck Face (132 KB). El resto de las capturas se carga de forma diferida. Las pestañas admiten flechas, Home y End; el menú se cierra con Escape. Se respeta la preferencia de movimiento reducido.

La franja de confianza de la portada muestra ocho negocios reales con enlaces a sus webs en otra pestaña, en ambos idiomas. Se mueve continuamente con un bucle sin salto y sin flechas de navegación. No muestra controles y se detiene al explorar con el cursor, mientras se toca, fuera de pantalla y al ocultar la pestaña. Con teclado o movimiento reducido muestra la lista original con scroll horizontal y enlaces accesibles. Sin JavaScript también conserva los enlaces y el scroll.

## Alcance

- Inicio, servicios, proyectos, planes, contacto, plantillas, privacidad, condiciones y 404, en español e inglés.
- Los 10 proyectos actuales y las 5 plantillas del sitio original. Fuck Face aparece primero como el proyecto más reciente.
- Soluciones para sitios de presentación, sitios de crecimiento, tiendas en línea y software a medida, sin precios publicados.
- Equipo actual: Brandon Soto, Manfred Zuñiga y Brandon Garro.
- Logotipo, fotografía y capturas reales de AlmaBela, Abogados de la Guácima, Charlie Mensajería, CR Granimar, La Camisa del 10, AroArte, AP Signature Travel y Fuck Face. El Sistema de Barbería muestra su pantalla pública de acceso. Barber Magic CR conserva su aviso de vista previa pendiente. Los videos originales permanecen como recursos, sin reproducirse en la nueva portada.
- Bot flotante con seis opciones de orientación y mensajes preparados para WhatsApp, sin campos de texto.
- Página de contacto con acceso principal a WhatsApp y seis accesos por necesidad. El visitante revisa y envía el mensaje desde WhatsApp; cualquier sesión se coordina con el equipo.

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

Se incorporó la propuesta de equipo de TI externo en español e inglés: soporte puntual, acompañamiento mensual y proyectos tecnológicos. La portada presenta la oferta junto con los servicios web existentes; servicios y soluciones explican el alcance y el proceso. Los accesos a WhatsApp incluyen consultas de TI. Los horarios, visitas y tiempos de respuesta se acuerdan por servicio; no se publican precios ni soporte ilimitado.


## Presentación y contacto

La página usa descripciones concretas de desarrollo web, software y soporte de TI en ambos idiomas. El bot flotante conserva su personaje SVG, saludo, parpadeo y seguimiento del cursor. Ofrece seis opciones de consulta y prepara un mensaje para WhatsApp, sin pedir datos en el sitio. No envía mensajes por sí solo. Los iconos de navegación son SVG. La portada muestra capturas reales, sin efectos de profundidad ni destellos. Las animaciones del bot se conservan y respetan movimiento reducido. Se conserva el carrusel de clientes, con pausa al interactuar y compatibilidad con movimiento reducido.

## Iconos, información y movimiento

El icono de WhatsApp se sirve sin modificar desde el paquete oficial de Meta (Digital Glyph White RGB, 2026). Su relación de aspecto se fija en 1:1. Fuente: https://www.meta.com/en-gb/brand/resources/whatsapp/whatsapp-brand/

Los favicons de 16, 32, 180, 192 y 512 píxeles y el archivo ICO se derivan del monograma del logotipo existente. El manifiesto usa la identidad de BM.

Privacidad y condiciones están enlazadas desde el pie en ambos idiomas. La política describe el contacto directo por WhatsApp y la información compartida en esa conversación. Sin JavaScript se conservan los enlaces de contacto. Las páginas describen el funcionamiento actual; su publicación no certifica cumplimiento legal ni sustituye una revisión jurídica. Referencia de protección de datos: https://formatos.inamu.go.cr/SIDOC/DOCS/ley_8968.pdf

El generador emite `dist/404.html` para la respuesta 404 automática de Vercel, además de una versión inglesa en `dist/en/404.html`. La vista previa también devuelve HTTP 404 en rutas inexistentes. Se generan sitemap y robots, y las páginas 404 llevan noindex.

Los titulares aparecen por palabras con opacidad, desplazamiento breve y desenfoque suave, sin máscaras que recorten las letras. El acento de la portada aparece por caracteres con una transición suave. Las animaciones usan Web Animations API, se reactivan al volver a entrar en pantalla y no necesitan bibliotecas. El texto conserva una versión accesible y funciona sin JavaScript. Se respeta movimiento reducido según la preferencia de movimiento del sistema. El bot conserva sus animaciones originales.

## Contacto directo y SEO

Los llamados comerciales usan WhatsApp +506 6023 3159. Los enlaces de navegación, proyectos externos y documentos siguen sirviendo para explorar el sitio. El correo se conserva para consultas de privacidad. No hay formularios ni campos de texto, tampoco dentro del asistente. Las opciones del bot ofrecen orientación opcional; su botón principal abre WhatsApp.

Se añaden cuatro páginas de servicios en ambos idiomas: diseño web, tiendas virtuales, software a medida y soporte TI. Cada una explica el alcance, la forma de trabajo, una pregunta habitual y servicios relacionados. Se enlazan desde servicios y entre ellas; los objetivos de inicio enlazan a su página correspondiente.

`seo.cjs` genera títulos y descripciones específicos, canonical, hreflang es/en/x-default, Open Graph y tarjetas sociales. Los datos JSON-LD describen Organization, WebSite, WebPage/ContactPage/CollectionPage, BreadcrumbList y Service donde corresponde. No se inventan dirección, horarios, precios, calificaciones ni resultados. La imagen social local mide 1200 × 630. Las fuentes se cargan con un enlace en el encabezado y preconnect, sin importación CSS anidada.

El sitemap incluye las 24 páginas indexables y sus alternativas de idioma. Las dos páginas 404 tienen noindex y no entran en el sitemap. `node check.cjs` comprueba enlaces, metadatos, datos estructurados y cobertura del sitemap.

Después de publicar: enviar `https://www.bmwebsolutionscr.com/sitemap.xml` a la propiedad verificada en Google Search Console, inspeccionar las páginas nuevas y revisar consultas, impresiones y clics. Validar datos estructurados con Rich Results Test. La publicación, la verificación de Search Console y la indexación no se realizan al generar los archivos locales. No se garantizan posiciones.

Referencias oficiales:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/appearance/structured-data/organization

## Ajustes de interacción del navegador

Se retiraron la nota de revisión del mensaje en contacto y en el asistente, y el botón para pausar animaciones. Instagram, Facebook y WhatsApp muestran sus logos junto a etiquetas legibles. Las preguntas frecuentes usan despliegue y cierre animados con controles nativos de teclado; sin JavaScript conservan su funcionamiento. Las tarjetas y los titulares se animan al entrar en pantalla tanto al bajar como al subir; solo se reactivan después de salir del área visible. La marca vuelve al inicio mediante una transición entre documentos; en la propia portada sube suavemente sin recargar. Todos estos movimientos respetan la preferencia de movimiento reducido del sistema.

## Videos reales de proyectos

La portada y nueve proyectos usan grabaciones públicas de sus sitios: Fuck Face, AlmaBela, Abogados de la Guácima, Charlie Mensajería, CR Granimar, GyG Automotriz, La Camisa del 10, AroArte y AP Signature Travel. Cada proyecto tiene versiones de escritorio y móvil, de aproximadamente 14 segundos, con un recorrido hacia abajo y de regreso al inicio. En páginas extensas se muestran las primeras cinco alturas de pantalla para conservar una presentación breve.

Los archivos H.264/MP4 optimizados y las portadas JPG viven en `dist/assets/previews/`. `recordings.json` registra URL, tamaño, duración y fecha de captura; `project-media.cjs` genera la presentación. Se puede alternar entre escritorio y móvil y pausar cada video. Se descargan al entrar en pantalla y se detienen fuera de ella, al ocultar la pestaña o al cambiar la pestaña del showcase. Movimiento reducido y ahorro de datos muestran la portada, con reproducción voluntaria. Sin JavaScript se mantienen la portada y el enlace al proyecto.

GyG Automotriz se incorporó el 27 de octubre de 2026 con recorridos de escritorio y móvil, en español e inglés. Su tarjeta sustituye a Barber Magic CR, cuyo dominio no se renovó. El sistema de barbería solo ofrece una página pública de inicio de sesión sin recorrido y conserva su presentación anterior. La leyenda inferior «EJEMPLO VISUAL / SOFTWARE A MEDIDA» se retiró; la maqueta de software sigue identificada como ejemplo.

## Modo oscuro y luz del robot

El selector de la cabecera alterna entre claro y oscuro en todas las páginas, incluidos contacto, documentos legales y 404, en ambos idiomas. La primera visita siempre inicia en modo claro, independientemente de la apariencia del sistema; la elección explícita se guarda en `localStorage` (`bm-theme`) y se sincroniza entre pestañas. Si el almacenamiento está bloqueado, el selector sigue funcionando durante la visita. `dist/theme.js` aplica la preferencia antes de cargar los estilos para evitar un destello de tema claro.

`dist/theme.css` define la paleta oscura y los estados del selector. Los ojos del robot emiten un brillo anaranjado cálido. Un destello local con degradado y desenfoque gira hacia el puntero y se extiende suavemente desde cada ojo. El seguimiento usa un frame por movimiento del puntero y respeta el parpadeo. Se reinicia al abrir el asistente, desplazar o redimensionar la página, salir el puntero, perder foco y ocultarse la página. En pantallas táctiles y con movimiento reducido se conserva el brillo fijo.

Verificación: `node generate.cjs` y `node check.cjs`. Con la vista previa activa, `node review-dark-mode.cjs http://127.0.0.1:4173` revisa las 26 páginas, siete anchos, español e inglés, teclado, persistencia, modo claro inicial, sincronización entre pestañas, seguimiento del cursor, movimiento reducido y almacenamiento bloqueado. Usa Playwright y Edge del entorno de desarrollo; no añade dependencias al sitio publicado.
