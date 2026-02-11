// ===========================================
// SISTEMA DE COTIZACIÓN INTELIGENTE
// Good Call Travel - 2026
// ===========================================

// Base de datos de destinos con precios base
const destinationsDB = {
    'Machu Picchu, Perú': { 
        basePrice: 1200, 
        region: 'América del Sur', 
        category: 'Aventura',
        nights: 4,
        includes: ['Hotel 4★', 'Tours guiados', 'Tren panorámico', 'Desayunos']
    },
    'Santorini, Grecia': { 
        basePrice: 1800, 
        region: 'Europa', 
        category: 'Premium',
        nights: 6,
        includes: ['Hotel boutique', 'Tour de vinos', 'Crucero sunset', 'Media pensión']
    },
    'Maldivas': { 
        basePrice: 2500, 
        region: 'Asia', 
        category: 'Playa',
        nights: 5,
        includes: ['Villa overwater', 'All-inclusive', 'Spa', 'Deportes acuáticos']
    },
    'Tokio, Japón': { 
        basePrice: 2200, 
        region: 'Asia', 
        category: 'Cultural',
        nights: 7,
        includes: ['Hotel 4★', 'JR Pass', 'Ceremonia del té', 'Guía bilingüe']
    },
    'París, Francia': { 
        basePrice: 1600, 
        region: 'Europa', 
        category: 'Romance',
        nights: 5,
        includes: ['Hotel Le Marais', 'Tours museos', 'Cena Torre Eiffel', 'Desayunos']
    },
    'Bali, Indonesia': { 
        basePrice: 1400, 
        region: 'Asia', 
        category: 'Wellness',
        nights: 6,
        includes: ['Villa privada', 'Retiro yoga', 'Spa ilimitado', 'Tours espirituales']
    },
    'Dubai, EAU': { 
        basePrice: 2000, 
        region: 'Medio Oriente', 
        category: 'Lujo',
        nights: 5,
        includes: ['Hotel 5★', 'Desert safari', 'Burj Khalifa', 'Compras']
    },
    'Roma, Italia': { 
        basePrice: 1500, 
        region: 'Europa', 
        category: 'Cultural',
        nights: 5,
        includes: ['Hotel centro', 'Coliseo VIP', 'Vaticano tour', 'Cooking class']
    },
    'Londres, Inglaterra': { 
        basePrice: 1700, 
        region: 'Europa', 
        category: 'Cultural',
        nights: 5,
        includes: ['Hotel zona 1', 'British Museum', 'London Eye', 'West End show']
    },
    'Nueva York, USA': { 
        basePrice: 1900, 
        region: 'América del Norte', 
        category: 'Ciudad',
        nights: 6,
        includes: ['Hotel Manhattan', 'City Pass', 'Broadway show', 'Tours']
    }
};

// Costos de vuelo aproximados por región (origen-destino)
const flightCosts = {
    'América del Sur': {
        'América del Sur': 300,
        'América del Norte': 600,
        'Europa': 900,
        'Asia': 1200,
        'Medio Oriente': 1000
    },
    'América del Norte': {
        'América del Sur': 700,
        'América del Norte': 400,
        'Europa': 800,
        'Asia': 1100,
        'Medio Oriente': 900
    },
    'Europa': {
        'América del Sur': 1000,
        'América del Norte': 700,
        'Europa': 200,
        'Asia': 600,
        'Medio Oriente': 400
    },
    'Asia': {
        'América del Sur': 1300,
        'América del Norte': 1200,
        'Europa': 700,
        'Asia': 400,
        'Medio Oriente': 500
    },
    'Medio Oriente': {
        'América del Sur': 1100,
        'América del Norte': 1000,
        'Europa': 500,
        'Asia': 600,
        'Medio Oriente': 300
    }
};

// ===========================================
// FUNCIONES DE CÁLCULO
// ===========================================

// Detectar región del origen
function detectOriginRegion(origin) {
    const normalized = origin.toLowerCase();
    
    if (normalized.includes('perú') || normalized.includes('peru') || 
        normalized.includes('argentina') || normalized.includes('chile') || 
        normalized.includes('colombia') || normalized.includes('brasil') || 
        normalized.includes('brazil') || normalized.includes('ecuador') ||
        normalized.includes('bolivia') || normalized.includes('uruguay') ||
        normalized.includes('paraguay') || normalized.includes('venezuela') ||
        normalized.includes('méxico') || normalized.includes('mexico')) {
        return 'América del Sur';
    }
    
    if (normalized.includes('usa') || normalized.includes('estados unidos') || 
        normalized.includes('miami') || normalized.includes('nueva york') || 
        normalized.includes('new york') || normalized.includes('los angeles') ||
        normalized.includes('los ángeles') || normalized.includes('san francisco') || 
        normalized.includes('chicago') || normalized.includes('canada') || 
        normalized.includes('canadá') || normalized.includes('toronto') ||
        normalized.includes('vancouver')) {
        return 'América del Norte';
    }
    
    if (normalized.includes('españa') || normalized.includes('spain') ||
        normalized.includes('madrid') || normalized.includes('barcelona') ||
        normalized.includes('francia') || normalized.includes('france') ||
        normalized.includes('italia') || normalized.includes('italy') ||
        normalized.includes('alemania') || normalized.includes('germany') ||
        normalized.includes('inglaterra') || normalized.includes('england') ||
        normalized.includes('reino unido') || normalized.includes('uk') ||
        normalized.includes('portugal') || normalized.includes('grecia') ||
        normalized.includes('greece') || normalized.includes('suiza') ||
        normalized.includes('switzerland')) {
        return 'Europa';
    }
    
    if (normalized.includes('japón') || normalized.includes('japan') ||
        normalized.includes('tokio') || normalized.includes('tokyo') ||
        normalized.includes('china') || normalized.includes('beijing') ||
        normalized.includes('shanghai') || normalized.includes('corea') ||
        normalized.includes('korea') || normalized.includes('tailandia') ||
        normalized.includes('thailand') || normalized.includes('singapur') ||
        normalized.includes('singapore') || normalized.includes('vietnam') ||
        normalized.includes('indonesia') || normalized.includes('bali')) {
        return 'Asia';
    }
    
    if (normalized.includes('dubai') || normalized.includes('emiratos') ||
        normalized.includes('uae') || normalized.includes('qatar') ||
        normalized.includes('arabia') || normalized.includes('saudi')) {
        return 'Medio Oriente';
    }
    
    return 'América del Sur'; // Default
}

// Verificar si es temporada alta
function isHighSeason(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // 1-12
    
    // Temporada alta:
    // - Verano (Junio, Julio, Agosto)
    // - Navidad/Año Nuevo (Diciembre, Enero)
    return (month >= 6 && month <= 8) || month === 12 || month === 1;
}

// Calcular descuento por grupo
function calculateGroupDiscount(travelers) {
    const num = parseInt(travelers);
    if (num >= 5) return { rate: 0.15, label: '15% descuento grupo grande' };
    if (num >= 4) return { rate: 0.10, label: '10% descuento grupo' };
    if (num >= 3) return { rate: 0.05, label: '5% descuento grupo pequeño' };
    return { rate: 0, label: 'Sin descuento' };
}

// Calcular días hasta el viaje
function daysUntilTravel(dateString) {
    const travelDate = new Date(dateString);
    const today = new Date();
    const diffTime = travelDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Función principal de cotización
function calculateQuote(origin, destination, date, travelers) {
    // Obtener datos del destino
    const destData = destinationsDB[destination];
    if (!destData) {
        return null; // Destino no encontrado
    }

    // 1. Precio base del paquete
    const basePrice = destData.basePrice;

    // 2. Calcular costo de vuelos
    const originRegion = detectOriginRegion(origin);
    const destRegion = destData.region;
    
    let flightCost = 800; // Default
    if (flightCosts[originRegion] && flightCosts[originRegion][destRegion]) {
        flightCost = flightCosts[originRegion][destRegion];
    }

    // 3. Ajuste de temporada
    const highSeason = isHighSeason(date);
    const seasonMultiplier = highSeason ? 1.25 : 0.90;
    const subtotalBeforeSeason = basePrice + flightCost;
    const seasonAdjustment = subtotalBeforeSeason * (seasonMultiplier - 1);
    
    // 4. Subtotal antes de descuentos
    let subtotal = subtotalBeforeSeason + seasonAdjustment;

    // 5. Descuento por reserva anticipada (BONUS)
    const daysAdvance = daysUntilTravel(date);
    let earlyBookingDiscount = 0;
    let earlyBookingLabel = 'Sin descuento anticipado';
    
    if (daysAdvance > 90) {
        earlyBookingDiscount = subtotal * 0.10;
        earlyBookingLabel = '10% descuento reserva anticipada (+90 días)';
    } else if (daysAdvance > 60) {
        earlyBookingDiscount = subtotal * 0.05;
        earlyBookingLabel = '5% descuento reserva anticipada (+60 días)';
    }

    // 6. Descuento por grupo
    const groupDiscountData = calculateGroupDiscount(travelers);
    const groupDiscount = subtotal * groupDiscountData.rate;

    // 7. Precio final
    const totalDiscounts = earlyBookingDiscount + groupDiscount;
    const finalPricePerPerson = Math.round(subtotal - totalDiscounts);
    const totalForGroup = finalPricePerPerson * parseInt(travelers);

    return {
        basePrice,
        flightCost,
        flightRoute: `${originRegion} → ${destRegion}`,
        seasonAdjustment: Math.round(seasonAdjustment),
        seasonLabel: highSeason ? 'Temporada Alta (+25%)' : 'Temporada Baja (-10%)',
        isHighSeason: highSeason,
        earlyBookingDiscount: Math.round(earlyBookingDiscount),
        earlyBookingLabel,
        groupDiscount: Math.round(groupDiscount),
        groupDiscountLabel: groupDiscountData.label,
        groupDiscountRate: groupDiscountData.rate,
        subtotal: Math.round(subtotal),
        totalDiscounts: Math.round(totalDiscounts),
        finalPricePerPerson,
        totalForGroup,
        destination: destData,
        daysAdvance
    };
}

// Formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// ===========================================
// MANEJO DEL FORMULARIO
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const modal = document.getElementById('quoteModal');
    const loading = document.getElementById('quoteLoading');
    const result = document.getElementById('quoteResult');
    const closeBtn = document.getElementById('closeQuote');
    const newSearchBtn = document.getElementById('newSearch');
    const bookNowBtn = document.getElementById('bookNow');
    const searchError = document.getElementById('searchError');

    // Manejar envío del formulario
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const date = document.getElementById('date').value;
        const travelers = document.getElementById('travelers').value;

        // Validar campos
        if (!origin || !destination || !date) {
            searchError.classList.add('active');
            setTimeout(() => {
                searchError.classList.remove('active');
            }, 3000);
            return;
        }

        // Validar fecha (no puede ser en el pasado)
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('⚠️ La fecha seleccionada no puede ser en el pasado');
            return;
        }

        // Mostrar modal
        modal.classList.add('active');
        loading.classList.add('active');
        result.style.display = 'none';

        // Simular carga (puedes conectar aquí tu API real)
        setTimeout(() => {
            const quote = calculateQuote(origin, destination, date, travelers);

            if (quote) {
                // Rellenar datos en el modal
                document.getElementById('quoteOrigin').textContent = origin;
                document.getElementById('quoteDestination').textContent = destination;
                document.getElementById('quoteDate').textContent = new Date(date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                document.getElementById('quoteTravelers').textContent = travelers + (travelers == 1 ? ' persona' : ' personas');

                document.getElementById('basePrice').textContent = formatCurrency(quote.basePrice);
                document.getElementById('flightCost').textContent = formatCurrency(quote.flightCost);
                document.getElementById('flightLabel').textContent = `Vuelos (${quote.flightRoute})`;
                
                document.getElementById('seasonLabel').textContent = quote.seasonLabel;
                document.getElementById('seasonAdjustment').textContent = 
                    (quote.seasonAdjustment >= 0 ? '+' : '') + formatCurrency(quote.seasonAdjustment);
                document.getElementById('seasonAdjustment').style.color = 
                    quote.seasonAdjustment >= 0 ? '#ff6b6b' : '#4ade80';

                if (quote.groupDiscount > 0) {
                    document.getElementById('groupDiscount').textContent = 
                        '-' + formatCurrency(quote.groupDiscount) + 
                        ' (' + (quote.groupDiscountRate * 100) + '%)';
                } else {
                    document.getElementById('groupDiscount').textContent = 'No aplica';
                }

                document.getElementById('totalPrice').textContent = formatCurrency(quote.finalPricePerPerson);

                // Mostrar resultado
                loading.classList.remove('active');
                result.style.display = 'block';

                // Animación de entrada
                setTimeout(() => {
                    result.style.animation = 'slideUp 0.4s ease';
                }, 10);

            } else {
                loading.classList.remove('active');
                alert('❌ Destino no encontrado en nuestra base de datos. Por favor, selecciona un destino de la lista.');
                modal.classList.remove('active');
            }
        }, 1500);
    });

    // Cerrar modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    // Nueva búsqueda
    newSearchBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        // Scroll al formulario
        document.getElementById('searchForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Reservar ahora
    bookNowBtn.addEventListener('click', function() {
        // Aquí puedes redirigir a tu sistema de reservas
        const origin = document.getElementById('quoteOrigin').textContent;
        const destination = document.getElementById('quoteDestination').textContent;
        const message = `¡Hola! Me interesa reservar el viaje de ${origin} a ${destination}. ¿Pueden ayudarme?`;
        
        // Redirigir a WhatsApp (ejemplo)
        const whatsappNumber = '51999888777'; // Reemplaza con tu número
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappURL, '_blank');
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Prevenir cierre al hacer clic dentro del contenido
    document.querySelector('.quote-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Establecer fecha mínima (hoy)
    const dateInput = document.getElementById('date');
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);

    console.log('✅ Sistema de cotización inicializado correctamente');
});

// ===========================================
// ESTILOS ADICIONALES PARA EL MODAL
// ===========================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .quote-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .quote-modal.active {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .quote-content {
        background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
        border-radius: 24px;
        padding: 40px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.4s ease;
        position: relative;
    }

    .quote-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .quote-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
    }

    .quote-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .quote-header h2 {
        color: white;
        font-size: 32px;
        margin-bottom: 10px;
        font-weight: 700;
    }

    .quote-header p {
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
    }

    .quote-details {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
    }

    .quote-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .quote-row:last-child {
        border-bottom: none;
    }

    .quote-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
    }

    .quote-value {
        color: white;
        font-weight: 600;
        font-size: 16px;
    }

    .price-breakdown {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .price-breakdown h3 {
        color: white;
        font-size: 18px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .price-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        color: rgba(255, 255, 255, 0.8);
    }

    .price-total {
        border-top: 2px solid rgba(255, 255, 255, 0.2);
        padding-top: 16px;
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .price-total .label {
        color: white;
        font-size: 20px;
        font-weight: 700;
    }

    .price-total .amount {
        color: #FFD700;
        font-size: 32px;
        font-weight: 800;
    }

    .quote-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 24px;
    }

    .quote-btn {
        padding: 16px 24px;
        border-radius: 12px;
        border: none;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .quote-btn-primary {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #1e3a5f;
    }

    .quote-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
    }

    .quote-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .quote-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .loading-spinner {
        display: none;
        text-align: center;
        padding: 40px;
    }

    .loading-spinner.active {
        display: block;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top: 4px solid #FFD700;
        border-radius: 50%;
        margin: 0 auto 20px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .search-error {
        background: rgba(255, 59, 48, 0.1);
        border: 2px solid rgba(255, 59, 48, 0.3);
        border-radius: 12px;
        padding: 16px;
        margin-top: 12px;
        color: #ff3b30;
        display: none;
        font-weight: 600;
    }

    .search-error.active {
        display: block;
        animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Responsive */
    @media (max-width: 768px) {
        .quote-content {
            padding: 24px;
            width: 95%;
        }

        .quote-header h2 {
            font-size: 24px;
        }

        .price-total .amount {
            font-size: 24px;
        }

        .quote-actions {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(styleSheet);