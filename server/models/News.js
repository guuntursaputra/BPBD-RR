const { DataTypes } = require('sequelize');
const db = require('../config/database');

const News = db.define('News', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    titleNews: { 
        type: DataTypes.STRING(50), 
        allowNull: false 
    },
    imgNewsUrl: { 
        type: DataTypes.STRING(255), 
        allowNull: true 
    },
    contentNews: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    updatedAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, { freezeTableName: true });

module.exports = News;
