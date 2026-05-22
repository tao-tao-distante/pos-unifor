const createUserRepository = (usuarios) => ({
  findById: (id) => usuarios.find(usuario => usuario.id === id),
});

module.exports = { createUserRepository };
