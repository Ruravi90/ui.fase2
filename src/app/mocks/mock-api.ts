import { HttpRequest } from '@angular/common/http';
import {
  departments,
  mockCollections,
  packages,
  packageTrackings,
  payments,
  purchases,
  sales,
  typeSales,
  users
} from './data/mock-database';

type MockHandler = (req: HttpRequest<any>, context: MockContext) => any;

export interface MockRoute {
  method: string;
  pattern: RegExp;
  response: MockHandler;
}

export interface MockContext {
  path: string;
  segments: string[];
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const getId = (segments: string[], index = segments.length - 1) => Number(segments[index]);

const makePaginate = (data: any[], req: HttpRequest<any>) => {
  const params = new URL(req.urlWithParams, window.location.origin).searchParams;
  const currentPage = Number(params.get('page') || 1);
  const perPage = Number(req.body?.per_page || req.body?.perPage || 15);
  const total = data.length;
  const from = total === 0 ? 0 : ((currentPage - 1) * perPage) + 1;
  const pageData = data.slice(from - 1, from - 1 + perPage);
  const lastPage = Math.max(Math.ceil(total / perPage), 1);

  return {
    current_page: currentPage,
    data: clone(pageData),
    from,
    last_page: lastPage,
    next_page_url: currentPage < lastPage ? `?page=${currentPage + 1}` : null,
    path: req.url.split('?')[0],
    per_page: perPage,
    prev_page_url: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    to: total === 0 ? 0 : from + pageData.length - 1,
    total
  };
};

const nextId = (collection: any[]) => Math.max(0, ...collection.map(item => Number(item.id) || 0)) + 1;

const findIn = (name: string, id: number) => {
  const collection = mockCollections[name] || [];
  return collection.find(item => Number(item.id) === id) || null;
};

const createIn = (name: string, body: any) => {
  const collection = mockCollections[name];
  if (!collection) {
    return { ...(body || {}), id: body?.id || 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  }
  const record = {
    ...(body || {}),
    id: body?.id || nextId(collection),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  collection.unshift(record);
  return clone(record);
};

const updateIn = (name: string, id: number, body: any) => {
  const collection = mockCollections[name];
  if (!collection) {
    return { ...(body || {}), id, updated_at: new Date().toISOString() };
  }
  const index = collection.findIndex(item => Number(item.id) === id);
  if (index === -1) {
    return createIn(name, { ...body, id });
  }
  collection[index] = { ...collection[index], ...(body || {}), id, updated_at: new Date().toISOString() };
  return clone(collection[index]);
};

const deleteIn = (name: string, id: number) => {
  const collection = mockCollections[name];
  if (!collection) {
    return { status: true, id };
  }
  const index = collection.findIndex(item => Number(item.id) === id);
  if (index > -1) {
    collection.splice(index, 1);
  }
  return { status: true, id };
};

const collectionNameFromPath = (path: string) => path.split('/')[0];

const currentUser = () => users[0];

const paymentWithRelations = (payment: any) => {
  const sale = sales.find(item => Number(item.id) === Number(payment.sale_id));
  const user = users.find(item => Number(item.id) === Number(payment.user_id)) || currentUser();
  const type = typeSales.find(item => Number(item.id) === Number(payment.type_sale_id)) || typeSales[0];
  return { ...payment, sale, user, responsible: user, type };
};

const saleGroup = (sale: any) => ({ ...sale, sales: sale.sales || [sale] });

const cuteSalesByDepartment = () => {
  return departments.map(department => {
    const departmentSales = sales
      .filter(sale => Number(sale.department_id) === Number(department.id) && Number(sale.is_cancel) === 0)
      .map(saleGroup);

    return {
      ...department,
      sales: departmentSales,
      sumSubTotal: departmentSales.reduce((sum, sale) => sum + Number(sale.subtotal || 0), 0),
      sumTotal: departmentSales.reduce((sum, sale) => sum + Number(sale.total || 0), 0)
    };
  }).filter(department => department.sales.length > 0);
};

const salesForPaginate = (req: HttpRequest<any>) => {
  const isPaid = Number(req.body?.isPaid);
  let result = sales.map(saleGroup);

  if (isPaid === 0) {
    result = result.filter(sale => String(sale.is_paid) === '0' && Number(sale.is_cancel) === 0);
  }

  if (isPaid === 1) {
    result = result.filter(sale => Number(sale.is_cancel) === 0);
  }

  if (isPaid === 2) {
    result = [
      { id: 1001, cute_date: new Date().toLocaleDateString('es-MX') },
      { id: 1002, cute_date: new Date(Date.now() - 86400000).toLocaleDateString('es-MX') }
    ];
  }

  return makePaginate(result, req);
};

const packageList = (req: HttpRequest<any>) => {
  const isCompleted = Number(req.body?.isCompleted);
  const result = packages.filter(item => Number(item.is_completed) === isCompleted);
  return makePaginate(result, req);
};

const balance = () => [
  {
    name: 'Caja principal',
    salesTotal: 11150,
    purchaseTotal: 3150,
    total: 8000,
    expenses: [
      { name: 'Insumos clinicos', total: 2300 },
      { name: 'Servicios', total: 850 }
    ]
  },
  {
    name: 'Caja tarjeta',
    salesTotal: 1600,
    purchaseTotal: 0,
    total: 1600,
    expenses: []
  }
];

const chartTotals = () => [
  { date: '02-2026', sales: 3 },
  { date: '03-2026', sales: 5 },
  { date: '04-2026', sales: 4 },
  { date: '05-2026', sales: 7 },
  { date: '06-2026', sales: 6 }
];

const packageChart = () => packages.map(item => ({
  cat_package: item.type,
  sales: item.type?.session_count || 0
}));

const serviceChart = () => sales
  .filter(item => item.cat_service)
  .map(item => ({ cat_service: item.cat_service, sales: Number(item.amount || item.total || 0) }));

export const mockRoutes: MockRoute[] = [
  {
    method: 'POST',
    pattern: /^users\/login$/,
    response: req => ({
      success: {
        ...clone(users[0]),
        token: 'mock-fase2-token'
      }
    })
  },
  {
    method: 'POST',
    pattern: /^users\/register$/,
    response: req => createIn('users', req.body)
  },
  {
    method: 'POST',
    pattern: /^(users|agents)\/exist_user$/,
    response: req => ({
      status: mockCollections['users'].some(user => user.username === req.body?.username)
    })
  },
  {
    method: 'POST',
    pattern: /^sales\/paginate$/,
    response: req => salesForPaginate(req)
  },
  {
    method: 'POST',
    pattern: /^packages\/paginate$/,
    response: req => packageList(req)
  },
  {
    method: 'POST',
    pattern: /^purchases\/paginate$/,
    response: req => makePaginate(purchases, req)
  },
  {
    method: 'POST',
    pattern: /^cat_(references|packages|products|pills|services|type_sales|expenses|concepts)\/paginate$/,
    response: (req, context) => makePaginate(mockCollections[collectionNameFromPath(context.path)] || [], req)
  },
  {
    method: 'POST',
    pattern: /^clients\/paginate$/,
    response: req => makePaginate(mockCollections['clients'], req)
  },
  {
    method: 'POST',
    pattern: /^users\/paginate$/,
    response: req => makePaginate(mockCollections['users'], req)
  },
  {
    method: 'POST',
    pattern: /^sales\/cute_now$/,
    response: () => cuteSalesByDepartment()
  },
  {
    method: 'POST',
    pattern: /^sales\/cute_day$/,
    response: () => cuteSalesByDepartment()
  },
  {
    method: 'GET',
    pattern: /^sales\/\d+$/,
    response: (_req, context) => {
      const sale = findIn('sales', getId(context.segments));
      return clone(sale ? saleGroup(sale) : {});
    }
  },
  {
    method: 'GET',
    pattern: /^sales\/sales_day$/,
    response: () => clone(sales.filter(sale => Number(sale.is_cancel) === 0))
  },
  {
    method: 'GET',
    pattern: /^sales\/user\/\d+$/,
    response: () => clone(sales.filter(sale => Number(sale.is_cancel) === 0))
  },
  {
    method: 'POST',
    pattern: /^sales\/user_day$/,
    response: () => clone(sales.filter(sale => Number(sale.is_cancel) === 0))
  },
  {
    method: 'POST',
    pattern: /^sales\/cancel\/\d+$/,
    response: (_req, context) => updateIn('sales', getId(context.segments), { is_cancel: 1 })
  },
  {
    method: 'POST',
    pattern: /^sales$/,
    response: req => {
      const created = (req.body?.sales || [req.body]).map((item: any) => createIn('sales', item));
      return created.length === 1 ? created[0] : created;
    }
  },
  {
    method: 'GET',
    pattern: /^payments\/\d+$/,
    response: (_req, context) => {
      const payment = findIn('payments', getId(context.segments));
      return clone(payment ? paymentWithRelations(payment) : {});
    }
  },
  {
    method: 'GET',
    pattern: /^payments\/for_sale\/\d+$/,
    response: (_req, context) => clone(payments.filter(payment => Number(payment.sale_id) === getId(context.segments)).map(paymentWithRelations))
  },
  {
    method: 'POST',
    pattern: /^payments$/,
    response: req => paymentWithRelations(createIn('payments', req.body))
  },
  {
    method: 'GET',
    pattern: /^packages_tracking\/for_package\/\d+$/,
    response: (_req, context) => clone(packageTrackings.filter(item => Number(item.package_id) === getId(context.segments)))
  },
  {
    method: 'POST',
    pattern: /^packages_tracking$/,
    response: req => {
      const created = createIn('packages_tracking', {
        ...req.body,
        user: users.find(user => Number(user.id) === Number(req.body?.user_id)) || currentUser()
      });
      const pkg = packages.find(item => Number(item.id) === Number(created.package_id));
      if (pkg) {
        pkg.tracking = [...(pkg.tracking || []), created];
        pkg.is_completed = Number(pkg.type?.session_count || 0) <= pkg.tracking.length ? 1 : 0;
      }
      return created;
    }
  },
  {
    method: 'POST',
    pattern: /^packages\/is_completed$/,
    response: req => clone(packages.filter(item => Number(item.is_completed) === Number(req.body?.isCompleted)))
  },
  {
    method: 'GET',
    pattern: /^products_inventory\/product\/\d+$/,
    response: (_req, context) => clone(mockCollections['products_inventory'].find(item => Number(item.product_id) === getId(context.segments)) || { count: 0 })
  },
  {
    method: 'GET',
    pattern: /^pills_inventory\/pill\/\d+$/,
    response: (_req, context) => clone(mockCollections['pills_inventory'].find(item => Number(item.pill_id) === getId(context.segments)) || { count: 0 })
  },
  {
    method: 'POST',
    pattern: /^purchases\/pay\/\d+$/,
    response: (_req, context) => updateIn('purchases', getId(context.segments), { is_paid: true })
  },
  {
    method: 'POST',
    pattern: /^purchases\/cancel\/\d+$/,
    response: (_req, context) => updateIn('purchases', getId(context.segments), { is_cancel: 1 })
  },
  {
    method: 'POST',
    pattern: /^purchases$/,
    response: req => {
      const created = (req.body?.purchases || [req.body]).map((item: any) => createIn('purchases', item));
      return created.length === 1 ? created[0] : created;
    }
  },
  {
    method: 'POST',
    pattern: /^box\/balance$/,
    response: () => balance()
  },
  {
    method: 'POST',
    pattern: /^box\/sales_chart$/,
    response: () => chartTotals()
  },
  {
    method: 'POST',
    pattern: /^box\/sales_package$/,
    response: () => packageChart()
  },
  {
    method: 'POST',
    pattern: /^box\/sales_service$/,
    response: () => serviceChart()
  },
  {
    method: 'POST',
    pattern: /^box\/dashboard_summary$/,
    response: () => ({
      revenueToday: 5400,
      salesMonth: 120,
      pendingAmount: 3200,
      activePackages: 15,
      lowStockProducts: 4,
      lowStockPills: 2,
      salesToday: 18,
      pendingPayments: 5,
      completedPackages: 8,
      revenueMonth: 45000
    })
  },
  {
    method: 'POST',
    pattern: /^box\/sales_department$/,
    response: () => [
      { department: { name: 'Ventas' }, total: 30000 },
      { department: { name: 'Servicios' }, total: 15000 }
    ]
  },
  {
    method: 'POST',
    pattern: /^box\/payment_methods$/,
    response: () => [
      { type: { name: 'Efectivo' }, total: 12000 },
      { type: { name: 'Tarjeta Crédito/Débito' }, total: 28000 },
      { type: { name: 'Transferencia' }, total: 5000 }
    ]
  },
  {
    method: 'POST',
    pattern: /^box\/top_sellers$/,
    response: () => ({
      packages: [
        { id: 1, cat_package: { name: 'Paquete Relajante' }, total: 5000 },
        { id: 2, cat_package: { name: 'Paquete Reductivo' }, total: 4200 }
      ],
      services: [
        { id: 1, cat_service: { name: 'Masaje Sueco' }, total: 3500 },
        { id: 2, cat_service: { name: 'Limpieza Facial' }, total: 2800 }
      ],
      products: [
        { id: 1, cat_product: { name: 'Crema Hidratante' }, total: 1200 },
        { id: 2, cat_product: { name: 'Aceite Esencial' }, total: 800 }
      ]
    })
  },
  {
    method: 'GET',
    pattern: /^box\/recent_activity$/,
    response: () => [
      { type: 'payment', title: 'Pago recibido', description: 'Cliente: María G.', amount: 500, created_at: new Date().toISOString() },
      { type: 'sale', title: 'Nueva venta', description: 'Paquete Relajante', amount: 1200, created_at: new Date(Date.now() - 3600000).toISOString() },
      { type: 'purchase', title: 'Compra de insumos', description: 'Proveedor Médico', amount: 3500, created_at: new Date(Date.now() - 7200000).toISOString() }
    ]
  },
  {
    method: 'GET',
    pattern: /^box\/alerts$/,
    response: () => [
      { level: 'warning', type: 'payment', message: 'Hay 5 pagos vencidos esta semana.' },
      { level: 'danger', type: 'stock', message: 'Inventario bajo en 6 productos.' },
      { level: 'info', type: 'package', message: '3 paquetes requieren seguimiento.' }
    ]
  },
  {
    method: 'GET',
    pattern: /^[a-z_]+$/,
    response: (_req, context) => clone(mockCollections[collectionNameFromPath(context.path)] || [])
  },
  {
    method: 'GET',
    pattern: /^[a-z_]+\/\d+$/,
    response: (_req, context) => clone(findIn(collectionNameFromPath(context.path), getId(context.segments)) || {})
  },
  {
    method: 'POST',
    pattern: /^[a-z_]+$/,
    response: (req, context) => createIn(collectionNameFromPath(context.path), req.body)
  },
  {
    method: 'PUT',
    pattern: /^[a-z_]+\/\d+$/,
    response: (req, context) => updateIn(collectionNameFromPath(context.path), getId(context.segments), req.body)
  },
  {
    method: 'DELETE',
    pattern: /^[a-z_]+\/\d+$/,
    response: (_req, context) => deleteIn(collectionNameFromPath(context.path), getId(context.segments))
  }
];

export const getMockContext = (req: HttpRequest<any>): MockContext => {
  const parsedUrl = new URL(req.urlWithParams, window.location.origin);
  const path = parsedUrl.pathname
    .replace(/^\/+/, '')
    .replace(/^api\//, '')
    .replace(/\/+$/, '');

  return {
    path,
    segments: path.split('/').filter(Boolean)
  };
};
