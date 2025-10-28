const Sequelize = require("sequelize");
const connection = require("../database/database");

const Animais = connection.define ("animais", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
    , descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
    , imagem: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Animais.sync({ force: false }) // Não recriar a tabela se ela já existir
    .then(() => {
        console.log('Tabela "animais" verificada com sucesso!');
    })
    .catch((err) => {
        console.error('Erro ao verificar a tabela animais:', err);
    });

module.exports = Animais;