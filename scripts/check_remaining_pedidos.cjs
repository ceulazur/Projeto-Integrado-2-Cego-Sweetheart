const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('Verificando pedidos restantes no banco...');

try {
  // Contar total de pedidos
  const total = db.prepare('SELECT COUNT(*) as count FROM pedidos').get();
  console.log(`Total de pedidos: ${total.count}`);

  if (total.count === 0) {
    console.log('Nenhum pedido encontrado no banco.');
    return;
  }

  // Mostrar todos os pedidos restantes
  const pedidos = db.prepare(`
    SELECT 
      id, 
      clienteNome, 
      clienteId,
      produtoNome, 
      produtoPrice,
      quantidade,
      subtotal,
      frete,
      total, 
      status,
      formaPagamento,
      created_at
    FROM pedidos 
    ORDER BY id DESC
  `).all();

  console.log('\n📋 Detalhes dos pedidos restantes:');
  console.log('='.repeat(80));
  
  pedidos.forEach((pedido, index) => {
    console.log(`\n🛒 Pedido #${index + 1} (ID: ${pedido.id})`);
    console.log(`   Cliente: ${pedido.clienteNome} (ID: ${pedido.clienteId})`);
    console.log(`   Produto: ${pedido.produtoNome}`);
    console.log(`   Preço unitário: ${pedido.produtoPrice || 'N/A'}`);
    console.log(`   Quantidade: ${pedido.quantidade || 1}`);
    console.log(`   Subtotal: ${pedido.subtotal || 'N/A'}`);
    console.log(`   Frete: ${pedido.frete || 'N/A'}`);
    console.log(`   Total: ${pedido.total || 'N/A'}`);
    console.log(`   Status: ${pedido.status}`);
    console.log(`   Forma de pagamento: ${pedido.formaPagamento}`);
    console.log(`   Data de criação: ${pedido.created_at}`);
    console.log('-'.repeat(40));
  });

  // Calcular estatísticas
  const totalValor = db.prepare(`
    SELECT SUM(CAST(REPLACE(REPLACE(total, 'R$ ', ''), ',', '.') AS REAL)) as total
    FROM pedidos 
    WHERE total IS NOT NULL AND total != '' AND total != '0' AND total != 'R$ 0,00'
  `).get();

  const pedidosPorStatus = db.prepare(`
    SELECT status, COUNT(*) as count
    FROM pedidos 
    GROUP BY status
  `).all();

  console.log('\n📊 Estatísticas:');
  console.log(`💰 Valor total: R$ ${(totalValor.total || 0).toFixed(2).replace('.', ',')}`);
  
  console.log('\n📈 Pedidos por status:');
  pedidosPorStatus.forEach(item => {
    console.log(`   ${item.status}: ${item.count} pedido(s)`);
  });

} catch (error) {
  console.error('❌ Erro:', error.message);
} finally {
  db.close();
} 