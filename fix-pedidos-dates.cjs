const Database = require('better-sqlite3');
const path = require('path');

console.log('🔧 Verificando e corrigindo datas dos pedidos...');

try {
  const db = new Database(path.join(__dirname, 'users.db'));
  
  // Verificar pedidos sem data
  console.log('\n📋 Verificando pedidos sem data...');
  const pedidosSemData = db.prepare(`
    SELECT id, clienteNome, produtoNome, created_at, data 
    FROM pedidos 
    WHERE created_at IS NULL OR created_at = '' OR created_at = 'NULL'
    ORDER BY id
  `).all();
  
  if (pedidosSemData.length > 0) {
    console.log(`   Encontrados ${pedidosSemData.length} pedidos sem data:`);
    pedidosSemData.forEach(pedido => {
      console.log(`   - ID ${pedido.id}: ${pedido.produtoNome} (created_at: ${pedido.created_at}, data: ${pedido.data})`);
    });
    
    // Atualizar created_at para pedidos sem data
    console.log('\n🔄 Atualizando created_at para pedidos sem data...');
    const updateStmt = db.prepare(`
      UPDATE pedidos 
      SET created_at = datetime('now', '-1 day') 
      WHERE created_at IS NULL OR created_at = '' OR created_at = 'NULL'
    `);
    const result = updateStmt.run();
    console.log(`   ✅ ${result.changes} pedidos atualizados`);
    
  } else {
    console.log('   ✅ Todos os pedidos já têm data');
  }
  
  // Verificar estrutura da tabela
  console.log('\n📊 Verificando estrutura da tabela pedidos...');
  const columns = db.prepare('PRAGMA table_info(pedidos)').all();
  console.log('   Colunas da tabela pedidos:');
  columns.forEach(col => {
    console.log(`   - ${col.name} (${col.type})`);
  });
  
  // Verificar dados finais
  console.log('\n📈 Dados finais dos pedidos:');
  const pedidosFinais = db.prepare(`
    SELECT id, clienteNome, produtoNome, created_at, 
           CASE 
             WHEN created_at IS NOT NULL AND created_at != '' AND created_at != 'NULL' AND datetime(created_at) IS NOT NULL
             THEN date(created_at)
             ELSE 'Sem data'
           END as data_formatada
    FROM pedidos 
    ORDER BY id DESC
  `).all();
  
  pedidosFinais.forEach(pedido => {
    console.log(`   - ID ${pedido.id}: ${pedido.produtoNome} (${pedido.data_formatada})`);
  });
  
  db.close();
  console.log('\n✅ Verificação e correção concluída!');
} catch (error) {
  console.error('❌ Erro durante a verificação:', error);
} 