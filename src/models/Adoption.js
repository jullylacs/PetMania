const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Adoption extends Model {}

Adoption.init({
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
    petId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pets',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pendente', 'aprovada', 'rejeitada'),
        allowNull: false,
        defaultValue: 'pendente'
    }
}, {
    sequelize,
    modelName: 'Adoption',
    tableName: 'adoptions'
});

module.exports = Adoption;