// =======================================
// COTIZADOR COSTAMAR - CONEXIÓN CON API
// =======================================

window.CotizadorCostamar = {

  API_URL: 'https://api-costamar.onrender.com',

  // Timeout en milisegundos (25 segundos)
  TIMEOUT_MS: 25000,

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
    'tacna': 'TCQ',
    'juliaca': 'JUL',
    'puerto maldonado': 'PEM',
    'cancun': 'CUN',
    'cancún': 'CUN',
    'punta cana': 'PUJ',
    'miami': 'MIA',
    'nueva york': 'JFK',
    'new york': 'JFK',
    'los angeles': 'LAX',
    'los ángeles': 'LAX',
    'madrid': 'MAD',
    'barcelona': 'BCN',
    'buenos aires': 'EZE',
    'santiago': 'SCL',
    'bogota': 'BOG',
    'bogotá': 'BOG',
    'medellin': 'MDE',
    'medellín': 'MDE',
    'quito': 'UIO',
    'guayaquil': 'GYE',
    'ciudad de mexico': 'MEX',
    'ciudad de méxico': 'MEX',
    'paris': 'CDG',
    'parís': 'CDG',
    'roma': 'FCO',
    'london': 'LHR',
    'londres': 'LHR'
  },

  obtenerCodigoIATA(ciudad) {
    const ciudadLimpia = ciudad.split(',')[0].trim().toLowerCase();
    return this.CIUDADES_IATA[ciudadLimpia] || null;
  },

  // Fetch con timeout usando AbortController
  async fetchConTimeout(url, opciones) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...opciones,
        signal: controller.signal
      });
      clearTimeout(timer);
      return response;
    } catch (error) {
      clearTimeout(timer);
      if (error.name === 'AbortError') {
        throw new Error('La búsqueda tardó demasiado. El servidor puede estar iniciándose — intenta de nuevo en unos segundos.');
      }
      throw error;
    }
  },

  async cotizarConFees(datos) {
    try {
      console.log('Consultando API Costamar...', datos);

      const nombreOrigen = Object.keys(this.CIUDADES_IATA).find(
        k => this.CIUDADES_IATA[k] === datos.origen
      ) || datos.origen;

      const nombreDestino = Object.keys(this.CIUDADES_IATA).find(
        k => this.CIUDADES_IATA[k] === datos.destino
      ) || datos.destino;

      const response = await this.fetchConTimeout(`${this.API_URL}/api/cotizar`, {
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
        let errorMsg = `Error del servidor (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const resultado = await response.json();

      if (!resultado.success) {
        throw new Error(resultado.error || 'La API no devolvió resultados');
      }

      console.log('Vuelos recibidos:', resultado.vuelos?.length);

      return {
        success: true,
        vuelos: resultado.vuelos.map(v => ({
          aerolinea:      v.aerolinea       || 'N/A',
          hora_salida:    v.hora_salida      || 'N/A',
          hora_llegada:   v.hora_llegada     || 'N/A',
          duracion:       v.duracion         || 'N/A',
          escalas_texto:  v.escalas_texto    || 'Directo',
          escalas:        v.escalas_texto    || 'Directo',
          equipaje_bodega: v.equipaje_bodega || 'No incluido',
          equipaje_mano:   v.equipaje_mano   || 'No especificado',
          personal_item:   v.personal_item   || 'Incluido (bolso/mochila)',
          numero_vuelo:    v.numero_vuelo    || 'N/A',
          clase:           v.clase           || 'Economy',
          precio_base:     v.precio          || 0,
          fee_por_persona: 0,
          precio_final:    v.precio          || 0,
          precio:          v.precio          || 0,
          moneda_final:    v.moneda          || 'USD'
        })),
        moneda: resultado.vuelos[0]?.moneda || 'USD'
      };

    } catch (error) {
      console.error('Error al cotizar:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

console.log('Cotizador Costamar cargado');
