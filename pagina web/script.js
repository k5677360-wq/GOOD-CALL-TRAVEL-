// =====================================================
// GOOD CALL TRAVEL - Script Principal
// Modificado para leer autocompletado y redirigir
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    // ==================== CONFIGURACIÓN ====================
    // Soportamos ambos IDs por si acaso (searchForm o search-form)
    const searchForm = document.getElementById('searchForm') || document.getElementById('search-form');
    // En el nuevo HTML le pusimos 'departureDate' al input
    const dateInput = document.getElementById('departureDate') || document.getElementById('date');

    // ==================== FECHA MÍNIMA ====================
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ==================== SUBMIT DEL FORMULARIO ====================
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 1. Obtener códigos IATA de los campos ocultos
            const codigoOrigen = document.getElementById('origen_iata').value;
            const codigoDestino = document.getElementById('destino_iata').value;
            
            // 2. Obtener los nombres mostrados
            const nombreOrigen = document.getElementById('origen_texto').value;
            const nombreDestino = document.getElementById('destino_texto').value;

            // 3. Obtener fechas y verificar si es solo ida
            const fechaIda = document.getElementById('departureDate') ? document.getElementById('departureDate').value : dateInput.value;
            const inputVuelta = document.getElementById('returnDate');
            const fechaVuelta = inputVuelta ? inputVuelta.value : '';
            
            const tabOneway = document.querySelector('.tab-btn[data-type="oneway"]');
            const isOneway = tabOneway ? tabOneway.classList.contains('active') : false;
            
            // 4. Obtener pasajeros
            const adultos = document.getElementById('adults') ? document.getElementById('adults').value : 1;
            const ninos = document.getElementById('children') ? document.getElementById('children').value : 0;
            const infantes = document.getElementById('infants') ? document.getElementById('infants').value : 0;
            const totalViajeros = parseInt(adultos) + parseInt(ninos) + parseInt(infantes);

            // ==================== VALIDACIONES ====================
            if (!codigoOrigen || !codigoDestino) {
                alert('⚠️ Por favor selecciona una ciudad válida de la lista desplegable.');
                return;
            }

            if (!fechaIda) {
                alert('⚠️ Por favor selecciona una fecha de ida.');
                return;
            }

            if (!isOneway && !fechaVuelta && inputVuelta) {
                alert('⚠️ Por favor selecciona una fecha de vuelta o cambia a "Solo Ida".');
                return;
            }

            if (codigoOrigen === codigoDestino) {
                alert('⚠️ El origen y destino deben ser diferentes.');
                return;
            }

            // ==================== PREPARAR DATA ====================
            const fechaIdaAPI = fechaIda.replace(/-/g, '');
            const fechaVueltaAPI = fechaVuelta ? fechaVuelta.replace(/-/g, '') : '';

            // Guardar nombres en localStorage sin el país (ej: "Lima")
            localStorage.setItem('nombreOrigen', nombreOrigen.split(',')[0]); 
            localStorage.setItem('nombreDestino', nombreDestino.split(',')[0]);
            localStorage.setItem('fechaBusqueda', fechaIda);

            // Construir URL base
            let urlResultados = `resultados.html?origen=${codigoOrigen}&destino=${codigoDestino}&fecha=${fechaIdaAPI}&pasajeros=${totalViajeros}`;
            
            // Si es ida y vuelta, agregar parámetro extra
            if (!isOneway && fechaVueltaAPI) {
                urlResultados += `&fecha_vuelta=${fechaVueltaAPI}`;
            }

            console.log('🚀 Redirigiendo a:', urlResultados);
            window.location.href = urlResultados;
        });
    }

    // ==================== ANIMACIONES DE SCROLL ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .destination-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

    // ==================== SMOOTH SCROLL PARA ANCLAS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
    
    return ciudades[ciudad.toLowerCase()] || null;
}
