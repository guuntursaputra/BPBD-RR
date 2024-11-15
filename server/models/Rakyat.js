const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Bank = require('./Bank');

const Rakyat = db.define('Rakyat', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING(124), 
        allowNull: false 
    },
    NIK: { 
        type: DataTypes.STRING(255), 
        allowNull: false, 
        unique: true 
    },
    gender: { 
        type: DataTypes.STRING(25), 
        allowNull: false 
    },
    bankId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
}, { freezeTableName: true });

Bank.hasMany(Rakyat, { foreignKey: 'bankId' });
Rakyat.belongsTo(Bank, { foreignKey: 'bankId' });

module.exports = Rakyat;
