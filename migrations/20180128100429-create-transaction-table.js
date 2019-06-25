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
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        transactionDate :{
            allowNull: false,
            type: Sequelize.DATE,
        },
        spender: {
            type: Sequelize.STRING,
            onDelete: "CASCADE",
            allowNull: false,
            references: { model: 'Members', key: 'id' }
        },
        receiver: {
            type: Sequelize.STRING,
            onDelete: "CASCADE",
            allowNull: true,
            references: { model: 'Members', key: 'id' }
        },
        reason : {
            allowNull: false,
            type: Sequelize.STRING,
        },
        type : {
            allowNull: false,
            type: Sequelize.STRING,
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
