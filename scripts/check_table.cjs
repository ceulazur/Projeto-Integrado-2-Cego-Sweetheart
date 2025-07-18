const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('Verificando estrutura da tabela pedidos...');

try {
  const columns = db.prepare("PRAGMA table_info(pedidos)").all();
  console.log('Colunas da tabela pedidos:');
  columns.forEach(col => {
    console.log(`- ${col.name} (${col.type})`);
  });
  
  const hasCreatedAt = columns.some(col => col.name === 'created_at');
  console.log(`\nColuna created_at existe: ${hasCreatedAt}`);
  
  if (hasCreatedAt) {
    const count = db.prepare('SELECT COUNT(*) as count FROM pedidos').get();
    console.log(`Total de pedidos na tabela: ${count.count}`);
  }
  
} catch (error) {
  console.error('Erro:', error.message);
} finally {
  db.close();
} 