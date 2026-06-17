export const usersMockData = {
  data: [
    {
      id: 1,
      name: 'Admin Sistema',
      email: 'admin@fase2.com',
      username: 'admin',
      role_id: 1,
      role: { id: 1, name: 'Administrador' }
    },
    {
      id: 2,
      name: 'Vendedor 1',
      email: 'vendedor@fase2.com',
      username: 'vendedor1',
      role_id: 2,
      role: { id: 2, name: 'Ventas' }
    }
  ],
  total: 2,
  per_page: 10,
  current_page: 1,
  last_page: 1
};
