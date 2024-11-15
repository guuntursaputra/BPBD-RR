const Footer = require('./Footer');
const ListContentFooter = require('./ListContentFooter');

// Define associations
Footer.hasMany(ListContentFooter, { foreignKey: 'footerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ListContentFooter.belongsTo(Footer, { foreignKey: 'footerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = { Footer, ListContentFooter };
