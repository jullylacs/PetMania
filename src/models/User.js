const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
    tableName: 'cadastros',
    hooks: {
        beforeCreate: async (user) => {
            if (user.senha) {
                user.senha = await bcrypt.hash(user.senha, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('senha')) {
                user.senha = await bcrypt.hash(user.senha, 10);
            }
        }
    }
});

User.prototype.validPassword = async function(senha) {
    return await bcrypt.compare(senha, this.senha);
};

module.exports = User;