const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('Verificação simples dos pedidos...');

try {
  const count = db.prepare('SELECT COUNT(*) as count FROM pedidos').get();
  console.log(`Total de pedidos: ${count.count}`);
  
  if (count.count > 0) {
    const pedidos = db.prepare('SELECT id, clienteNome, produtoNome, total FROM pedidos').all();
    console.log('Pedidos encontrados:');
    pedidos.forEach(p => {
      console.log(`- ID: ${p.id}, Cliente: ${p.clienteNome}, Produto: ${p.produtoNome}, Total: ${p.total}`);
    });
  } else {
    console.log('Nenhum pedido encontrado.');
  }
  
} catch (error) {
  console.error('Erro:', error.message);
} finally {
  db.close();
} 