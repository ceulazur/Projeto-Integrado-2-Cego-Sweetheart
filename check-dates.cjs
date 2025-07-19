const Database = require('better-sqlite3');
const path = require('path');

console.log('🔍 Verificando datas dos pedidos...');

try {
  const db = new Database(path.join(__dirname, 'users.db'));
  
  // Verificar todos os pedidos
  const pedidos = db.prepare('SELECT id, clienteNome, produtoNome, created_at FROM pedidos ORDER BY id DESC').all();
  
  console.log(`\n📊 Total de pedidos: ${pedidos.length}`);
  
  pedidos.forEach(pedido => {
    console.log(`   - ID ${pedido.id}: ${pedido.produtoNome} (created_at: ${pedido.created_at})`);
  });
  
  db.close();
} catch (error) {
  console.error('❌ Erro:', error);
} 