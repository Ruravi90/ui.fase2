export const salesCuteNowMockData = [
  {
    id: 101,
    client_id: 1,
    user_id: 1,
    amount: 1500.50,
    created_at: new Date().toISOString(),
    status: 'COMPLETADO',
    client: { id: 1, name: 'Juan Pérez' },
    user: { id: 1, name: 'Admin Sistema' }
  },
  {
    id: 102,
    client_id: 2,
    user_id: 1,
    amount: 300.00,
    created_at: new Date().toISOString(),
    status: 'PENDIENTE',
    client: { id: 2, name: 'María García' },
    user: { id: 1, name: 'Admin Sistema' }
  }
];

export const salesPaginateMockData = {
  current_page: 1,
  data: [
    {
      id: 1,
      is_cancel: 0,
      is_paid: '0',
      updated_at: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
      client: { id: 1, name: 'María', lastname: 'González' },
      sales: [
        {
          id: 101,
          is_cancel: 0,
          is_paid: '0',
          department: { id: 1, name: 'Cosmetología' },
          product_id: 1,
          cat_product: { id: 1, name: 'Tratamiento Facial Premium' },
          amount: 1500.00,
          balance: 500.00,
          payments: [
            { id: 1, amount: 1000.00, updated_at: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString() }
          ]
        }
      ]
    },
    {
      id: 2,
      is_cancel: 0,
      is_paid: '1',
      updated_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      client: { id: 2, name: 'Roberto', lastname: 'Méndez' },
      sales: [
        {
          id: 102,
          is_cancel: 0,
          is_paid: '1',
          department: { id: 2, name: 'Aparatología' },
          service_id: 1,
          cat_service: { id: 1, name: 'Sesión Depilación Láser' },
          amount: 800.00,
          balance: 0.00,
          payments: [
            { id: 2, amount: 800.00, updated_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() }
          ]
        }
      ]
    },
    {
      id: 3,
      is_cancel: 1,
      is_paid: '0',
      updated_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      client: { id: 3, name: 'Ana', lastname: 'López' },
      sales: [
        {
          id: 103,
          is_cancel: 1,
          is_paid: '0',
          department: { id: 1, name: 'Cosmetología' },
          package_id: 1,
          cat_package: { id: 1, name: 'Paquete Relajación Total' },
          amount: 3500.00,
          balance: 3500.00,
          payments: []
        }
      ]
    }
  ],
  from: 1,
  last_page: 1,
  next_page_url: null,
  path: "http://localhost:8000/api/sales/paginate",
  per_page: 15,
  prev_page_url: null,
  to: 3,
  total: 3
};
