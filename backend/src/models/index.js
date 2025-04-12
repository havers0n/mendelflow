const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

// Define relationships
Order.belongsTo(User, { as: 'assignedUser', foreignKey: 'assignedTo' });
User.hasMany(Order, { as: 'assignedOrders', foreignKey: 'assignedTo' });

// Export models
module.exports = {
  User,
  Product,
  Order,
};
