# Rediseño del Historial de Ventas (App Shell)

Se ha implementado con éxito el rediseño completo de la vista de **Ventas** (`#/page/sales`), adoptando el **Manual de Identidad Sereno**.

## ¿Qué cambió?

1. **Datos de Prueba (Mocks):**
   - Se crearon datos simulados detallados en `sales.mock.ts` que representan un objeto de paginación (`Paginate`).
   - El endpoint local `sales/paginate` ahora intercepta la solicitud y devuelve estos datos, haciendo que la tabla principal cobre vida y muestre tickets pagados, pendientes y cancelados.

2. **Diseño de Listas y Tarjetas:**
   - Adiós a los viejos `<ul class="list-group">` y cajas grises de Bootstrap.
   - Ahora, cada ticket (Venta maestra) se muestra en una tarjeta tipo boutique (`sale-day-card`) idéntica a las tarjetas del "Punto de Venta" (Corte de caja).
   - Se agregaron etiquetas semánticas para indicar si la venta está **Cancelada** (`status-error`) o activa, y el saldo pendiente resalta en color cálido si hay deuda.

3. **Botones de Filtro (Radio Buttons):**
   - Los radio buttons "Fechas de corte", "Por pagar" y "Todas" pasaron de ser controles nativos feos a ser **Píldoras Interactivas** (`serene-radio-group`) con indicadores visuales de estado (`status-indicator`).

4. **Modal de Abonos / Finiquitos:**
   - El diseño del modal "Registrar abonos/finiquitos" (`#modalPayment`) fue pulido a mano.
   - Ya no tiene bordes rígidos. Utiliza una sombra suave de elevación y esquinas redondeadas.
   - Los campos internos ahora son `serene-select` y `serene-input`, perfectamente alineados con 38px de altura.
   - La lista del historial de abonos se transformó a una `serene-list` sin bordes y tipografía fina.

## Verificación

1. Navega a `#/page/sales` en tu navegador.
2. Observarás que ahora la pantalla no está vacía; verás los tickets precargados (María, Roberto y Ana).
3. Haz clic en el ícono de "Abonar" (el símbolo de Dólar `$`) en la venta de "María González".
4. Disfruta de la nueva estética del modal de registro de pagos.

> [!NOTE]
> Las tarjetas y la forma de listar los abonos están construidas para ser 100% responsivas, evitando el solapamiento en pantallas pequeñas.
