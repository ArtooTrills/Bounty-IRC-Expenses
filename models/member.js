'use strict';
module.exports = function(sequelize, DataTypes) {
    var Member = sequelize.define('Members', {
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        nickName: { type: DataTypes.STRING, allowNull: false, unique: true },
        createdAt: {type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW},
        updatedAt: {type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW},
        slackId: { type: DataTypes.STRING, allowNull: true}
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });

    return Member;
};
