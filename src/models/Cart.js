const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Cart extends Model {}

Cart.init({
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
    status: {
        type: DataTypes.ENUM('aberto', 'fechado'),
        allowNull: false,
        defaultValue: 'aberto'
    }
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts'
});

module.exports = Cart;