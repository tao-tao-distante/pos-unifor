const createOrderRepository = (pedidos) => ({
  findAll: () => pedidos,
  findById: (id) => pedidos.find(pedido => pedido.id === id),
  create: (pedido) => {
    pedidos.push(pedido);
    return pedido;
  },
  nextId: () => pedidos.length + 1,
});

module.exports = { createOrderRepository };
