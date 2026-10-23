import 'dotenv/config';
import { createConnection } from 'mysql2/promise';

async function listar() {
  try {
    const conn = await createConnection({
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? '3306'),
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'aula_mysql'
    });

    const [linhas] = await conn.execute('SELECT id, nome, email, curso FROM alunos ORDER BY id DESC');
    console.log('\n=============================================');
    console.log('   REGISTROS NO BANCO DE DADOS (aula_mysql)  ');
    console.log('=============================================');
    
    if (Array.isArray(linhas) && linhas.length > 0) {
      console.table(linhas);
      console.log(`Total de alunos cadastrados: ${linhas.length}\n`);
    } else {
      console.log('Nenhum aluno cadastrado no momento.\n');
    }

    await conn.end();
  } catch (erro) {
    console.error('Falha ao consultar banco MySQL:', erro);
  }
}

listar();

