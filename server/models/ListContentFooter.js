const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ListContentFooter = db.define('ListContentFooter', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    content: { 
        type: DataTypes.STRING(50), 
        allowNull: false 
    },
    urlLink: { 
        type: DataTypes.STRING(50), 
        allowNull: true 
    },
    footerId: { 
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { freezeTableName: true });

module.exports = ListContentFooter;
