const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    username: { 
        type: DataTypes.STRING(25), 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING(50), 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
}, { freezeTableName: true });

module.exports = User;
