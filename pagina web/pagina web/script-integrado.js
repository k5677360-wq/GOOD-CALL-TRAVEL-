// ===========================================
// GOOD CALL TRAVEL - JAVASCRIPT INTEGRADO CON COTIZADOR REAL
// Combina funcionalidad premium con API de Costamar
// ===========================================

// ===========================================
// IMPORTAR FUNCIONES DEL COTIZADOR
// ===========================================
import { cotizarPaqueteCompleto, paquetesDestinos } from './cotizador-integrado.js';

// ===========================================
// CONFIGURACIÓN DINÁMICA DE DESTINOS
// ===========================================
const destinationsData = [
    {
        id: 1,
        name: "Machu Picchu, Perú",
        location: "Cusco",
        category: "Aventura",
        price: 6650,
        description: "Explora la legendaria ciudad perdida de los Incas. Un viaje mágico que combina historia milenaria, naturaleza espectacular y cultura viva.",
        features: ["Guía experto en historia inca", "Hotel 4 estrellas en Cusco", "Tren panorámico incluido", "5 días / 4 noches"],
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",
        badge: "⭐ Más Popular",
        featured: false
    },
    {
        id: 2,
        name: "Santorini, Grecia",
        location: "Mar Egeo",
        category: "Premium",
        price: 9250,
        description: "Atardeceres mágicos sobre el mar Egeo, arquitectura icónica blanca y azul, y gastronomía mediterránea excepcional.",
        features: ["Hotel boutique con vista", "Tour de vinos incluido", "Crucero al atardecer", "7 días / 6 noches"],
        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
        badge: null,
        featured: false
    },
    {
        id: 3,
        name: "Maldivas",
        location: "Océano Índico",
        category: "Playa",
        price: 11840,
        description: "Paraíso tropical con aguas cristalinas turquesas, resorts de lujo overwater y experiencias de buceo inolvidables.",
        features: ["Villa sobre el agua", "All-inclusive resort 5★", "Spa y deportes acuáticos", "6 días / 5 noches"],
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
        badge: null,
        featured: false
    },
    {
        id: 4,
        name: "Tokio, Japón",
        location: "Asia",
        category: "Cultural",
        price: 10360,
        description: "Fusión perfecta de tradición milenaria y tecnología de vanguardia en la metrópolis más vibrante de Asia.",
        features: ["Guía cultural bilingüe", "JR Pass incluido", "Ceremonia del té", "8 días / 7 noches"],
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
        badge: null,
        featured: false
    },
    {
        id: 5,
        name: "París, Francia",
        location: "Europa",
        category: "Romance",
        price: 8880,
        description: "La ciudad del amor y la luz. Arte, arquitectura, moda y gastronomía de clase mundial.",
        features: ["Hotel en Le Marais", "Tours en museos", "Cena en Torre Eiffel", "6 días / 5 noches"],
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
        badge: null,
        featured: false
    },
    {
        id: 6,
        name: "Bali, Indonesia",
        location: "Sureste Asiático",
        category: "Wellness",
        price: 7770,
        description: "Isla de los dioses con templos místicos, arrozales esmeraldas y una cultura espiritual única.",
        features: ["Retiro de yoga y spa", "Villa privada con piscina", "Tour espiritual", "7 días / 6 noches"],
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
        badge: null,
        featured: false
    }
];

// ===========================================
// INICIALIZACIÓN AOS (Animate On Scroll)
// ===========================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0,
            anchorPlacement: 'top-bottom',
            disable: false,
            startEvent: 'DOMContentLoaded',
            initClassName: 'aos-init',
            animatedClassName: 'aos-animate'
        });
    } else {
        console.warn('AOS no disponible, mostrando contenido sin animaciones');
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.visibility = 'visible';
        });
    }
}

// ===========================================
// RENDERIZADO DE DESTINOS
// ===========================================
function renderDestinations() {
    const container = document.getElementById('destinations-container');
    if (!container) return;

    container.innerHTML = destinationsData.map((dest, index) => `
        <div class="destination-card ${dest.featured ? 'featured' : ''}" 
             data-aos="fade-up" 
             data-aos-delay="${index * 100}"
             style="opacity: 1; transform: none; visibility: visible;">
            <div class="destination-image">
                <div class="image-overlay"></div>
                <img src="${dest.image}" alt="${dest.name}" class="dest-img" loading="lazy">
                ${dest.badge ? `<div class="destination-badge">${dest.badge}</div>` : ''}
            </div>
            <div class="destination-content">
                <div class="destination-header">
                    <span class="destination-tag">${dest.category}</span>
                    <span class="destination-price">Desde S/ ${dest.price.toLocaleString('es-PE')}</span>
                </div>
                <h3>${dest.name}</h3>
                <p>${dest.description}</p>
                <ul class="destination-features">
                    ${dest.features.map(feat => `<li>${feat}</li>`).join('')}
                </ul>
                <a href="#contacto" class="destination-link">
                    Consultar Disponibilidad
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </a>
            </div>
        </div>
    `).join('');

    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// ===========================================
// MENÚ MÓVIL
// ===========================================
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

// ===========================================
// SMOOTH SCROLL
// ===========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===========================================
// NAVBAR SCROLL EFFECTS
// ===========================================
function initNavbarScroll() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }
}

// ===========================================
// BACK TO TOP BUTTON
// ===========================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===========================================
// FORMULARIO DE BÚSQUEDA CON API REAL DE COSTAMAR
// ===========================================
function initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    const searchError = document.getElementById('searchError');
    
    if (!searchForm) return;
    
    // Establecer fecha mínima a hoy
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const date = document.getElementById('date').value;
        const travelers = parseInt(document.getElementById('travelers').value);
        
        // Validación
        if (!origin || !destination || !date || !travelers) {
            searchError.classList.add('active');
            setTimeout(() => searchError.classList.remove('active'), 3000);
            return;
        }
        
        // Ocultar error si estaba visible
        searchError.classList.remove('active');
        
        // Verificar que el destino está disponible
        if (!paquetesDestinos[destination]) {
            showNotification('❌ Destino no disponible en nuestra base de datos. Por favor, selecciona un destino de la lista.', 'error');
            return;
        }
        
        // Mostrar modal con loading
        showQuoteModal();
        
        try {
            // Calcular fecha de vuelta (4 días después por defecto)
            const fechaIda = new Date(date);
            const fechaVuelta = new Date(fechaIda);
            fechaVuelta.setDate(fechaVuelta.getDate() + 4);
            const fechaVueltaString = fechaVuelta.toISOString().split('T')[0];
            
            // Llamar al API real de Costamar
            console.log('🔍 Consultando API de Costamar...');
            const resultado = await cotizarPaqueteCompleto({
                origen: origin,
                destino: destination,
                fechaIda: date,
                fechaVuelta: fechaVueltaString,
                viajeros: travelers
            });
            
            if (!resultado.success) {
                hideQuoteModal();
                showNotification(`❌ ${resultado.error}`, 'error');
                return;
            }
            
            // Mostrar resultado en el modal
            displayQuoteResult(resultado, origin, destination, date, travelers);
            
        } catch (error) {
            console.error('Error en cotización:', error);
            hideQuoteModal();
            showNotification('❌ Error al procesar la cotización. Por favor, intenta nuevamente.', 'error');
        }
    });
}

// ===========================================
// MOSTRAR MODAL DE COTIZACIÓN
// ===========================================
function showQuoteModal() {
    const modal = document.getElementById('quoteModal');
    const loading = document.getElementById('quoteLoading');
    const result = document.getElementById('quoteResult');
    
    if (modal && loading && result) {
        modal.style.display = 'flex';
        loading.style.display = 'flex';
        result.style.display = 'none';
        document.body.style.overflow = 'hidden';
    }
}

// ===========================================
// OCULTAR MODAL DE COTIZACIÓN
// ===========================================
function hideQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// ===========================================
// MOSTRAR RESULTADO DE COTIZACIÓN
// ===========================================
function displayQuoteResult(resultado, origin, destination, date, travelers) {
    const loading = document.getElementById('quoteLoading');
    const result = document.getElementById('quoteResult');
    
    // Ocultar loading, mostrar resultado
    if (loading && result) {
        loading.style.display = 'none';
        result.style.display = 'block';
    }
    
    // Formatear fecha
    const dateObj = new Date(date);
    const dateFormatted = dateObj.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Llenar datos del viaje
    document.getElementById('quoteOrigin').textContent = `${origin} (${resultado.vuelo.origen.split('(')[1].replace(')', '')})`;
    document.getElementById('quoteDestination').textContent = `${destination} (${resultado.vuelo.destino.split('(')[1].replace(')', '')})`;
    document.getElementById('quoteDate').textContent = dateFormatted;
    document.getElementById('quoteTravelers').textContent = `${travelers} ${travelers === 1 ? 'persona' : 'personas'}`;
    
    // Llenar desglose de precios
    const moneda = resultado.precio.moneda === 'PEN' ? 'S/' : '$';
    
    document.getElementById('basePrice').textContent = `${moneda} ${resultado.desglose.precioPaquete.toLocaleString()}`;
    document.getElementById('flightLabel').textContent = `Vuelos (${resultado.vuelo.aerolinea})`;
    document.getElementById('flightCost').textContent = `${moneda} ${resultado.desglose.precioVuelo.toLocaleString()}`;
    
    // Descuento por grupo
    const descuentoGrupo = resultado.desglose.descuentoGrupo;
    document.getElementById('groupDiscount').textContent = descuentoGrupo > 0 
        ? `-${moneda} ${descuentoGrupo.toLocaleString()}` 
        : 'Sin descuento';
    
    // Ajuste de temporada
    const ajusteTemporada = resultado.desglose.ajusteTemporada;
    const esTemporadaAlta = ajusteTemporada > 0;
    document.getElementById('seasonLabel').textContent = resultado.desglose.etiquetaTemporada;
    document.getElementById('seasonAdjustment').textContent = ajusteTemporada >= 0 
        ? `+${moneda} ${Math.abs(ajusteTemporada).toLocaleString()}` 
        : `-${moneda} ${Math.abs(ajusteTemporada).toLocaleString()}`;
    document.getElementById('seasonAdjustment').style.color = ajusteTemporada >= 0 ? '#fbbf24' : '#4ade80';
    
    // Precio total
    document.getElementById('totalPrice').textContent = `${moneda} ${resultado.precio.total.toLocaleString()}`;
    
    // Agregar información adicional del vuelo
    const quoteDetails = document.querySelector('.quote-details');
    if (quoteDetails && !document.getElementById('flightDetails')) {
        const flightDetailsHTML = `
            <div id="flightDetails" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: white; font-size: 1.1rem; margin-bottom: 10px;">✈️ Detalles del Vuelo</h3>
                <div class="quote-row">
                    <span class="quote-label">Aerolínea</span>
                    <span class="quote-value">${resultado.vuelo.aerolinea}</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">Duración</span>
                    <span class="quote-value">${resultado.vuelo.duracion}</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">Escalas</span>
                    <span class="quote-value">${resultado.vuelo.escalas}</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">Equipaje</span>
                    <span class="quote-value">${resultado.vuelo.equipaje}</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">Incluye</span>
                    <span class="quote-value" style="text-align: right; max-width: 60%;">${resultado.destino.incluye.join(', ')}</span>
                </div>
            </div>
        `;
        quoteDetails.insertAdjacentHTML('beforeend', flightDetailsHTML);
    }
    
    // Configurar botones
    const closeBtn = document.getElementById('closeQuote');
    const newSearchBtn = document.getElementById('newSearch');
    const bookNowBtn = document.getElementById('bookNow');
    
    if (closeBtn) {
        closeBtn.onclick = hideQuoteModal;
    }
    
    if (newSearchBtn) {
        newSearchBtn.onclick = () => {
            hideQuoteModal();
            // Limpiar detalles de vuelo para la próxima búsqueda
            const flightDetails = document.getElementById('flightDetails');
            if (flightDetails) {
                flightDetails.remove();
            }
        };
    }
    
    if (bookNowBtn) {
        bookNowBtn.onclick = () => {
            const mensaje = `Hola! Quiero reservar un viaje:\n\n` +
                `📍 Destino: ${destination}\n` +
                `🛫 Desde: ${origin}\n` +
                `📅 Fecha: ${dateFormatted}\n` +
                `👥 Viajeros: ${travelers}\n` +
                `✈️ Aerolínea: ${resultado.vuelo.aerolinea}\n` +
                `💰 Precio: ${moneda} ${resultado.precio.total.toLocaleString()}\n\n` +
                `¿Pueden ayudarme con la reserva?`;
            
            const numero = '51987654321'; // CAMBIAR POR TU NÚMERO
            const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        };
    }
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    const modal = document.getElementById('quoteModal');
    if (modal && e.target === modal) {
        hideQuoteModal();
        // Limpiar detalles de vuelo
        const flightDetails = document.getElementById('flightDetails');
        if (flightDetails) {
            flightDetails.remove();
        }
    }
});

// ===========================================
// FORMULARIOS DE CONTACTO
// ===========================================
function initForms() {
    const contactForm = document.getElementById('contactForm');
    const hiringForm = document.getElementById('hiringForm');

    const handleForm = async (form, successMsg) => {
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <span>Enviando...</span>
                </div>
            `;

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                showNotification(successMsg, 'success');
                form.reset();
            } catch (error) {
                showNotification('Hubo un error. Por favor, inténtalo de nuevo.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    };

    handleForm(contactForm, '✅ ¡Gracias! Nos pondremos en contacto contigo pronto.');
    handleForm(hiringForm, '✅ ¡Postulación recibida! Revisaremos tu perfil pronto.');
}

// ===========================================
// SISTEMA DE NOTIFICACIONES
// ===========================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '-400px',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '1.25rem 2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        fontWeight: '600',
        fontSize: '1rem',
        maxWidth: '350px',
        transition: 'right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.right = '20px';
    }, 100);
    
    setTimeout(() => {
        notification.style.right = '-400px';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// ===========================================
// LOADING SCREEN
// ===========================================
function hideLoadingScreen() {
    window.addEventListener('load', () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
    });
}

// ===========================================
// PARALLAX EFFECT
// ===========================================
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ===========================================
// ANIMACIÓN DE NÚMEROS
// ===========================================
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number, .hero-stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const hasK = text.includes('K');
                const hasPlus = text.includes('+');
                const hasStar = text.includes('★');
                const hasDot = text.includes('.');
                
                let finalNumber;
                if (hasDot) {
                    finalNumber = parseFloat(text);
                } else {
                    finalNumber = parseInt(text.replace(/[^0-9]/g, ''));
                }
                
                if (isNaN(finalNumber)) return;
                
                const duration = 2000;
                const steps = 60;
                const increment = finalNumber / steps;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        current = finalNumber;
                        clearInterval(timer);
                    }
                    
                    let display = hasDot ? current.toFixed(1) : Math.floor(current);
                    if (hasK) display += 'K';
                    if (hasPlus) display += '+';
                    if (hasStar) display += '★';
                    
                    target.textContent = display;
                }, duration / steps);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => observer.observe(num));
}

// ===========================================
// LAZY LOADING DE IMÁGENES
// ===========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===========================================
// INICIALIZACIÓN GLOBAL
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🌍 Good Call Travel - Sistema Integrado con Costamar', 'font-size: 20px; font-weight: bold; color: #1a3a52; background: #e8f2f7; padding: 10px; border-radius: 5px;');
    
    hideLoadingScreen();
    renderDestinations();
    initAOS();
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initBackToTop();
    initSearchForm();  // ✅ Formulario con API real de Costamar
    initForms();
    initParallax();
    animateNumbers();
    initLazyLoading();
    
    console.log('✅ Todos los módulos cargados correctamente');
    console.log('✅ Cotizador integrado con API de Costamar');
});

// ===========================================
// OPTIMIZACIÓN DE RENDIMIENTO
// ===========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(() => {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

console.log('%c✨ Good Call Travel - Cotizador Real Integrado', 'font-size: 16px; font-weight: bold; color: #2e5d7f; padding: 5px;');
