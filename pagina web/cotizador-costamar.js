// =======================================
// COTIZADOR COSTAMAR - CONEXIÓN CON API
// =======================================

window.CotizadorCostamar = {

  API_URL: 'https://api-costamar.onrender.com',

  CIUDADES_IATA: {
    'lima': 'LIM',
    'cusco': 'CUZ',
    'cuzco': 'CUZ',
    'arequipa': 'AQP',
    'iquitos': 'IQT',
    'piura': 'PIU',
    'trujillo': 'TRU',
    'chiclayo': 'CIX',
    'tarapoto': 'TPP',
    'pucallpa': 'PCL',
    'tumbes': 'TBP',
    'cancun': 'CUN',
    'punta cana': 'PUJ',
    'miami': 'MIA',
    'madrid': 'MAD',
    'buenos aires': 'BUE',
    'santiago': 'SCL',
    'bogota': 'BOG',
    'paris': 'PAR',
    'roma': 'ROM'
  },

  obtenerCodigoIATA(ciudad) {
    const ciudadLimpia = ciudad.split(',')[0].trim().toLowerCase();
    return this.CIUDADES_IATA[ciudadLimpia] || null;
  },

  async cotizarConFees(datos) {
    try {
      console.log('📡 Consultando API Costamar...', datos);

      const nombreOrigen = Object.keys(this.CIUDADES_IATA).find(
        k => this.CIUDADES_IATA[k] === datos.origen
      ) || datos.origen;

      const nombreDestino = Object.keys(this.CIUDADES_IATA).find(
        k => this.CIUDADES_IATA[k] === datos.destino
      ) || datos.destino;

      const response = await fetch(`${this.API_URL}/api/cotizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origen: nombreOrigen,
          destino: nombreDestino,
          fechaIda: datos.fechaIda,
          adultos: datos.adultos
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al conectar con la API');
      }

      const resultado = await response.json();

      if (!resultado.success) {
        throw new Error(resultado.error);
      }

      console.log('✅ Vuelos recibidos:', resultado);

      return {
        success: true,
        vuelos: resultado.vuelos.map(v => ({
          aerolinea: v.aerolinea || 'N/A',
          hora_salida: v.hora_salida || 'N/A',
          hora_llegada: v.hora_llegada || 'N/A',
          duracion: v.duracion || 'N/A',
          escalas: v.escalas_texto || 'N/A',
          equipaje: v.equipaje_bodega || 'No incluido',
          precio_base: v.precio,
          fee_por_persona: 0,
          precio_final: v.precio,
          moneda_final: v.moneda || 'USD'
        })),
        moneda: resultado.vuelos[0]?.moneda || 'USD'
      };

    } catch (error) {
      console.error('❌ Error al cotizar:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};


console.log('✅ Cotizador Costamar cargado');