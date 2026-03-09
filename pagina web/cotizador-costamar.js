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
        'chiclayo': 'CIX'
    },
    
    // =======================================
    // LÓGICA DE FEES POR DESTINO (USD por pasajero)
    // =======================================
    // Perú → Perú = $20 | Sudamérica = $50 | Internacional/Exótico = $100
    
    IATA_PERU: [
        'LIM','CUZ','AQP','IQT','PIU','TRU','CIX','TCQ',
        'JUL','PCL','TPP','TBP','PEM','AYP','CJA','HUU','JAE','TYL'
    ],
    
    IATA_SUDAMERICA: [
        // Colombia continental (sin San Andrés)
        'BOG','MDE','CLO','CTG','BAQ',
        // Chile
        'SCL','ANF','CCP','PMC','IQQ',
        // Argentina
        'EZE','COR','MDZ','ROS','SLA','TUC','BRC','USH',
        // Ecuador
        'UIO','GYE',
        // Brasil
        'GRU','GIG','BSB','CNF','FLN','POA','SSA','REC','FOR','MAO',
        // Uruguay, Paraguay, Bolivia, Venezuela
        'MVD','ASU','CCS','VVI','LPB'
    ],
    
    // Todo lo que NO sea Perú ni Sudamérica continental = $100
    // Incluye: EEUU, Europa, México, Caribe, San Andrés (ADZ), etc.
    
    calcularFee(codigoOrigen, codigoDestino) {
        const origenEsPeru = this.IATA_PERU.includes(codigoOrigen);
        const destinoEsPeru = this.IATA_PERU.includes(codigoDestino);
        const destinoEsSudamerica = this.IATA_SUDAMERICA.includes(codigoDestino);
        
        // Vuelo local: ambos en Perú
        if (origenEsPeru && destinoEsPeru) return 20;
        
        // Vuelo a Sudamérica continental
        if (destinoEsSudamerica) return 50;
        
        // Todo lo demás: Europa, EEUU, Caribe, exóticos (San Andrés, etc.)
        return 100;
    },
    
    obtenerCodigoIATA(ciudad) {
        const ciudadLimpia = ciudad.split(',')[0].trim().toLowerCase();
        return this.CIUDADES_IATA[ciudadLimpia] || null;
    },
    
async cotizarConFees(datos) {
    try {
        console.log('📡 Consultando API Costamar...', datos);

        // Diccionario IATA → nombre (para enviar al API Python que espera nombres)
        const IATA_A_NOMBRE = {
            'LIM': 'lima', 'CUZ': 'cusco', 'AQP': 'arequipa',
            'IQT': 'iquitos', 'PIU': 'piura', 'TRU': 'trujillo',
            'CIX': 'chiclayo', 'TCQ': 'tacna', 'JUL': 'juliaca',
            'PCL': 'pucallpa', 'TPP': 'tarapoto', 'TBP': 'tumbes',
            'PEM': 'puerto maldonado', 'BOG': 'bogotá', 'SCL': 'santiago',
            'MIA': 'miami', 'JFK': 'nueva york', 'LAX': 'los ángeles',
            'MAD': 'madrid', 'BCN': 'barcelona', 'MEX': 'ciudad de méxico',
            'CUN': 'cancún', 'EZE': 'buenos aires', 'GRU': 'são paulo',
            'GIG': 'rio de janeiro', 'UIO': 'quito', 'GYE': 'guayaquil'
        };

        // datos.origen llega como código IATA (ej: "LIM"), lo convertimos al nombre
        const nombreOrigen = IATA_A_NOMBRE[datos.origen] || datos.origen;
        const nombreDestino = IATA_A_NOMBRE[datos.destino] || datos.destino;

        if (!nombreOrigen || !nombreDestino) {
            throw new Error('Código de ciudad no reconocido: ' + datos.origen + ' / ' + datos.destino);
        }

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
            
            // Calcular fee según ruta
            const fee = this.calcularFee(datos.origen, datos.destino);
            console.log(`💰 Fee aplicado: $${fee} USD por pasajero (${datos.origen} → ${datos.destino})`);
            
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
                    fee_por_persona: fee,
                    precio_final: v.precio + fee,
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
