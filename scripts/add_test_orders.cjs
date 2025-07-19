const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('Adicionando pedidos de teste...');

try {
  // Primeiro, vamos verificar se há usuários no sistema
  const users = db.prepare('SELECT id, email, firstName, lastName FROM users LIMIT 1').all();
  
  if (users.length === 0) {
    console.log('Nenhum usuário encontrado. Criando usuário de teste...');
    
    // Criar um usuário de teste
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('teste123', 10);
    
    db.prepare(`
      INSERT INTO users (email, password, firstName, lastName) 
      VALUES (?, ?, ?, ?)
    `).run('teste@exemplo.com', hashedPassword, 'Usuário', 'Teste');
    
    console.log('Usuário de teste criado: teste@exemplo.com / teste123');
  }

  // Pegar o primeiro usuário
  const user = db.prepare('SELECT id, email, firstName, lastName FROM users LIMIT 1').get();
  console.log('Usando usuário:', user);

  // Verificar se há produtos
  const products = db.prepare('SELECT id, title, price FROM products LIMIT 1').all();
  
  if (products.length === 0) {
    console.log('Nenhum produto encontrado. Criando produto de teste...');
    
    db.prepare(`
      INSERT INTO products (title, artistHandle, price, imageUrl, description, quantity, dimensions, framed, artistUsername, artistProfileImage, availableSizes, category, isAvailable, variations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Produto de Teste',
      '@teste',
      'R$ 50,00',
      'https://via.placeholder.com/300x300',
      'Produto de teste para verificar funcionalidade',
      10,
      '20x20 cm',
      1,
      '@teste',
      'https://via.placeholder.com/100x100',
      JSON.stringify(['P', 'M', 'G']),
      'Teste',
      1,
      JSON.stringify([])
    );
    
    console.log('Produto de teste criado');
  }

  const product = db.prepare('SELECT id, title, price FROM products LIMIT 1').get();
  console.log('Usando produto:', product);

  // Adicionar pedidos de teste
  const pedidosTeste = [
    {
      clienteNome: `${user.firstName} ${user.lastName}`,
      clienteId: user.id.toString(),
      status: 'transporte',
      statusEntrega: 'Em transporte',
      data: new Date().toISOString().slice(0, 10),
      produtoId: product.id,
      produtoNome: product.title,
      produtoImageUrl: 'https://via.placeholder.com/300x300',
      produtoPrice: product.price,
      quantidade: 1,
      subtotal: 'R$ 50,00',
      frete: 'R$ 10,00',
      total: 'R$ 60,00',
      formaPagamento: 'Cartão de Crédito',
      codigoRastreio: 'TEST123456'
    },
    {
      clienteNome: `${user.firstName} ${user.lastName}`,
      clienteId: user.id.toString(),
      status: 'entregue',
      statusEntrega: 'Entregue',
      data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      produtoId: product.id,
      produtoNome: product.title,
      produtoImageUrl: 'https://via.placeholder.com/300x300',
      produtoPrice: product.price,
      quantidade: 2,
      subtotal: 'R$ 100,00',
      frete: 'R$ 10,00',
      total: 'R$ 110,00',
      formaPagamento: 'PIX',
      codigoRastreio: 'TEST789012'
    }
  ];

  const insertStmt = db.prepare(`
    INSERT INTO pedidos (
      clienteNome, clienteId, status, statusEntrega, data, produtoId, produtoNome, 
      produtoImageUrl, produtoPrice, quantidade, subtotal, frete, total, 
      formaPagamento, codigoRastreio
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  pedidosTeste.forEach((pedido, index) => {
    insertStmt.run(
      pedido.clienteNome,
      pedido.clienteId,
      pedido.status,
      pedido.statusEntrega,
      pedido.data,
      pedido.produtoId,
      pedido.produtoNome,
      pedido.produtoImageUrl,
      pedido.produtoPrice,
      pedido.quantidade,
      pedido.subtotal,
      pedido.frete,
      pedido.total,
      pedido.formaPagamento,
      pedido.codigoRastreio
    );
    console.log(`Pedido ${index + 1} criado com sucesso`);
  });

  // Verificar total de pedidos
  const total = db.prepare('SELECT COUNT(*) as count FROM pedidos').get();
  console.log(`\n✅ Total de pedidos no banco: ${total.count}`);

  console.log('\n📋 Informações para teste:');
  console.log(`👤 Usuário: ${user.email} (ID: ${user.id})`);
  console.log(`🔑 Senha: teste123`);
  console.log(`🛒 Produto: ${product.title} (ID: ${product.id})`);

} catch (error) {
  console.error('❌ Erro:', error.message);
} finally {
  db.close();
} 