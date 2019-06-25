'use strict';
module.exports = function(sequelize, DataTypes) {
    var Transaction = sequelize.define('Transactions', {
        amount: { type: DataTypes.FLOAT, allowNull: false, default: 0.0 },
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        transactionDate: {type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW},
        createdAt: {type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW},
        updatedAt: {type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW},
        reason: {type: DataTypes.STRING, allowNull: false},
        type: {type: DataTypes.STRING, allowNull: false},
        desc: {type: DataTypes.STRING, allowNull: false},
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                Transaction.belongsTo(models.Members, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: true,
                        name: 'receiver'
                    },
                });
                Transaction.belongsTo(models.Members, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false,
                        name: 'spender'
                    },
                });
            }
        }
    });

    return Transaction;
};