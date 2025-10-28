const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Donation extends Model {}

Donation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    mensagem: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada'),
        allowNull: false,
        defaultValue: 'pendente'
    },
    formaPagamento: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Donation',
    tableName: 'donations'
});

module.exports = Donation;