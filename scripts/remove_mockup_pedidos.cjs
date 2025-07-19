const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('Removendo pedidos de mockup (valor 0 ou nulo)...');

try {
  // Primeiro, vamos verificar quantos pedidos existem antes da remoção
  const totalAntes = db.prepare('SELECT COUNT(*) as count FROM pedidos').get();
  console.log(`Total de pedidos antes da remoção: ${totalAntes.count}`);

  // Verificar pedidos que serão removidos
  const pedidosParaRemover = db.prepare(`
    SELECT id, clienteNome, produtoNome, total, status 
    FROM pedidos 
    WHERE total IS NULL OR total = '' OR total = '0' OR total = 'R$ 0,00'
  `).all();

  console.log(`\nPedidos que serão removidos (${pedidosParaRemover.length}):`);
  pedidosParaRemover.forEach(pedido => {
    console.log(`- ID: ${pedido.id}, Cliente: ${pedido.clienteNome}, Produto: ${pedido.produtoNome}, Total: "${pedido.total}", Status: ${pedido.status}`);
  });

  if (pedidosParaRemover.length === 0) {
    console.log('\nNenhum pedido de mockup encontrado para remoção.');
    return;
  }

  // Remover pedidos de mockup
  const result = db.prepare(`
    DELETE FROM pedidos 
    WHERE total IS NULL OR total = '' OR total = '0' OR total = 'R$ 0,00'
  `).run();

  console.log(`\n✅ ${result.changes} pedidos removidos com sucesso!`);

  // Verificar quantos pedidos restaram
  const totalDepois = db.prepare('SELECT COUNT(*) as count FROM pedidos').get();
  console.log(`Total de pedidos após a remoção: ${totalDepois.count}`);

  // Mostrar alguns pedidos restantes como exemplo
  const pedidosRestantes = db.prepare(`
    SELECT id, clienteNome, produtoNome, total, status 
    FROM pedidos 
    ORDER BY id DESC 
    LIMIT 5
  `).all();

  console.log('\nExemplos de pedidos restantes:');
  pedidosRestantes.forEach(pedido => {
    console.log(`- ID: ${pedido.id}, Cliente: ${pedido.clienteNome}, Produto: ${pedido.produtoNome}, Total: ${pedido.total}, Status: ${pedido.status}`);
  });

  // Calcular valor total dos pedidos restantes
  const totalValor = db.prepare(`
    SELECT SUM(CAST(REPLACE(REPLACE(total, 'R$ ', ''), ',', '.') AS REAL)) as total
    FROM pedidos 
    WHERE total IS NOT NULL AND total != '' AND total != '0' AND total != 'R$ 0,00'
  `).get();

  console.log(`\n💰 Valor total dos pedidos restantes: R$ ${(totalValor.total || 0).toFixed(2).replace('.', ',')}`);

} catch (error) {
  console.error('❌ Erro durante a remoção:', error.message);
} finally {
  db.close();
  console.log('\n✅ Operação concluída!');
} 