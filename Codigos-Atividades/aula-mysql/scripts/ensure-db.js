const net = require('net');
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const MYSQL_PORT = 3306;
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
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function main() {
  if (await checkPort(MYSQL_PORT)) {
    return;
  }

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
      console.log('MySQL pronto para conexões.');
      return;
    }
  }
}

main().catch(console.error);

