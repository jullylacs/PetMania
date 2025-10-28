const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    especie: {
        type: DataTypes.STRING,
        allowNull: false
    },
    raca: {
        type: DataTypes.STRING
    },
    idade: {
        type: DataTypes.INTEGER
    },
    sexo: {
        type: DataTypes.ENUM('M', 'F'),
        allowNull: false
    },
    porte: {
        type: DataTypes.STRING
    },
    descricao: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('disponivel', 'adotado'),
        defaultValue: 'disponivel'
    },
    imagem: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'animais'
});

module.exports = Pet;