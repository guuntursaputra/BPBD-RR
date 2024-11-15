const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Bank = db.define('Bank', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    bankName: { 
        type: DataTypes.STRING(125), 
        allowNull: false 
    },
    branchBank: { 
        type: DataTypes.STRING(125), 
        allowNull: true 
    },
    account: { 
        type: DataTypes.STRING(125), 
        allowNull: false 
    },
}, { freezeTableName: true });

module.exports = Bank;
