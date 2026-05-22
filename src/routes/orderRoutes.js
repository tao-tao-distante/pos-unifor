const express = require('express');

const createOrderRoutes = ({ orderRepository, createOrder, getOrderDetails }) => {
  const router = express.Router();

  router.get('/pedidos', (req, res) => {
    res.json(orderRepository.findAll());
  });

  router.post('/pedidos', async (req, res) => {
    const result = await createOrder(req.body);
    return res.status(result.status).json(result.body);
  });

  router.get('/pedidos/:id', (req, res) => {
    const result = getOrderDetails(parseInt(req.params.id));
    return res.status(result.status).json(result.body);
  });

  return router;
};

module.exports = { createOrderRoutes };
