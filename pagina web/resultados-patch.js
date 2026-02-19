// ================================================================
// GOOD CALL TRAVEL — resultados-patch.js
// Agrega: selector de fechas (date strip) + limpia emojis en cards
// Se carga DESPUÉS de resultados.js para no romper nada existente
// ================================================================

document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // 1. DATE STRIP — selector de fechas cercanas
    // ============================================================
    function inicializarDateStrip() {
        const strip     = document.getElementById('dateStrip');
        const btnPrev   = document.getElementById('datePrev');
        const btnNext   = document.getElementById('dateNext');
        if (!strip) return;

        // Fecha actual de la búsqueda
        const fechaParam = parametrosBusqueda?.fecha?.toString() || '';
        if (fechaParam.length !== 8) return;

        const anio = parseInt(fechaParam.substring(0, 4));
        const mes  = parseInt(fechaParam.substring(4, 6)) - 1;
        const dia  = parseInt(fechaParam.substring(6, 8));
        let fechaBase = new Date(anio, mes, dia);

        // Rango: 3 días antes, fecha actual, 3 días después
        let offset = 0; // desplazamiento por clic en prev/next

        function renderStrip(desplazamiento) {
            offset = desplazamiento;
            strip.innerHTML = '';
            const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
            const meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];

            for (let i = -3; i <= 3; i++) {
                const d = new Date(fechaBase);
                d.setDate(fechaBase.getDate() + i + desplazamiento);

                const esCurrent = i === 0 && desplazamiento === 0 || false;
                const esSeleccionado = (d.getFullYear() === anio && d.getMonth() === mes && d.getDate() === dia && desplazamiento === 0 && i === 0);

                // Calcular si es la fecha actualmente en la URL
                const dFecha = `${d.getFullYear()}${meses[d.getMonth()]}${String(d.getDate()).padStart(2,'0')}`;
                const esActual = dFecha === fechaParam;

                const btn = document.createElement('button');
                btn.className = 'date-chip' + (esActual ? ' date-chip--active' : '');
                btn.dataset.fecha = dFecha;

                const diaSem = dias[d.getDay()];
                const diaMes = String(d.getDate()).padStart(2, '0');
                const mesNum = meses[d.getMonth()];

                btn.innerHTML = `
                    <span class="date-chip-day">${diaSem}</span>
                    <span class="date-chip-date">${diaMes}/${mesNum}</span>
                `;

                btn.addEventListener('click', function () {
                    const nuevaFecha = this.dataset.fecha;
                    if (nuevaFecha === fechaParam) return; // misma fecha, no hacer nada

                    // Construir nueva URL conservando todos los parámetros
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.set('fecha', nuevaFecha);
                    // También actualizar el origen del parámetro 'date' si viene de index.html
                    if (urlParams.has('date')) urlParams.set('date', 
                        `${nuevaFecha.substring(0,4)}-${nuevaFecha.substring(4,6)}-${nuevaFecha.substring(6,8)}`
                    );

                    // Mostrar loading inmediatamente
                    document.getElementById('resultsContainer').style.display = 'none';
                    document.getElementById('loadingState').style.display = 'flex';

                    window.location.href = `resultados.html?${urlParams.toString()}`;
                });

                strip.appendChild(btn);
            }
        }

        renderStrip(0);

        // Navegar anterior / siguiente semana
        let currentOffset = 0;
        btnPrev && btnPrev.addEventListener('click', () => {
            currentOffset -= 7;
            renderStrip(currentOffset);
        });
        btnNext && btnNext.addEventListener('click', () => {
            currentOffset += 7;
            renderStrip(currentOffset);
        });
    }

    // Esperar a que resultados.js termine de inicializar parametrosBusqueda
    // resultados.js llama leerParametrosURL() en DOMContentLoaded, pero este
    // archivo se carga después, así que podemos acceder a parametrosBusqueda directamente.
    // Pequeño timeout para asegurar que leerParametrosURL() ya corrió:
    setTimeout(inicializarDateStrip, 50);


    // ============================================================
    // 2. LIMPIAR EMOJIS — reemplaza emojis en los títulos del panel
    //    de detalles con caracteres unicode profesionales
    // ============================================================
    function limpiarEmojis() {
        // Mapa de emojis → caracteres especiales limpios
        const mapa = [
            // Títulos de secciones en detalle
            { de: '📋 Información del vuelo', a: '&#9992; Información del vuelo' },
            { de: '🧳 Equipaje incluido',      a: '&#9997; Equipaje incluido' },
            { de: '💰 Desglose de precios',    a: '&#36; Desglose de precios' },
            // Labels de filas de equipaje
            { de: '👜 Bolso personal',          a: 'Bolso personal' },
            { de: '🎒 Equipaje de mano',        a: 'Equipaje de mano' },
            { de: '🧳 Maleta de bodega',        a: 'Maleta de bodega' },
        ];

        document.querySelectorAll('.detalle-titulo, .detalle-label').forEach(el => {
            mapa.forEach(({ de, a }) => {
                if (el.innerHTML.includes(de)) {
                    el.innerHTML = el.innerHTML.replace(de, a);
                }
            });
        });

        // Quitar emoji del best-badge dejando solo el texto
        document.querySelectorAll('.best-badge').forEach(el => {
            el.innerHTML = el.innerHTML
                .replace('⭐', '')
                .replace('⭐️', '')
                .trim();
        });

        // Emojis en pills de equipaje
        document.querySelectorAll('.equip-item .equip-icon').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('.equip-item').forEach(el => {
            el.innerHTML = el.innerHTML
                .replace('🎒', '')
                .replace('💼', '')
                .replace('🧳', '')
                .trim();
        });
    }

    // Observar el contenedor de vuelos para limpiar emojis
    // cuando resultados.js inyecte las cards
    const vuelosContainer = document.getElementById('vuelosContainer');
    if (vuelosContainer) {
        const observer = new MutationObserver(() => {
            limpiarEmojis();
        });
        observer.observe(vuelosContainer, { childList: true, subtree: true });
    }

    // ============================================================
    // 3. PANEL MODIFICAR — pre-popular los selects con la búsqueda actual
    // ============================================================
    function prePopularFormulario() {
        // Esperar a que parametrosBusqueda esté disponible
        setTimeout(() => {
            if (!window.parametrosBusqueda) return;
            const { origen, destino, pasajeros, fecha } = window.parametrosBusqueda;

            const mapIATAaCiudad = {
                'LIM': 'lima', 'CUZ': 'cusco', 'AQP': 'arequipa', 'IQT': 'iquitos',
                'PIU': 'piura', 'TRU': 'trujillo', 'CIX': 'chiclayo', 'PCL': 'pucallpa',
                'TPP': 'tarapoto', 'JUL': 'juliaca', 'TCQ': 'tacna', 'TBP': 'tumbes',
                'PEM': 'puerto maldonado', 'BOG': 'bogotá', 'MDE': 'medellín',
                'UIO': 'quito', 'GYE': 'guayaquil', 'SCL': 'santiago',
                'EZE': 'buenos aires', 'MEX': 'ciudad de méxico', 'CUN': 'cancún',
                'MIA': 'miami', 'JFK': 'nueva york', 'LAX': 'los ángeles',
                'MAD': 'madrid', 'BCN': 'barcelona'
            };

            const selOrigen  = document.getElementById('newOrigin');
            const selDestino = document.getElementById('newDestination');
            const selViajeros = document.getElementById('newTravelers');
            const inpFecha   = document.getElementById('newDate');

            if (selOrigen && origen) {
                const ciudadOrigen = mapIATAaCiudad[origen] || origen.toLowerCase();
                [...selOrigen.options].forEach(o => {
                    if (o.value === ciudadOrigen) o.selected = true;
                });
            }

            if (selDestino && destino) {
                const ciudadDestino = mapIATAaCiudad[destino] || destino.toLowerCase();
                [...selDestino.options].forEach(o => {
                    if (o.value === ciudadDestino) o.selected = true;
                });
            }

            if (selViajeros && pasajeros) {
                selViajeros.value = String(pasajeros);
            }

            if (inpFecha && fecha) {
                const f = fecha.toString();
                if (f.length === 8) {
                    inpFecha.value = `${f.substring(0,4)}-${f.substring(4,6)}-${f.substring(6,8)}`;
                }
            }
        }, 100);
    }

    prePopularFormulario();

    console.log('✅ resultados-patch.js: date strip + limpieza de emojis activos.');
});
