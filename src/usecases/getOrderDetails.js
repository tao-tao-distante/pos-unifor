const createGetOrderDetailsUseCase = ({ orderRepository, userRepository }) => (id) => {
  const pedido = orderRepository.findById(id);

  if (!pedido) {
    return { status: 404, body: { erro: "Pedido não encontrado" } };
  }

  const donoPedido = userRepository.findById(pedido.usuarioId);

  if (!donoPedido) {
    return { status: 404, body: { erro: "Dono do pedido não encontrado" } };
  }

  return {
    status: 200,
    body: {
      pedido,
      cliente: donoPedido.nome,
    },
  };
};

module.exports = { createGetOrderDetailsUseCase };
