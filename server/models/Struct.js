const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Struct = db.define('Struct', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    imgStruct: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    }
}, { freezeTableName: true });

module.exports = Struct;
