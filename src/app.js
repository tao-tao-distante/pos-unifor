const express = require('express');
const axios = require('axios');
const { createInitialData } = require('./data/seed');
const { createOrderRepository } = require('./infra/repositories/orderRepository');
const { createUserRepository } = require('./infra/repositories/userRepository');
const { createFreightService } = require('./infra/services/freightService');
const { UserLock, createCreateOrderUseCase } = require('./usecases/createOrder');
const { createGetOrderDetailsUseCase } = require('./usecases/getOrderDetails');
const { createOrderRoutes } = require('./routes/orderRoutes');

const createApp = ({ httpClient = axios } = {}) => {
  const app = express();
  const data = createInitialData();

  const userRepository = createUserRepository(data.usuarios);
  const orderRepository = createOrderRepository(data.pedidos);
  const freightService = createFreightService(httpClient);

  const createOrder = createCreateOrderUseCase({
    userRepository,
    orderRepository,
    freightService,
    userLock: new UserLock(),
  });
  const getOrderDetails = createGetOrderDetailsUseCase({ orderRepository, userRepository });

  app.use(express.json());
  app.use(createOrderRoutes({ orderRepository, createOrder, getOrderDetails }));

  return app;
};

module.exports = { createApp };
