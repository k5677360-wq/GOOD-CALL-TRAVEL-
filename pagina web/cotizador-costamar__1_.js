// ============================================
// COTIZADOR COSTAMAR - Adaptado para Cloudflare Workers
// Terminal ID: 0606424761
// Usa fetch nativo (sin axios)
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
  // Colombia
  'BOG', 'MDE', 'CLO', 'CTG', 'BAQ', 'SMR', 'BGA', 'PEI', 'ADZ', 'CUC',
  'AXM', 'NVA', 'PSO', 'MZL', 'MTR', 'VUP', 'UIB', 'RCH', 'LET',
  // Ecuador
  'UIO', 'GYE', 'CUE', 'MEC', 'LOH', 'ESM', 'GPS', 'SCY',
  // Chile
  'SCL', 'VAP', 'CCP', 'ANF', 'IQQ', 'LSC', 'ZCO', 'PMC', 'PUQ', 'CJC',
  'ARI', 'CPO', 'IPC',
  // Argentina
  'EZE', 'COR', 'MDZ', 'ROS', 'SLA', 'BRC', 'IGR', 'USH', 'TUC', 'JUJ',
  'NQN', 'MDQ', 'FTE',
  // Brasil
  'GRU', 'GIG', 'BSB', 'SSA', 'FOR', 'CNF', 'REC', 'CWB', 'POA', 'MAO',
  'BEL', 'NAT', 'FLN', 'VIX', 'MCZ', 'JPA', 'AJU', 'CGR', 'GYN', 'CGB',
  'THE', 'SLZ', 'BVB', 'PVH', 'RBR', 'MCP', 'PMW',
  // Bolivia
  'LPB', 'VVI', 'CBB', 'SRE', 'TJA', 'UYU', 'TDD',
  // Paraguay
  'ASU', 'AGT',
  // Uruguay
  'MVD', 'PDP',
  // Venezuela
  'CCS', 'MAR', 'VLN', 'BLA', 'BRM', 'MRD', 'PMV', 'PZO', 'MYC', 'MUN',
  // Panamá
  'PTY',
  // Caribe cercano
  'AUA', 'CUR', 'BON', 'SXM', 'PUJ', 'SDQ', 'SJU', 'HAV', 'VRA', 'KIN',
  'MBJ', 'NAS'
];

// ============================================
// DICCIONARIO DE CÓDIGOS IATA - 500+ CIUDADES
// ============================================
const CODIGOS_IATA = {
  // PERÚ
  'lima': 'LIM',
  'cusco': 'CUZ', 'cuzco': 'CUZ',
  'arequipa': 'AQP',
  'piura': 'PIU',
  'iquitos': 'IQT',
  'trujillo': 'TRU',
  'chiclayo': 'CIX',
  'tarapoto': 'TPP',
  'juliaca': 'JUL',
  'puno': 'JUL',
  'puerto maldonado': 'PEM',
  'tacna': 'TCQ',
  'tumbes': 'TBP',
  'cajamarca': 'CJA',
  'ayacucho': 'AYP',
  'pucallpa': 'PCL',
  'jaen': 'JAE',
  'talara': 'TYL',
  'anta': 'ATA',
  'andahuaylas': 'ANS',
  'huanuco': 'HUU',
  'tingo maria': 'TGI',
  'chachapoyas': 'CHH',
  'yurimaguas': 'YMS',
  'huancayo': 'JAU',
  'jauja': 'JAU',
  'aeropuerto de jauja': 'JAU',

  // COLOMBIA
  'bogota': 'BOG', 'bogotá': 'BOG',
  'medellin': 'MDE', 'medellín': 'MDE',
  'cali': 'CLO',
  'cartagena': 'CTG',
  'barranquilla': 'BAQ',
  'santa marta': 'SMR',
  'bucaramanga': 'BGA',
  'pereira': 'PEI',
  'san andres': 'ADZ', 'san andrés': 'ADZ',
  'cucuta': 'CUC', 'cúcuta': 'CUC',
  'armenia': 'AXM',
  'neiva': 'NVA',
  'pasto': 'PSO',
  'manizales': 'MZL',
  'monteria': 'MTR', 'montería': 'MTR',
  'valledupar': 'VUP',
  'quibdo': 'UIB', 'quibdó': 'UIB',
  'riohacha': 'RCH',
  'leticia': 'LET',

  // ECUADOR
  'quito': 'UIO',
  'guayaquil': 'GYE',
  'cuenca': 'CUE',
  'manta': 'MEC',
  'loja': 'LOH',
  'esmeraldas': 'ESM',
  'baltra': 'GPS',
  'galapagos': 'GPS', 'galápagos': 'GPS',
  'san cristobal': 'SCY', 'san cristóbal': 'SCY',

  // CHILE
  'santiago': 'SCL',
  'valparaiso': 'VAP', 'valparaíso': 'VAP',
  'concepcion': 'CCP', 'concepción': 'CCP',
  'antofagasta': 'ANF',
  'iquique': 'IQQ',
  'la serena': 'LSC',
  'temuco': 'ZCO',
  'puerto montt': 'PMC',
  'punta arenas': 'PUQ',
  'calama': 'CJC',
  'arica': 'ARI',
  'copiapo': 'CPO', 'copiapó': 'CPO',
  'isla de pascua': 'IPC',

  // ARGENTINA
  'buenos aires': 'EZE',
  'cordoba': 'COR', 'córdoba': 'COR',
  'mendoza': 'MDZ',
  'rosario': 'ROS',
  'salta': 'SLA',
  'bariloche': 'BRC',
  'iguazu': 'IGR', 'iguazú': 'IGR',
  'ushuaia': 'USH',
  'tucuman': 'TUC', 'tucumán': 'TUC',
  'jujuy': 'JUJ',
  'neuquen': 'NQN', 'neuquén': 'NQN',
  'mar del plata': 'MDQ',
  'el calafate': 'FTE',

  // BRASIL
  'sao paulo': 'GRU', 'são paulo': 'GRU',
  'rio de janeiro': 'GIG', 'río de janeiro': 'GIG',
  'brasilia': 'BSB', 'brasília': 'BSB',
  'salvador': 'SSA',
  'fortaleza': 'FOR',
  'belo horizonte': 'CNF',
  'recife': 'REC',
  'curitiba': 'CWB',
  'porto alegre': 'POA',
  'manaus': 'MAO',
  'belem': 'BEL', 'belém': 'BEL',
  'natal': 'NAT',
  'florianopolis': 'FLN', 'florianópolis': 'FLN',
  'vitoria': 'VIX', 'vitória': 'VIX',
  'maceio': 'MCZ', 'maceió': 'MCZ',
  'joao pessoa': 'JPA', 'joão pessoa': 'JPA',
  'aracaju': 'AJU',
  'campo grande': 'CGR',
  'goiania': 'GYN', 'goiânia': 'GYN',
  'cuiaba': 'CGB', 'cuiabá': 'CGB',
  'teresina': 'THE',
  'sao luis': 'SLZ', 'são luís': 'SLZ',
  'boa vista': 'BVB',
  'porto velho': 'PVH',
  'rio branco': 'RBR',
  'macapa': 'MCP', 'macapá': 'MCP',
  'palmas': 'PMW',

  // BOLIVIA
  'la paz': 'LPB',
  'santa cruz': 'VVI',
  'cochabamba': 'CBB',
  'sucre': 'SRE',
  'tarija': 'TJA',
  'uyuni': 'UYU',
  'trinidad': 'TDD',

  // PARAGUAY
  'asuncion': 'ASU', 'asunción': 'ASU',
  'ciudad del este': 'AGT',

  // URUGUAY
  'montevideo': 'MVD',
  'punta del este': 'PDP',

  // VENEZUELA
  'caracas': 'CCS',
  'maracaibo': 'MAR',
  'valencia': 'VLN',
  'barcelona': 'BLA',
  'barquisimeto': 'BRM',
  'merida': 'MRD', 'mérida': 'MRD',
  'isla margarita': 'PMV',
  'puerto ordaz': 'PZO',
  'maracay': 'MYC',
  'maturin': 'MUN', 'maturín': 'MUN',

  // CENTROAMÉRICA
  'panama': 'PTY', 'panamá': 'PTY',
  'ciudad de panama': 'PTY',
  'san jose': 'SJO', 'san josé': 'SJO',
  'liberia': 'LIR',
  'managua': 'MGA',
  'san salvador': 'SAL',
  'tegucigalpa': 'TGU',
  'san pedro sula': 'SAP',
  'ciudad de guatemala': 'GUA',
  'guatemala': 'GUA',
  'flores': 'FRS',
  'tikal': 'FRS',
  'belize': 'BZE',

  // MÉXICO
  'mexico': 'MEX', 'méxico': 'MEX',
  'ciudad de mexico': 'MEX',
  'guadalajara': 'GDL',
  'monterrey': 'MTY',
  'cancun': 'CUN', 'cancún': 'CUN',
  'tijuana': 'TIJ',
  'los cabos': 'SJD',
  'cabo': 'SJD',
  'puerto vallarta': 'PVR',
  'mazatlan': 'MZT', 'mazatlán': 'MZT',
  'merida': 'MID',
  'acapulco': 'ACA',
  'veracruz': 'VER',
  'oaxaca': 'OAX',
  'chihuahua': 'CUU',
  'hermosillo': 'HMO',
  'culiacan': 'CUL', 'culiacán': 'CUL',
  'queretaro': 'QRO', 'querétaro': 'QRO',
  'aguascalientes': 'AGU',
  'leon': 'BJX', 'león': 'BJX',
  'tuxtla gutierrez': 'TGZ', 'tuxtla gutiérrez': 'TGZ',
  'villahermosa': 'VSA',
  'tampico': 'TAM',
  'zacatecas': 'ZCL',
  'san luis potosi': 'SLP', 'san luis potosí': 'SLP',
  'durango': 'DGO',
  'torreon': 'TRC', 'torreón': 'TRC',
  'puebla': 'PBC',
  'ixtapa': 'ZIH',
  'zihuatanejo': 'ZIH',
  'huatulco': 'HUX',
  'loreto': 'LTO',
  'manzanillo': 'ZLO',
  'morelia': 'MLM',
  'cozumel': 'CZM',
  'chetumal': 'CTM',
  'campeche': 'CPE',
  'ciudad juarez': 'CJS', 'ciudad juárez': 'CJS',
  'ciudad obregon': 'CEN', 'ciudad obregón': 'CEN',
  'reynosa': 'REX',
  'matamoros': 'MAM',
  'nuevo laredo': 'NLD',

  // CARIBE
  'aruba': 'AUA',
  'la habana': 'HAV',
  'varadero': 'VRA',
  'santiago de cuba': 'SCU',
  'holguin': 'HOG', 'holguín': 'HOG',
  'santo domingo': 'SDQ',
  'punta cana': 'PUJ',
  'san juan': 'SJU',
  'havana': 'HAV',
  'kingston': 'KIN',
  'montego bay': 'MBJ',
  'nassau': 'NAS',
  'bridgetown': 'BGI',
  'port of spain': 'POS',
  'curacao': 'CUR', 'curaçao': 'CUR',
  'bonaire': 'BON',
  'st maarten': 'SXM',
  'antigua': 'ANU',
  'barbados': 'BGI',
  'grenada': 'GND',
  'st lucia': 'UVF',
  'martinica': 'FDF',
  'guadalupe': 'PTP',

  // ESTADOS UNIDOS
  'nueva york': 'JFK', 'new york': 'JFK',
  'miami': 'MIA',
  'los angeles': 'LAX', 'los ángeles': 'LAX',
  'orlando': 'MCO',
  'houston': 'IAH',
  'atlanta': 'ATL',
  'washington': 'IAD',
  'chicago': 'ORD',
  'san francisco': 'SFO',
  'las vegas': 'LAS',
  'seattle': 'SEA',
  'boston': 'BOS',
  'dallas': 'DFW',
  'denver': 'DEN',
  'fort lauderdale': 'FLL',
  'phoenix': 'PHX',
  'philadelphia': 'PHL',
  'detroit': 'DTW',
  'minneapolis': 'MSP',
  'tampa': 'TPA',
  'san diego': 'SAN',
  'newark': 'EWR',
  'charlotte': 'CLT',
  'baltimore': 'BWI',
  'nashville': 'BNA',
  'austin': 'AUS',
  'salt lake city': 'SLC',
  'portland': 'PDX',
  'raleigh': 'RDU',
  'pittsburgh': 'PIT',
  'st louis': 'STL',
  'new orleans': 'MSY',
  'cleveland': 'CLE',
  'cincinnati': 'CVG',
  'indianapolis': 'IND',
  'columbus': 'CMH',
  'kansas city': 'MCI',
  'milwaukee': 'MKE',
  'memphis': 'MEM',
  'sacramento': 'SMF',
  'san jose': 'SJC',
  'san antonio': 'SAT',
  'jacksonville': 'JAX',
  'omaha': 'OMA',
  'oklahoma city': 'OKC',
  'louisville': 'SDF',
  'richmond': 'RIC',
  'honolulu': 'HNL',
  'anchorage': 'ANC',

  // CANADÁ
  'toronto': 'YYZ',
  'montreal': 'YUL',
  'vancouver': 'YVR',
  'calgary': 'YYC',
  'ottawa': 'YOW',
  'edmonton': 'YEG',
  'winnipeg': 'YWG',
  'quebec': 'YQB', 'québec': 'YQB',
  'halifax': 'YHZ',
  'victoria': 'YYJ',

  // EUROPA
  'madrid': 'MAD',
  'barcelona': 'BCN',
  'sevilla': 'SVQ',
  'valencia': 'VLC',
  'malaga': 'AGP', 'málaga': 'AGP',
  'bilbao': 'BIO',
  'palma': 'PMI',
  'alicante': 'ALC',
  'ibiza': 'IBZ',
  'santiago de compostela': 'SCQ',
  'vigo': 'VGO',
  'granada': 'GRX',
  'tenerife': 'TFN',
  'gran canaria': 'LPA',

  'paris': 'CDG', 'parís': 'CDG',
  'lyon': 'LYS',
  'marsella': 'MRS',
  'niza': 'NCE',
  'toulouse': 'TLS',
  'burdeos': 'BOD',

  'londres': 'LHR', 'london': 'LHR',
  'manchester': 'MAN',
  'edimburgo': 'EDI',
  'glasgow': 'GLA',
  'birmingham': 'BHX',
  'liverpool': 'LPL',

  'roma': 'FCO',
  'milan': 'MXP', 'milán': 'MXP',
  'venecia': 'VCE',
  'florencia': 'FLR',
  'napoles': 'NAP', 'nápoles': 'NAP',
  'palermo': 'PMO',
  'bolonia': 'BLQ',
  'pisa': 'PSA',
  'turin': 'TRN', 'turín': 'TRN',
  'catania': 'CTA',

  'berlin': 'BER', 'berlín': 'BER',
  'munich': 'MUC', 'múnich': 'MUC',
  'frankfurt': 'FRA',
  'hamburgo': 'HAM',
  'dusseldorf': 'DUS',
  'colonia': 'CGN',
  'stuttgart': 'STR',
  'hannover': 'HAJ',
  'nuremberg': 'NUE',

  'amsterdam': 'AMS',
  'rotterdam': 'RTM',

  'bruselas': 'BRU',

  'zurich': 'ZRH',
  'ginebra': 'GVA',

  'viena': 'VIE',

  'praga': 'PRG',

  'varsovia': 'WAW',
  'cracovia': 'KRK',

  'budapest': 'BUD',

  'atenas': 'ATH',

  'estambul': 'IST',

  'moscu': 'SVO', 'moscú': 'SVO',
  'san petersburgo': 'LED',

  'lisboa': 'LIS',
  'oporto': 'OPO',
  'faro': 'FAO',

  'copenhague': 'CPH',
  'estocolmo': 'ARN',
  'oslo': 'OSL',
  'helsinki': 'HEL',
  'reikiavik': 'KEF',

  'dublin': 'DUB', 'dublín': 'DUB',

  // ASIA
  'tokio': 'NRT',
  'osaka': 'KIX',
  'kioto': 'ITM',
  'seul': 'ICN',
  'beijing': 'PEK',
  'shanghai': 'PVG',
  'hong kong': 'HKG',
  'guangzhou': 'CAN',
  'shenzhen': 'SZX',
  'bangkok': 'BKK',
  'phuket': 'HKT',
  'chiang mai': 'CNX',
  'singapur': 'SIN',
  'kuala lumpur': 'KUL',
  'manila': 'MNL',
  'jakarta': 'CGK',
  'bali': 'DPS',
  'hanoi': 'HAN',
  'ho chi minh': 'SGN',
  'dubai': 'DXB',
  'abu dhabi': 'AUH',
  'doha': 'DOH',
  'delhi': 'DEL',
  'mumbai': 'BOM',
  'bangalore': 'BLR',

  // OCEANÍA
  'sydney': 'SYD',
  'melbourne': 'MEL',
  'brisbane': 'BNE',
  'perth': 'PER',
  'adelaida': 'ADL',
  'auckland': 'AKL',
  'wellington': 'WLG',
  'queenstown': 'ZQN',
  'christchurch': 'CHC',

  // ÁFRICA
  'ciudad del cabo': 'CPT',
  'johannesburgo': 'JNB',
  'el cairo': 'CAI',
  'casablanca': 'CMN',
  'marrakech': 'RAK',
  'nairobi': 'NBO',
  'addis abeba': 'ADD',
  'lagos': 'LOS',
  'dar es salaam': 'DAR',
  'mauricio': 'MRU',
  'seychelles': 'SEZ',
  'zanzibar': 'ZNZ'
};

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

/**
 * Convierte nombre de ciudad a código IATA
 * @param {string} ciudad - Nombre de la ciudad
 * @returns {string|null} - Código IATA o null
 */
export function obtenerCodigoIATA(ciudad) {
  if (!ciudad) return null;
  const normalizado = ciudad.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return CODIGOS_IATA[normalizado] || null;
}

/**
 * Determina el tipo de destino para calcular fees
 * @param {string} origen - Código IATA origen
 * @param {string} destino - Código IATA destino
 * @returns {'NACIONAL'|'SUDAMERICA'|'INTERNACIONAL'}
 */
export function determinarTipoDestino(origen, destino) {
  if (CIUDADES_PERU.includes(origen) && CIUDADES_PERU.includes(destino)) {
    return 'NACIONAL';
  }
  if (CIUDADES_SUDAMERICA.includes(destino)) {
    return 'SUDAMERICA';
  }
  return 'INTERNACIONAL';
}

/**
 * Retorna el fee por persona según tipo de destino
 * @param {'NACIONAL'|'SUDAMERICA'|'INTERNACIONAL'} tipoDestino
 * @returns {number} Fee en USD
 */
export function calcularFee(tipoDestino) {
  return FEES[tipoDestino] || FEES.INTERNACIONAL;
}

// ============================================
// EXTRAER INFO DE UN VUELO (parsear respuesta)
// ============================================

/**
 * Parsea un objeto de vuelo crudo de Costamar
 * @param {object} vuelo - Objeto vuelo de la API
 * @returns {object} Info del vuelo normalizada
 */
export function extraerInfoVuelo(vuelo) {
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

  // Precio
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

  // Itinerario
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
// ============================================

/**
 * Busca vuelos en la API de Costamar
 * 
 * @param {string} origen       - Código IATA origen (ej: "LIM")
 * @param {string} destino      - Código IATA destino (ej: "CUZ")
 * @param {string} fechaIda     - Fecha formato "YYYYMMDD" (ej: "20260315")
 * @param {string|null} fechaVuelta - Fecha vuelta "YYYYMMDD" o null para solo ida
 * @param {number} adultos      - Cantidad de adultos (default 1)
 * @param {number} ninos        - Cantidad de niños (default 0)
 * @param {number} infantes     - Cantidad de infantes (default 0)
 * @returns {Promise<Array>}    - Array de vuelos crudos de Costamar
 */
export async function cotizarEnCostamar(origen, destino, fechaIda, fechaVuelta = null, adultos = 1, ninos = 0, infantes = 0) {
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

  const response = await fetch('https://costamar.com.pe/vuelos/api/flights/search', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': 'https://booking.clickandbook.com',
      'Referer': 'https://booking.clickandbook.com/'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Costamar HTTP ${response.status}`);
  }

  const data = await response.json();
  return data?.data || [];
}

// ============================================
// FUNCIÓN COMPLETA: COTIZAR CON FEES
// ============================================

/**
 * Cotiza vuelos y aplica fees + conversión de moneda
 * 
 * @param {object} params
 * @param {string} params.origen       - Código IATA origen
 * @param {string} params.destino      - Código IATA destino
 * @param {string} params.fechaIda     - "YYYYMMDD"
 * @param {string|null} params.fechaVuelta - "YYYYMMDD" o null
 * @param {number} params.adultos      - (default 1)
 * @param {number} params.ninos        - (default 0)
 * @param {number} params.infantes     - (default 0)
 * @param {number} params.maxResultados - Máximo de vuelos a devolver (default 5)
 * @returns {Promise<object>} Resultado con vuelos procesados
 */
export async function cotizarConFees({
  origen,
  destino,
  fechaIda,
  fechaVuelta = null,
  adultos = 1,
  ninos = 0,
  infantes = 0,
  maxResultados = 5
}) {
  // 1. Buscar vuelos
  const vuelosRaw = await cotizarEnCostamar(
    origen, destino, fechaIda, fechaVuelta, adultos, ninos, infantes
  );

  if (!vuelosRaw || vuelosRaw.length === 0) {
    return { success: false, error: 'No hay vuelos disponibles', vuelos: [] };
  }

  // 2. Calcular fees
  const tipoDestino = determinarTipoDestino(origen, destino);
  const feePorPersona = calcularFee(tipoDestino);
  const esNacional = tipoDestino === 'NACIONAL';
  const totalPasajeros = adultos + ninos + infantes;
  const feeTotal = feePorPersona * totalPasajeros;

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
