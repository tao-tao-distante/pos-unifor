const {
  USER_TYPE_VIP,
  USER_TYPE_NORMAL,
  ORDER_STATUS_APPROVED,
} = require('../config/constants');

const createInitialData = () => ({
  usuarios: [
    { id: 1, nome: "João Silva", tipo: USER_TYPE_VIP, saldo: 100 },
    { id: 2, nome: "Maria Souza", tipo: USER_TYPE_NORMAL, saldo: 50 },
  ],
  pedidos: [
    { id: 1, usuarioId: 1, valorFinal: 85.00, status: ORDER_STATUS_APPROVED },
    { id: 2, usuarioId: 2, valorFinal: 105.00, status: ORDER_STATUS_APPROVED },
    { id: 3, usuarioId: 99, valorFinal: 30.00, status: ORDER_STATUS_APPROVED },
  ],
});

module.exports = { createInitialData };
