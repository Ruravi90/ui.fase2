const now = () => new Date().toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

export const references = [
  { id: 1, name: 'Recomendacion' },
  { id: 2, name: 'Redes sociales' },
  { id: 3, name: 'Google' },
  { id: 4, name: 'Cliente frecuente' }
];

export const departments = [
  { id: 1, name: 'Cosmetologia' },
  { id: 2, name: 'Aparatologia' },
  { id: 3, name: 'Recepcion' },
  { id: 4, name: 'Administracion' }
];

export const typeSales = [
  { id: 1, name: 'Efectivo' },
  { id: 2, name: 'Tarjeta' },
  { id: 3, name: 'Transferencia' }
];

export const products = [
  { id: 1, name: 'Protector solar SPF 50', price: 420, count: 1 },
  { id: 2, name: 'Serum vitamina C', price: 680, count: 1 },
  { id: 3, name: 'Crema hidratante facial', price: 520, count: 1 },
  { id: 4, name: 'Kit post laser', price: 890, count: 1 }
];

export const pills = [
  { id: 1, name: 'Colageno hidrolizado', price: 380, count: 1 },
  { id: 2, name: 'Biotina', price: 260, count: 1 },
  { id: 3, name: 'Antioxidante facial', price: 320, count: 1 }
];

export const services = [
  { id: 1, name: 'Limpieza facial profunda', price: 950, count: 1 },
  { id: 2, name: 'Depilacion laser axila', price: 780, count: 1 },
  { id: 3, name: 'Masaje relajante', price: 720, count: 1 },
  { id: 4, name: 'Radiofrecuencia facial', price: 1250, count: 1 }
];

export const catPackages = [
  {
    id: 1,
    name: 'Facial premium 5 sesiones',
    price: 4200,
    session_count: 5,
    count: 1,
    complements: [
      { id: 1, product_id: 2, cat_product: products[1], count: 1 }
    ]
  },
  {
    id: 2,
    name: 'Laser piernas 8 sesiones',
    price: 8200,
    session_count: 8,
    count: 1,
    complements: [
      { id: 2, product_id: 4, cat_product: products[3], count: 1 }
    ]
  },
  {
    id: 3,
    name: 'Relax corporal 4 sesiones',
    price: 2600,
    session_count: 4,
    count: 1,
    complements: []
  }
];

export const expenses = [
  { id: 1, name: 'Insumos clinicos' },
  { id: 2, name: 'Servicios' },
  { id: 3, name: 'Papeleria' },
  { id: 4, name: 'Mantenimiento' }
];

export const concepts = [
  { id: 1, name: 'Compra para inventario' },
  { id: 2, name: 'Pago a proveedor' },
  { id: 3, name: 'Gasto operativo' },
  { id: 4, name: 'Ajuste de caja' }
];

export const permissions = [
  { id: 1, name: 'Ventas', slug: 'sales', description: 'Acceso a ventas' },
  { id: 2, name: 'Catalogos', slug: 'catalogs', description: 'Administrar catalogos' },
  { id: 3, name: 'Inventario', slug: 'inventory', description: 'Administrar inventario' },
  { id: 4, name: 'Caja', slug: 'box', description: 'Consultar caja' },
  { id: 5, name: 'Admin', slug: 'admin', description: 'Administracion general' }
];

export const roles = [
  { id: 1, name: 'Administrador', slug: 'admin', description: 'Control completo', permissions },
  { id: 2, name: 'Ventas', slug: 'sales', description: 'Ventas y pagos', permissions: [permissions[0], permissions[3]] },
  { id: 3, name: 'Terapeuta', slug: 'agent', description: 'Atencion de sesiones', permissions: [permissions[0]] }
];

export const users = [
  {
    id: 1,
    name: 'Admin',
    lastname: 'Sistema',
    motherlastname: '',
    email: 'admin@fase2.test',
    username: 'admin',
    initials: 'AS',
    roles: [roles[0]],
    created_at: daysAgo(90),
    updated_at: now()
  },
  {
    id: 2,
    name: 'Valeria',
    lastname: 'Molina',
    motherlastname: 'Ruiz',
    email: 'valeria@fase2.test',
    username: 'valeria',
    initials: 'VM',
    roles: [roles[1]],
    created_at: daysAgo(60),
    updated_at: now()
  },
  {
    id: 3,
    name: 'Daniela',
    lastname: 'Torres',
    motherlastname: 'Leon',
    email: 'daniela@fase2.test',
    username: 'daniela',
    initials: 'DT',
    roles: [roles[2]],
    created_at: daysAgo(45),
    updated_at: now()
  }
];

export const clients = [
  {
    id: 1,
    name: 'Maria',
    lastname: 'Gonzalez',
    motherlastname: 'Perez',
    fullname: 'Maria Gonzalez Perez',
    email: 'maria.gonzalez@example.com',
    phone_home: '5551001001',
    phone_mobile: '5552002001',
    reference_id: 1,
    reference: references[0],
    other_ref: '',
    address: [
      { id: 1, name: 'Casa', suburb: 'Del Valle', outdoor_number: 124, inner_number: 2, postal_code: 3100, town: 'Benito Juarez', state: 'CDMX', client_id: 1 }
    ]
  },
  {
    id: 2,
    name: 'Roberto',
    lastname: 'Mendez',
    motherlastname: 'Lopez',
    fullname: 'Roberto Mendez Lopez',
    email: 'roberto.mendez@example.com',
    phone_home: '5551001002',
    phone_mobile: '5552002002',
    reference_id: 2,
    reference: references[1],
    other_ref: 'Instagram',
    address: [
      { id: 2, name: 'Casa', suburb: 'Roma Norte', outdoor_number: 88, postal_code: 6700, town: 'Cuauhtemoc', state: 'CDMX', client_id: 2 }
    ]
  },
  {
    id: 3,
    name: 'Ana',
    lastname: 'Lopez',
    motherlastname: 'Santos',
    fullname: 'Ana Lopez Santos',
    email: 'ana.lopez@example.com',
    phone_home: '5551001003',
    phone_mobile: '5552002003',
    reference_id: 4,
    reference: references[3],
    other_ref: '',
    address: []
  },
  {
    id: 4,
    name: 'Sofia',
    lastname: 'Reyes',
    motherlastname: 'Cruz',
    fullname: 'Sofia Reyes Cruz',
    email: 'sofia.reyes@example.com',
    phone_home: '5551001004',
    phone_mobile: '5552002004',
    reference_id: 3,
    reference: references[2],
    other_ref: '',
    address: []
  }
];

export const providers = [
  { id: 1, business_name: 'Dermocosmetica MX', contact_name: 'Laura Marin', office_phone: '5553003001' },
  { id: 2, business_name: 'Equipos Spa Pro', contact_name: 'Hector Casas', office_phone: '5553003002' },
  { id: 3, business_name: 'Servicios Clinicos Norte', contact_name: 'Nadia Solis', office_phone: '5553003003' }
];

export const productInventory = [
  { id: 1, product_id: 1, product: products[0], count: 18 },
  { id: 2, product_id: 2, product: products[1], count: 9 },
  { id: 3, product_id: 3, product: products[2], count: 14 },
  { id: 4, product_id: 4, product: products[3], count: 6 }
];

export const pillInventory = [
  { id: 1, pill_id: 1, pill: pills[0], count: 22 },
  { id: 2, pill_id: 2, pill: pills[1], count: 35 },
  { id: 3, pill_id: 3, pill: pills[2], count: 16 }
];

export const payments = [
  { id: 1, sale_id: 1, user_id: 2, user: users[1], responsible_id: 2, responsible: users[1], type_sale_id: 1, type: typeSales[0], amount: 950, is_paid: '1', created_at: daysAgo(0), updated_at: daysAgo(0) },
  { id: 2, sale_id: 2, user_id: 2, user: users[1], responsible_id: 2, responsible: users[1], type_sale_id: 2, type: typeSales[1], amount: 1600, is_paid: '0', created_at: daysAgo(1), updated_at: daysAgo(1) },
  { id: 3, sale_id: 3, user_id: 1, user: users[0], responsible_id: 1, responsible: users[0], type_sale_id: 3, type: typeSales[2], amount: 8200, is_paid: '1', created_at: daysAgo(2), updated_at: daysAgo(2) }
];

export const sales = [
  {
    id: 1,
    client_id: 1,
    client: clients[0],
    department_id: 1,
    department: departments[0],
    responsible_id: 3,
    responsible: users[2],
    user_id: 2,
    user: users[1],
    type_sale_id: 1,
    type: typeSales[0],
    service_id: 1,
    cat_service: services[0],
    count: 1,
    price: 950,
    discount: 0,
    subtotal: 950,
    total: 950,
    amount: 950,
    balance: 0,
    is_paid: '1',
    is_cute: '0',
    is_cancel: 0,
    description: 'Limpieza facial profunda',
    additionals: [],
    payments: [payments[0]],
    created_at: daysAgo(0),
    updated_at: daysAgo(0)
  },
  {
    id: 2,
    client_id: 2,
    client: clients[1],
    department_id: 2,
    department: departments[1],
    responsible_id: 3,
    responsible: users[2],
    user_id: 2,
    user: users[1],
    type_sale_id: 2,
    type: typeSales[1],
    product_id: 2,
    cat_product: products[1],
    count: 2,
    price: 1360,
    discount: 0,
    subtotal: 1360,
    total: 1360,
    amount: 1600,
    balance: 0,
    is_paid: '1',
    is_cute: '0',
    is_cancel: 0,
    description: 'Venta de serum vitamina C',
    additionals: [],
    payments: [payments[1]],
    created_at: daysAgo(1),
    updated_at: daysAgo(1)
  },
  {
    id: 3,
    client_id: 4,
    client: clients[3],
    department_id: 2,
    department: departments[1],
    responsible_id: 3,
    responsible: users[2],
    user_id: 1,
    user: users[0],
    type_sale_id: 3,
    type: typeSales[2],
    package_id: 2,
    cat_package: catPackages[1],
    count: 1,
    price: 8200,
    discount: 0,
    subtotal: 8200,
    total: 8200,
    amount: 8200,
    balance: 0,
    is_paid: '1',
    is_cute: '0',
    is_cancel: 0,
    description: 'Paquete laser piernas',
    additionals: [],
    payments: [payments[2]],
    created_at: daysAgo(2),
    updated_at: daysAgo(2)
  },
  {
    id: 4,
    client_id: 3,
    client: clients[2],
    department_id: 1,
    department: departments[0],
    responsible_id: 3,
    responsible: users[2],
    user_id: 2,
    user: users[1],
    type_sale_id: 1,
    type: typeSales[0],
    package_id: 1,
    cat_package: catPackages[0],
    count: 1,
    price: 4200,
    discount: 10,
    subtotal: 3780,
    total: 3780,
    amount: 1000,
    balance: 2780,
    is_paid: '0',
    is_cute: '0',
    is_cancel: 0,
    description: 'Anticipo paquete facial',
    additionals: [],
    payments: [],
    created_at: daysAgo(3),
    updated_at: daysAgo(3)
  }
];

export const packageTrackings = [
  { id: 1, package_id: 1, user_id: 3, user: users[2], description: 'Sesion 1 - diagnostico facial', scheduled_date: daysAgo(3), is_taken: true },
  { id: 2, package_id: 2, user_id: 3, user: users[2], description: 'Sesion 1 - laser piernas', scheduled_date: daysAgo(2), is_taken: true },
  { id: 3, package_id: 2, user_id: 3, user: users[2], description: 'Sesion 2 - laser piernas', scheduled_date: daysAgo(1), is_taken: true }
];

export const packages = [
  {
    id: 1,
    sale_id: 4,
    sale: sales[3],
    client_id: 3,
    client: clients[2],
    cat_package_id: 1,
    type: catPackages[0],
    is_completed: 0,
    tracking: [packageTrackings[0]],
    created_at: daysAgo(3),
    updated_at: daysAgo(3)
  },
  {
    id: 2,
    sale_id: 3,
    sale: sales[2],
    client_id: 4,
    client: clients[3],
    cat_package_id: 2,
    type: catPackages[1],
    is_completed: 0,
    tracking: [packageTrackings[1], packageTrackings[2]],
    created_at: daysAgo(2),
    updated_at: daysAgo(1)
  },
  {
    id: 3,
    sale_id: 1,
    sale: sales[0],
    client_id: 1,
    client: clients[0],
    cat_package_id: 3,
    type: catPackages[2],
    is_completed: 1,
    tracking: [],
    created_at: daysAgo(40),
    updated_at: daysAgo(8)
  }
];

export const purchases = [
  {
    id: 1,
    department_id: 1,
    department: departments[0],
    product_id: 1,
    product: products[0],
    cat_product: products[0],
    name_product: products[0].name,
    product_count: 8,
    amount: 2300,
    user_id: 1,
    user: users[0],
    provider_id: 1,
    provider: providers[0],
    expense_id: 1,
    expense: expenses[0],
    cat_expense: expenses[0],
    concept_id: 1,
    cat_concept: concepts[0],
    is_paid: false,
    created_at: daysAgo(1),
    updated_at: daysAgo(1)
  },
  {
    id: 2,
    department_id: 4,
    department: departments[3],
    name_expense: 'Internet mensual',
    amount: 850,
    user_id: 1,
    user: users[0],
    provider_id: 3,
    provider: providers[2],
    expense_id: 2,
    expense: expenses[1],
    cat_expense: expenses[1],
    concept_id: 3,
    cat_concept: concepts[2],
    is_paid: true,
    created_at: daysAgo(5),
    updated_at: daysAgo(4)
  }
];

const nextDays = (days: number) => new Date(Date.now() + days * 86400000).toISOString();

export const schedules = [
  {
    id: 1, title: 'Limpieza Facial - Maria G.', client_id: 1, client: clients[0],
    start: new Date(Date.now() + 1 * 86400000).toISOString().substring(0, 10) + 'T10:00:00',
    end:   new Date(Date.now() + 1 * 86400000).toISOString().substring(0, 10) + 'T11:00:00',
    color: '#a2d2ff', description: 'Limpieza facial profunda, 1 sesión', allDay: 0
  },
  {
    id: 2, title: 'Masaje Relajante - Sofia R.', client_id: 4, client: clients[3],
    start: new Date(Date.now() + 2 * 86400000).toISOString().substring(0, 10) + 'T14:30:00',
    end:   new Date(Date.now() + 2 * 86400000).toISOString().substring(0, 10) + 'T15:30:00',
    color: '#ffc8dd', description: 'Masaje relajante zona espalda', allDay: 0
  },
  {
    id: 3, title: 'Radiofrecuencia - Ana L.', client_id: 3, client: clients[2],
    start: new Date(Date.now() + 3 * 86400000).toISOString().substring(0, 10) + 'T09:00:00',
    end:   new Date(Date.now() + 3 * 86400000).toISOString().substring(0, 10) + 'T10:00:00',
    color: '#caffbf', description: 'Radiofrecuencia facial sesión 2', allDay: 0
  },
  {
    id: 4, title: 'Depilación Láser - Roberto M.', client_id: 2, client: clients[1],
    start: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10) + 'T11:00:00',
    end:   new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10) + 'T12:00:00',
    color: '#ffadad', description: 'Sesión 3 - depilación axilas', allDay: 0
  },
  {
    id: 5, title: 'Consulta - Maria G.', client_id: 1, client: clients[0],
    start: new Date(Date.now()).toISOString().substring(0, 10) + 'T16:00:00',
    end:   new Date(Date.now()).toISOString().substring(0, 10) + 'T16:30:00',
    color: '#c9b1ff', description: 'Consulta seguimiento tratamiento', allDay: 0
  }
];

export const saleAdditionals: any[] = [];

export const mockCollections: Record<string, any[]> = {
  agents: users,
  cat_concepts: concepts,
  cat_expenses: expenses,
  cat_packages: catPackages,
  cat_pills: pills,
  cat_products: products,
  cat_references: references,
  cat_services: services,
  cat_type_sales: typeSales,
  clients,
  creditors: providers,
  departments,
  packages,
  packages_tracking: packageTrackings,
  payments,
  permissions,
  pills_inventory: pillInventory,
  products_inventory: productInventory,
  providers,
  purchases,
  roles,
  sale_additionals: saleAdditionals,
  sales,
  schedules,
  users
};
