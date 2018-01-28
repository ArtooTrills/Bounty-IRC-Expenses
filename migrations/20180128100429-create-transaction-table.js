'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        amount: {
            type: Sequelize.FLOAT,
            defaultValue: 0.0,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        transactionsDate :{
            allowNull: false,
            type: Sequelize.DATE,
        },
        bankId: {
            type: Sequelize.INTEGER,
            onDelete: "CASCADE",
            allowNull: true,
            references: { model: 'Members', key: 'id' }
        },
        desc : {
            allowNull: false,
            type: Sequelize.STRING,
        }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Transactions');
  }
};
