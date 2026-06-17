export const packagesPaginateMockData = {
  current_page: 1,
  data: [
    {
      id: 3001,
      is_completed: 0,
      client: { id: 101, name: 'Sofía', lastname: 'Reyes' },
      type: { id: 1, name: 'Paquete Masaje Relajante Completo', session_count: 5 },
      sale_id: 2001,
      sale: { id: 2001, is_paid: '0', price: 4000, discount: 0, subtotal: 4000, total: 4000 },
      tracking: [ 
        { id: 1, is_taken: true, description: 'Sesión 1 - Relajación de espalda', scheduled_date: new Date().toISOString(), user: { name: 'Ana', lastname: 'M.' } }
      ],
      created_at: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
    },
    {
      id: 3002,
      is_completed: 1,
      client: { id: 102, name: 'Laura', lastname: 'Gómez' },
      type: { id: 2, name: 'Paquete Depilación Láser Piernas', session_count: 8 },
      sale_id: 2002,
      sale: { id: 2002, is_paid: '1', price: 8000, discount: 10, subtotal: 7200, total: 7200 },
      tracking: [ 
        { id: 2, is_taken: true, description: 'Sesión 1', scheduled_date: new Date().toISOString(), user: { name: 'Roberto', lastname: 'M.' } },
        { id: 3, is_taken: true, description: 'Sesión 2', scheduled_date: new Date().toISOString(), user: { name: 'Roberto', lastname: 'M.' } },
        { id: 4, is_taken: true, description: 'Sesión 3', scheduled_date: new Date().toISOString(), user: { name: 'Roberto', lastname: 'M.' } },
        { id: 5, is_taken: true, description: 'Sesión 4', scheduled_date: new Date().toISOString(), user: { name: 'Roberto', lastname: 'M.' } },
        { id: 6, is_taken: true, description: 'Sesión 5', scheduled_date: new Date().toISOString(), user: { name: 'Roberto', lastname: 'M.' } },
        { id: 7, is_taken: true, description: 'Sesión 6', scheduled_date: new Date().toISOString(), user: { name: 'Roberto', lastname: 'M.' } },
        { id: 8, is_taken: true, description: 'Sesión 7', scheduled_date: new Date().toISOString(), user: { name: 'Roberto', lastname: 'M.' } },
        { id: 9, is_taken: true, description: 'Sesión 8', scheduled_date: new Date().toISOString(), user: { name: 'Roberto', lastname: 'M.' } }
      ],
      created_at: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString()
    },
    {
      id: 3003,
      is_completed: 0,
      client: { id: 103, name: 'Carmen', lastname: 'Salinas' },
      type: { id: 3, name: 'Paquete Tratamiento Facial Acne', session_count: 6 },
      sale_id: 2003,
      sale: { id: 2003, is_paid: '0', price: 6000, discount: 0, subtotal: 6000, total: 6000 },
      tracking: [],
      created_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
    }
  ],
  total: 3
};
