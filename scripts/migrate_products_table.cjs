// Script de migração para adicionar colunas na tabela products
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../users.db');
const db = new Database(dbPath);

function addColumnIfNotExists(table, column, typeAndDefault) {
  // Verifica se a coluna já existe
  const pragma = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!pragma.some(col => col.name === column)) {
    db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeAndDefault}`).run();
    console.log(`Coluna '${column}' adicionada em '${table}'.`);
  } else {
    console.log(`Coluna '${column}' já existe em '${table}'.`);
  }
}

addColumnIfNotExists('products', 'category', "TEXT DEFAULT 'Tela'");
addColumnIfNotExists('products', 'isAvailable', 'BOOLEAN DEFAULT 1');
addColumnIfNotExists('products', 'variations', "TEXT DEFAULT '[]'");

console.log('Migração concluída!');
db.close(); 