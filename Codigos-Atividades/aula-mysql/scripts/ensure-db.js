require('dotenv').config();
const net = require('net');
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

const MYSQL_PORT = Number(process.env.DB_PORT ?? '3306');
const MYSQL_BIN = 'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqld.exe';
const DATA_DIR = path.resolve(__dirname, '..', 'mysql-data');

function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(600);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function garantirBancoETabela() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST ?? 'localhost',
      port: MYSQL_PORT,
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      multipleStatements: true
    });

    const sqlPath = path.resolve(__dirname, '..', 'banco.sql');
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await conn.query(sql);
    }

    await conn.end();
  } catch (erro) {
    // Se falhar a inicialização do DDL, o database.ts reportará o erro no boot
    console.warn('Aviso ao sincronizar banco com banco.sql:', erro.message);
  }
}

async function main() {
  let portaAberta = await checkPort(MYSQL_PORT);

  if (!portaAberta) {
    console.log('Iniciando o MySQL...');
    try {
      execSync('powershell -Command "Start-ScheduledTask -TaskName MySQL_Aula"', { stdio: 'ignore' });
    } catch {
      if (fs.existsSync(MYSQL_BIN)) {
        const child = spawn(MYSQL_BIN, [`--datadir=${DATA_DIR}`, `--port=${MYSQL_PORT}`], {
          detached: true,
          stdio: 'ignore'
        });
        child.unref();
      }
    }

    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 400));
      if (await checkPort(MYSQL_PORT)) {
        portaAberta = true;
        console.log('MySQL pronto para conexões.');
        break;
      }
    }
  }

  if (portaAberta) {
    await garantirBancoETabela();
  }
}

main().catch(console.error);
