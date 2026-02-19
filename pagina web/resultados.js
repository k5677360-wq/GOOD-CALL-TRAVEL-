// =====================================================
// GOOD CALL TRAVEL - Resultados de Búsqueda
// =====================================================

// TU NÚMERO DE WHATSAPP (cámbialo por el tuyo)
const WHATSAPP_NUMERO = '51987654321';

let vuelosOriginales = [];
let parametrosBusqueda = {};

const nombresCiudades = {
    'LIM': 'Lima', 'CUZ': 'Cusco', 'AQP': 'Arequipa', 'IQT': 'Iquitos',
    'PIU': 'Piura', 'TRU': 'Trujillo', 'CIX': 'Chiclayo', 'PCL': 'Pucallpa',
    'TPP': 'Tarapoto', 'JUL': 'Juliaca', 'TCQ': 'Tacna', 'TBP': 'Tumbes',
    'PEM': 'Puerto Maldonado', 'BOG': 'Bogotá', 'MDE': 'Medellín',
    'CLO': 'Cali', 'CTG': 'Cartagena', 'BAQ': 'Barranquilla',
    'UIO': 'Quito', 'GYE': 'Guayaquil', 'SCL': 'Santiago',
    'EZE': 'Buenos Aires', 'GRU': 'São Paulo', 'GIG': 'Rio de Janeiro',
    'MEX': 'Ciudad de México', 'CUN': 'Cancún', 'MIA': 'Miami',
    'JFK': 'Nueva York', 'LAX': 'Los Ángeles', 'MAD': 'Madrid', 'BCN': 'Barcelona'
};

// Códigos IATA de aerolíneas para logos
const CODIGOS_AEROLINEA = {
    'LATAM Airlines': 'LA',
    'Sky Airline': 'H2',
    'JetSmart': 'JA',
    'Viva Air': 'VV',
    'Avianca': 'AV',
    'American Airlines': 'AA',
    'Copa Airlines': 'CM',
    'Iberia': 'IB',
    'Air France': 'AF',
    'KLM': 'KL',
    'United Airlines': 'UA',
    'Delta': 'DL',
};

function obtenerLogoAerolinea(nombreAerolinea) {
    const codigo = CODIGOS_AEROLINEA[nombreAerolinea];
    if (codigo) {
        return `https://pics.avs.io/100/100/${codigo}.png`;
    }
    return null;
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    leerParametrosURL();
    mostrarResumenBusqueda();
    buscarVuelos();
    configurarOrdenamiento();
    configurarFormularioNuevo();
});

// ==================== SELECTOR DE FECHAS ====================
function renderizarSelectorFechas() {
    const fecha = parametrosBusqueda.fecha; // YYYYMMDD
    if (!fecha || fecha.length !== 8) return;

    const año = parseInt(fecha.substring(0,4));
    const mes = parseInt(fecha.substring(4,6)) - 1;
    const dia = parseInt(fecha.substring(6,8));
    const fechaBase = new Date(año, mes, dia);

    // Generar 7 días: 3 antes, el seleccionado, 3 después
    const dias = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date(fechaBase);
        d.setDate(d.getDate() + i);
        dias.push(d);
    }

    const diasSemana = ['dom','lun','mar','mié','jue','vie','sáb'];

    const html = `
    <div class="fecha-selector-wrap">
        <button class="fecha-nav" id="btnFechaAnterior">&#8249;</button>
        <div class="fecha-lista" id="fechaLista">
            ${dias.map(d => {
                const yyyymmdd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
                const esActual = yyyymmdd === fecha;
                const diaSem = diasSemana[d.getDay()];
                const diaNum = String(d.getDate()).padStart(2,'0');
                const mesNum = String(d.getMonth()+1).padStart(2,'0');
                return `<button class="fecha-btn ${esActual ? 'fecha-activa' : ''}" data-fecha="${yyyymmdd}">
                    <span class="fecha-diasem">${diaSem}</span>
                    <span class="fecha-num">${diaNum}/${mesNum}</span>
                </button>`;
            }).join('')}
        </div>
        <button class="fecha-nav" id="btnFechaSiguiente">&#8250;</button>
    </div>`;

    // Insertar antes de los resultados
    const topbar = document.querySelector('.results-topbar');
    if (topbar) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        topbar.parentNode.insertBefore(wrapper.firstElementChild, topbar);
    }

    // Click en fecha
    document.getElementById('fechaLista').addEventListener('click', function(e) {
        const btn = e.target.closest('.fecha-btn');
        if (!btn) return;
        const nuevaFecha = btn.dataset.fecha;
        parametrosBusqueda.fecha = nuevaFecha;
        document.querySelectorAll('.fecha-btn').forEach(b => b.classList.remove('fecha-activa'));
        btn.classList.add('fecha-activa');
        buscarVuelos();
        // Actualizar URL sin recargar
        const url = new URL(window.location.href);
        url.searchParams.set('date', `${nuevaFecha.substring(0,4)}-${nuevaFecha.substring(4,6)}-${nuevaFecha.substring(6,8)}`);
        window.history.replaceState({}, '', url);
    });

    // Navegación anterior/siguiente
    document.getElementById('btnFechaAnterior').addEventListener('click', () => moverFechas(-7));
    document.getElementById('btnFechaSiguiente').addEventListener('click', () => moverFechas(7));
}

function moverFechas(dias) {
    const fecha = parametrosBusqueda.fecha;
    const año = parseInt(fecha.substring(0,4));
    const mes = parseInt(fecha.substring(4,6)) - 1;
    const dia = parseInt(fecha.substring(6,8));
    const nueva = new Date(año, mes, dia);
    nueva.setDate(nueva.getDate() + dias);
    const nuevaStr = `${nueva.getFullYear()}${String(nueva.getMonth()+1).padStart(2,'0')}${String(nueva.getDate()).padStart(2,'0')}`;
    parametrosBusqueda.fecha = nuevaStr;
    // Re-renderizar selector
    const wrap = document.querySelector('.fecha-selector-wrap');
    if (wrap) wrap.remove();
    renderizarSelectorFechas();
    buscarVuelos();
}

// ==================== LEER URL ====================
function leerParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // Soporta parámetros en español (origen/destino/fecha) y en inglés (origin/destination/date)
    const origenRaw  = urlParams.get('origen')  || urlParams.get('origin')      || '';
    const destinoRaw = urlParams.get('destino') || urlParams.get('destination') || '';
    const fechaRaw   = urlParams.get('fecha')   || urlParams.get('date')        || '';
    const pasajeros  = parseInt(urlParams.get('pasajeros') || urlParams.get('adults')) || 1;

    // Normalizar fecha: acepta 20260220 o 2026-02-20 → siempre guarda YYYYMMDD
    const fecha = fechaRaw.replace(/-/g, '');

    // Convertir nombre de ciudad a código IATA si llega como nombre (ej: "lima" → "LIM")
    const NOMBRE_A_IATA = {
        'lima': 'LIM', 'cusco': 'CUZ', 'cuzco': 'CUZ', 'arequipa': 'AQP',
        'iquitos': 'IQT', 'piura': 'PIU', 'trujillo': 'TRU', 'chiclayo': 'CIX',
        'tacna': 'TCQ', 'juliaca': 'JUL', 'pucallpa': 'PCL', 'tarapoto': 'TPP',
        'tumbes': 'TBP', 'puerto maldonado': 'PEM', 'bogotá': 'BOG',
        'santiago': 'SCL', 'miami': 'MIA', 'nueva york': 'JFK',
        'los ángeles': 'LAX', 'madrid': 'MAD', 'barcelona': 'BCN',
        'ciudad de méxico': 'MEX', 'cancún': 'CUN', 'buenos aires': 'EZE',
        'são paulo': 'GRU', 'rio de janeiro': 'GIG', 'quito': 'UIO', 'guayaquil': 'GYE'
    };

    const origen  = NOMBRE_A_IATA[origenRaw.toLowerCase()]  || origenRaw.toUpperCase();
    const destino = NOMBRE_A_IATA[destinoRaw.toLowerCase()] || destinoRaw.toUpperCase();

    parametrosBusqueda = { origen, destino, fecha, pasajeros };

    if (!origen || !destino || !fecha) {
        mostrarError('Parámetros de búsqueda inválidos');
    }
}
// ==================== RESUMEN ====================
function mostrarResumenBusqueda() {
    if (!parametrosBusqueda.origen) return;
    const urlParams = new URLSearchParams(window.location.search);
    const nombreOrigen = urlParams.get('nombreOrigen') || nombresCiudades[parametrosBusqueda.origen] || parametrosBusqueda.origen;
    const nombreDestino = urlParams.get('nombreDestino') || nombresCiudades[parametrosBusqueda.destino] || parametrosBusqueda.destino;
    const fecha = parametrosBusqueda.fecha.toString();
    if (fecha.length !== 8) return;
    const fechaObj = new Date(fecha.substring(0,4), parseInt(fecha.substring(4,6))-1, fecha.substring(6,8));
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('ciudadOrigen').textContent = nombreOrigen;
    document.getElementById('ciudadDestino').textContent = nombreDestino;
    document.getElementById('fechaViaje').textContent = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    document.getElementById('numPasajeros').textContent = `${parametrosBusqueda.pasajeros} ${parametrosBusqueda.pasajeros === 1 ? 'pasajero' : 'pasajeros'}`;
}

// ==================== BUSCAR VUELOS ====================
async function buscarVuelos() {
    try {
        mostrarLoading();
        if (!window.CotizadorCostamar) throw new Error('CotizadorCostamar no cargado');
        const resultado = await window.CotizadorCostamar.cotizarConFees({
            origen: parametrosBusqueda.origen,
            destino: parametrosBusqueda.destino,
            fechaIda: parametrosBusqueda.fecha,
            adultos: parametrosBusqueda.pasajeros
        });
        if (resultado.success && resultado.vuelos && resultado.vuelos.length > 0) {
            vuelosOriginales = resultado.vuelos;
            mostrarResultados(resultado.vuelos);
        } else if (resultado.success) {
            mostrarSinResultados();
        } else {
            mostrarError(resultado.error || 'No se pudieron obtener los vuelos');
        }
    } catch (error) {
        let msg = 'Error al conectar con el servidor';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            msg = '🔌 No se pudo conectar. Asegúrate de que Python (api_costamar.py) esté corriendo.';
        }
        mostrarError(msg);
    }
}

// ==================== ESTADOS ====================
function mostrarLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'none';
}
function mostrarError(msg) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('noResultsState').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('errorMessage').textContent = msg;
}
function mostrarSinResultados() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
}
function mostrarResultados(vuelos) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    document.getElementById('numVuelos').textContent = vuelos.length;
    // Renderizar selector de fechas solo la primera vez
    if (!document.querySelector('.fecha-selector-wrap')) {
        renderizarSelectorFechas();
    }
    renderizarVuelos(vuelos);
}

// ==================== RENDERIZAR ====================
function renderizarVuelos(vuelos) {
    const container = document.getElementById('vuelosContainer');
    if (!vuelos || vuelos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#64748b;padding:40px">No hay vuelos disponibles</p>';
        return;
    }
    container.innerHTML = vuelos.map((vuelo, index) => crearCardVuelo(vuelo, index)).join('');
}

// ==================== CREAR CARD PROFESIONAL ====================
function crearCardVuelo(vuelo, index) {
    const esMejor = index === 0;
    const precioUSD = vuelo.precio_final || vuelo.precio || 0;
    
    const precioBaseUSD = vuelo.precio_base || vuelo.precio || 0;
    
    const feeUSD = vuelo.fee_por_persona || 0;
    
    
    const pasajeros = parametrosBusqueda.pasajeros;
    const totalGrupoUSD = precioUSD * pasajeros;

    const logoUrl = obtenerLogoAerolinea(vuelo.aerolinea);
    const initiales = (vuelo.aerolinea || 'A').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();

    const eqBodega = vuelo.equipaje_bodega || vuelo.equipaje || 'No incluido';
    const eqMano = vuelo.equipaje_mano || 'No especificado';
    const eqPersonal = vuelo.personal_item || 'Incluido (bolso/mochila)';

    const eqBodegaIncluido = !eqBodega.toLowerCase().includes('no incluido');
    const eqManoIncluido = !eqMano.toLowerCase().includes('no incluido') && !eqMano.toLowerCase().includes('no especificado');
    const eqPersonalIncluido = eqPersonal.toLowerCase().includes('incluido');

    const escalasTexto = vuelo.escalas_texto || vuelo.escalas || 'Directo';
    const esDirecto = escalasTexto.toLowerCase().includes('directo');

    return `
    <div class="vuelo-card" id="card-${index}">
       ${esMejor ? '<div class="best-badge">★ Mejor precio disponible</div>' : ''}
        <!-- FILA PRINCIPAL -->
        <div class="card-main">
            
            <!-- AEROLÍNEA -->
            <div class="airline-col">
                <div class="airline-logo-wrap">
                    ${logoUrl 
                        ? `<img class="airline-logo" src="${logoUrl}" alt="${vuelo.aerolinea}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
                        : ''
                    }
                    <div class="airline-logo-fallback" ${logoUrl ? 'style="display:none"' : ''}>${initiales}</div>
                </div>
                <div class="airline-name">${vuelo.aerolinea || 'Aerolínea'}</div>
                <div class="flight-number">${vuelo.numero_vuelo || ''}</div>
            </div>
            
            <!-- HORARIO -->
            <div class="horario-col">
                <div class="time-block">
                    <div class="hora">${vuelo.hora_salida || '--:--'}</div>
                    <div class="iata">${parametrosBusqueda.origen}</div>
                </div>
                
                <div class="duracion-line">
                    <div class="duracion-texto">${vuelo.duracion || '-'}</div>
                    <div class="linea-vuelo">
                        <svg class="avion-icon" width="18" height="18" viewBox="0 0 24 24" fill="#2563eb">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                    </div>
                    <span class="tipo-vuelo ${esDirecto ? 'tipo-directo' : 'tipo-escala'}">${escalasTexto}</span>
                </div>
                
                <div class="time-block">
                    <div class="hora">${vuelo.hora_llegada || '--:--'}</div>
                    <div class="iata">${parametrosBusqueda.destino}</div>
                </div>
            </div>
            
            <!-- PRECIO -->
            <div class="precio-col">
                <div class="precio-moneda">USD</div>
                <div class="precio-valor">$${precioUSD.toFixed(2)}</div>
                
                <div class="precio-persona">por persona</div>
                <button class="btn-reservar" onclick="reservar(${index})">
                    Reservar ahora →
                </button>
            </div>
        </div>
        
        <!-- EQUIPAJE RÁPIDO -->
        <div class="card-equipaje">
            <div class="equip-item ${eqPersonalIncluido ? 'equip-incluido' : 'equip-no'}">
                <span class="equip-icon">■</span>
                <span>Bolso personal: ${eqPersonalIncluido ? 'Incluido' : 'No incluido'}</span>
            </div>
            <div class="equip-item ${eqManoIncluido ? 'equip-incluido' : 'equip-no'}">
                <span class="equip-icon">■</span>
                <span>Mano: ${eqManoIncluido ? eqMano : 'No incluido'}</span>
            </div>
            <div class="equip-item ${eqBodegaIncluido ? 'equip-incluido' : 'equip-no'}">
                <span class="equip-icon">■</span>
                <span>Bodega: ${eqBodegaIncluido ? eqBodega : 'No incluido'}</span>
            </div>
        </div>
        
        <!-- TOGGLE DETALLES -->
        <div class="card-toggle">
            <button class="btn-toggle-detalle" onclick="toggleDetalles(${index})">
                <svg class="toggle-icon" id="icon-${index}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                Ver detalles del vuelo y precios
            </button>
            ${pasajeros > 1 ? `<span style="font-size:.82rem;color:#64748b;font-weight:600">Total ${pasajeros} personas: <strong style="color:#1a3a6c">$${totalGrupoUSD.toFixed(2)}</strong></span>` : ''}
        </div>
        
        <!-- PANEL DE DETALLES -->
        <div class="card-detalles" id="detalles-${index}">
            
            <!-- Info vuelo -->
            <div class="detalle-seccion">
                <div class="detalle-titulo">Información del vuelo</div>
                <div class="detalle-fila">
                    <span class="detalle-label">Aerolínea</span>
                    <span class="detalle-valor">${vuelo.aerolinea || 'N/A'}</span>
                </div>
                <div class="detalle-fila">
                    <span class="detalle-label">Vuelo</span>
                    <span class="detalle-valor">${vuelo.numero_vuelo || 'N/A'}</span>
                </div>
                <div class="detalle-fila">
                    <span class="detalle-label">Clase</span>
                    <span class="detalle-valor">${vuelo.clase || 'Economy'}</span>
                </div>
                <div class="detalle-fila">
                    <span class="detalle-label">Duración</span>
                    <span class="detalle-valor">${vuelo.duracion || 'N/A'}</span>
                </div>
                <div class="detalle-fila">
                    <span class="detalle-label">Tipo</span>
                    <span class="detalle-valor">${escalasTexto}</span>
                </div>
            </div>
            
            <!-- Equipaje detallado -->
            <div class="detalle-seccion">
                <div class="detalle-titulo">Equipaje incluido</div>
                <div class="detalle-fila">
                    <span class="detalle-label">Bolso personal</span>
                    <span class="detalle-valor" style="color:${eqPersonalIncluido ? '#16a34a' : '#dc2626'}">${eqPersonal}</span>
                </div>
                <div class="detalle-fila">
                    <span class="detalle-label">quipaje de mano</span>
                    <span class="detalle-valor" style="color:${eqManoIncluido ? '#16a34a' : '#dc2626'}">${eqMano}</span>
                </div>
                <div class="detalle-fila">
                    <span class="detalle-label">Maleta de bodega</span>
                    <span class="detalle-valor" style="color:${eqBodegaIncluido ? '#16a34a' : '#dc2626'}">${eqBodega}</span>
                </div>
                
                <!-- AGREGAR MALETA -->
                ${!eqBodegaIncluido ? `
                <div class="maleta-addon" style="margin-top:12px">
                    <div class="maleta-info">
                        <div class="maleta-icon">+</div>
                        <div>
                            <div class="maleta-titulo">Agregar maleta de bodega</div>
                            <div class="maleta-desc">23kg · Agregar al momento de reservar</div>
                        </div>
                    </div>
                    <div>
                        <div class="maleta-precio">Consultar precio</div>
                        <button class="btn-add-maleta" id="maleta-btn-${index}" onclick="agregarMaleta(${index})">
                            + Agregar
                        </button>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- Desglose precios -->
            <div class="detalle-seccion">
                <div class="detalle-titulo">Desglose de precios</div>
                <div class="detalle-fila">
                    <span class="detalle-label">Precio base vuelo</span>
                    <span class="detalle-valor">$${precioBaseUSD.toFixed(2)}</span>
                </div>
                ${feeUSD > 0 ? `
                <div class="detalle-fila">
                    <span class="detalle-label">Fee de servicio (15%)</span>
                    <span class="detalle-valor">+$${feeUSD.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="detalle-total">
                    <span class="detalle-label">Total por persona</span>
                    <span class="detalle-valor">$${precioUSD.toFixed(2)}</span>
                </div>
                ${pasajeros > 1 ? `
                <div class="detalle-total" style="margin-top:8px;background:#f0fdf4">
                    <span class="detalle-label" style="color:#16a34a">Total ${pasajeros} personas</span>
                    <span class="detalle-valor" style="color:#16a34a">$${totalGrupoUSD.toFixed(2)}</span>
                </div>
                ` : ''}
            </div>
            
        </div>
    </div>
    `;
}

// ==================== TOGGLE DETALLES ====================
function toggleDetalles(index) {
    const panel = document.getElementById(`detalles-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    const estaAbierto = panel.classList.contains('open');
    panel.classList.toggle('open');
    icon.classList.toggle('open');
}

// ==================== RESERVAR (abre modal WhatsApp) ====================
function reservar(index) {
    const vuelo = vuelosOriginales[index];
    const precioFinalUSD = vuelo.precio_final || vuelo.precio;
    const origen = nombresCiudades[parametrosBusqueda.origen] || parametrosBusqueda.origen;
    const destino = nombresCiudades[parametrosBusqueda.destino] || parametrosBusqueda.destino;

    const mensaje = `✈️ *Hola Good Call Travel!*\n\nQuiero reservar este vuelo:\n\n🗺️ Ruta: ${origen} → ${destino}\n✈️ Aerolínea: ${vuelo.aerolinea}\n🕐 Horario: ${vuelo.hora_salida} → ${vuelo.hora_llegada}\n📅 Fecha: ${parametrosBusqueda.fecha}\n👥 Pasajeros: ${parametrosBusqueda.pasajeros}\n💰 Precio: $${precioUSD.toFixed(2)} por persona\n\n¿Me pueden confirmar disponibilidad?`;

    const linkWA = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    
    document.getElementById('waInfo').textContent = `${vuelo.aerolinea} · ${origen} → ${destino} · $${precioUSD.toFixed(2)} por persona`;
    document.getElementById('waLink').href = linkWA;
    document.getElementById('waModal').style.display = 'flex';
}

function cerrarWAModal() {
    document.getElementById('waModal').style.display = 'none';
}

// ==================== AGREGAR MALETA ====================
function agregarMaleta(index) {
    const btn = document.getElementById(`maleta-btn-${index}`);
    if (btn.classList.contains('added')) {
        btn.classList.remove('added');
        btn.textContent = '+ Agregar';
    } else {
        btn.classList.add('added');
        btn.textContent = '✓ Añadida';
    }
    reservar(index); // Abre WhatsApp para que el agente confirme el precio de la maleta
}

// ==================== ORDENAMIENTO ====================
function configurarOrdenamiento() {
    const sel = document.getElementById('sortSelect');
    if (sel) sel.addEventListener('change', function() { ordenarVuelos(this.value); });
}
function ordenarVuelos(criterio) {
    let vuelos = [...vuelosOriginales];
    if (criterio === 'precio') vuelos.sort((a,b) => (a.precio_final||a.precio)-(b.precio_final||b.precio));
    else if (criterio === 'hora') vuelos.sort((a,b) => (a.hora_salida||'').localeCompare(b.hora_salida||''));
    else if (criterio === 'duracion') vuelos.sort((a,b) => parseDuracion(a.duracion)-parseDuracion(b.duracion));
    renderizarVuelos(vuelos);
}
function parseDuracion(dur) {
    if (!dur) return 999;
    const m = dur.match(/(\d+)h\s*(\d+)?m?/);
    return m ? parseInt(m[1])*60 + (parseInt(m[2])||0) : 999;
}

// ==================== FORMULARIO MODIFICAR ====================
function configurarFormularioNuevo() {
    const btnToggle = document.getElementById('btnToggleSearch');
    const btnCancel = document.getElementById('btnCancelSearch');
    const container = document.getElementById('searchFormContainer');
    const form = document.getElementById('newSearchForm');
    const dateInput = document.getElementById('newDate');

    if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    if (btnToggle) btnToggle.addEventListener('click', () => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });
    if (btnCancel) btnCancel.addEventListener('click', () => { container.style.display = 'none'; });
    if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        const origen = document.getElementById('newOrigin').value.trim();
        const destino = document.getElementById('newDestination').value.trim();
        const fecha = document.getElementById('newDate').value;
        const viajeros = document.getElementById('newTravelers').value;
        if (!origen || !destino || !fecha) { alert('Completa todos los campos'); return; }
        const co = obtenerCodigoIATA(origen);
        const cd = obtenerCodigoIATA(destino);
        if (!co || !cd) { alert('Ciudad no válida. Selecciona del menú.'); return; }
        window.location.href = `resultados.html?origen=${co}&destino=${cd}&fecha=${fecha.replace(/-/g,'')}&pasajeros=${viajeros}&nombreOrigen=${encodeURIComponent(origen)}&nombreDestino=${encodeURIComponent(destino)}`;
    });
}

function obtenerCodigoIATA(ciudad) {
    const mapa = {
        'lima': 'LIM', 'lima, perú': 'LIM', 'cusco': 'CUZ', 'cusco, perú': 'CUZ',
        'arequipa': 'AQP', 'arequipa, perú': 'AQP', 'iquitos': 'IQT', 'iquitos, perú': 'IQT',
        'piura': 'PIU', 'piura, perú': 'PIU', 'trujillo': 'TRU', 'trujillo, perú': 'TRU',
        'chiclayo': 'CIX', 'chiclayo, perú': 'CIX', 'pucallpa': 'PCL', 'tarapoto': 'TPP',
        'juliaca': 'JUL', 'tacna': 'TCQ', 'tumbes': 'TBP', 'puerto maldonado': 'PEM',
        'bogotá': 'BOG', 'bogotá, colombia': 'BOG', 'medellín': 'MDE', 'quito': 'UIO',
        'guayaquil': 'GYE', 'santiago': 'SCL', 'santiago, chile': 'SCL',
        'buenos aires': 'EZE', 'ciudad de méxico': 'MEX', 'cancún': 'CUN',
        'miami': 'MIA', 'nueva york': 'JFK', 'los ángeles': 'LAX', 'madrid': 'MAD', 'barcelona': 'BCN'
    };
    return mapa[ciudad.toLowerCase()] || null;
}