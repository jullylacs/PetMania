const Sequelize = require("sequelize");
const connection = require("../database/database");
const Animais = require("../animais/Animais");

const Agendamento = connection.define("agendamentos", {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'cadastros',
            key: 'id'
        }
    },
    petId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'animais',
            key: 'id'
        }
    },
    data: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    hora: {
        type: Sequelize.TIME,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('pendente', 'aprovado', 'cancelado'),
        defaultValue: 'pendente'
    }
});

Agendamento.sync({ force: false })
    .then(() => {
        console.log('Tabela "agendamentos" verificada com sucesso!');
    })
    .catch((err) => {
        console.error('Erro ao verificar tabela agendamentos:', err);
    });

// Associações
Animais.hasMany(Agendamento);
Agendamento.belongsTo(Animais, { foreignKey: 'petId' });

module.exports = Agendamento;