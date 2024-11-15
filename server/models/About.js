const { DataTypes } = require('sequelize');
const db = require('../config/database');

const About = db.define('About', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    aboutUs: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    detailAboutUs: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    }
}, { freezeTableName: true });

module.exports = About;
