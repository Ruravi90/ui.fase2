# Fase 2 Spa - Design System & Brand Guidelines

Este documento establece las reglas visuales y los estándares de diseño para mantener un *look and feel* coherente en toda la aplicación web de **Fase 2 Spa**. El objetivo es transmitir tranquilidad, elegancia, profesionalismo y un toque orgánico en cada pantalla, **evitando por completo el aspecto de plantilla genérica comercial**.

---

## 1. Concepto y Visión Visual
**"Serene & Organic" (Sereno y Orgánico)**
Basados en los principios de diseño de interfaz de autor, la interfaz debe sentirse como un refugio relajante. Cada elección es deliberada y se aleja de los patrones predeterminados. Se privilegia el espacio en blanco (whitespace), las curvas suaves y las tipografías elegantes de estilo boutique. 

---

## 2. Paleta de Colores (Restricción y Elegancia)

Para mantener la coherencia tanto en pantalla (RGB/HEX) como en posibles impresiones (Pantone), utilizamos los siguientes tonos base. La regla de oro es **usar el color con moderación**; el color de acento principal debe ser lo único que llame la atención.

### Colores Base
| Uso | Nombre | HEX | RGB | Pantone (Aproximado) |
| :--- | :--- | :--- | :--- | :--- |
| **Fondo Principal** | Alabaster / Crema Cálido | `#FAF9F6` | `250, 249, 246` | Pantone 11-0105 TCX (Antique White) |
| **Superficies / Tarjetas** | Blanco Puro (con sombra suave) | `#FFFFFF` | `255, 255, 255` | N/A |

### Colores de Acento (Identidad)
| Uso | Nombre | HEX | RGB | Pantone (Aproximado) |
| :--- | :--- | :--- | :--- | :--- |
| **Primario (Botones, Activos)** | Verde Salvia Suave | `#84A59D` | `132, 165, 157` | Pantone 5503 C |
| **Primario Hover** | Verde Salvia Oscuro | `#729189` | `114, 145, 137` | Pantone 5493 C |
| **Secundario / Detalles** | Rubor / Terracota Suave | `#F28482` | `242, 132, 130` | Pantone 16-1526 TPX (Terra Cotta) |

### Colores de Texto y Estado
| Uso | Nombre | HEX | RGB | Pantone (Aproximado) |
| :--- | :--- | :--- | :--- | :--- |
| **Texto Principal** | Bosque Oscuro / Carbón | `#3A4A40` | `58, 74, 64` | Pantone 447 C |
| **Texto Secundario (Muted)** | Salvia Apagada | `#8C9C93` | `140, 156, 147` | Pantone 5625 C |
| **Bordes y Líneas** | Gris Verdoso Muy Claro | `#E0E5E2` | `224, 229, 226` | Pantone Cool Gray 2 C |
| **Error / Peligro** | Rojo Desaturado | `#D9534F` | `217, 83, 79` | Pantone 703 C |

---

## 3. Tipografía (El Vehículo de la Personalidad)

La tipografía no es un mero contenedor de contenido; lleva la personalidad del proyecto. Evitamos combinaciones comunes (como Roboto/Open Sans).

### Tipografía de Títulos (Display)
* **Familia:** `Cormorant Garamond`
* **Uso:** Exclusivamente para encabezados (`h1`, `h2`, `h3`). Debe usarse para crear momentos de pausa y lectura elegante.
* **Pesos:** `400` (Regular) para títulos gigantes, `600` (Semi-Bold) para destacar títulos más pequeños.

### Tipografía de Cuerpo (Body & UI)
* **Familia:** `Outfit` (o `Inter` como utilidad).
* **Uso:** Párrafos, campos de formulario, botones.
* **Pesos:** `300` (Light), `400` (Regular), `500` (Medium para botones y etiquetas funcionales).

---

## 4. UI Components y Estructura

Las decisiones estructurales deben significar algo y no ser simple decoración. Todo lo que no cumpla una función debe ser eliminado.

### Formularios y Controles
* **Minimalismo Estructural:** Los campos de formulario no son cajas cerradas; son líneas limpias sobre las que descansa la información. Tienen solo un `border-bottom` que se ilumina con el color principal al hacer foco.
* **Botones:** Redondeados sutilmente (`6px`). Transmiten amabilidad sin ser infantiles (evitar radios de 50px).

### Elevación y Sombras
* **Regla:** La elevación se logra con sombras extremadamente difusas, largas y tenues (`rgba(58, 74, 64, 0.05)`), utilizando el tono base oscuro del texto para que no se vean sucias.

---

## 5. Animación Deliberada

La animación no debe sentirse automatizada ni excesiva. Las transiciones en la interfaz simulan respiraciones y movimientos naturales.
* **Micro-interacciones:** Los cambios en hover o focus tardan `0.3s`, permitiendo un cambio suave de estado en lugar de un encendido súbito.
* **Entradas de Pantalla:** Se evita el parpadeo abrupto. Usamos `slideUp` y `fadeIn` (0.6s) para introducir elementos importantes.
* **Elemento Firma (Signature):** Un fondo de orbes gradientes difuminados, que se mueve extremadamente lento, aportando profundidad sin exigir atención.

---

## 6. Copywriting y Tono de Voz (Writing in Design)

El diseño visual se apoya directamente en las palabras. El tono debe igualar a la estética.
* **Voz Activa:** Los botones dicen exactamente lo que hacen ("Guardar cambios", "Iniciar sesión"), sin ambigüedades.
* **Orientado al Usuario:** Hablamos el lenguaje de la clínica y el paciente, no el lenguaje del sistema.
* **Manejo de Errores:** Nunca usar tonos robóticos ni vagos. Los errores deben indicar exactamente qué falló y cómo resolverlo ("Usuario o contraseña incorrecta" en lugar de "Error 401").
