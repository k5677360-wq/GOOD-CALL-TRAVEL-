// =====================================================
// GOOD CALL TRAVEL - Script Principal
// Modificado para redirigir a página de resultados
// =====================================================

document.addEventListener('DOMContentLoaded', function () {
    // ==================== CONFIGURACIÓN ====================
    const searchForm = document.getElementById('search-form');
    const dateInput = document.getElementById('date');

    // ==================== FECHA MÍNIMA ====================
    // Establecer fecha mínima como hoy
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ==================== SUBMIT DEL FORMULARIO ====================
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Obtener valores del formulario
            const origen = document.getElementById('origin').value.trim();
            const destino = document.getElementById('destination').value.trim();
            const fecha = document.getElementById('date').value;
            const viajeros = document.getElementById('travelers').value;

            // Validar campos
            if (!origen || !destino || !fecha || !viajeros) {
                alert('⚠️ Por favor completa todos los campos');
                return;
            }

            // Validar que origen y destino sean diferentes
            if (origen.toLowerCase() === destino.toLowerCase()) {
                alert('⚠️ El origen y destino deben ser diferentes');
                return;
            }

            // Obtener códigos IATA
            const codigoOrigen = obtenerCodigoIATA(origen);
            const codigoDestino = obtenerCodigoIATA(destino);

            // Validar que se encontraron los códigos
            if (!codigoOrigen || !codigoDestino) {
                alert('⚠️ Ciudad no válida. Por favor selecciona una ciudad del menú.');
                return;
            }

            // Convertir fecha de YYYY-MM-DD a YYYYMMDD
            const fechaAPI = fecha.replace(/-/g, '');

            // Guardar nombres de ciudades en localStorage para mostrarlos en resultados
            localStorage.setItem('nombreOrigen', origen);
            localStorage.setItem('nombreDestino', destino);
            localStorage.setItem('fechaBusqueda', fecha);

            // Construir URL de resultados
            const urlResultados = `resultados.html?origen=${codigoOrigen}&destino=${codigoDestino}&fecha=${fechaAPI}&pasajeros=${viajeros}`;

            console.log('🚀 Redirigiendo a:', urlResultados);

            // Redirigir a página de resultados
            window.location.href = urlResultados;
        });
    }

    // ==================== ANIMACIONES DE SCROLL ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos con animación
    document.querySelectorAll('.feature-card, .destination-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

    // ==================== SMOOTH SCROLL PARA ANCLAS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ==================== FUNCIÓN: OBTENER CÓDIGO IATA ====================
function obtenerCodigoIATA(ciudad) {
    const ciudades = {
        // Perú
        'lima': 'LIM',
        'lima, perú': 'LIM',
        'cusco': 'CUZ',
        'cusco, perú': 'CUZ',
        'arequipa': 'AQP',
        'arequipa, perú': 'AQP',
        'iquitos': 'IQT',
        'iquitos, perú': 'IQT',
        'piura': 'PIU',
        'piura, perú': 'PIU',
        'trujillo': 'TRU',
        'trujillo, perú': 'TRU',
        'chiclayo': 'CIX',
        'chiclayo, perú': 'CIX',
        'pucallpa': 'PCL',
        'pucallpa, perú': 'PCL',
        'tarapoto': 'TPP',
        'tarapoto, perú': 'TPP',
        'juliaca': 'JUL',
        'juliaca, perú': 'JUL',
        'tacna': 'TCQ',
        'tacna, perú': 'TCQ',
        'tumbes': 'TBP',
        'tumbes, perú': 'TBP',
        'puerto maldonado': 'PEM',
        'puerto maldonado, perú': 'PEM',

        // Colombia
        'bogotá': 'BOG',
        'bogotá, colombia': 'BOG',
        'medellín': 'MDE',
        'medellín, colombia': 'MDE',
        'cali': 'CLO',
        'cali, colombia': 'CLO',
        'cartagena': 'CTG',
        'cartagena, colombia': 'CTG',
        'barranquilla': 'BAQ',
        'barranquilla, colombia': 'BAQ',

        // Ecuador
        'quito': 'UIO',
        'quito, ecuador': 'UIO',
        'guayaquil': 'GYE',
        'guayaquil, ecuador': 'GYE',

        // Chile
        'santiago': 'SCL',
        'santiago, chile': 'SCL',

        // Argentina
        'buenos aires': 'EZE',
        'buenos aires, argentina': 'EZE',

        // Brasil
        'são paulo': 'GRU',
        'são paulo, brasil': 'GRU',
        'rio de janeiro': 'GIG',
        'rio de janeiro, brasil': 'GIG',

        // México
        'ciudad de méxico': 'MEX',
        'ciudad de méxico, méxico': 'MEX',
        'cancún': 'CUN',
        'cancún, méxico': 'CUN',

        // Estados Unidos
        'miami': 'MIA',
        'miami, estados unidos': 'MIA',
        'nueva york': 'JFK',
        'nueva york, estados unidos': 'JFK',
        'los ángeles': 'LAX',
        'los ángeles, estados unidos': 'LAX',

        // España
        'madrid': 'MAD',
        'madrid, españa': 'MAD',
        'barcelona': 'BCN',
        'barcelona, españa': 'BCN'
    };

    return ciudades[ciudad.toLowerCase()] || null;
}