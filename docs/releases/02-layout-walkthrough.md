# Rediseño del Layout Principal Implementado

Se ha sustituido con éxito el antiguo cascarón de la aplicación (`DefaultLayoutComponent`) por un **App Shell a medida**, elegante y altamente semántico que respeta completamente nuestro Manual de Identidad Visual ("Serene & Organic").

## ¿Qué cambió?

1. **Limpieza de "Componentes Fantasma"**
   - Se removieron por completo las etiquetas antiguas (`<app-header>`, `<app-sidebar>`, `<app-footer>`, etc.) que Angular estaba ignorando (debido a `NO_ERRORS_SCHEMA`). 
   - Fueron reemplazadas por elementos HTML5 reales (`<aside>`, `<header>`, `<main>`), lo cual mejora la accesibilidad y nos da control total sobre la apariencia.

2. **Sidebar (Menú Lateral)**
   - Creado desde cero con un fondo **Bosque Oscuro (`#3A4A40`)**.
   - Los íconos y textos utilizan la familia tipográfica `Outfit` para máxima legibilidad.
   - Cuenta con efectos de hover sutiles: los enlaces inactivos tienen una leve transparencia, y al pasar el ratón se iluminan en blanco. 
   - El enlace activo (`active`) muestra un acento elegante con nuestro color primario (Verde Salvia).

3. **Topbar (Barra Superior)**
   - Ahora es sumamente limpia. Utiliza una sombra mínima (`box-shadow`) para separarse sutilmente del contenido principal.
   - El mensaje de bienvenida ("Hola, Nombre") usa la fuente premium `Cormorant Garamond` para el nombre de usuario, dándole ese toque de *boutique*.
   - El botón de "Salir" es minimalista: contorno gris suave que se torna en rojo desaturado solo al hacer hover, protegiendo al usuario de clics accidentales mientras mantiene la elegancia.

4. **Main Content (Contenedor Central)**
   - El contenedor donde se incrustan las vistas (como la de Ventas que hicimos antes) ahora tiene el color de fondo base **Alabaster (`#FAF9F6`)**.
   - Se ha personalizado la barra de desplazamiento (Scrollbar) a nivel global en este layout: es más delgada y translúcida, eliminando la pesada barra gris nativa del navegador.
