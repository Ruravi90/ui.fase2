# Fase 2 Spa — Design System & Brand Guidelines

Este documento establece las reglas visuales y los estándares de diseño para mantener un *look and feel* coherente en toda la aplicación web de **Fase 2 Spa**. El objetivo es transmitir tranquilidad, elegancia, profesionalismo y un toque orgánico en cada pantalla, **evitando por completo el aspecto de plantilla genérica comercial**.

---

## 1. Concepto y Visión Visual

**"Serene & Organic" (Sereno y Orgánico)**

Basados en los principios de diseño de interfaz de autor, la interfaz debe sentirse como un refugio relajante. Cada elección es deliberada y se aleja de los patrones predeterminados. Se privilegia el espacio en blanco (whitespace), las curvas suaves y las tipografías elegantes de estilo boutique.

**Reglas absolutas:**
- ❌ Sin tablas HTML genéricas para listados de datos — usar tarjetas (`sale-day-card`)
- ❌ Sin radio buttons nativos visibles — usar el sistema `serene-radio-group`
- ❌ Sin `iziToast`, `$` global ni dependencias jQuery — usar Swal2 toast
- ❌ Sin `BsModalService.forRoot()` en componentes standalone — usar overlays nativos
- ✅ Siempre skeleton loader mientras cargan datos
- ✅ Siempre confirmación Swal antes de acciones destructivas

---

## 2. Paleta de Colores

La regla de oro es **usar el color con moderación**; el color de acento principal debe ser lo único que llame la atención.

### Colores Base
| Uso | Nombre | HEX | CSS Var |
| :--- | :--- | :--- | :--- |
| **Fondo Principal** | Alabaster / Crema Cálido | `#FAF9F6` | `--color-bg` |
| **Superficies / Tarjetas** | Blanco Puro | `#FFFFFF` | `--color-surface` |
| **Bordes y Líneas** | Gris Verdoso Muy Claro | `#E0E5E2` | `--color-border` |

### Colores de Acento (Identidad)
| Uso | Nombre | HEX | CSS Var | Pantone |
| :--- | :--- | :--- | :--- | :--- |
| **Primario (Botones, Activos)** | Verde Salvia Suave | `#84A59D` | `--color-primary` | Pantone 5503 C |
| **Primario Hover** | Verde Salvia Oscuro | `#729189` | `--color-primary-hover` | Pantone 5493 C |
| **Secundario** | Rubor / Terracota | `#F28482` | `--color-secondary` | Pantone 16-1526 TPX |

### Colores de Texto y Estado
| Uso | Nombre | HEX | CSS Var |
| :--- | :--- | :--- | :--- |
| **Texto Principal** | Bosque Oscuro / Carbón | `#3A4A40` | `--color-text` / `--color-text-primary` |
| **Texto Secundario** | Salvia Apagada | `#8C9C93` | `--color-text-muted` |
| **Éxito** | Verde Hierba | `#5a9e7a` | `--color-success` |
| **Error / Peligro** | Rojo Desaturado | `#e85d5d` | `--color-danger` / `--color-error` |
| **Advertencia** | Ámbar Suave | `#e0a040` | `--color-warning` |

### Paleta de Colores para Eventos (Agenda)
Colores pastel usados en chips de citas y eventos. Siempre con texto `#3A4A40`:

| Color | HEX | Uso sugerido |
| :--- | :--- | :--- |
| Azul Pastel | `#a2d2ff` | Limpiezas faciales |
| Rosa Pastel | `#ffc8dd` | Masajes / relajación |
| Azul Claro | `#bde0fe` | Consultas |
| Rojo Pastel | `#ffadad` | Depilaciones |
| Amarillo | `#fdffb6` | Seguimientos |
| Verde Pastel | `#caffbf` | Radiofrecuencia |
| Lavanda | `#c9b1ff` | Procedimientos especiales |
| Naranja Pastel | `#ffd6a5` | Otros |

---

## 3. Tipografía

### Títulos (Display)
- **Familia:** `Cormorant Garamond` (serif)
- **Uso:** Encabezados de página (`h4` con font-size `1.8rem`), títulos de sección
- **Pesos:** `400` para títulos grandes, `600` para subtítulos
- **Ejemplo:** `font-family: 'Cormorant Garamond', serif; font-size: 1.8rem;`

### UI y Cuerpo
- **Familia:** `Outfit` (sans-serif)
- **Uso:** Párrafos, campos de formulario, botones, labels, badges
- **Pesos:** `300` (Light), `400` (Regular), `500` (Medium), `600` (SemiBold)
- **Import:** `https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap`

---

## 4. Componentes UI — Patrones Establecidos

### 4.1 Layout de Vista

Toda vista sigue esta estructura:

```html
<div class="animated fadeIn">
  <div class="row justify-content-center">
    <div class="col-lg-10">

      <!-- Header: título + filtros/acciones -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h4 style="margin: 0; color: var(--color-text-primary); font-family: 'Cormorant Garamond', serif; font-size: 1.8rem;">
          Título de la Vista
        </h4>
        <!-- acciones / filtros aquí -->
      </div>

      <!-- Skeleton loader (mientras isLoading === true) -->
      @if (isLoading) { <div class="box-loading-skeleton"> ... </div> }
      @else { <!-- contenido real --> }

    </div>
  </div>
</div>
```

### 4.2 Tarjetas de Lista (`sale-day-card`)

**Patrón principal para listados**. No usar tablas HTML.

```html
<div class="sale-day-card">
  <!-- Cabecera: identificador principal + fecha + acciones -->
  <div class="sale-day-header">
    <div>
      <span class="client-name">Nombre Principal</span>
      <span class="sale-time">{{ fecha | date:'dd/MM/yyyy HH:mm' }}</span>
    </div>
    <div style="display: flex; gap: 0.5rem;">
      <!-- botones de acción -->
    </div>
  </div>

  <!-- Cuerpo: grid de detalles -->
  <div class="sale-day-body">
    <div class="sale-item-detail">
      <div class="detail-grid">
        <div class="col-flex" style="flex: 2;">
          <small style="color: var(--color-text-muted);">Etiqueta</small><br>
          <span>Valor</span>
        </div>
        <div class="col-flex text-right">
          <small style="color: var(--color-text-muted);">Monto:</small><br>
          <span class="price-value">{{ monto | currency:'MXN ':'symbol':'1.2-2' }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 4.3 Filtros Radio Pill (`serene-radio-group`)

Reemplaza todos los radio buttons nativos. Siempre usar este patrón:

```html
<div class="serene-radio-group">
  <label class="radio-label" [class.active]="filters.estado === 0">
    <input type="radio" name="filtro" [value]="0" [(ngModel)]="filters.estado"
           (ngModelChange)="cargarDatos()" style="display: none;">
    <span class="status-indicator error"></span> Pendientes
  </label>
  <label class="radio-label" [class.active]="filters.estado === 1">
    <input type="radio" name="filtro" [value]="1" [(ngModel)]="filters.estado"
           (ngModelChange)="cargarDatos()" style="display: none;">
    <span class="status-indicator success"></span> Todos
  </label>
</div>
```

### 4.4 Skeleton Loader

**Obligatorio** mientras `isLoading === true`. Simula la estructura de las tarjetas reales.

```typescript
// En el componente TypeScript:
isLoading = false;

cargarDatos() {
  this.isLoading = true;
  this.servicio.paginate(this.filters).subscribe({
    next: (r) => {
      this.paginate = r;
      this.items = r.data;
      this.isLoading = false;
    },
    error: () => { this.isLoading = false; }
  });
}
```

```html
<!-- En el template HTML: -->
@if (isLoading) {
  <div class="box-loading-skeleton" style="margin-bottom: 1.5rem;">
    <div class="skeleton-line" style="width: 30%; height: 24px; margin-bottom: 16px;"></div>
    <div class="skeleton-line" style="width: 100%; height: 90px; margin-bottom: 12px; border-radius: 8px;"></div>
    <div class="skeleton-line" style="width: 100%; height: 90px; margin-bottom: 12px; border-radius: 8px;"></div>
    <div class="skeleton-line" style="width: 100%; height: 90px; border-radius: 8px;"></div>
  </div>
} @else {
  <!-- Contenido real -->
}
```

```scss
// En el SCSS del componente (o en styles.scss global):
.box-loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2rem;
  background: var(--color-surface, #fff);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(58, 74, 64, 0.05);
  border: 1px solid rgba(0,0,0,0.03);
}

.skeleton-line {
  display: block;
  border-radius: 6px;
  background: linear-gradient(90deg, #e8ecea 25%, #d4dbd8 50%, #e8ecea 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 4.5 Formularios

```html
<!-- Campo input -->
<input type="text" class="serene-input" placeholder="Texto" [(ngModel)]="modelo.campo">

<!-- Select con búsqueda -->
<ng-select class="serene-select"
  placeholder="Selecciona..."
  [items]="lista"
  bindLabel="name"
  bindValue="id"
  [(ngModel)]="modelo.campo_id"
  [selectOnTab]="true">
</ng-select>

<!-- Checkbox -->
<label class="serene-checkbox">
  <input type="checkbox" [(ngModel)]="modelo.activo">
  Texto descriptivo
</label>
```

### 4.6 Botones

```html
<!-- Primario (acción principal) -->
<button class="btn-serene-primary">Guardar cambios</button>

<!-- Secundario -->
<button class="btn-serene-secondary">Cancelar</button>

<!-- Icono peligro (eliminar) -->
<button class="btn-serene-icon-danger" title="Eliminar">
  <i class="fa fa-trash"></i>
</button>

<!-- Icono primario (pago/ver) -->
<button class="btn-serene-icon-primary" title="Pagar">
  <i class="fas fa-dollar-sign"></i>
</button>
```

### 4.7 Status Badges

```html
<!-- Estado pagado -->
<span class="status-badge status-paid">Pagado</span>

<!-- Estado cancelado -->
<span class="status-badge status-error">
  <i class="fa fa-ban"></i> Cancelada
</span>
```

```scss
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;

  &.status-paid {
    background: rgba(90, 158, 122, 0.1);
    color: #3d8a62;
    border: 1px solid rgba(90, 158, 122, 0.25);
  }
  &.status-error {
    background: rgba(232, 93, 93, 0.1);
    color: #c0392b;
    border: 1px solid rgba(232, 93, 93, 0.2);
  }
}
```

### 4.8 Modales Nativos (Angular Standalone)

**No usar `BsModalService` en componentes standalone** — requiere `ModalModule.forRoot()` que no aplica en esta arquitectura. Usar overlay nativo en el HTML y asegurar que las clases `.sc-modal-overlay`, `.sc-modal-panel`, `.sc-btn`, etc., estén definidas globalmente en `styles.scss` (ya incluidas en la última actualización).

```typescript
// En el componente:
showModal = false;

openModal()  { this.showModal = true;  this.cdr.detectChanges(); }
closeModal() { this.showModal = false; this.cdr.detectChanges(); }
```

```html
<!-- Overlay nativo con backdrop blur -->
<div class="sc-modal-overlay" [class.active]="showModal" (click)="closeModal()">
  <div class="sc-modal-panel" (click)="$event.stopPropagation()">
    <div class="sc-modal-header">
      <h4 class="sc-modal-title">Título</h4>
      <button class="sc-close-btn" (click)="closeModal()">✕</button>
    </div>
    <div class="sc-modal-body"><!-- contenido --></div>
    <div class="sc-modal-footer">
      <button class="sc-btn sc-btn-ghost" (click)="closeModal()">Cancelar</button>
      <button class="sc-btn sc-btn-primary" (click)="guardar()">Guardar</button>
    </div>
  </div>
</div>
```

### 4.9 Selectores de Cliente (ng-select)

Siempre mostrar nombre completo (`fullname`), nunca el ID numérico en la UI:

```html
<ng-select
  [items]="clients"
  bindLabel="fullname"
  bindValue="id"
  [(ngModel)]="formData.client_id"
  placeholder="Buscar cliente..."
  [clearable]="true">
</ng-select>
```

### 4.10 Paginación

```html
<div style="padding: 1rem 0; display: flex; justify-content: center;">
  <pagination
    [totalItems]="paginate.total || 0"
    [maxSize]="9"
    [itemsPerPage]="filters.perPage"
    (pageChanged)="pageChanged($event)"
    previousText="&lsaquo;"
    nextText="&rsaquo;"
    firstText="&laquo;"
    lastText="&raquo;">
  </pagination>
</div>
```

---

## 5. Notificaciones y Confirmaciones (Swal2)

**No usar** `iziToast`, `alert()`, ni dependencias globales. Todo via SweetAlert2.

### Toast de éxito (no bloqueante)
```typescript
Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'success',
  title: 'Operación realizada',
  showConfirmButton: false,
  timer: 2000
});
```

### Confirmación antes de acción destructiva
```typescript
Swal.fire({
  title: '¿Confirmar?',
  html: `<p>Descripción clara de la consecuencia.</p>`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#84A59D',
  cancelButtonColor: '#bdc3c7',
  confirmButtonText: 'Sí, continuar',
  cancelButtonText: 'Cancelar',
  reverseButtons: true
}).then(result => {
  if (result.isConfirmed) { /* acción */ }
});
```

---

## 6. Agenda / Calendario (FullCalendar)

### Configuración mínima requerida
```typescript
import esLocale from '@fullcalendar/core/locales/es';

calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locale: esLocale,
  buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día' },
  initialView: 'timeGridWeek',
  editable: true,
  selectable: true,
  select: this.handleDateSelect.bind(this),
  eventClick: this.handleEventClick.bind(this),
  eventDrop: this.handleEventDrop.bind(this),
  eventResize: this.handleEventResize.bind(this),
};
```

### Reglas de FullCalendar
- Usar `ChangeDetectorRef.detectChanges()` al abrir/cerrar modales desde callbacks
- Actualizar eventos con spread inmutable: `this.calendarOptions = { ...this.calendarOptions, events }`
- Guardar `*ngIf="calendarOptions"` en el template para prevenir el error `hasOwnProperty`
- El campo `textColor` de eventos debe ser `#3A4A40` para contraste con colores pastel

### Formato de fechas en citas
Formato humanizado en español: **"Jueves 22 de octubre del 2026 a las 10:00 AM"**

```typescript
const fecha = new Date(cita.start);
const opciones: Intl.DateTimeFormatOptions = {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit'
};
const fechaFormateada = fecha.toLocaleDateString('es-MX', opciones);
// → "jueves, 22 de octubre de 2026, 10:00 a. m."
```

---

## 7. Mock Data (Desarrollo)

### Estructura esperada por el sistema mock
Los objetos mock deben incluir las relaciones embebidas que el template necesita:

```typescript
// schedules — formato FullCalendar
{
  id: 1,
  title: 'Limpieza Facial - Maria G.',
  client_id: 1,
  client: { id: 1, name: 'Maria', fullname: 'Maria Gonzalez Perez' },
  start: '2026-06-19T10:00:00',
  end:   '2026-06-19T11:00:00',
  color: '#a2d2ff',
  description: 'Descripción del servicio',
  allDay: 0
}

// purchases — con relaciones de proveedor, gasto y producto
{
  id: 1,
  user: { name: 'Admin' },
  provider: { business_name: 'Proveedor SA' },
  department: { name: 'Cosmetologia' },
  cat_expense: { name: 'Insumos clínicos' },
  product: { name: 'Protector solar SPF 50' },
  product_count: 8,
  amount: 2300,
  is_paid: false
}
```

### Filtros en el mock
El mock interceptor (`mock-api.ts`) debe filtrar por `isPaid` igual que el backend real:

```typescript
{
  method: 'POST',
  pattern: /^purchases\/paginate$/,
  response: (req) => {
    const isPaid = req.body?.isPaid;
    let result = purchases;
    if (isPaid === 0 || isPaid === '0') result = purchases.filter(p => !p.is_paid);
    if (isPaid === 1 || isPaid === '1') result = purchases.filter(p => p.is_paid);
    return makePaginate(result, req);
  }
}
```

---

## 8. Arquitectura Angular — Reglas de Componentes Standalone

Este proyecto usa **Angular 22 con componentes standalone** (sin AppModule clásico).

### Imports necesarios por tipo de componente
```typescript
// Componente base
imports: [CommonModule, FormsModule]

// Con listas paginadas
imports: [CommonModule, FormsModule, PaginationModule]

// Con selector de cliente/catálogo
imports: [CommonModule, FormsModule, NgSelectModule]

// Con agenda
imports: [CommonModule, FullCalendarModule, FormsModule, NgSelectModule]
```

### Providers globales (`app.config.ts`)
```typescript
providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withHashLocation()),
  provideHttpClient(withInterceptorsFromDi()),
  provideAnimations(),
  AlwaysAuthGuard,
  // ⚠️ NO agregar ModalModule.forRoot() — no compatible con standalone
]
```

### Variables de entorno
```typescript
// environments/environment.ts
export const environment = {
  production: false,
  urlApi: 'http://localhost:8000/api/',   // <-- usar urlApi, no apiUrl
  useMock: true,
  openWaEnabled: false
};
```

---

## 9. Elevación y Sombras

| Nivel | CSS | Uso |
| :--- | :--- | :--- |
| **sm** | `0 2px 12px rgba(58, 74, 64, 0.06)` | Tarjetas de lista, paneles |
| **md** | `0 8px 30px rgba(58, 74, 64, 0.12)` | Modales, dropdowns |
| **lg** | `0 10px 30px rgba(0,0,0,0.10)` | Modales de pago |

---

## 10. Animaciones

- **Transiciones de estado:** `0.2s–0.3s ease` — hover de botones, focus de inputs
- **Entradas de pantalla:** clase `.animated.fadeIn` en el wrapper raíz de cada vista
- **Skeleton shimmer:** `1.4s ease-in-out infinite` — animación `shimmer` con gradient 90°
- **Modales nativos:** `transform: translateY(24px) scale(0.97)` → `translateY(0) scale(1)` con `cubic-bezier(0.34, 1.56, 0.64, 1)` (efecto bounce suave)
- **Eventos FullCalendar:** hover `translateY(-1px)` con `box-shadow` para dar sensación de elevación

---

## 11. Copywriting y Tono de Voz

- **Voz Activa:** Botones con verbos concretos ("Agendar", "Guardar cambios", "Marcar como pagado")
- **Lenguaje de clínica:** Hablar de "citas", "egresos", "abonos" — nunca "records", "entries"
- **Errores humanos:** "No se pudo actualizar la cita" en lugar de "Error 500"
- **Confirmaciones:** Siempre mencionar el nombre del cliente o proveedor en el mensaje Swal
- **Fechas en citas:** Formato largo en español — "Jueves 22 de octubre del 2026 a las 10:00 AM"
- **Montos:** Siempre `currency:'MXN ':'symbol':'1.2-2'` — ejemplo: `MXN 1,250.00`
