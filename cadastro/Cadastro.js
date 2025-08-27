const Sequelize = require("sequelize");
const connection = require("../database/database");

const Cadastro = connection.define("cadastros", {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    DiaVisita:{
        type: Sequelize.DATE,
        allowNull: false
    },
    Email:{
        type: Sequelize.STRING,
        allowNull: false        
    },
    Hora:{
        type: Sequelize.TIME,
        allowNull: false
    },
        Pet:{
        type: Sequelize.STRING,
        allowNull: false
    },
})


Cadastro.sync({ force: false }) // Não recriar a tabela se ela já existir
    .then(() => {
        console.log('Tabela "cadastros" verificada com sucesso!');
    })
    .catch((err) => {
        console.error('Erro ao verificar a tabela cadastros:', err);
    });

module.exports = Cadastro;