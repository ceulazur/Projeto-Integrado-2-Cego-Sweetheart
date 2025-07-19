const Database = require('better-sqlite3');
const path = require('path');

console.log('🔍 Verificando reembolsos na tabela...');

try {
  const db = new Database(path.join(__dirname, 'users.db'));
  
  // Verificar se a tabela existe
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='reembolsos'
  `).get();

  if (!tableExists) {
    console.log('❌ Tabela reembolsos não existe!');
    process.exit(1);
  }

  // Contar reembolsos
  const count = db.prepare('SELECT COUNT(*) as count FROM reembolsos').get();
  console.log(`📊 Total de reembolsos: ${count.count}`);

  if (count.count > 0) {
    // Listar todos os reembolsos com detalhes completos
    const reembolsos = db.prepare('SELECT * FROM reembolsos ORDER BY id DESC').all();
    console.log('📋 Detalhes completos dos reembolsos:');
    reembolsos.forEach((r, index) => {
      console.log(`\n${index + 1}. Reembolso ID: ${r.id}`);
      console.log(`   - Order ID: ${r.orderId}`);
      console.log(`   - Cliente: ${r.clienteNome} (ID: ${r.clienteId})`);
      console.log(`   - Produto: ${r.produtoNome}`);
      console.log(`   - Status: ${r.status}`);
      console.log(`   - Valor: ${r.valorReembolso}`);
      console.log(`   - Motivo: ${r.motivo}`);
      console.log(`   - Data criação: ${r.created_at}`);
      console.log(`   - Data solicitação: ${r.dataSolicitacao}`);
    });
  } else {
    console.log('⚠️  Nenhum reembolso encontrado na tabela!');
    console.log('💡 Para testar, você precisa criar um reembolso primeiro.');
  }

  db.close();
  console.log('\n✅ Verificação concluída!');
} catch (error) {
  console.error('❌ Erro ao verificar reembolsos:', error);
  process.exit(1);
} 