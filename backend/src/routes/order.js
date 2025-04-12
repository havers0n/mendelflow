const express = require('express');
const router = express.Router();
const { Order, User, Product } = require('../models');
const { auth, checkRole } = require('../middleware/auth');

// Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username', 'firstName', 'lastName'],
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username', 'firstName', 'lastName'],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order (admin/manager only)
router.post('/', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status!' });
  }

  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (status === 'in_progress' && !order.startedAt) {
      order.startedAt = new Date();
    } else if (status === 'completed') {
      order.completedAt = new Date();
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign order to user
router.patch('/:id/assign', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { userId } = req.body;
    const order = await Order.findByPk(req.params.id);
    const user = await User.findByPk(userId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    order.assignedTo = userId;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get orders by status
router.get('/status/:status', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: req.params.status },
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username', 'firstName', 'lastName'],
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's assigned orders
router.get('/assigned/:userId', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { assignedTo: req.params.userId },
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username', 'firstName', 'lastName'],
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 