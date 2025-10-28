const Sequelize = require("sequelize");
const connection = require("../database/database");

const Cadastro = connection.define('cadastros', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    }
});

Cadastro.sync({ force: false })
    .then(() => {
        console.log('Tabela "cadastros" verificada com sucesso!');
    })
    .catch((err) => {
        console.error('Erro ao verificar tabela cadastros:', err);
    });

module.exports = Cadastro;
