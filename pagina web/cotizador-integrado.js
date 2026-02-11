// ============================================
// COTIZADOR INTEGRADO - Good Call Travel
// Combina API de Costamar con lógica de paquetes
// ============================================

// Importar funciones de Costamar
import { 
    obtenerCodigoIATA, 
    cotizarConFees,
    determinarTipoDestino 
} from './cotizador-costamar__1_.js';

// ============================================
// BASE DE DATOS DE DESTINOS CON PAQUETES
// ============================================
const paquetesDestinos = {
    'Machu Picchu, Perú': { 
        codigoIATA: 'CUZ',
        paqueteBase: 450, // Precio del paquete SIN vuelo
        region: 'América del Sur', 
        category: 'Aventura',
        nights: 4,
        includes: ['Hotel 4★', 'Tours guiados', 'Tren panorámico', 'Desayunos']
    },
    'Cusco, Perú': { 
        codigoIATA: 'CUZ',
        paqueteBase: 450,
        region: 'América del Sur', 
        category: 'Aventura',
        nights: 4,
        includes: ['Hotel 4★', 'Tours guiados', 'Tren panorámico', 'Desayunos']
    },
    'Arequipa, Perú': { 
        codigoIATA: 'AQP',
        paqueteBase: 380,
        region: 'América del Sur', 
        category: 'Cultural',
        nights: 3,
        includes: ['Hotel 3★', 'City tour', 'Monasterio Santa Catalina', 'Desayunos']
    },
    'Iquitos, Perú': { 
        codigoIATA: 'IQT',
        paqueteBase: 550,
        region: 'América del Sur', 
        category: 'Aventura',
        nights: 4,
        includes: ['Lodge amazónico', 'Tours selva', 'Excursiones río', 'Pensión completa']
    },
    'Puno, Perú': { 
        codigoIATA: 'JUL',
        paqueteBase: 320,
        region: 'América del Sur', 
        category: 'Cultural',
        nights: 3,
        includes: ['Hotel 3★', 'Islas flotantes', 'Lago Titicaca', 'Desayunos']
    },
    'Santorini, Grecia': { 
        codigoIATA: 'JTR',
        paqueteBase: 800,
        region: 'Europa', 
        category: 'Premium',
        nights: 6,
        includes: ['Hotel boutique', 'Tour de vinos', 'Crucero sunset', 'Media pensión']
    },
    'Maldivas': { 
        codigoIATA: 'MLE',
        paqueteBase: 1200,
        region: 'Asia', 
        category: 'Playa',
        nights: 5,
        includes: ['Villa overwater', 'All-inclusive', 'Spa', 'Deportes acuáticos']
    },
    'Tokio, Japón': { 
        codigoIATA: 'NRT',
        paqueteBase: 900,
        region: 'Asia', 
        category: 'Cultural',
        nights: 7,
        includes: ['Hotel 4★', 'JR Pass', 'Ceremonia del té', 'Guía bilingüe']
    },
    'París, Francia': { 
        codigoIATA: 'CDG',
        paqueteBase: 650,
        region: 'Europa', 
        category: 'Romance',
        nights: 5,
        includes: ['Hotel Le Marais', 'Tours museos', 'Cena Torre Eiffel', 'Desayunos']
    },
    'Roma, Italia': { 
        codigoIATA: 'FCO',
        paqueteBase: 580,
        region: 'Europa', 
        category: 'Cultural',
        nights: 5,
        includes: ['Hotel centro', 'Coliseo VIP', 'Vaticano tour', 'Cooking class']
    },
    'Londres, Inglaterra': { 
        codigoIATA: 'LHR',
        paqueteBase: 720,
        region: 'Europa', 
        category: 'Cultural',
        nights: 5,
        includes: ['Hotel zona 1', 'British Museum', 'London Eye', 'West End show']
    },
    'Nueva York, USA': { 
        codigoIATA: 'JFK',
        paqueteBase: 850,
        region: 'América del Norte', 
        category: 'Ciudad',
        nights: 6,
        includes: ['Hotel Manhattan', 'City Pass', 'Broadway show', 'Tours']
    },
    'Bali, Indonesia': { 
        codigoIATA: 'DPS',
        paqueteBase: 600,
        region: 'Asia', 
        category: 'Wellness',
        nights: 6,
        includes: ['Villa privada', 'Retiro yoga', 'Spa ilimitado', 'Tours espirituales']
    },
    'Dubai, EAU': { 
        codigoIATA: 'DXB',
        paqueteBase: 950,
        region: 'Medio Oriente', 
        category: 'Lujo',
        nights: 5,
        includes: ['Hotel 5★', 'Desert safari', 'Burj Khalifa', 'Compras']
    }
};

// ============================================
// FUNCIONES DE CÁLCULO
// ============================================

/**
 * Verifica si es temporada alta
 */
function esTemporadaAlta(fechaString) {
    const fecha = new Date(fechaString);
    const mes = fecha.getMonth() + 1;
    // Temporada alta: Jun-Ago, Dic-Ene
    return (mes >= 6 && mes <= 8) || mes === 12 || mes === 1;
}

/**
 * Calcula descuento por grupo
 */
function calcularDescuentoGrupo(viajeros) {
    const num = parseInt(viajeros);
    if (num >= 5) return { tasa: 0.15, etiqueta: '15% descuento grupo grande (5+ personas)' };
    if (num >= 4) return { tasa: 0.10, etiqueta: '10% descuento grupo (4 personas)' };
    if (num >= 3) return { tasa: 0.05, etiqueta: '5% descuento grupo (3 personas)' };
    return { tasa: 0, etiqueta: 'Sin descuento por grupo' };
}

/**
 * Calcula días hasta el viaje
 */
function diasHastaViaje(fechaString) {
    const fechaViaje = new Date(fechaString);
    const hoy = new Date();
    const difTiempo = fechaViaje - hoy;
    const difDias = Math.ceil(difTiempo / (1000 * 60 * 60 * 24));
    return difDias;
}

/**
 * Convierte fecha YYYY-MM-DD a YYYYMMDD para Costamar
 */
function convertirFechaCostamar(fecha) {
    return fecha.replace(/-/g, '');
}

// ============================================
// FUNCIÓN PRINCIPAL DE COTIZACIÓN INTEGRADA
// ============================================

/**
 * Cotiza un paquete completo usando API real de Costamar + paquete terrestre
 * 
 * @param {object} params
 * @param {string} params.origen - Ciudad de origen (ej: "Lima, Perú")
 * @param {string} params.destino - Ciudad destino (debe estar en paquetesDestinos)
 * @param {string} params.fechaIda - Fecha ida YYYY-MM-DD
 * @param {string} params.fechaVuelta - Fecha vuelta YYYY-MM-DD (opcional)
 * @param {number} params.viajeros - Número de viajeros
 * @returns {Promise<object>} Cotización completa
 */
export async function cotizarPaqueteCompleto({
    origen,
    destino,
    fechaIda,
    fechaVuelta = null,
    viajeros = 1
}) {
    try {
        // 1. Verificar que el destino existe en nuestra base de datos
        const paquete = paquetesDestinos[destino];
        if (!paquete) {
            return {
                success: false,
                error: `Destino "${destino}" no disponible en nuestros paquetes`,
                destinosDisponibles: Object.keys(paquetesDestinos)
            };
        }

        // 2. Obtener códigos IATA
        const codigoOrigen = obtenerCodigoIATA(origen) || 'LIM'; // Default Lima
        const codigoDestino = paquete.codigoIATA;

        if (!codigoOrigen) {
            return {
                success: false,
                error: `No se pudo determinar el código de aeropuerto para "${origen}"`
            };
        }

        // 3. Convertir fechas al formato de Costamar (YYYYMMDD)
        const fechaIdaCostamar = convertirFechaCostamar(fechaIda);
        const fechaVueltaCostamar = fechaVuelta ? convertirFechaCostamar(fechaVuelta) : null;

        // 4. Consultar API de Costamar para obtener vuelos reales
        console.log('🔍 Buscando vuelos reales en Costamar...');
        const resultadoVuelos = await cotizarConFees({
            origen: codigoOrigen,
            destino: codigoDestino,
            fechaIda: fechaIdaCostamar,
            fechaVuelta: fechaVueltaCostamar,
            adultos: viajeros,
            ninos: 0,
            infantes: 0,
            maxResultados: 3
        });

        if (!resultadoVuelos.success || resultadoVuelos.vuelos.length === 0) {
            return {
                success: false,
                error: 'No se encontraron vuelos disponibles para estas fechas',
                detalles: resultadoVuelos.error
            };
        }

        // 5. Tomar el vuelo más económico
        const vueloSeleccionado = resultadoVuelos.vuelos[0];
        const precioVuelo = vueloSeleccionado.precio_final;
        const monedaVuelo = vueloSeleccionado.moneda_final;

        // 6. Calcular precio del paquete terrestre
        const precioPaqueteBase = paquete.paqueteBase * viajeros;

        // 7. Ajuste por temporada
        const temporadaAlta = esTemporadaAlta(fechaIda);
        const multiplicadorTemporada = temporadaAlta ? 1.25 : 0.90;
        const ajusteTemporada = precioPaqueteBase * (multiplicadorTemporada - 1);

        // 8. Subtotal antes de descuentos
        let subtotal = precioVuelo + precioPaqueteBase + ajusteTemporada;

        // 9. Descuento por reserva anticipada
        const diasAnticipacion = diasHastaViaje(fechaIda);
        let descuentoAnticipado = 0;
        let etiquetaAnticipado = 'Sin descuento por anticipación';

        if (diasAnticipacion > 90) {
            descuentoAnticipado = subtotal * 0.10;
            etiquetaAnticipado = '10% descuento reserva anticipada (+90 días)';
        } else if (diasAnticipacion > 60) {
            descuentoAnticipado = subtotal * 0.05;
            etiquetaAnticipado = '5% descuento reserva anticipada (+60 días)';
        }

        // 10. Descuento por grupo
        const descuentoGrupo = calcularDescuentoGrupo(viajeros);
        const montoDescuentoGrupo = subtotal * descuentoGrupo.tasa;

        // 11. Calcular precio final
        const totalDescuentos = descuentoAnticipado + montoDescuentoGrupo;
        const precioFinalPorPersona = Math.round(subtotal - totalDescuentos) / viajeros;
        const precioFinalTotal = Math.round(subtotal - totalDescuentos);

        // 12. Preparar respuesta completa
        return {
            success: true,
            
            // Información del destino
            destino: {
                nombre: destino,
                codigo: codigoDestino,
                categoria: paquete.category,
                noches: paquete.nights,
                incluye: paquete.includes
            },

            // Información del vuelo (datos reales de Costamar)
            vuelo: {
                origen: `${origen} (${codigoOrigen})`,
                destino: `${destino} (${codigoDestino})`,
                aerolinea: vueloSeleccionado.aerolinea,
                precio: precioVuelo,
                moneda: monedaVuelo,
                duracion: vueloSeleccionado.duracion,
                escalas: vueloSeleccionado.escalas,
                horaSalida: vueloSeleccionado.hora_salida,
                horaLlegada: vueloSeleccionado.hora_llegada,
                equipaje: vueloSeleccionado.equipaje,
                tipoDestino: vueloSeleccionado.tipo_destino,
                feePorPersona: vueloSeleccionado.fee_por_persona,
                feeTotal: vueloSeleccionado.fee_total
            },

            // Desglose de precios
            desglose: {
                precioVuelo: Math.round(precioVuelo),
                precioPaquete: Math.round(precioPaqueteBase),
                ajusteTemporada: Math.round(ajusteTemporada),
                etiquetaTemporada: temporadaAlta ? 'Temporada Alta (+25%)' : 'Temporada Baja (-10%)',
                subtotal: Math.round(subtotal),
                descuentoAnticipado: Math.round(descuentoAnticipado),
                etiquetaAnticipado,
                descuentoGrupo: Math.round(montoDescuentoGrupo),
                etiquetaGrupo: descuentoGrupo.etiqueta,
                totalDescuentos: Math.round(totalDescuentos)
            },

            // Precio final
            precio: {
                porPersona: Math.round(precioFinalPorPersona),
                total: precioFinalTotal,
                moneda: monedaVuelo,
                viajeros: viajeros
            },

            // Vuelos alternativos (para que el usuario pueda comparar)
            vuelosAlternativos: resultadoVuelos.vuelos.slice(1).map(v => ({
                aerolinea: v.aerolinea,
                precio: v.precio_final,
                duracion: v.duracion,
                escalas: v.escalas,
                horaSalida: v.hora_salida,
                equipaje: v.equipaje
            })),

            // Información adicional
            info: {
                fechaIda,
                fechaVuelta: fechaVuelta || 'Solo ida',
                diasAnticipacion,
                temporadaAlta,
                fechaCotizacion: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error('Error en cotización:', error);
        return {
            success: false,
            error: 'Error al procesar la cotización',
            detalles: error.message
        };
    }
}

// ============================================
// FUNCIÓN PARA BÚSQUEDA RÁPIDA SOLO DE VUELOS
// ============================================

/**
 * Búsqueda rápida solo de vuelos (sin paquete terrestre)
 */
export async function cotizarSoloVuelos({
    origen,
    destino,
    fechaIda,
    fechaVuelta = null,
    viajeros = 1
}) {
    try {
        const codigoOrigen = obtenerCodigoIATA(origen);
        const codigoDestino = obtenerCodigoIATA(destino);

        if (!codigoOrigen || !codigoDestino) {
            return {
                success: false,
                error: 'No se pudieron determinar los códigos de aeropuerto'
            };
        }

        const fechaIdaCostamar = convertirFechaCostamar(fechaIda);
        const fechaVueltaCostamar = fechaVuelta ? convertirFechaCostamar(fechaVuelta) : null;

        const resultado = await cotizarConFees({
            origen: codigoOrigen,
            destino: codigoDestino,
            fechaIda: fechaIdaCostamar,
            fechaVuelta: fechaVueltaCostamar,
            adultos: viajeros,
            maxResultados: 5
        });

        return resultado;

    } catch (error) {
        return {
            success: false,
            error: 'Error al buscar vuelos',
            detalles: error.message
        };
    }
}

// ============================================
// EXPORTAR FUNCIONES Y DATOS
// ============================================

export {
    paquetesDestinos,
    esTemporadaAlta,
    calcularDescuentoGrupo,
    obtenerCodigoIATA
};
