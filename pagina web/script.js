// =====================================================
// GOOD CALL TRAVEL - Script Principal
// Modificado para redirigir a página de resultados
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
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
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener códigos IATA de los campos ocultos generados por el autocompletado
            const codigoOrigen = document.getElementById('origen_iata').value;
            const codigoDestino = document.getElementById('destino_iata').value;
            
            // Obtener los nombres mostrados para el UI
            const nombreOrigen = document.getElementById('origen_texto').value;
            const nombreDestino = document.getElementById('destino_texto').value;

            // Obtener fechas y pasajeros
            const fechaIda = document.getElementById('departureDate').value;
            const fechaVuelta = document.getElementById('returnDate') ? document.getElementById('returnDate').value : '';
            const isOneway = document.querySelector('.tab-btn[data-type="oneway"]').classList.contains('active');
            
            const adultos = document.getElementById('adults') ? document.getElementById('adults').value : 1;
            const ninos = document.getElementById('children') ? document.getElementById('children').value : 0;
            const infantes = document.getElementById('infants') ? document.getElementById('infants').value : 0;
            
            // Calcular total de viajeros para la URL
            const totalViajeros = parseInt(adultos) + parseInt(ninos) + parseInt(infantes);

            // Validaciones
            if (!codigoOrigen || !codigoDestino) {
                alert('⚠️ Por favor selecciona una ciudad válida de la lista desplegable.');
                return;
            }

            if (!fechaIda) {
                alert('⚠️ Por favor selecciona una fecha de ida.');
                return;
            }

            if (!isOneway && !fechaVuelta) {
                alert('⚠️ Por favor selecciona una fecha de vuelta o cambia a "Solo Ida".');
                return;
            }

            if (codigoOrigen === codigoDestino) {
                alert('⚠️ El origen y destino deben ser diferentes.');
                return;
            }

            // Formatear fechas para la API (YYYYMMDD)
            const fechaIdaAPI = fechaIda.replace(/-/g, '');
            const fechaVueltaAPI = fechaVuelta ? fechaVuelta.replace(/-/g, '') : '';

            // Guardar nombres en localStorage para la página de resultados
            localStorage.setItem('nombreOrigen', nombreOrigen.split(',')[0]); 
            localStorage.setItem('nombreDestino', nombreDestino.split(',')[0]);
            localStorage.setItem('fechaBusqueda', fechaIda);

            // Construir URL de resultados (Ajustada para soportar ida y vuelta si aplica)
            let urlResultados = `resultados.html?origen=${codigoOrigen}&destino=${codigoDestino}&fecha=${fechaIdaAPI}&pasajeros=${totalViajeros}`;
            
            if (!isOneway && fechaVueltaAPI) {
                urlResultados += `&fecha_vuelta=${fechaVueltaAPI}`;
            }

            console.log('🚀 Redirigiendo a:', urlResultados);

            // Redirigir a página de resultados
            window.location.href = urlResultados;
        });
    }
});

// NOTA: La antigua función obtenerCodigoIATA() ha sido ELIMINADA 
// ya que el archivo aeropuertos.json ahora maneja esa lógica en el frontend
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

    // Observar elementos con animación
    document.querySelectorAll('.feature-card, .destination-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

    // ==================== SMOOTH SCROLL PARA ANCLAS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
