const mysql = require('mysql2');

// Criar conexão
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234'
});

console.log('🔍 Testando conexão com MySQL...\n');

// Testar conexão
connection.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar:', err.message);
        if (err.message.includes('Access denied')) {
            console.log('\n⚠️ Verifique suas credenciais:');
            console.log('Host: localhost');
            console.log('Usuário: root');
            console.log('Senha: 1234');
        } else if (err.message.includes('ECONNREFUSED')) {
            console.log('\n⚠️ O MySQL não está respondendo. Verifique se:');
            console.log('1. O serviço do MySQL está em execução');
            console.log('2. A porta 3306 está livre');
        }
        process.exit(1);
    }

    console.log('✅ Conectado ao MySQL com sucesso!\n');

    // Tentar criar o banco de dados
    connection.query('CREATE DATABASE IF NOT EXISTS happypet', (err) => {
        if (err) {
            console.error('❌ Erro ao criar banco de dados:', err.message);
        } else {
            console.log('✅ Banco de dados "happypet" criado/verificado com sucesso!');
            
            // Usar o banco de dados
            connection.query('USE happypet', (err) => {
                if (err) {
                    console.error('❌ Erro ao usar banco de dados:', err.message);
                } else {
                    console.log('✅ Usando banco de dados "happypet"');
                    
                    // Verificar tabelas
                    const checkTables = () => {
                        connection.query('SHOW TABLES', (err, results) => {
                            if (err) {
                                console.error('❌ Erro ao listar tabelas:', err.message);
                            } else {
                                console.log('\n📋 Tabelas encontradas:');
                                if (results.length === 0) {
                                    console.log('Nenhuma tabela encontrada');
                                } else {
                                    results.forEach(row => {
                                        console.log(`- ${Object.values(row)[0]}`);
                                    });
                                }
                            }
                            connection.end();
                        });
                    };

                    checkTables();
                }
            });
        }
    });
});