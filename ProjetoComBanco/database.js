// database.js
require('dotenv').config();
const oracledb = require('oracledb');

// Retorna as linhas como objetos JSON com os nomes das colunas
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function initPool() {
  await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/XEPDB1',
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1
  });
}

async function getConnection() {
  return await oracledb.getConnection();
}

module.exports = {
  oracledb,
  initPool,
  getConnection
};
