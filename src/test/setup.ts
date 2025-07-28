import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ultra-simples do react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => children,
  Routes: ({ children }: any) => children,
  Route: ({ children }: any) => children,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({ id: '1' }),
  Link: ({ children, to }: any) => children,
}))

// Mock ultra-simples do @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: class {
    constructor() {}
  },
  QueryClientProvider: ({ children }: any) => children,
  useQuery: () => ({ 
    data: [
      {
        id: 1,
        name: 'Pintura Abstrata',
        price: 150.00,
        artist: 'João Artista',
        category: 'pintura',
        description: 'Pintura abstrata em tela',
        sizes: ['P', 'M', 'G'],
        inStock: true,
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
      }
    ], 
    isLoading: false, 
    error: null 
  }),
  useMutation: () => ({ 
    mutate: vi.fn(), 
    isLoading: false, 
    error: null 
  }),
}))

// Mock ultra-simples dos contextos
vi.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: any) => children,
  useAuth: () => ({
    user: {
      id: 1,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      role: 'customer',
    },
    setUser: vi.fn(),
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  getCartKey: vi.fn(),
}))

vi.mock('../contexts/UserContext', () => ({
  UserProvider: ({ children }: any) => children,
  useUser: () => ({
    usuario: {
      id: 1,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      role: 'customer',
    },
    setUsuario: vi.fn(),
    loading: false,
  }),
}))

vi.mock('../contexts/FilterContext', () => ({
  FilterProvider: ({ children }: any) => children,
  useFilters: () => ({
    filters: {
      priceRange: { min: 0, max: 10000 },
      inStockOnly: false,
      frameStatus: 'all',
      sortBy: 'default',
      vendor: '',
    },
    setFilters: vi.fn(),
    resetFilters: vi.fn(),
    isDefault: true,
  }),
}))

// Mock ultra-simples do axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ 
      data: [
        {
          id: 1,
          name: 'João Artista',
          email: 'artista@exemplo.com',
          role: 'artist',
        },
        {
          id: 2,
          name: 'Maria Pintora',
          email: 'pintora@exemplo.com',
          role: 'artist',
        }
      ] 
    }),
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
    put: vi.fn().mockResolvedValue({ data: { success: true } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}))

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock do IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock do ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) 