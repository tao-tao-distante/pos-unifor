const {
  ORDER_STATUS_APPROVED,
  USER_TYPE_VIP,
  VIP_ADDITIONAL_DISCOUNT,
  VIP_DISCOUNT_PERCENTAGE,
} = require('../config/constants');

const calculateFinalOrderValue = (valorTotal, userType) => {
  if (userType !== USER_TYPE_VIP) {
    return valorTotal;
  }

  return (valorTotal * (1 - VIP_DISCOUNT_PERCENTAGE)) - VIP_ADDITIONAL_DISCOUNT;
};

class UserLock {
  constructor() {
    this.locks = new Map();
  }

  async run(usuarioId, action) {
    const previous = this.locks.get(usuarioId) || Promise.resolve();
    let release;
    const current = new Promise(resolve => { release = resolve; });
    const chain = previous.then(() => current);

    this.locks.set(usuarioId, chain);
    await previous;

    try {
      return await action();
    } finally {
      release();
      if (this.locks.get(usuarioId) === chain) {
        this.locks.delete(usuarioId);
      }
    }
  }
}

const createCreateOrderUseCase = ({ userRepository, orderRepository, freightService, userLock }) => async ({ usuarioId, valorTotal, cepDestino }) => {
  if (!usuarioId || !valorTotal || !cepDestino) {
    return { status: 400, body: { erro: "Dados inválidos: usuarioId, valorTotal e cepDestino são obrigatórios" } };
  }

  const usuario = userRepository.findById(usuarioId);
  if (!usuario) {
    return { status: 404, body: { erro: "Usuário não encontrado" } };
  }

  let valorFinal = calculateFinalOrderValue(valorTotal, usuario.tipo);

  try {
    valorFinal += await freightService.getFreightCost(cepDestino);
  } catch (error) {
    return { status: 500, body: { erro: error.message } };
  }

  return userLock.run(usuarioId, async () => {
    if (usuario.saldo < valorFinal) {
      return { status: 400, body: { erro: "Saldo insuficiente" } };
    }

    usuario.saldo -= valorFinal;

    const novoPedido = orderRepository.create({
      id: orderRepository.nextId(),
      usuarioId,
      valorFinal,
      status: ORDER_STATUS_APPROVED,
    });

    return { status: 201, body: novoPedido };
  });
};

module.exports = {
  UserLock,
  calculateFinalOrderValue,
  createCreateOrderUseCase,
};
