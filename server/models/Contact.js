const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Contact = db.define('Contact', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    detailLocation: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    embedMap: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    }
}, { freezeTableName: true });

module.exports = Contact;
