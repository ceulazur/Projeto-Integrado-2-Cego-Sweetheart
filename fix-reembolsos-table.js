const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, 'users.db');
const db = new Database(dbPath);

console.log('🔧 Corrigindo tabela reembolsos...');

try {
  // Verificar se a tabela existe
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='reembolsos'
  `).get();

  if (tableExists) {
    console.log('📋 Tabela reembolsos encontrada. Verificando estrutura...');
    
    // Verificar colunas
    const columns = db.prepare('PRAGMA table_info(reembolsos)').all();
    console.log('📊 Colunas atuais:', columns.map(col => col.name));
    
    const hasOrderId = columns.some(col => col.name === 'orderId');
    
    if (!hasOrderId) {
      console.log('❌ Coluna orderId não encontrada. Recriando tabela...');
      
      // Recriar a tabela
      db.exec('DROP TABLE IF EXISTS reembolsos');
      db.exec(`
        CREATE TABLE reembolsos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId TEXT NOT NULL,
          clienteNome TEXT NOT NULL,
          clienteId TEXT NOT NULL,
          produtoNome TEXT NOT NULL,
          produtoImageUrl TEXT,
          motivo TEXT NOT NULL,
          descricao TEXT NOT NULL,
          banco TEXT NOT NULL,
          agencia TEXT NOT NULL,
          conta TEXT NOT NULL,
          tipoConta TEXT NOT NULL,
          fotoUrl TEXT,
          status TEXT DEFAULT 'pendente',
          dataSolicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
          dataResposta DATETIME,
          valorReembolso TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('✅ Tabela reembolsos recriada com sucesso!');
    } else {
      console.log('✅ Tabela reembolsos já tem a estrutura correta!');
    }
  } else {
    console.log('📋 Criando tabela reembolsos...');
    
    db.exec(`
      CREATE TABLE reembolsos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId TEXT NOT NULL,
        clienteNome TEXT NOT NULL,
        clienteId TEXT NOT NULL,
        produtoNome TEXT NOT NULL,
        produtoImageUrl TEXT,
        motivo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        banco TEXT NOT NULL,
        agencia TEXT NOT NULL,
        conta TEXT NOT NULL,
        tipoConta TEXT NOT NULL,
        fotoUrl TEXT,
        status TEXT DEFAULT 'pendente',
        dataSolicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        dataResposta DATETIME,
        valorReembolso TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabela reembolsos criada com sucesso!');
  }
  
  // Verificar estrutura final
  const finalColumns = db.prepare('PRAGMA table_info(reembolsos)').all();
  console.log('📊 Estrutura final da tabela:');
  finalColumns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
} catch (error) {
  console.error('❌ Erro ao corrigir tabela:', error);
} finally {
  db.close();
  console.log('🔒 Conexão com banco fechada.');
} 