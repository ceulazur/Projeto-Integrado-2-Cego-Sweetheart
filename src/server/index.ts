import express, { Request, Response } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import multer from 'multer';

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clienteNome TEXT,
    clienteId TEXT,
    status TEXT,
    data TEXT,
    produtoId INTEGER,
    produtoNome TEXT,
    formaPagamento TEXT,
    codigoRastreio TEXT
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
      availableSizes: JSON.stringify(['P', 'M', 'G'])
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
      availableSizes: JSON.stringify(['P', 'M', 'G'])
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
      availableSizes: JSON.stringify(['P', 'M', 'G'])
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
      availableSizes: JSON.stringify(['P', 'M', 'G'])
    }
  ];

  const insertProductStmt = db.prepare(`
    INSERT INTO products (
      title, artistHandle, price, imageUrl, description, quantity, 
      dimensions, framed, artistUsername, artistProfileImage, availableSizes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      product.availableSizes
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
      availableSizes: JSON.parse(product.availableSizes)
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
    if (typeof query !== 'string' || query.trim() === '') {
      return res.json([]);
    }

    const searchQuery = `%${query}%`;
    // Retorna todos os campos do produto para popular o formulário de edição
    const products = db.prepare(
      'SELECT * FROM products WHERE title LIKE ? LIMIT 10'
    ).all(searchQuery) as Product[];

    const transformedProducts = products.map(product => ({
      ...product,
      id: product.id.toString(),
      framed: Boolean(product.framed),
      availableSizes: JSON.parse(product.availableSizes)
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
      return res.status(404).json({ error: 'Produto não encontrado' });
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
      availableSizes: JSON.parse(product.availableSizes)
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
        dimensions, framed, artistUsername, artistProfileImage, availableSizes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      JSON.stringify(productData.availableSizes)
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
        artistProfileImage = ?, availableSizes = ?
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
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as User | undefined;

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({ 
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
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
    const { clienteNome, clienteId, produtoId, produtoNome, formaPagamento } = req.body;
    if (!clienteNome || !clienteId || !produtoId || !produtoNome || !formaPagamento) {
      res.status(400).json({ error: 'Campos obrigatórios faltando' });
      return;
    }
    // Verifica estoque
    const produto = db.prepare('SELECT quantity FROM products WHERE id = ?').get(produtoId);
    if (!produto || produto.quantity < 1) {
      res.status(400).json({ error: 'Produto sem estoque' });
      return;
    }
    // Baixa estoque
    db.prepare('UPDATE products SET quantity = quantity - 1 WHERE id = ?').run(produtoId);
    // Cria pedido
    const stmt = db.prepare(`
      INSERT INTO pedidos (clienteNome, clienteId, status, data, produtoId, produtoNome, formaPagamento, codigoRastreio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const dataAtual = new Date().toISOString().slice(0, 10);
    stmt.run(
      clienteNome,
      clienteId,
      'Em aberto',
      dataAtual,
      produtoId,
      produtoNome,
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
    const pedidos = db.prepare('SELECT * FROM pedidos ORDER BY id DESC').all();
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
    const stmt = db.prepare('UPDATE pedidos SET status = ?, codigoRastreio = ? WHERE id = ?');
    const result = stmt.run(status, codigoRastreio, id);
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

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 