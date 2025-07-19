const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('Verificando dados da tabela pedidos...');

try {
  // Verificar estrutura
  const columns = db.prepare("PRAGMA table_info(pedidos)").all();
  console.log('Colunas disponíveis:');
  columns.forEach(col => {
    console.log(`- ${col.name} (${col.type})`);
  });
  
  // Verificar alguns registros de exemplo
  const samplePedidos = db.prepare(`
    SELECT id, clienteNome, produtoNome, produtoPrice, quantidade, subtotal, frete, total, formaPagamento, status
    FROM pedidos 
    LIMIT 3
  `).all();
  
  console.log('\nExemplos de pedidos:');
  samplePedidos.forEach((pedido, index) => {
    console.log(`\nPedido ${index + 1}:`);
    console.log(`- ID: ${pedido.id}`);
    console.log(`- Cliente: ${pedido.clienteNome}`);
    console.log(`- Produto: ${pedido.produtoNome}`);
    console.log(`- Preço unitário: ${pedido.produtoPrice}`);
    console.log(`- Quantidade: ${pedido.quantidade}`);
    console.log(`- Subtotal: ${pedido.subtotal}`);
    console.log(`- Frete: ${pedido.frete}`);
    console.log(`- Total: ${pedido.total}`);
    console.log(`- Forma de pagamento: ${pedido.formaPagamento}`);
    console.log(`- Status: ${pedido.status}`);
  });
  
  // Calcular valor total recebido
  const totalRecebido = db.prepare(`
    SELECT SUM(CAST(REPLACE(total, 'R$ ', '') AS REAL)) as total
    FROM pedidos 
    WHERE status != 'Cancelado'
  `).get();
  
  console.log(`\nTotal recebido (excluindo cancelados): R$ ${totalRecebido.total || 0}`);
  
} catch (error) {
  console.error('Erro:', error.message);
} finally {
  db.close();
} 