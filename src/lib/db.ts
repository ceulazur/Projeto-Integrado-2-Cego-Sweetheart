import Database from 'better-sqlite3';

const db = new Database('users.db');

// Criar tabela de usuários se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

export interface User {
  id?: number;
  username: string;
  password: string;
}

export const registerUser = (username: string, password: string): boolean => {
  try {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, password);
    return true;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return false;
  }
};

export const loginUser = (username: string, password: string): User | null => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
    const user = stmt.get(username, password) as User | undefined;
    return user || null;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return null;
  }
}; 