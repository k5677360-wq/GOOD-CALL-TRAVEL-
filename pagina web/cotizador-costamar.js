// ============================================================
// GOOD CALL TRAVEL — cotizador-costamar.js
// Conector entre resultados.html y el backend Flask (backend.py)
// Expone: window.CotizadorCostamar.cotizarConFees({ origen, destino, fechaIda, adultos })
// ============================================================

(function () {

    // URL del backend Flask. Si lo corres en otro puerto cámbialo aquí.
    const BACKEND_URL = 'http://localhost:5000';

    // Fee de servicio de Good Call Travel (15%)
    const FEE_PORCENTAJE = 0.15;

    /**
     * Llama al endpoint /api/search del backend y devuelve los vuelos
     * ya formateados con el fee incluido.
     *
     * @param {Object} params
     * @param {string} params.origen    - Código IATA (ej: "LIM")
     * @param {string} params.destino   - Código IATA (ej: "CUZ")
     * @param {string} params.fechaIda  - Formato YYYYMMDD (ej: "20260220")
     * @param {number} params.adultos   - Número de adultos (default: 1)
     * @returns {Promise<{success: boolean, vuelos?: Array, error?: string}>}
     */
    async function cotizarConFees({ origen, destino, fechaIda, adultos = 1 }) {

        // Convertir fecha de YYYYMMDD a YYYY-MM-DD que espera el backend
        const fechaFormateada = fechaIda.length === 8
            ? `${fechaIda.substring(0, 4)}-${fechaIda.substring(4, 6)}-${fechaIda.substring(6, 8)}`
            : fechaIda;

        const payload = {
            origin: origen,
            destination: destino,
            departDate: fechaFormateada,
            returnDate: null,
            tripType: 'oneway',
            passengers: {
                adults: adultos,
                children: 0,
                infants: 0
            }
        };

        console.log('[CotizadorCostamar] Llamando al backend:', payload);

        const response = await fetch(`${BACKEND_URL}/api/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Backend respondió ${response.status}: ${text}`);
        }

        const data = await response.json();

        if (!data.success) {
            return { success: false, error: data.error || 'Error desconocido del servidor' };
        }

        // Normalizar vuelos: el backend devuelve el formato de backend.py (_format_flight)
        // Los mapeamos al formato que espera resultados.js
        const vuelosNormalizados = (data.outbound || []).map(v => aplicarFee(v));

        if (vuelosNormalizados.length === 0) {
            return { success: true, vuelos: [] };
        }

        return { success: true, vuelos: vuelosNormalizados };
    }

    /**
     * Aplica el fee de servicio al vuelo y adapta los campos al formato
     * que usa resultados.js para renderizar las cards.
     */
    function aplicarFee(vuelo) {
        const precioBase = parseFloat(vuelo.price || 0);
        const fee = precioBase * FEE_PORCENTAJE;
        const precioFinal = precioBase + fee;

        return {
            // Campos propios del backend (_format_flight en backend.py)
            aerolinea:       vuelo.airline    || 'N/A',
            numero_vuelo:    vuelo.flightNumber || vuelo.id || 'N/A',
            hora_salida:     vuelo.departTime  || 'N/A',
            hora_llegada:    vuelo.arrivalTime || 'N/A',
            duracion:        formatDuracion(vuelo.duration),
            escalas:         vuelo.stops       || 0,
            escalas_texto:   vuelo.isDirect ? 'Directo' : `${vuelo.stops || 1} escala${vuelo.stops > 1 ? 's' : ''}`,
            clase:           vuelo.fareClass   || 'Economy',
            equipaje_bodega: vuelo.checkedBaggage || 'No especificado',
            equipaje_mano:   vuelo.handBaggage    || 'No especificado',
            personal_item:   vuelo.personalItem   || 'Incluido (bolso/mochila)',

            // Precios
            precio:          precioBase,
            precio_base:     precioBase,
            fee_por_persona: fee,
            precio_final:    precioFinal,
            moneda:          'USD',
        };
    }

    /**
     * Convierte duración en minutos (número) a texto "Xh Ym"
     */
    function formatDuracion(minutos) {
        if (!minutos && minutos !== 0) return 'N/A';
        const min = parseInt(minutos, 10);
        if (isNaN(min)) return 'N/A';
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${h}h ${m}m`;
    }

    // Exponer en window para que resultados.js pueda usarlo
    window.CotizadorCostamar = {
        cotizarConFees,
        BACKEND_URL,
        FEE_PORCENTAJE
    };

    console.log('[CotizadorCostamar] ✅ Módulo cargado. Backend:', BACKEND_URL);

})();
