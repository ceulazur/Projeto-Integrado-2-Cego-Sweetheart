import express, { Request, Response } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { CorreiosService } from './correios.js';

// Types
interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  created_at: string;
}

interface Product {
  id: number;
  title: string;
  artistHandle: string;
  price: string;
  imageUrl: string;
  description: string;
  quantity: number;
  dimensions: string;
  framed: boolean;
  artistUsername: string;
  artistProfileImage: string;
  availableSizes: string;
  created_at: string;
  category: string;
  isAvailable: boolean;
  variations: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ProductRequest {
  title: string;
  artistHandle: string;
  price: string;
  imageUrl: string;
  description: string;
  quantity: number;
  dimensions: string;
  framed: boolean;
  artistUsername: string;
  artistProfileImage: string;
  availableSizes: string[];
  category: string;
  isAvailable: boolean;
  variations: { size: string; color: string }[];
}

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, '../../public/uploads')));
app.use('/products_image/uploads', express.static(join(__dirname, '../../public/products_image/uploads')));

// Database setup
const db = new Database(join(dirname(__dirname), '../users.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artistHandle TEXT NOT NULL,
    price TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    dimensions TEXT NOT NULL,
    framed BOOLEAN NOT NULL DEFAULT 0,
    artistUsername TEXT NOT NULL,
    artistProfileImage TEXT NOT NULL,
    availableSizes TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    category TEXT DEFAULT 'Tela',
    isAvailable BOOLEAN DEFAULT 1,
    variations TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clienteNome TEXT,
    clienteId TEXT,
    status TEXT DEFAULT 'transporte',
    statusEntrega TEXT DEFAULT 'Em transporte',
    data TEXT,
    produtoId INTEGER,
    produtoNome TEXT,
    produtoImageUrl TEXT,
    produtoPrice TEXT,
    quantidade INTEGER DEFAULT 1,
    subtotal TEXT,
    frete TEXT,
    total TEXT,
    formaPagamento TEXT,
    codigoRastreio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    telefone TEXT,
    endereco TEXT,
    fotoUrl TEXT,
    handle TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reembolsos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT NOT NULL,
    clienteNome TEXT NOT NULL,
    clienteId TEXT NOT NULL,
    produtoNome TEXT NOT NULL,
    produtoImageUrl TEXT,
    motivo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    banco TEXT NOT NULL,
    agencia TEXT NOT NULL,
    conta TEXT NOT NULL,
    tipoConta TEXT NOT NULL,
    fotoUrl TEXT,
    status TEXT DEFAULT 'pendente',
    dataSolicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataResposta DATETIME,
    valorReembolso TEXT NOT NULL,
    artistHandle TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Check if products table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

if (count.count === 0) {
  // Insert sample products only if the table is empty
  const sampleProducts: Omit<Product, 'id' | 'created_at'>[] = [
    {
      title: "Vulk",
      artistHandle: "@ceulazur",
      price: "R$ 50.00",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/45610d9b421b9212bc929c32d87b7875fab83345?placeholderIfAbsent=true",
      description: "Uma obra de arte única que combina elementos modernos com técnicas tradicionais. Esta peça exclusiva do artista @Ceulazur representa a fusão entre o urbano e o natural, criando uma experiência visual impactante que transforma qualquer ambiente.",
      quantity: 8,
      dimensions: "20x20 cm",
      framed: true,
      artistUsername: "@Ceulazur",
      artistProfileImage: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/235d1fa082185e9c963e83352ff5b3b837f0f7e2?placeholderIfAbsent=true",
      availableSizes: JSON.stringify(['P', 'M', 'G']),
      category: 'Outros',
      isAvailable: true,
      variations: '[]'
    },
    {
      title: "Vulk",
      artistHandle: "@ceulazur",
      price: "R$ 50.00",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/45610d9b421b9212bc929c32d87b7875fab83345?placeholderIfAbsent=true",
      description: "Uma obra de arte única que combina elementos modernos com técnicas tradicionais. Esta peça exclusiva do artista @Ceulazur representa a fusão entre o urbano e o natural, criando uma experiência visual impactante que transforma qualquer ambiente.",
      quantity: 5,
      dimensions: "20x20 cm",
      framed: true,
      artistUsername: "@Ceulazur",
      artistProfileImage: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/235d1fa082185e9c963e83352ff5b3b837f0f7e2?placeholderIfAbsent=true",
      availableSizes: JSON.stringify(['P', 'M', 'G']),
      category: 'Outros',
      isAvailable: true,
      variations: '[]'
    },
    {
      title: "Vulk",
      artistHandle: "@ceulazur",
      price: "R$ 50.00",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/45610d9b421b9212bc929c32d87b7875fab83345?placeholderIfAbsent=true",
      description: "Uma obra de arte única que combina elementos modernos com técnicas tradicionais. Esta peça exclusiva do artista @Ceulazur representa a fusão entre o urbano e o natural, criando uma experiência visual impactante que transforma qualquer ambiente.",
      quantity: 12,
      dimensions: "20x20 cm",
      framed: true,
      artistUsername: "@Ceulazur",
      artistProfileImage: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/235d1fa082185e9c963e83352ff5b3b837f0f7e2?placeholderIfAbsent=true",
      availableSizes: JSON.stringify(['P', 'M', 'G']),
      category: 'Outros',
      isAvailable: true,
      variations: '[]'
    },
    {
      title: "Vulk",
      artistHandle: "@ceulazur",
      price: "R$ 50.00",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/45610d9b421b9212bc929c32d87b7875fab83345?placeholderIfAbsent=true",
      description: "Uma obra de arte única que combina elementos modernos com técnicas tradicionais. Esta peça exclusiva do artista @Ceulazur representa a fusão entre o urbano e o natural, criando uma experiência visual impactante que transforma qualquer ambiente.",
      quantity: 3,
      dimensions: "20x20 cm",
      framed: true,
      artistUsername: "@Ceulazur",
      artistProfileImage: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/235d1fa082185e9c963e83352ff5b3b837f0f7e2?placeholderIfAbsent=true",
      availableSizes: JSON.stringify(['P', 'M', 'G']),
      category: 'Outros',
      isAvailable: true,
      variations: '[]'
    }
  ];

  const insertProductStmt = db.prepare(`
    INSERT INTO products (
      title, artistHandle, price, imageUrl, description, quantity, 
      dimensions, framed, artistUsername, artistProfileImage, availableSizes,
      category, isAvailable, variations
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleProducts.forEach(product => {
    insertProductStmt.run(
      product.title,
      product.artistHandle,
      product.price,
      product.imageUrl,
      product.description,
      product.quantity,
      product.dimensions,
      product.framed ? 1 : 0,
      product.artistUsername,
      product.artistProfileImage,
      product.availableSizes,
      product.category || 'Outros',
      product.isAvailable !== undefined ? (product.isAvailable ? 1 : 0) : 1,
      JSON.stringify(product.variations || [])
    );
  });
}

// Garante que os usuários admin e ceulazur existam
const adminUsers = [
  { email: 'admin', password: 'admin1@', firstName: 'Admin', lastName: 'Root' },
  { email: 'ceulazur', password: 'admin2@', firstName: 'Ceulazur', lastName: 'Admin' },
  { email: 'artemisia', password: 'admin3@', firstName: 'Artemisia', lastName: 'Gentileschi' },
];

const userExistsStmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
const insertUserStmt = db.prepare('INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)');

adminUsers.forEach(async (user) => {
  const exists = userExistsStmt.get(user.email) as { count: number };
  if (exists.count === 0) {
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash(user.password, 10);
    insertUserStmt.run(user.email, hash, user.firstName, user.lastName);
  }
});

// Migra vendedores conhecidos da tabela users para vendors (se ainda não migrados)
const knownVendors = [
  { email: 'artemisia', handle: '@artemisia' },
  { email: 'ceulazur', handle: '@ceulazur' },
  { email: 'testecapi@exemplo.com', handle: '@teste' },
  { email: 'criacadoteste@gmail.com', handle: '@teste' }
];

for (const v of knownVendors) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(v.email) as any;
  if (user) {
    // Verifica se já existe na tabela vendors
    const exists = db.prepare('SELECT COUNT(*) as count FROM vendors WHERE email = ?').get(v.email) as { count: number };
    if (exists.count === 0) {
      db.prepare(`INSERT INTO vendors (email, password, firstName, lastName, telefone, endereco, fotoUrl, handle, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(user.email, user.password, user.firstName, user.lastName, user.telefone || '', user.endereco || '', user.fotoUrl || '', v.handle, user.created_at);
    }
    // Remove da tabela users
    db.prepare('DELETE FROM users WHERE email = ?').run(v.email);
  }
}

// Configuração do multer para uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + '.' + ext);
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Configuração do multer para uploads de produtos
const productImageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, join(__dirname, '../../public/products_image/uploads'));
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + '.' + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Get all products
app.get('/api/products', (_req: Request, res: Response) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all() as Product[];
    
    // Transform products to match frontend interface
    const transformedProducts = products.map(product => ({
      id: product.id.toString(),
      title: product.title,
      artistHandle: product.artistHandle,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description,
      quantity: product.quantity,
      dimensions: product.dimensions,
      framed: Boolean(product.framed),
      artistUsername: product.artistUsername,
      artistProfileImage: product.artistProfileImage,
      availableSizes: JSON.parse(product.availableSizes),
      category: product.category || 'Outros',
      isAvailable: product.isAvailable !== undefined ? Boolean(product.isAvailable) : true,
      variations: product.variations ? JSON.parse(product.variations) : []
    }));

    res.json(transformedProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Search for products
app.get('/api/products/search', (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    const artist = req.query.artist;
    
    if (typeof query !== 'string' || query.trim() === '') {
      return res.json([]);
    }

    const searchQuery = `%${query}%`;
    let sqlQuery = 'SELECT * FROM products WHERE title LIKE ?';
    const params = [searchQuery];

    // Se o parâmetro artist foi fornecido, adicionar filtro por artistHandle
    if (typeof artist === 'string' && artist.trim() !== '') {
      sqlQuery += ' AND artistHandle = ?';
      params.push(artist);
    }

    sqlQuery += ' LIMIT 10';

    // Retorna todos os campos do produto para popular o formulário de edição
    const products = db.prepare(sqlQuery).all(...params) as Product[];

    const transformedProducts = products.map(product => ({
      ...product,
      id: product.id.toString(),
      framed: Boolean(product.framed),
      availableSizes: JSON.parse(product.availableSizes),
      category: product.category || 'Outros',
      isAvailable: product.isAvailable !== undefined ? Boolean(product.isAvailable) : true,
      variations: product.variations ? JSON.parse(product.variations) : []
    }));

    res.json(transformedProducts);
  } catch (error) {
    console.error('Erro ao pesquisar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get product by ID
app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;

    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    // Transform product to match frontend interface
    const transformedProduct = {
      id: product.id.toString(),
      title: product.title,
      artistHandle: product.artistHandle,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description,
      quantity: product.quantity,
      dimensions: product.dimensions,
      framed: Boolean(product.framed),
      artistUsername: product.artistUsername,
      artistProfileImage: product.artistProfileImage,
      availableSizes: JSON.parse(product.availableSizes),
      category: product.category || 'Outros',
      isAvailable: product.isAvailable !== undefined ? Boolean(product.isAvailable) : true,
      variations: product.variations ? JSON.parse(product.variations) : []
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create new product
app.post('/api/products', (req: Request, res: Response) => {
  try {
    const productData = req.body as ProductRequest;
    
    const stmt = db.prepare(`
      INSERT INTO products (
        title, artistHandle, price, imageUrl, description, quantity, 
        dimensions, framed, artistUsername, artistProfileImage, availableSizes,
        category, isAvailable, variations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      productData.title,
      productData.artistHandle,
      productData.price,
      productData.imageUrl,
      productData.description,
      productData.quantity,
      productData.dimensions,
      productData.framed ? 1 : 0,
      productData.artistUsername,
      productData.artistProfileImage,
      JSON.stringify(productData.availableSizes),
      productData.category || 'Tela',
      productData.isAvailable !== undefined ? (productData.isAvailable ? 1 : 0) : 1,
      JSON.stringify(productData.variations || [])
    );

    res.status(201).json({ 
      message: 'Produto criado com sucesso',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update product
app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productData = req.body as ProductRequest;
    
    const stmt = db.prepare(`
      UPDATE products SET 
        title = ?, artistHandle = ?, price = ?, imageUrl = ?, description = ?, 
        quantity = ?, dimensions = ?, framed = ?, artistUsername = ?, 
        artistProfileImage = ?, availableSizes = ?, category = ?, isAvailable = ?, variations = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(
      productData.title,
      productData.artistHandle,
      productData.price,
      productData.imageUrl,
      productData.description,
      productData.quantity,
      productData.dimensions,
      productData.framed ? 1 : 0,
      productData.artistUsername,
      productData.artistProfileImage,
      JSON.stringify(productData.availableSizes),
      productData.category || 'Outros',
      productData.isAvailable !== undefined ? (productData.isAvailable ? 1 : 0) : 1,
      JSON.stringify(productData.variations || []),
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Register route
app.post('/api/register', async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body as RegisterRequest;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const stmt = db.prepare('INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)');
    stmt.run(email, hashedPassword, firstName, lastName);

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login route
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as RegisterRequest;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Primeiro tenta autenticar como vendedor
    let stmt = db.prepare('SELECT * FROM vendors WHERE email = ?');
    let user = stmt.get(email);
    let userType = 'vendor';
    if (!user) {
      // Se não for vendedor, tenta como cliente
      stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      user = stmt.get(email);
      userType = 'user';
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const bcryptjs = await import('bcryptjs');
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    // Retorna dados do usuário ou vendedor
    if (userType === 'vendor') {
      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          telefone: user.telefone,
          endereco: user.endereco,
          fotoUrl: user.fotoUrl,
          handle: user.handle,
          tipo: 'vendedor'
        }
      });
    } else {
    res.json({ 
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
          lastName: user.lastName,
          telefone: user.telefone,
          endereco: user.endereco,
          fotoUrl: user.fotoUrl,
          tipo: 'cliente'
      }
    });
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Debug route to check users (remove in production)
app.get('/api/users', (_req: Request, res: Response) => {
  try {
    const users = db.prepare('SELECT id, email, firstName, lastName, created_at FROM users').all();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Ajustar rota de vendors para buscar só da tabela vendors
app.get('/api/vendors', (_req: Request, res: Response) => {
  try {
    const vendors = db.prepare(`
      SELECT id, email, firstName, lastName, telefone, endereco, fotoUrl, handle, created_at 
      FROM vendors 
      ORDER BY firstName
    `).all();
    res.json(vendors);
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar dados do usuário por ID
app.get('/api/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT id, email, firstName, lastName, telefone, endereco, fotoUrl FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Atualizar dados do usuário por ID
app.put('/api/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, telefone, endereco, fotoUrl } = req.body;
    const stmt = db.prepare('UPDATE users SET firstName = ?, lastName = ?, telefone = ?, endereco = ?, fotoUrl = ? WHERE id = ?');
    const result = stmt.run(firstName, lastName, telefone, endereco, fotoUrl, id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Endpoint para upload de imagem
app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  // Caminho relativo para uso no frontend
  const relativePath = '/uploads/' + req.file.filename;
  res.json({ url: relativePath });
});

// Rota para upload de imagem de produto
app.post('/api/upload/product-image', productImageUpload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    console.error('Nenhum arquivo enviado para upload de produto!');
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  // Caminho relativo para uso no frontend
  const relativePath = `/products_image/uploads/${req.file.filename}`;
  console.log('Imagem de produto salva em:', relativePath);
  res.json({ url: relativePath });
});

// Rota para listar todos os artistas únicos
app.get('/api/artists', (_req: Request, res: Response) => {
  try {
    const artists = db.prepare(
      'SELECT DISTINCT artistHandle, artistUsername, artistProfileImage FROM products'
    ).all();
    res.json(artists);
  } catch (error) {
    console.error('Erro ao buscar artistas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para criar pedido e baixar estoque
app.post('/api/pedidos', express.json(), (req: Request, res: Response) => {
  try {
    const { 
      clienteNome, 
      clienteId, 
      produtoId, 
      produtoNome, 
      produtoImageUrl,
      produtoPrice,
      quantidade,
      subtotal,
      frete,
      total,
      formaPagamento 
    } = req.body;
    
    if (!clienteNome || !clienteId || !produtoId || !produtoNome || !formaPagamento) {
      res.status(400).json({ error: 'Campos obrigatórios faltando' });
      return;
    }
    
    // Verifica estoque
    const produto = db.prepare('SELECT quantity FROM products WHERE id = ?').get(produtoId);
    if (!produto || produto.quantity < quantidade) {
      res.status(400).json({ error: 'Produto sem estoque suficiente' });
      return;
    }
    
    // Baixa estoque
    db.prepare('UPDATE products SET quantity = quantity - ? WHERE id = ?').run(quantidade, produtoId);
    
    // Cria pedido com todos os dados - removendo o campo 'data' e deixando created_at ser preenchido automaticamente
    const stmt = db.prepare(`
      INSERT INTO pedidos (
        clienteNome, clienteId, status, statusEntrega, produtoId, produtoNome, 
        produtoImageUrl, produtoPrice, quantidade, subtotal, frete, total, 
        formaPagamento, codigoRastreio
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      clienteNome,
      clienteId,
      'preparando',
      'Preparando entrega',
      produtoId,
      produtoNome,
      produtoImageUrl || '',
      produtoPrice || '',
      quantidade || 1,
      subtotal || '',
      frete || '',
      total || '',
      formaPagamento,
      ''
    );
    
    res.status(201).json({ message: 'Pedido criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar todos os pedidos
app.get('/api/pedidos', (req: Request, res: Response) => {
  try {
    const { vendor } = req.query;
    
    let pedidos;
    if (vendor && vendor !== 'admin') {
      // Se for um vendedor específico, filtra apenas os pedidos dos seus produtos
      pedidos = db.prepare(`
        SELECT p.*, pr.artistHandle,
        CASE 
          WHEN p.created_at IS NOT NULL AND p.created_at != '' AND p.created_at != 'NULL' AND datetime(p.created_at) IS NOT NULL
          THEN date(p.created_at)
          ELSE date('now')
        END as data
        FROM pedidos p 
        JOIN products pr ON p.produtoId = pr.id 
        WHERE pr.artistHandle = ? 
        ORDER BY p.id DESC
      `).all(vendor);
    } else {
      // Se for admin ou não especificado, retorna todos os pedidos
      pedidos = db.prepare(`
        SELECT p.*, pr.artistHandle,
        CASE 
          WHEN p.created_at IS NOT NULL AND p.created_at != '' AND p.created_at != 'NULL' AND datetime(p.created_at) IS NOT NULL
          THEN date(p.created_at)
          ELSE date('now')
        END as data
        FROM pedidos p 
        JOIN products pr ON p.produtoId = pr.id 
        ORDER BY p.id DESC
      `).all();
    }
    
    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar status e codigoRastreio do pedido
app.put('/api/pedidos/:id', express.json(), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, codigoRastreio } = req.body;
    // Mapear status para statusEntrega
    let statusEntrega = '';
    switch (status) {
      case 'preparando':
        statusEntrega = 'Preparando entrega';
        break;
      case 'transporte':
        statusEntrega = 'Em transporte';
        break;
      case 'entregue':
        statusEntrega = 'Entregue';
        break;
      case 'reembolsado':
        statusEntrega = 'Reembolsado';
        break;
      default:
        statusEntrega = status;
    }
    
    const stmt = db.prepare('UPDATE pedidos SET status = ?, statusEntrega = ?, codigoRastreio = ? WHERE id = ?');
    const result = stmt.run(status, statusEntrega, codigoRastreio, id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Pedido não encontrado' });
    } else {
      res.json({ message: 'Pedido atualizado com sucesso' });
    }
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para buscar pedidos por cliente
app.get('/api/pedidos/cliente/:clienteId', (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    
    const pedidos = db.prepare(`
      SELECT 
        id, clienteNome, clienteId, status, statusEntrega, 
        produtoId, produtoNome, produtoImageUrl, produtoPrice, 
        quantidade, subtotal, frete, total, formaPagamento, 
        codigoRastreio, created_at,
        CASE 
          WHEN created_at IS NOT NULL AND created_at != '' AND created_at != 'NULL' AND datetime(created_at) IS NOT NULL
          THEN created_at 
          ELSE datetime('now') 
        END as data_pedido
      FROM pedidos 
      WHERE clienteId = ? 
      ORDER BY 
        CASE 
          WHEN created_at IS NOT NULL AND created_at != '' AND created_at != 'NULL' AND datetime(created_at) IS NOT NULL
          THEN datetime(created_at)
          ELSE datetime('now')
        END DESC
    `).all(clienteId);
    
    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos do cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Ajustar cadastro de vendedor para inserir na tabela vendors
app.post('/api/vendors', async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, telefone, endereco, fotoUrl, handle, password } = req.body;
    if (!email || !firstName || !lastName || !handle || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    // Verifica se já existe
    const exists = db.prepare('SELECT COUNT(*) as count FROM vendors WHERE email = ?').get(email) as { count: number };
    if (exists.count > 0) {
      return res.status(409).json({ error: 'Já existe um vendedor com este email' });
    }
    const bcryptjs = await import('bcryptjs');
    const hash = await bcryptjs.hash(password, 10);
    const stmt = db.prepare('INSERT INTO vendors (email, password, firstName, lastName, telefone, endereco, fotoUrl, handle) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(email, hash, firstName, lastName, telefone || '', endereco || '', fotoUrl || '', handle);
    res.status(201).json({
      message: 'Vendedor criado com sucesso',
      vendor: {
        id: result.lastInsertRowid,
        email,
        firstName,
        lastName,
        telefone,
        endereco,
        fotoUrl,
        handle
      }
    });
  } catch (error) {
    console.error('Erro ao criar vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para buscar vendedor por ID
app.get('/api/vendors/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendor = db.prepare('SELECT id, email, firstName, lastName, telefone, endereco, fotoUrl, handle FROM vendors WHERE id = ?').get(id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vendedor' });
  }
});

// Endpoint para deletar vendedor
app.delete('/api/vendors/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o vendedor existe
    const vendor = db.prepare('SELECT * FROM vendors WHERE id = ?').get(id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }
    
    // Verificar se o vendedor tem produtos
    const produtos = db.prepare('SELECT COUNT(*) as count FROM products WHERE artistHandle = ?').get(vendor.handle);
    if (produtos.count > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir o vendedor pois ele possui produtos cadastrados' 
      });
    }
    
    // Verificar se o vendedor tem pedidos
    const pedidos = db.prepare(`
      SELECT COUNT(*) as count FROM pedidos p 
      JOIN products pr ON p.produtoId = pr.id 
      WHERE pr.artistHandle = ?
    `).get(vendor.handle);
    if (pedidos.count > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir o vendedor pois ele possui pedidos' 
      });
    }
    
    // Deletar o vendedor
    const stmt = db.prepare('DELETE FROM vendors WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Vendedor não encontrado' });
    }

    res.json({ message: 'Vendedor excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar vendedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para criar reembolso
app.post('/api/reembolsos', (req: Request, res: Response) => {
  try {
    // Verificar se a tabela reembolsos existe e tem a estrutura correta
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='reembolsos'
    `).get();

    if (!tableExists) {
      // Criar a tabela se não existir
      db.exec(`
        CREATE TABLE reembolsos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId TEXT NOT NULL,
          clienteNome TEXT NOT NULL,
          clienteId TEXT NOT NULL,
          produtoNome TEXT NOT NULL,
          produtoImageUrl TEXT,
          motivo TEXT NOT NULL,
          descricao TEXT NOT NULL,
          banco TEXT NOT NULL,
          agencia TEXT NOT NULL,
          conta TEXT NOT NULL,
          tipoConta TEXT NOT NULL,
          fotoUrl TEXT,
          status TEXT DEFAULT 'pendente',
          dataSolicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
          dataResposta DATETIME,
          valorReembolso TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      // Verificar se a coluna orderId existe
      const columns = db.prepare(`
        PRAGMA table_info(reembolsos)
      `).all();
      
      const hasOrderId = columns.some((col: { name: string }) => col.name === 'orderId');
      
      if (!hasOrderId) {
        // Recriar a tabela com a estrutura correta
        db.exec('DROP TABLE IF EXISTS reembolsos');
        db.exec(`
          CREATE TABLE reembolsos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT NOT NULL,
            clienteNome TEXT NOT NULL,
            clienteId TEXT NOT NULL,
            produtoNome TEXT NOT NULL,
            produtoImageUrl TEXT,
            motivo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            banco TEXT NOT NULL,
            agencia TEXT NOT NULL,
            conta TEXT NOT NULL,
            tipoConta TEXT NOT NULL,
            fotoUrl TEXT,
            status TEXT DEFAULT 'pendente',
            dataSolicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            dataResposta DATETIME,
            valorReembolso TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
      }
    }

    const {
      orderId,
      clienteNome,
      clienteId,
      produtoNome,
      produtoImageUrl,
      motivo,
      descricao,
      banco,
      agencia,
      conta,
      tipoConta,
      fotoUrl,
      valorReembolso,
      artistHandle
    } = req.body;

    if (!orderId || !clienteNome || !clienteId || !produtoNome || !motivo || !descricao || !banco || !agencia || !conta || !tipoConta || !valorReembolso) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    const stmt = db.prepare(`
      INSERT INTO reembolsos (
        orderId, clienteNome, clienteId, produtoNome, produtoImageUrl,
        motivo, descricao, banco, agencia, conta, tipoConta, fotoUrl, valorReembolso, artistHandle
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      orderId,
      clienteNome,
      clienteId,
      produtoNome,
      produtoImageUrl || '',
      motivo,
      descricao,
      banco,
      agencia,
      conta,
      tipoConta,
      fotoUrl || '',
      valorReembolso,
      artistHandle || ''
    );

    res.status(201).json({
      message: 'Reembolso solicitado com sucesso',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Erro ao criar reembolso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar reembolsos
app.get('/api/reembolsos', (req: Request, res: Response) => {
  try {
    // Verificar se a tabela reembolsos existe e tem a estrutura correta
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='reembolsos'
    `).get();

    if (!tableExists) {
      // Criar a tabela se não existir
      db.exec(`
        CREATE TABLE IF NOT EXISTS reembolsos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId TEXT NOT NULL,
          clienteNome TEXT NOT NULL,
          clienteId TEXT NOT NULL,
          produtoNome TEXT NOT NULL,
          produtoImageUrl TEXT,
          motivo TEXT NOT NULL,
          descricao TEXT NOT NULL,
          banco TEXT NOT NULL,
          agencia TEXT NOT NULL,
          conta TEXT NOT NULL,
          tipoConta TEXT NOT NULL,
          fotoUrl TEXT,
          status TEXT DEFAULT 'pendente',
          dataSolicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
          dataResposta DATETIME,
          valorReembolso TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      // Verificar se a coluna orderId existe
      const columns = db.prepare(`
        PRAGMA table_info(reembolsos)
      `).all();
      
      const hasOrderId = columns.some((col: { name: string }) => col.name === 'orderId');
      
      if (!hasOrderId) {
        // Recriar a tabela com a estrutura correta
        db.exec('DROP TABLE IF EXISTS reembolsos');
        db.exec(`
          CREATE TABLE reembolsos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId TEXT NOT NULL,
            clienteNome TEXT NOT NULL,
            clienteId TEXT NOT NULL,
            produtoNome TEXT NOT NULL,
            produtoImageUrl TEXT,
            motivo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            banco TEXT NOT NULL,
            agencia TEXT NOT NULL,
            conta TEXT NOT NULL,
            tipoConta TEXT NOT NULL,
            fotoUrl TEXT,
            status TEXT DEFAULT 'pendente',
            dataSolicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            dataResposta DATETIME,
            valorReembolso TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
      }
    }

    const { vendor } = req.query;
    
    let reembolsos;
    if (vendor && vendor !== 'admin') {
      // Se for um vendedor específico, filtra apenas os reembolsos dos seus produtos
      reembolsos = db.prepare(`
        SELECT * FROM reembolsos 
        WHERE artistHandle = ? 
        ORDER BY created_at DESC
      `).all(vendor);
    } else {
      // Se for admin ou não especificado, retorna todos os reembolsos
      reembolsos = db.prepare(`
        SELECT * FROM reembolsos 
        ORDER BY created_at DESC
      `).all();
    }

    res.json(reembolsos);
  } catch (error) {
    console.error('Erro ao buscar reembolsos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para buscar reembolso por ID
app.get('/api/reembolsos/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vendor } = req.query;
    
    let reembolso;
    if (vendor && vendor !== 'admin') {
      // Se for um vendedor específico, verificar se o reembolso pertence a ele
      reembolso = db.prepare('SELECT * FROM reembolsos WHERE id = ? AND artistHandle = ?').get(id, vendor);
    } else {
      // Se for admin ou não especificado, retorna o reembolso
      reembolso = db.prepare('SELECT * FROM reembolsos WHERE id = ?').get(id);
    }

    if (!reembolso) {
      return res.status(404).json({ error: 'Reembolso não encontrado' });
    }

    res.json(reembolso);
  } catch (error) {
    console.error('Erro ao buscar reembolso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para aprovar/rejeitar reembolso
app.put('/api/reembolsos/:id', (req: Request, res: Response) => {
  try {
    console.log('🔄 Tentando atualizar reembolso...');
    const { id } = req.params;
    const { status } = req.body;

    console.log('📋 ID do reembolso:', id);
    console.log('📋 Status solicitado:', status);

    if (!status || !['aprovado', 'rejeitado'].includes(status)) {
      console.log('❌ Status inválido:', status);
      return res.status(400).json({ error: 'Status inválido' });
    }

    // Primeiro verificar se o reembolso existe e se o vendedor tem permissão
    console.log('🔍 Verificando se reembolso existe...');
    const { vendor } = req.query;
    
    let reembolso;
    if (vendor && vendor !== 'admin') {
      // Se for um vendedor específico, verificar se o reembolso pertence a ele
      reembolso = db.prepare('SELECT * FROM reembolsos WHERE id = ? AND artistHandle = ?').get(id, vendor);
    } else {
      // Se for admin ou não especificado, retorna o reembolso
      reembolso = db.prepare('SELECT * FROM reembolsos WHERE id = ?').get(id);
    }
    console.log('📋 Reembolso encontrado:', reembolso);
    
    if (!reembolso) {
      console.log('❌ Reembolso não encontrado');
      return res.status(404).json({ error: 'Reembolso não encontrado' });
    }

    // Iniciar transação para garantir consistência
    const transaction = db.transaction(() => {
      // 1. Atualizar status do reembolso
      console.log('✅ Atualizando status do reembolso para:', status);
      const updateReembolsoStmt = db.prepare(`
        UPDATE reembolsos 
        SET status = ? 
        WHERE id = ?
      `);
      const result = updateReembolsoStmt.run(status, id);
      
      if (result.changes === 0) {
        throw new Error('Reembolso não encontrado');
      }

      // 2. Se o reembolso foi aprovado, atualizar o status do pedido
      if (status === 'aprovado') {
        console.log('💰 Reembolso aprovado! Atualizando status do pedido...');
        
        // Buscar o pedido pelo orderId
        const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(reembolso.orderId);
        console.log('📋 Pedido encontrado:', pedido);
        
        if (pedido) {
          // Atualizar status do pedido para "reembolsado"
          const updatePedidoStmt = db.prepare(`
            UPDATE pedidos 
            SET status = ?, statusEntrega = ? 
            WHERE id = ?
          `);
          const pedidoResult = updatePedidoStmt.run('reembolsado', 'Reembolsado', reembolso.orderId);
          console.log('📊 Resultado da atualização do pedido:', pedidoResult);
          
          if (pedidoResult.changes > 0) {
            console.log('✅ Status do pedido atualizado para "reembolsado"');
          } else {
            console.log('⚠️ Não foi possível atualizar o status do pedido');
          }
        } else {
          console.log('⚠️ Pedido não encontrado para orderId:', reembolso.orderId);
        }
      }

      return result;
    });

    // Executar a transação
    const result = transaction();
    console.log('📊 Resultado da transação:', result);

    console.log('✅ Reembolso atualizado com sucesso!');
    res.json({ 
      message: `Reembolso ${status} com sucesso`,
      pedidoAtualizado: status === 'aprovado'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar reembolso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de Correios
app.get('/api/cep/:cep', async (req: Request, res: Response) => {
  try {
    const { cep } = req.params;
    
    if (!CorreiosService.validarCep(cep)) {
      return res.status(400).json({ error: 'CEP inválido' });
    }
    
    const endereco = await CorreiosService.buscarCep(cep);
    
    if (!endereco) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }
    
    res.json(endereco);
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/frete/calcular', async (req: Request, res: Response) => {
  try {
    const { cepOrigem, cepDestino, peso, comprimento, altura, largura } = req.body;
    
    if (!cepOrigem || !cepDestino) {
      return res.status(400).json({ error: 'CEP de origem e destino são obrigatórios' });
    }
    
    if (!CorreiosService.validarCep(cepOrigem) || !CorreiosService.validarCep(cepDestino)) {
      return res.status(400).json({ error: 'CEP inválido' });
    }
    
    const frete = await CorreiosService.calcularFrete(
      cepOrigem,
      cepDestino,
      peso || 1000, // 1kg padrão
      comprimento || 20,
      altura || 20,
      largura || 20
    );
    
    res.json(frete);
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 