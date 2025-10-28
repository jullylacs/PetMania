const mysql = require('mysql2/promise');

async function setupDatabase() {
    let connection;
    
    console.log('🔍 Iniciando verificação do banco de dados...\n');

    try {
        // Primeiro, tentar conectar sem especificar um banco de dados
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1234'
        });

        console.log('✅ Conexão com MySQL estabelecida!\n');

        // Verificar se o banco de dados existe
        const [databases] = await connection.query('SHOW DATABASES LIKE "happypet"');
        
        if (databases.length === 0) {
            console.log('📦 Criando banco de dados "happypet"...');
            await connection.query('CREATE DATABASE IF NOT EXISTS happypet');
            console.log('✅ Banco de dados criado com sucesso!\n');
        } else {
            console.log('✅ Banco de dados "happypet" já existe!\n');
        }

        // Conectar ao banco de dados específico
        await connection.query('USE happypet');
        
        // Criar tabela de cadastros se não existir
        console.log('📋 Verificando tabelas...');
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cadastros (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "cadastros" verificada!');

        // Criar tabela de animais se não existir
        await connection.query(`
            CREATE TABLE IF NOT EXISTS animais (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                especie VARCHAR(100) NOT NULL,
                raca VARCHAR(100),
                idade INT,
                sexo ENUM('M', 'F') NOT NULL,
                porte VARCHAR(50),
                descricao TEXT,
                status ENUM('disponivel', 'adotado') DEFAULT 'disponivel',
                imagem VARCHAR(255),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela "animais" verificada!');

        // Verificar se já existe um usuário admin
        const [admins] = await connection.query('SELECT * FROM cadastros WHERE role = "admin"');
        
        if (admins.length === 0) {
            console.log('\n⚙️ Criando usuário administrador padrão...');
            const bcrypt = require('bcryptjs');
            const senhaHash = await bcrypt.hash('admin123', 10);
            
            await connection.query(`
                INSERT INTO cadastros (nome, email, senha, role)
                VALUES ('Administrador', 'admin@petmania.com', ?, 'admin')
            `, [senhaHash]);
            
            console.log('✅ Usuário administrador criado com sucesso!');
            console.log('   Email: admin@petmania.com');
            console.log('   Senha: admin123');
        }

        console.log('\n✅ Configuração do banco de dados concluída com sucesso!');
        console.log('\nVocê já pode iniciar o servidor usando: node server.js');

    } catch (error) {
        console.error('\n❌ Erro:', error.message);
        
        if (error.message.includes('Access denied')) {
            console.log('\n⚠️ Verifique:');
            console.log('1. Se as credenciais do MySQL estão corretas');
            console.log('2. Se o usuário tem as permissões necessárias');
            console.log('\n📝 Credenciais configuradas:');
            console.log('   Host: localhost');
            console.log('   Usuário: root');
            console.log('   Senha: 1234');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log('\n⚠️ Verifique:');
            console.log('1. Se o MySQL está instalado e em execução');
            console.log('2. Se a porta 3306 está acessível');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
        // Não encerrar o processo aqui para permitir que as mensagens sejam exibidas
    }
}

// Executar a configuração
setupDatabase();