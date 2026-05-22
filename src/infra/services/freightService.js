const {
  DEFAULT_FREIGHT,
  FREIGHT_RATES,
  VIACEP_API_URL,
} = require('../../config/constants');

const createFreightService = (httpClient) => ({
  getFreightCost: async (cepDestino) => {
    try {
      const response = await httpClient.get(`${VIACEP_API_URL}/${cepDestino}/json/`);

      if (response.data.erro) {
        throw new Error("CEP inválido");
      }

      return FREIGHT_RATES[response.data.uf] !== undefined
        ? FREIGHT_RATES[response.data.uf]
        : DEFAULT_FREIGHT;
    } catch (error) {
      throw new Error("Erro ao calcular frete externo");
    }
  },
});

module.exports = { createFreightService };
