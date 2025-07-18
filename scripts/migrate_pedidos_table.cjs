const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('Iniciando migração da tabela pedidos...');

try {
  // Verificar se a tabela existe
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='pedidos'
  `).get();

  if (tableExists) {
    console.log('Tabela pedidos encontrada. Verificando estrutura...');
    
    // Verificar se os novos campos já existem
    const columns = db.prepare("PRAGMA table_info(pedidos)").all();
    const columnNames = columns.map(col => col.name);
    
    console.log('Colunas existentes:', columnNames);
    
    const newColumns = [
      'produtoImageUrl',
      'produtoPrice', 
      'quantidade',
      'subtotal',
      'frete',
      'total',
      'statusEntrega',
      'created_at'
    ];
    
    const missingColumns = newColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('Adicionando colunas faltantes:', missingColumns);
      
      // Adicionar colunas uma por uma com tratamento de erro
      missingColumns.forEach(column => {
        try {
          let sql = '';
          switch (column) {
            case 'produtoImageUrl':
              sql = 'ALTER TABLE pedidos ADD COLUMN produtoImageUrl TEXT';
              break;
            case 'produtoPrice':
              sql = 'ALTER TABLE pedidos ADD COLUMN produtoPrice TEXT';
              break;
            case 'quantidade':
              sql = 'ALTER TABLE pedidos ADD COLUMN quantidade INTEGER DEFAULT 1';
              break;
            case 'subtotal':
              sql = 'ALTER TABLE pedidos ADD COLUMN subtotal TEXT';
              break;
            case 'frete':
              sql = 'ALTER TABLE pedidos ADD COLUMN frete TEXT';
              break;
            case 'total':
              sql = 'ALTER TABLE pedidos ADD COLUMN total TEXT';
              break;
            case 'statusEntrega':
              sql = 'ALTER TABLE pedidos ADD COLUMN statusEntrega TEXT DEFAULT "Em transporte"';
              break;
            case 'created_at':
              sql = 'ALTER TABLE pedidos ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP';
              break;
          }
          
          if (sql) {
            db.prepare(sql).run();
            console.log(`Coluna ${column} adicionada com sucesso`);
          }
        } catch (error) {
          console.log(`Coluna ${column} já existe ou erro ao adicionar:`, error.message);
        }
      });
      
      // Atualizar status existentes para o novo formato
      try {
        db.prepare(`
          UPDATE pedidos 
          SET status = 'transporte', 
              statusEntrega = 'Em transporte' 
          WHERE status = 'Em aberto' OR status IS NULL
        `).run();
        
        console.log('Status dos pedidos existentes atualizados');
      } catch (error) {
        console.log('Erro ao atualizar status (pode ser que não haja pedidos para atualizar):', error.message);
      }
      
    } else {
      console.log('Tabela já está atualizada com todas as colunas necessárias');
    }
    
  } else {
    console.log('Tabela pedidos não encontrada. Criando nova tabela...');
    
    db.exec(`
      CREATE TABLE pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clienteNome TEXT,
        clienteId TEXT,
        status TEXT DEFAULT 'transporte',
        statusEntrega TEXT DEFAULT 'Em transporte',
        data TEXT,
        produtoId INTEGER,
        produtoNome TEXT,
        produtoImageUrl TEXT,
        produtoPrice TEXT,
        quantidade INTEGER DEFAULT 1,
        subtotal TEXT,
        frete TEXT,
        total TEXT,
        formaPagamento TEXT,
        codigoRastreio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Nova tabela pedidos criada com sucesso');
  }
  
  console.log('Migração concluída com sucesso!');
  
} catch (error) {
  console.error('Erro durante a migração:', error);
} finally {
  db.close();
} 