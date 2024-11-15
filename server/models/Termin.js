const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Termin = db.define('Termin', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    terminNum: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.STRING(255), 
        allowNull: true 
    },
}, { freezeTableName: true });

module.exports = Termin;
