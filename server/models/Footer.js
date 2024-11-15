const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Footer = db.define('Footer', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    titleFooter: { 
        type: DataTypes.STRING(25), 
        allowNull: false 
    }
}, { freezeTableName: true });

module.exports = Footer;
