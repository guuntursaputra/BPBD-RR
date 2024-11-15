const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Termin = require('./Termin');
const Recap = require('./Recap');

const TerminNominal = db.define('TerminNominal', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    terminId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    recapId: { 
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    stage: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    nominal: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
}, { freezeTableName: true });

// Set up associations
Termin.hasMany(TerminNominal, { foreignKey: 'terminId' });
TerminNominal.belongsTo(Termin, { foreignKey: 'terminId' });

Recap.hasMany(TerminNominal, { foreignKey: 'recapId' });
TerminNominal.belongsTo(Recap, { foreignKey: 'recapId' });

module.exports = TerminNominal;
