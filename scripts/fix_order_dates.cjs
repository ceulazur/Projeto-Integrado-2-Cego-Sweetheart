const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('🔧 Corrigindo datas dos pedidos...');

try {
  // Verificar pedidos existentes
  const orders = db.prepare('SELECT id, created_at, data FROM pedidos').all();
  
  console.log(`📊 Encontrados ${orders.length} pedidos no banco`);
  
  let fixedCount = 0;
  
  orders.forEach(order => {
    console.log(`Pedido ${order.id}:`);
    console.log(`  - created_at: ${order.created_at}`);
    console.log(`  - data: ${order.data}`);
    
    // Se created_at está vazio ou é inválido, atualizar com a data atual
    if (!order.created_at || order.created_at === '' || order.created_at === 'NULL') {
      const now = new Date().toISOString();
      db.prepare('UPDATE pedidos SET created_at = ? WHERE id = ?').run(now, order.id);
      console.log(`  ✅ Corrigido: ${now}`);
      fixedCount++;
    } else {
      console.log(`  ✅ Já tem data válida`);
    }
  });
  
  console.log(`\n🎉 Processo concluído!`);
  console.log(`📈 Pedidos corrigidos: ${fixedCount}`);
  console.log(`📈 Pedidos já válidos: ${orders.length - fixedCount}`);
  
} catch (error) {
  console.error('❌ Erro ao corrigir datas:', error);
} finally {
  db.close();
  console.log('🔒 Conexão com banco fechada');
} 