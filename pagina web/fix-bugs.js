// ================================================================
// GOOD CALL TRAVEL - PARCHE DE CORRECCIÓN
// Archivo: fix-bugs.js
// Incluir DESPUÉS de script-integrado.js en el index.html así:
//   <script src="fix-bugs.js"></script>
// ================================================================

document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // FIX 1: IMÁGENES DE DESTINOS
    // El overlay estaba antes del img y lo tapaba con z-index:1
    // Solución: reemplazar renderDestinations con orden correcto
    // ============================================================
    function renderDestinationsFixed() {
        const container = document.getElementById('destinations-container');
        if (!container || typeof destinationsData === 'undefined') return;

        container.innerHTML = destinationsData.map((dest, index) => `
            <div class="destination-card ${dest.featured ? 'featured' : ''}"
                 data-aos="fade-up"
                 data-aos-delay="${index * 100}"
                 style="opacity:1;transform:none;visibility:visible;">
                <div class="destination-image">
                    <img src="${dest.image}" alt="${dest.name}" class="dest-img" loading="lazy">
                    <div class="image-overlay"></div>
                    ${dest.badge ? `<div class="destination-badge">${dest.badge}</div>` : ''}
                </div>
                <div class="destination-content">
                    <div class="destination-header">
                        <span class="destination-tag">${dest.category}</span>
                        <span class="destination-price">Desde $${typeof dest.price === 'number' ? dest.price.toLocaleString() : dest.price}</span>
                    </div>
                    <h3>${dest.name}</h3>
                    <p>${dest.description}</p>
                    <ul class="destination-features">
                        ${dest.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                    <a href="#contacto" class="destination-link">
                        Ver paquete completo
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        `).join('');
    }

    // Ejecutar el fix de imágenes
    renderDestinationsFixed();


    // ============================================================
    // FIX 2: COTIZADOR NO REDIRIGE A RESULTADOS
    // El script buscaba getElementById('date') pero el campo
    // en index.html se llama id="departureDate"
    // ============================================================
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) return;

    // Remover listeners anteriores clonando el form
    const freshForm = searchForm.cloneNode(true);
    searchForm.parentNode.replaceChild(freshForm, searchForm);

    // Configurar fechas mínimas con los IDs correctos
    const departureInput = document.getElementById('departureDate');
    const returnInput = document.getElementById('returnDate');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (departureInput) {
        departureInput.min = tomorrowStr;
        if (!departureInput.value) departureInput.value = tomorrowStr;
    }
    if (returnInput) {
        returnInput.min = tomorrowStr;
    }

    // Sincronizar fecha mínima de vuelta
    if (departureInput && returnInput) {
        departureInput.addEventListener('change', function () {
            const nextDay = new Date(this.value);
            nextDay.setDate(nextDay.getDate() + 1);
            returnInput.min = nextDay.toISOString().split('T')[0];
            if (returnInput.value && returnInput.value <= this.value) {
                returnInput.value = '';
            }
        });
    }

    // Submit con redirección correcta
    freshForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const origin      = document.getElementById('origin')?.value?.trim();
        const destination = document.getElementById('destination')?.value?.trim();
        const date        = document.getElementById('departureDate')?.value;  // ← CORREGIDO
        const returnDate  = document.getElementById('returnDate')?.value || '';
        const adults      = document.getElementById('adults')?.value || '1';
        const children    = document.getElementById('children')?.value || '0';
        const infants     = document.getElementById('infants')?.value || '0';

        // Obtener modo de viaje del tab activo
        const activeTab = document.querySelector('.tab-btn.active');
        const tripMode  = activeTab?.dataset?.type || 'roundtrip';

        // Validación
        if (!origin || !destination || !date) {
            // Mostrar error visual si existe el elemento, si no alert
            const errEl = document.getElementById('searchError') || document.getElementById('cotError');
            if (errEl) {
                errEl.textContent = 'Por favor completa: origen, destino y fecha.';
                errEl.style.display = 'block';
                setTimeout(() => errEl.style.display = 'none', 3500);
            } else {
                alert('⚠️ Por favor completa todos los campos obligatorios.');
            }
            return;
        }

        if (origin.toLowerCase() === destination.toLowerCase()) {
            alert('⚠️ El origen y el destino deben ser diferentes.');
            return;
        }

        // Construir URL con parámetros
        const params = new URLSearchParams({
            origin,
            destination,
            date,
            returnDate,
            adults,
            children,
            infants,
            tripMode
        });

        // Redirigir a resultados ✅
        window.location.href = `resultados.html?${params.toString()}`;
    });

    console.log('✅ fix-bugs.js: Imágenes y cotizador corregidos.');
});
