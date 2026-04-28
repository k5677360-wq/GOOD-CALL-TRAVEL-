// =====================================================
// GOOD CALL TRAVEL - Resultados de Búsqueda (API REAL)
// =====================================================

// TU NÚMERO DE WHATSAPP
const WHATSAPP_NUMERO = '51983894837';

// ⚠️ IMPORTANTE: Pon aquí la URL exacta de tu API de Python en Render
const RENDER_API_URL = 'https://TU-APP.onrender.com/buscar'; 

let vuelosOriginales = [];
let parametrosBusqueda = {};

// Nombres solo para mostrar en la interfaz
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

const CODIGOS_AEROLINEA = {
    'LATAM Airlines': 'LA', 'Sky Airline': 'H2', 'JetSmart': 'JF', 
    'JetSmart Airlines': 'JF', 'Jetsmart': 'JF', 'Viva Air': 'VV', 
    'Avianca': 'AV', 'American Airlines': 'AA', 'Copa Airlines': 'CM', 
    'Iberia': 'IB', 'Air France': 'AF', 'KLM': 'KL', 'United Airlines': 'UA', 'Delta': 'DL',
};

function obtenerLogoAerolinea(nombreAerolinea) {
    const codigo = CODIGOS_AEROLINEA[nombreAerolinea];
    return codigo ? `https://pics.avs.io/100/100/${codigo}.png` : null;
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    leerParametrosURL();
    mostrarResumenBusqueda();
    buscarVuelos();
    configurarOrdenamiento();
    configurarFormularioNuevo();
});

// ==================== LEER URL ====================
function leerParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // El index.html ahora manda el IATA directo en 'origen' y 'destino'
    const origen = urlParams.get('origen');
    const destino = urlParams.get('destino');
    const fechaRaw = urlParams.get('fecha');
    const pasajeros = parseInt(urlParams.get('pasajeros')) || 1;

    if (!origen || !destino || !fechaRaw) {
        mostrarError('Parámetros de búsqueda inválidos. Por favor vuelve al inicio.');
        return;
    }

    const fecha = fechaRaw.replace(/-/g, '');
    parametrosBusqueda = { origen, destino, fecha, pasajeros };
}

// ==================== RESUMEN ====================
function mostrarResumenBusqueda() {
    if (!parametrosBusqueda.origen) return;
    const nombreOrigen = localStorage.getItem('nombreOrigen') || nombresCiudades[parametrosBusqueda.origen] || parametrosBusqueda.origen;
    const nombreDestino = localStorage.getItem('nombreDestino') || nombresCiudades[parametrosBusqueda.destino] || parametrosBusqueda.destino;
    
    const fecha = parametrosBusqueda.fecha.toString();
    if (fecha.length === 8) {
        const fechaObj = new Date(fecha.substring(0,4), parseInt(fecha.substring(4,6))-1, fecha.substring(6,8));
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('fechaViaje').textContent = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    }

    document.getElementById('ciudadOrigen').textContent = nombreOrigen;
    document.getElementById('ciudadDestino').textContent = nombreDestino;
    document.getElementById('numPasajeros').textContent = `${parametrosBusqueda.pasajeros} ${parametrosBusqueda.pasajeros === 1 ? 'pasajero' : 'pasajeros'}`;
}

// ==================== BUSCAR VUELOS (API EN RENDER) ====================
async function buscarVuelos() {
    try {
        mostrarLoading();
        console.log("Buscando vuelos en API Render:", parametrosBusqueda);

        const response = await fetch(RENDER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                origen: parametrosBusqueda.origen,
                destino: parametrosBusqueda.destino,
                fecha_ida: parametrosBusqueda.fecha,
                adultos: parametrosBusqueda.pasajeros,
                ninos: 0,
                infantes: 0
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Se asume que tu API devuelve una lista [] o { data: [] }
        const data = await response.json(); 
        const vuelos = data.data || data; // Ajusta esto según lo que devuelva tu Python

        if (vuelos && vuelos.length > 0) {
            vuelosOriginales = vuelos;
            mostrarResultados(vuelos);
        } else {
            mostrarSinResultados();
        }

    } catch (error) {
        console.error("Error en el fetch:", error);
        let msg = 'Error al conectar con el servidor.';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            msg = '🔌 No se pudo conectar. Asegúrate de que tu API de Render esté activa y configurada (CORS).';
        }
        mostrarError(msg);
    }
}

// ==================== ESTADOS DE UI ====================
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
    
    if (!document.querySelector('.fecha-selector-wrap')) {
        renderizarSelectorFechas();
    }
    renderizarVuelos(vuelos);
}

// ==================== RENDERIZAR VUELOS ====================
function renderizarVuelos(vuelos) {
    const container = document.getElementById('vuelosContainer');
    if (!vuelos || vuelos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#64748b;padding:40px">No hay vuelos disponibles</p>';
        return;
    }
    container.innerHTML = vuelos.map((vuelo, index) => crearCardVuelo(vuelo, index)).join('');
}

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
       ${esMejor ? '<div class="best-badge-wrap"><span class="badge-recomendado">Recomendado</span><span class="badge-economico">Más económico</span></div>' : ''}
        
        <div class="card-main">
            <div class="airline-col">
                <div class="airline-logo-wrap">
                    ${logoUrl ? `<img class="airline-logo" src="${logoUrl}" alt="${vuelo.aerolinea}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
                    <div class="airline-logo-fallback" ${logoUrl ? 'style="display:none"' : ''}>${initiales}</div>
                </div>
                <div class="airline-name">${vuelo.aerolinea || 'Aerolínea'}</div>
                <div class="flight-number">${vuelo.numero_vuelo || ''}</div>
            </div>
            
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
            
            <div class="precio-col">
                <div class="precio-moneda">USD</div>
                <div class="precio-valor">$${precioUSD.toFixed(2)}</div>
                <div class="precio-persona">por persona</div>
                <button class="btn-reservar" onclick="reservar(${index})">Reservar ahora →</button>
            </div>
        </div>
        
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
        
        <div class="card-toggle">
            <button class="btn-toggle-detalle" onclick="toggleDetalles(${index})">
                <svg class="toggle-icon" id="icon-${index}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                Ver detalles del vuelo y precios
            </button>
            ${pasajeros > 1 ? `<span style="font-size:.82rem;color:#64748b;font-weight:600">Total ${pasajeros} personas: <strong style="color:#1a3a6c">$${totalGrupoUSD.toFixed(2)}</strong></span>` : ''}
        </div>
        
        <div class="card-detalles" id="detalles-${index}">
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
            
            <div class="detalle-seccion">
                <div class="detalle-titulo">Equipaje incluido</div>
                <div class="detalle-fila">
                    <span class="detalle-label">Bolso personal</span>
                    <span class="detalle-valor" style="color:${eqPersonalIncluido ? '#16a34a' : '#dc2626'}">${eqPersonal}</span>
                </div>
                <div class="detalle-fila">
                   <span class="detalle-label">Equipaje de mano</span>
                    <span class="detalle-valor" style="color:${eqManoIncluido ? '#16a34a' : '#dc2626'}">${eqMano}</span>
                </div>
                <div class="detalle-fila">
                    <span class="detalle-label">Maleta de bodega</span>
                    <span class="detalle-valor" style="color:${eqBodegaIncluido ? '#16a34a' : '#dc2626'}">${eqBodega}</span>
                </div>
                
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
                        <button class="btn-add-maleta" id="maleta-btn-${index}" onclick="agregarMaleta(${index})">+ Agregar</button>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="detalle-seccion">
                <div class="detalle-titulo">Desglose de precios</div>
                <div class="detalle-fila">
                    <span class="detalle-label">Precio base vuelo</span>
                    <span class="detalle-valor">$${precioBaseUSD.toFixed(2)}</span>
                </div>
                ${feeUSD > 0 ? `
                <div class="detalle-fila">
                    <span class="detalle-label">Fee de servicio</span>
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

function toggleDetalles(index) {
    const panel = document.getElementById(`detalles-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    panel.classList.toggle('open');
    icon.classList.toggle('open');
}

// ==================== INTERACCIONES ====================
function reservar(index) {
    const vuelo = vuelosOriginales[index];
    const precioFinalUSD = vuelo.precio_final || vuelo.precio;
    const origen = localStorage.getItem('nombreOrigen') || parametrosBusqueda.origen;
    const destino = localStorage.getItem('nombreDestino') || parametrosBusqueda.destino;

    const mensaje = `✈️ *Hola Good Call Travel!*\n\nQuiero reservar este vuelo:\n\n🗺️ Ruta: ${origen} → ${destino}\n✈️ Aerolínea: ${vuelo.aerolinea}\n🕐 Horario: ${vuelo.hora_salida} → ${vuelo.hora_llegada}\n📅 Fecha: ${parametrosBusqueda.fecha}\n👥 Pasajeros: ${parametrosBusqueda.pasajeros}\n💰 Precio: $${precioFinalUSD.toFixed(2)} por persona\n\n¿Me pueden confirmar disponibilidad?`;

    const linkWA = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    
    document.getElementById('waInfo').textContent = `${vuelo.aerolinea} · ${origen} → ${destino} · $${precioFinalUSD.toFixed(2)} por persona`;
    document.getElementById('waLink').href = linkWA;
    document.getElementById('waModal').style.display = 'flex';
}

function cerrarWAModal() {
    document.getElementById('waModal').style.display = 'none';
}

function agregarMaleta(index) {
    const btn = document.getElementById(`maleta-btn-${index}`);
    if (btn.classList.contains('added')) {
        btn.classList.remove('added');
        btn.textContent = '+ Agregar';
    } else {
        btn.classList.add('added');
        btn.textContent = '✓ Añadida';
    }
    reservar(index); 
}

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

// ==================== SELECTOR DE FECHAS (UI) ====================
function renderizarSelectorFechas() {
    const fecha = parametrosBusqueda.fecha; 
    if (!fecha || fecha.length !== 8) return;

    const año = parseInt(fecha.substring(0,4));
    const mes = parseInt(fecha.substring(4,6)) - 1;
    const dia = parseInt(fecha.substring(6,8));
    const fechaBase = new Date(año, mes, dia);

    const dias = [];
    for (let i = -3; i <= 10; i++) {
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
                return `<button class="fecha-btn ${esActual ? 'fecha-activa' : ''}" data-fecha="${yyyymmdd}">
                    <span class="fecha-diasem">${diasSemana[d.getDay()]}</span>
                    <span class="fecha-num">${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}</span>
                </button>`;
            }).join('')}
        </div>
        <button class="fecha-nav" id="btnFechaSiguiente">&#8250;</button>
    </div>`;

    const topbar = document.querySelector('.results-topbar');
    if (topbar) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        topbar.parentNode.insertBefore(wrapper.firstElementChild, topbar);
    }

    document.getElementById('fechaLista').addEventListener('click', function(e) {
        const btn = e.target.closest('.fecha-btn');
        if (!btn) return;
        parametrosBusqueda.fecha = btn.dataset.fecha;
        
        const url = new URL(window.location.href);
        url.searchParams.set('fecha', parametrosBusqueda.fecha);
        window.history.replaceState({}, '', url);
        
        buscarVuelos();
    });

    document.getElementById('btnFechaAnterior').addEventListener('click', () => moverFechas(-7));
    document.getElementById('btnFechaSiguiente').addEventListener('click', () => moverFechas(7));
}

function moverFechas(diasMod) {
    const fecha = parametrosBusqueda.fecha;
    const nueva = new Date(parseInt(fecha.substring(0,4)), parseInt(fecha.substring(4,6)) - 1, parseInt(fecha.substring(6,8)));
    nueva.setDate(nueva.getDate() + diasMod);
    parametrosBusqueda.fecha = `${nueva.getFullYear()}${String(nueva.getMonth()+1).padStart(2,'0')}${String(nueva.getDate()).padStart(2,'0')}`;
    
    const wrap = document.querySelector('.fecha-selector-wrap');
    if (wrap) wrap.remove();
    renderizarSelectorFechas();
    buscarVuelos();
}

// ==================== FORMULARIO MODIFICAR (Arriba) ====================
function configurarFormularioNuevo() {
    const btnToggle = document.getElementById('btnToggleSearch');
    const container = document.getElementById('searchFormContainer');
    const btnCancel = document.getElementById('btnCancelSearch');
    const form = document.getElementById('newSearchForm');
    
    if (btnToggle) btnToggle.addEventListener('click', () => container.style.display = container.style.display === 'none' ? 'block' : 'none');
    if (btnCancel) btnCancel.addEventListener('click', () => container.style.display = 'none');
    
    if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = "index.html"; // Por simplicidad, si quieren cambiar, los mandamos al inicio que ya tiene el nuevo autocompletado avanzado
    });
}
