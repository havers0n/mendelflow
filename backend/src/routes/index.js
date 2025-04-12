const express = require('express');
const router = express.Router();

// Import route modules
const warehouseRoutes = require('./warehouse');
const productRoutes = require('./product');
const orderRoutes = require('./order');
const userRoutes = require('./user');

// Mount routes
router.use('/warehouse', warehouseRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router; 