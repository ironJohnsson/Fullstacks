-- Script para Oracle Database (Compatível com Oracle 11g XE e versões superiores)
-- Conecte-se ao seu schema/usuário (ex: SYSTEM ou seu usuário)

-- 1. Criação da tabela
CREATE TABLE usuarios (
  id NUMBER PRIMARY KEY,
  nome VARCHAR2(100) NOT NULL,
  email VARCHAR2(150) NOT NULL UNIQUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sequência para gerar os IDs (necessário no Oracle 11g)
CREATE SEQUENCE usuarios_seq START WITH 1 INCREMENT BY 1;

-- 3. Trigger para inserir o ID automaticamente antes de cada INSERT
CREATE OR REPLACE TRIGGER trg_usuarios_id
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    SELECT usuarios_seq.NEXTVAL INTO :NEW.id FROM dual;
  END IF;
END;
/
