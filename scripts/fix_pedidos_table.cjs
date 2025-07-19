const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

console.log('Verificando e corrigindo estrutura da tabela pedidos...');

try {
  // Verificar se a tabela existe
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='pedidos'
  `).get();

  if (!tableExists) {
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
    
    console.log('Nova tabela pedidos criada com sucesso!');
  } else {
    console.log('Tabela pedidos encontrada. Verificando estrutura...');
    
    // Verificar se a coluna created_at existe
    const columns = db.prepare("PRAGMA table_info(pedidos)").all();
    const columnNames = columns.map(col => col.name);
    
    console.log('Colunas existentes:', columnNames);
    
    if (!columnNames.includes('created_at')) {
      console.log('Adicionando coluna created_at...');
      
      try {
        // Adicionar coluna sem valor padrão
        db.prepare('ALTER TABLE pedidos ADD COLUMN created_at DATETIME').run();
        console.log('Coluna created_at adicionada com sucesso!');
        
        // Atualizar registros existentes com a data atual
        const dataAtual = new Date().toISOString();
        const result = db.prepare('UPDATE pedidos SET created_at = ? WHERE created_at IS NULL').run(dataAtual);
        console.log(`${result.changes} registros foram atualizados com a data atual`);
        
      } catch (error) {
        console.log('Erro ao adicionar coluna created_at:', error.message);
      }
    } else {
      console.log('Coluna created_at já existe.');
    }
    
    // Verificar outras colunas importantes
    const requiredColumns = [
      'produtoImageUrl',
      'produtoPrice', 
      'quantidade',
      'subtotal',
      'frete',
      'total',
      'statusEntrega'
    ];
    
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('Adicionando colunas faltantes:', missingColumns);
      
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
          }
          
          if (sql) {
            db.prepare(sql).run();
            console.log(`Coluna ${column} adicionada com sucesso`);
          }
        } catch (error) {
          console.log(`Erro ao adicionar coluna ${column}:`, error.message);
        }
      });
    }
    
    // Atualizar status existentes
    try {
      const result = db.prepare(`
        UPDATE pedidos 
        SET status = 'transporte', 
            statusEntrega = 'Em transporte' 
        WHERE status = 'Em aberto' OR status IS NULL
      `).run();
      
      if (result.changes > 0) {
        console.log(`${result.changes} pedidos tiveram o status atualizado`);
      } else {
        console.log('Nenhum pedido precisou ter o status atualizado');
      }
    } catch (error) {
      console.log('Erro ao atualizar status:', error.message);
    }
  }
  
  // Verificar estrutura final
  const finalColumns = db.prepare("PRAGMA table_info(pedidos)").all();
  console.log('Estrutura final da tabela:');
  finalColumns.forEach(col => {
    console.log(`- ${col.name} (${col.type})`);
  });
  
  console.log('Verificação e correção concluídas com sucesso!');
  
} catch (error) {
  console.error('Erro durante a verificação:', error);
} finally {
  db.close();
} 