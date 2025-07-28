// Dados mockados para os testes

export const mockProducts = [
  {
    id: 1,
    name: 'Pintura Abstrata',
    price: 150.00,
    artist: 'João Artista',
    category: 'pintura',
    description: 'Pintura abstrata em tela',
    sizes: ['P', 'M', 'G'],
    inStock: true,
    image: '/products_image/uploads/1750658124722-74664055.png',
  },
  {
    id: 2,
    name: 'Escultura Moderna',
    price: 300.00,
    artist: 'Maria Pintora',
    category: 'escultura',
    description: 'Escultura moderna em bronze',
    sizes: ['Único'],
    inStock: true,
    image: '/products_image/uploads/1750658393383-242573410.png',
  },
  {
    id: 3,
    name: 'Fotografia Urbana',
    price: 80.00,
    artist: 'Carlos Fotógrafo',
    category: 'fotografia',
    description: 'Fotografia urbana em preto e branco',
    sizes: ['A4', 'A3'],
    inStock: false,
    image: '/products_image/uploads/1750658422661-931872047.png',
  },
]

export const mockUsers = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: 'customer',
    firstName: 'João',
    lastName: 'Silva',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    role: 'customer',
    firstName: 'Maria',
    lastName: 'Santos',
  },
  {
    id: 3,
    name: 'João Artista',
    email: 'artista@exemplo.com',
    role: 'artist',
    firstName: 'João',
    lastName: 'Artista',
    handle: 'joao-artista',
  },
  {
    id: 4,
    name: 'Maria Pintora',
    email: 'pintora@exemplo.com',
    role: 'artist',
    firstName: 'Maria',
    lastName: 'Pintora',
    handle: 'maria-pintora',
  },
]

export const mockOrders = [
  {
    id: 1,
    customerName: 'João Silva',
    customerEmail: 'joao@exemplo.com',
    status: 'pending',
    total: 150.00,
    items: [
      {
        id: 1,
        name: 'Pintura Abstrata',
        price: 150.00,
        quantity: 1,
        size: 'M',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 2,
    customerName: 'Maria Santos',
    customerEmail: 'maria@exemplo.com',
    status: 'shipped',
    total: 380.00,
    items: [
      {
        id: 2,
        name: 'Escultura Moderna',
        price: 300.00,
        quantity: 1,
        size: 'Único',
      },
      {
        id: 3,
        name: 'Fotografia Urbana',
        price: 80.00,
        quantity: 1,
        size: 'A4',
      },
    ],
    createdAt: '2025-01-14T15:30:00Z',
  },
]

export const mockRefunds = [
  {
    id: 1,
    orderId: 1,
    customerName: 'João Silva',
    reason: 'Produto com defeito',
    status: 'pending',
    amount: 150.00,
    createdAt: '2025-01-15T11:00:00Z',
  },
  {
    id: 2,
    orderId: 2,
    customerName: 'Maria Santos',
    reason: 'Mudança de ideia',
    status: 'approved',
    amount: 380.00,
    createdAt: '2025-01-14T16:00:00Z',
  },
]

export const mockCart = {
  items: [
    {
      id: 1,
      name: 'Pintura Abstrata',
      price: 150.00,
      quantity: 2,
      size: 'M',
      artist: 'João Artista',
    },
    {
      id: 2,
      name: 'Escultura Moderna',
      price: 300.00,
      quantity: 1,
      size: 'Único',
      artist: 'Maria Pintora',
    },
  ],
  total: 600.00,
} 