// ============================================
// COTIZADOR COSTAMAR - VERSIÓN CON PROXY
// Terminal ID: 0606424761
// MODIFICADO: Llama al proxy local en lugar de directamente a Costamar
// ============================================

// ============================================
// CONFIGURACIÓN
// ============================================
const TERMINAL_ID = "0606424761";
const TIPO_CAMBIO = 3.60;

const FEES = {
  NACIONAL: 14,
  SUDAMERICA: 60,
  INTERNACIONAL: 90
};

// ============================================
// CIUDADES NACIONALES DE PERÚ (códigos IATA)
// ============================================
const CIUDADES_PERU = [
  'LIM', 'CUZ', 'AQP', 'PIU', 'IQT', 'TRU', 'CIX', 'TPP', 'JUL', 'PEM',
  'TCQ', 'TBP', 'CJA', 'AYP', 'PCL', 'JAE', 'TYL', 'ATA', 'ANS', 'HUU',
  'TGI', 'CHH', 'YMS', 'JAU'
];

// ============================================
// PAÍSES SUDAMÉRICA + CARIBE CERCANO
// ============================================
const CIUDADES_SUDAMERICA = [
  'BOG', 'MDE', 'CLO', 'CTG', 'BAQ', 'SMR', 'BGA', 'PEI', 'ADZ', 'CUC',
  'AXM', 'NVA', 'PSO', 'MZL', 'MTR', 'VUP', 'UIB', 'RCH', 'LET',
  'UIO', 'GYE', 'CUE', 'MEC', 'LOH', 'ESM', 'GPS', 'SCY',
  'SCL', 'VAP', 'CCP', 'ANF', 'IQQ', 'LSC', 'ZCO', 'PMC', 'PUQ', 'CJC',
  'ARI', 'CPO', 'IPC',
  'EZE', 'COR', 'MDZ', 'ROS', 'SLA', 'BRC', 'IGR', 'USH', 'TUC', 'JUJ',
  'NQN', 'MDQ', 'FTE',
  'GRU', 'GIG', 'BSB', 'SSA', 'FOR', 'CNF', 'REC', 'CWB', 'POA', 'MAO',
  'BEL', 'NAT', 'FLN', 'VIX', 'MCZ', 'JPA', 'AJU', 'CGR', 'GYN', 'CGB',
  'THE', 'SLZ', 'BVB', 'PVH', 'RBR', 'MCP', 'PMW',
  'LPB', 'VVI', 'CBB', 'SRE', 'TJA', 'UYU', 'TDD',
  'ASU', 'AGT',
  'MVD', 'PDP',
  'CCS', 'MAR', 'VLN', 'BLA', 'BRM', 'MRD', 'PMV', 'PZO', 'MYC', 'MUN',
  'PTY',
  'AUA', 'CUR', 'BON', 'SXM', 'PUJ', 'SDQ', 'SJU', 'HAV', 'VRA', 'KIN',
  'MBJ', 'NAS'
];

// DICCIONARIO DE CÓDIGOS IATA (simplificado para el ejemplo)
const CODIGOS_IATA = {
  'lima': 'LIM',
  'cusco': 'CUZ', 'cuzco': 'CUZ',
  'arequipa': 'AQP',
  'piura': 'PIU',
  'iquitos': 'IQT',
  'trujillo': 'TRU',
  'chiclayo': 'CIX',
  'puno': 'JUL', 'juliaca': 'JUL',
  'tarapoto': 'TPP',
  'puerto maldonado': 'PEM',
  'tacna': 'TCQ',
  'tumbes': 'TBP',
  'cajamarca': 'CJA'
};

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

function obtenerCodigoIATA(ciudad) {
  if (!ciudad) return null;
  const normalizado = ciudad.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return CODIGOS_IATA[normalizado] || null;
}

function determinarTipoDestino(origen, destino) {
  if (CIUDADES_PERU.includes(origen) && CIUDADES_PERU.includes(destino)) {
    return 'NACIONAL';
  }
  if (CIUDADES_SUDAMERICA.includes(destino)) {
    return 'SUDAMERICA';
  }
  return 'INTERNACIONAL';
}

function calcularFee(tipoDestino) {
  return FEES[tipoDestino] || FEES.INTERNACIONAL;
}

// ============================================
// EXTRAER INFO DE UN VUELO
// ============================================

function extraerInfoVuelo(vuelo) {
  const info = {
    aerolinea: 'N/A',
    precio: 0,
    moneda: 'USD',
    duracion: 'N/A',
    escalas: 'N/A',
    hora_salida: 'N/A',
    hora_llegada: 'N/A',
    equipaje: 'No incluido'
  };

  if (vuelo.pricing) {
    const pricing = vuelo.pricing;
    for (const campo of ['total', 'totalAmount', 'amount', 'grandTotal']) {
      if (pricing[campo]) {
        const precio = parseFloat(String(pricing[campo]).replace(/[^0-9.]/g, ''));
        if (precio > 0) {
          info.precio = precio;
          break;
        }
      }
    }
    info.moneda = pricing.currency || pricing.currencyCode || 'USD';
  }

  if (vuelo.itinerary?.[0]?.flights?.[0]) {
    const flight = vuelo.itinerary[0].flights[0];

    if (flight.marketingAirline) {
      info.aerolinea = flight.marketingAirline.name || 'N/A';
    }

    if (flight.departureDateTime) {
      info.hora_salida = flight.departureDateTime.substr(11, 5);
    }
    if (flight.arrivalDateTime) {
      info.hora_llegada = flight.arrivalDateTime.substr(11, 5);
    }

    if (flight.elapsedTime && flight.elapsedTime.length >= 4) {
      const h = parseInt(flight.elapsedTime.substr(0, 2));
      const m = parseInt(flight.elapsedTime.substr(2, 2));
      info.duracion = `${h}h ${m}m`;
    }

    if (flight.baggage) {
      const piezas = flight.baggage.pieces;
      if (piezas && piezas !== '0') {
        info.equipaje = `${piezas} maleta(s)`;
      } else {
        const desc = (flight.baggage.description || '').toUpperCase();
        if (desc.includes('INCLUDED') || desc.includes('INCLUIDO')) {
          info.equipaje = '1 maleta';
        }
      }
    }

    if (flight.segments) {
      const numEscalas = Math.max(0, flight.segments.length - 1);
      if (numEscalas === 0) {
        info.escalas = 'Directo';
      } else if (numEscalas === 1) {
        info.escalas = '1 escala';
      } else {
        info.escalas = `${numEscalas} escalas`;
      }
    }
  }

  return info;
}

// ============================================
// FUNCIÓN PRINCIPAL: COTIZAR EN COSTAMAR
// ⚠️ MODIFICADO: Ahora llama al PROXY LOCAL
// ============================================

async function cotizarEnCostamar(origen, destino, fechaIda, fechaVuelta = null, adultos = 1, ninos = 0, infantes = 0) {
  const flightType = fechaVuelta ? "RT" : "OW";

  const itinerary = fechaVuelta
    ? [
        { origin: origen, destination: destino, date: fechaIda },
        { origin: destino, destination: origen, date: fechaVuelta }
      ]
    : [
        { origin: origen, destination: destino, date: fechaIda }
      ];

  const fechaIdaISO = `${fechaIda.substr(0, 4)}-${fechaIda.substr(4, 2)}-${fechaIda.substr(6, 2)}T05:00:00.000Z`;
  const fechaVueltaISO = fechaVuelta
    ? `${fechaVuelta.substr(0, 4)}-${fechaVuelta.substr(4, 2)}-${fechaVuelta.substr(6, 2)}T05:00:00.000Z`
    : fechaIdaISO;

  const payload = {
    flightType,
    terminalId: TERMINAL_ID,
    itinerary,
    startDate: fechaIdaISO,
    endDate: fechaVueltaISO,
    passengers: { adults: adultos, children: ninos, infants: infantes },
    hasValidationToken: false
  };

  console.log('🔍 Enviando request al proxy:', payload);

  // ⚠️ CAMBIO CRÍTICO: Llama al PROXY LOCAL en lugar de Costamar directo
  const response = await fetch('/api/flights/search', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      // Ya NO se necesitan User-Agent, Origin, Referer aquí
      // El proxy se encarga de eso
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error del proxy:', response.status, errorText);
    throw new Error(`Proxy error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('✅ Respuesta recibida del proxy');
  
  return data?.data || [];
}

// ============================================
// FUNCIÓN COMPLETA: COTIZAR CON FEES
// ============================================

async function cotizarConFees({
  origen,
  destino,
  fechaIda,
  fechaVuelta = null,
  adultos = 1,
  ninos = 0,
  infantes = 0,
  maxResultados = 5
}) {
  console.log('📋 Iniciando cotización con fees...', { origen, destino, fechaIda });

  // 1. Buscar vuelos
  const vuelosRaw = await cotizarEnCostamar(
    origen, destino, fechaIda, fechaVuelta, adultos, ninos, infantes
  );

  if (!vuelosRaw || vuelosRaw.length === 0) {
    return { success: false, error: 'No hay vuelos disponibles', vuelos: [] };
  }

  console.log(`✈️ Encontrados ${vuelosRaw.length} vuelos`);

  // 2. Calcular fees
  const tipoDestino = determinarTipoDestino(origen, destino);
  const feePorPersona = calcularFee(tipoDestino);
  const esNacional = tipoDestino === 'NACIONAL';
  const totalPasajeros = adultos + ninos + infantes;
  const feeTotal = feePorPersona * totalPasajeros;

  console.log(`💰 Tipo: ${tipoDestino} | Fee: $${feePorPersona} x ${totalPasajeros} = $${feeTotal}`);

  // 3. Procesar vuelos
  const vuelos = vuelosRaw
    .map(v => {
      const info = extraerInfoVuelo(v);
      const precioConFee = info.precio + feeTotal;

      if (esNacional) {
        info.precio_final = Math.round(precioConFee * TIPO_CAMBIO * 100) / 100;
        info.moneda_final = 'PEN';
      } else {
        info.precio_final = Math.round(precioConFee * 100) / 100;
        info.moneda_final = 'USD';
      }

      info.fee_por_persona = feePorPersona;
      info.fee_total = feeTotal;
      info.tipo_destino = tipoDestino;
      info.total_pasajeros = totalPasajeros;
      info.precio_base = info.precio;

      return info;
    })
    .filter(v => v.precio > 0)
    .sort((a, b) => a.precio_final - b.precio_final)
    .slice(0, maxResultados);

  if (vuelos.length === 0) {
    return { success: false, error: 'No hay vuelos con precio válido', vuelos: [] };
  }

  console.log(`✅ ${vuelos.length} vuelos procesados | Mejor precio: ${vuelos[0].moneda_final} ${vuelos[0].precio_final}`);

  return {
    success: true,
    origen,
    destino,
    tipo_destino: tipoDestino,
    moneda: esNacional ? 'PEN' : 'USD',
    total_pasajeros: totalPasajeros,
    fee_por_persona: feePorPersona,
    fee_total: feeTotal,
    vuelos
  };
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

if (typeof window !== 'undefined') {
  window.CotizadorCostamar = {
    cotizarConFees,
    cotizarEnCostamar,
    obtenerCodigoIATA,
    determinarTipoDestino,
    calcularFee,
    extraerInfoVuelo
  };
}
