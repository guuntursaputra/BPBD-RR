const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Rakyat = require('./Rakyat');
const Termin = require('./Termin');

const Recap = db.define('Recap', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    rakyatId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    terminId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    lvlDamage: { 
        type: DataTypes.STRING(50), 
        allowNull: false 
    },
    transactionDate: { 
        type: DataTypes.DATE, 
        allowNull: true 
    }
}, { freezeTableName: true });

Rakyat.hasMany(Recap, { foreignKey: 'rakyatId' });
Recap.belongsTo(Rakyat, { foreignKey: 'rakyatId' });

Termin.hasMany(Recap, { foreignKey: 'terminId' });
Recap.belongsTo(Termin, { foreignKey: 'terminId' });

module.exports = Recap;
