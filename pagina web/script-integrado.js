// ===========================================
// GOOD CALL TRAVEL - JAVASCRIPT PREMIUM 2026
// Animaciones avanzadas | Interactividad moderna
// ===========================================

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
        // Si AOS no está disponible, hacer todos los elementos visibles
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

    // Refrescar AOS después de renderizar
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

    // Cerrar menú al hacer click en un enlace
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Cerrar menú al hacer click fuera
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
        
        // Agregar clase scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Ocultar/mostrar navbar
        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        // Active link basado en sección visible
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
// FORMULARIO DE BÚSQUEDA CON API COTIZADOR
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
        const travelers = document.getElementById('travelers').value;
        
        // Validación
        if (!origin || !destination || !date || !travelers) {
            searchError.classList.add('active');
            setTimeout(() => searchError.classList.remove('active'), 3000);
            return;
        }
        
        // Ocultar error si estaba visible
        searchError.classList.remove('active');
        
        // Calcular cotización usando el API
        const quote = calculateQuote(origin, destination, date, travelers);
        
        if (!quote) {
            showNotification('❌ Destino no disponible en nuestra base de datos. Por favor, intenta con otro destino.', 'error');
            return;
        }
        
        // Mostrar modal con la cotización
        displayQuoteModal(quote, origin, destination, date, travelers);
    });
}

// Mostrar modal de cotización
function displayQuoteModal(quote, origin, destination, date, travelers) {
    // Crear modal si no existe
    let modal = document.getElementById('quoteModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quoteModal';
        modal.className = 'quote-modal';
        document.body.appendChild(modal);
    }
    
    // Formatear fecha
    const dateObj = new Date(date);
    const dateFormatted = dateObj.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Generar HTML del modal
    modal.innerHTML = `
        <div class="quote-content">
            <button class="quote-close" onclick="closeQuoteModal()">×</button>
            
            <div class="quote-header">
                <h2>✨ ¡Tu Cotización Está Lista!</h2>
                <p>${destination}</p>
            </div>
            
            <div class="quote-details">
                <div class="quote-row">
                    <span class="quote-label">🛫 Ruta de vuelo</span>
                    <span class="quote-value">${quote.flightRoute}</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">📅 Fecha de salida</span>
                    <span class="quote-value">${dateFormatted}</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">👥 Viajeros</span>
                    <span class="quote-value">${travelers} ${travelers === '1' ? 'persona' : 'personas'}</span>
                </div>
                <div class="quote-row">
                    <span class="quote-label">🌙 Duración</span>
                    <span class="quote-value">${quote.destination.nights} noches</span>
                </div>
            </div>
            
            <div class="price-breakdown">
                <h3>💰 Desglose de Precio</h3>
                
                <div class="price-item">
                    <span>Paquete base</span>
                    <span>$${quote.basePrice.toLocaleString()}</span>
                </div>
                
                <div class="price-item">
                    <span>Vuelos (${quote.flightRoute})</span>
                    <span>$${quote.flightCost.toLocaleString()}</span>
                </div>
                
                <div class="price-item ${quote.seasonAdjustment >= 0 ? 'price-increase' : 'price-decrease'}">
                    <span>${quote.seasonLabel}</span>
                    <span>${quote.seasonAdjustment >= 0 ? '+' : ''}$${quote.seasonAdjustment.toLocaleString()}</span>
                </div>
                
                ${quote.earlyBookingDiscount > 0 ? `
                <div class="price-item price-discount">
                    <span>🎉 ${quote.earlyBookingLabel}</span>
                    <span>-$${quote.earlyBookingDiscount.toLocaleString()}</span>
                </div>
                ` : ''}
                
                ${quote.groupDiscount > 0 ? `
                <div class="price-item price-discount">
                    <span>👥 ${quote.groupDiscountLabel}</span>
                    <span>-$${quote.groupDiscount.toLocaleString()}</span>
                </div>
                ` : ''}
                
                <div class="price-total">
                    <div class="label">Precio por persona</div>
                    <div class="amount">$${quote.finalPricePerPerson.toLocaleString()}</div>
                </div>
                
                <div style="text-align: center; color: rgba(255,255,255,0.8); margin-top: 10px; font-size: 14px;">
                    Total ${travelers} ${travelers === '1' ? 'persona' : 'personas'}: $${quote.totalForGroup.toLocaleString()}
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; margin: 20px 0;">
                <h4 style="color: white; margin-bottom: 12px; font-size: 16px;">✅ Incluye:</h4>
                ${quote.destination.includes.map(item => `
                    <div style="color: rgba(255,255,255,0.9); margin: 8px 0; font-size: 14px;">
                        • ${item}
                    </div>
                `).join('')}
            </div>
            
            <div class="quote-actions">
                <button class="quote-btn quote-btn-primary" onclick="reservarAhora()">
                    📞 Reservar Ahora
                </button>
                <button class="quote-btn quote-btn-secondary" onclick="closeQuoteModal()">
                    🔄 Nueva Búsqueda
                </button>
            </div>
        </div>
    `;
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de cotización
function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Función de reserva
function reservarAhora() {
    closeQuoteModal();
    showNotification('✅ ¡Excelente! Redirigiendo al formulario de contacto...', 'success');
    setTimeout(() => {
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1000);
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('quoteModal');
    if (modal && e.target === modal) {
        closeQuoteModal();
    }
});

// ===========================================
// FORMULARIOS
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
                // Simular envío
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
    
    // Animar entrada
    setTimeout(() => {
        notification.style.right = '20px';
    }, 100);
    
    // Animar salida
    setTimeout(() => {
        notification.style.right = '-400px';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// ===========================================
// PANEL DE ADMINISTRACIÓN
// ===========================================
function initAdminPanel() {
    const adminToggle = document.getElementById('adminToggle');
    const adminPanel = document.getElementById('adminPanel');
    const adminClose = document.getElementById('adminClose');
    const adminSave = document.getElementById('adminSave');

    if (!adminToggle || !adminPanel) return;

    // Abrir panel
    adminToggle.addEventListener('click', () => {
        adminPanel.classList.add('active');
        renderAdminDestinations();
    });

    // Cerrar panel
    adminClose?.addEventListener('click', () => {
        adminPanel.classList.remove('active');
    });

    // Guardar precios
    adminSave?.addEventListener('click', () => {
        saveAdminPrices();
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.admin-panel') && !e.target.closest('.admin-toggle')) {
            adminPanel.classList.remove('active');
        }
    });

    // Cargar precios guardados
    loadSavedPrices();
}

function renderAdminDestinations() {
    const container = document.getElementById('adminDestinations');
    if (!container) return;

    container.innerHTML = destinationsData.map(dest => `
        <div class="admin-destination">
            <h4>${dest.name}</h4>
            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; color: #5a7a92;">
                Precio en Soles (S/)
            </label>
            <input 
                type="number" 
                class="admin-price-input" 
                data-dest-id="${dest.id}"
                value="${dest.price}"
                min="0"
                step="50"
                placeholder="Ingrese precio"
            >
        </div>
    `).join('');
}

function saveAdminPrices() {
    const inputs = document.querySelectorAll('.admin-price-input');
    const updates = {};
    
    inputs.forEach(input => {
        const destId = parseInt(input.dataset.destId);
        const newPrice = parseFloat(input.value) || 0;
        
        const dest = destinationsData.find(d => d.id === destId);
        if (dest) {
            dest.price = newPrice;
            updates[destId] = newPrice;
        }
    });

    // Guardar en localStorage
    localStorage.setItem('goodcall_prices', JSON.stringify(updates));

    // Re-renderizar destinos
    renderDestinations();

    // Notificación
    showNotification('✅ Precios actualizados correctamente', 'success');

    // Cerrar panel
    setTimeout(() => {
        document.getElementById('adminPanel').classList.remove('active');
    }, 800);
}

function loadSavedPrices() {
    const saved = localStorage.getItem('goodcall_prices');
    if (!saved) return;

    try {
        const prices = JSON.parse(saved);
        Object.keys(prices).forEach(destId => {
            const dest = destinationsData.find(d => d.id === parseInt(destId));
            if (dest) {
                dest.price = prices[destId];
            }
        });
    } catch (e) {
        console.error('Error loading saved prices:', e);
    }
}

// ===========================================
// EFECTOS PARALLAX EN HERO
// ===========================================
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 50;
            const y = (mouseY - 0.5) * speed * 50;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===========================================
// LOADING SCREEN
// ===========================================
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
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
// CURSOR PERSONALIZADO (OPCIONAL)
// ===========================================
function initCustomCursor() {
    // Solo en desktop
    if (window.innerWidth < 1024) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    Object.assign(cursor.style, {
        width: '20px',
        height: '20px',
        border: '2px solid #2e5d7f',
        borderRadius: '50%',
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '9999',
        transition: 'transform 0.2s ease',
        opacity: '0'
    });
    
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    function animate() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Agrandar cursor en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#1a3a52';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#2e5d7f';
        });
    });
}

// ===========================================
// INICIALIZACIÓN GLOBAL
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🌍 Good Call Travel - Sistema Inicializado', 'font-size: 20px; font-weight: bold; color: #1a3a52; background: #e8f2f7; padding: 10px; border-radius: 5px;');
    
    // Inicializar todos los módulos
    hideLoadingScreen();
    renderDestinations();
    initAOS();
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initBackToTop();
    initSearchForm();  // ✅ NUEVO: Formulario de búsqueda con API
    initForms();
    initAdminPanel();
    initParallax();
    animateNumbers();
    initLazyLoading();
    // initCustomCursor(); // Descomentar si deseas cursor personalizado
    
    console.log('✅ Todos los módulos cargados correctamente');
});

// ===========================================
// OPTIMIZACIÓN DE RENDIMIENTO
// ===========================================
// Throttle function para optimizar eventos de scroll
function throttle(func, wait) {
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

// Debounce function para resize events
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

// Optimizar resize events
window.addEventListener('resize', debounce(() => {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

console.log('%c✨ Good Call Travel - Premium Experience', 'font-size: 16px; font-weight: bold; color: #2e5d7f; padding: 5px;');
// ===========================================
// FORMULARIO DE BÚSQUEDA CON API REAL DE COSTAMAR
// ===========================================
function initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    const quoteModal = document.getElementById('quoteModal');
    const closeQuoteBtn = document.getElementById('closeQuote');
    const newSearchBtn = document.getElementById('newSearch');
    const bookNowBtn = document.getElementById('bookNow');
    const searchError = document.getElementById('searchError');
    
    if (!searchForm || !quoteModal) {
        console.warn('Elementos del formulario de búsqueda no encontrados');
        return;
    }
    
    // Configurar fechas mínimas
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    // Función para convertir fecha YYYY-MM-DD a YYYYMMDD
    function formatearFechaParaAPI(fechaISO) {
        return fechaISO.replace(/-/g, '');
    }
    
    // Manejar envío del formulario
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Ocultar error previo
        if (searchError) {
            searchError.style.display = 'none';
        }
        
        // Obtener valores del formulario
        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const date = document.getElementById('date').value;
        const travelers = parseInt(document.getElementById('travelers').value);
        
        // Validar campos
        if (!origin || !destination || !date || !travelers) {
            if (searchError) {
                searchError.style.display = 'block';
            }
            return;
        }
        
        // Extraer solo el nombre de la ciudad
        const originCity = origin.split(',')[0].trim();
        const destinationCity = destination.split(',')[0].trim();
        
        // Obtener códigos IATA
        if (!window.CotizadorCostamar) {
            showNotification('❌ Error: Cotizador no cargado. Recarga la página.', 'error');
            return;
        }
        
        const codigoOrigen = window.CotizadorCostamar.obtenerCodigoIATA(originCity);
        const codigoDestino = window.CotizadorCostamar.obtenerCodigoIATA(destinationCity);
        
        if (!codigoOrigen || !codigoDestino) {
            showNotification(`❌ Error: No se encontró código IATA para ${!codigoOrigen ? originCity : destinationCity}`, 'error');
            return;
        }
        
        // Convertir fecha al formato de la API
        const fechaIda = formatearFechaParaAPI(date);
        
        console.log('📋 Iniciando cotización:', {
            origen: `${originCity} (${codigoOrigen})`,
            destino: `${destinationCity} (${codigoDestino})`,
            fechaIda,
            adultos: travelers
        });
        
        // Mostrar modal con loading
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const quoteLoading = document.getElementById('quoteLoading');
        const quoteResult = document.getElementById('quoteResult');
        
        if (quoteLoading) quoteLoading.style.display = 'flex';
        if (quoteResult) quoteResult.style.display = 'none';
        
        try {
            // Llamar al cotizador de API real
            const resultado = await window.CotizadorCostamar.cotizarConFees({
                origen: codigoOrigen,
                destino: codigoDestino,
                fechaIda,
                fechaVuelta: null,
                adultos: travelers,
                ninos: 0,
                infantes: 0,
                maxResultados: 5
            });
            
            console.log('✅ Resultado de cotización:', resultado);
            
            if (resultado.success && resultado.vuelos && resultado.vuelos.length > 0) {
                // Ocultar loading y mostrar resultado
                if (quoteLoading) quoteLoading.style.display = 'none';
                if (quoteResult) quoteResult.style.display = 'block';
                
                // Tomar el mejor vuelo (más barato)
                const mejorVuelo = resultado.vuelos[0];
                
                // Llenar los datos del resultado
                document.getElementById('quoteOrigin').textContent = `${originCity} (${codigoOrigen})`;
                document.getElementById('quoteDestination').textContent = `${destinationCity} (${codigoDestino})`;
                document.getElementById('quoteDate').textContent = new Date(date).toLocaleDateString('es-PE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                document.getElementById('quoteTravelers').textContent = `${travelers} ${travelers === 1 ? 'persona' : 'personas'}`;
                
                // Calcular desglose de precios
                const precioBase = mejorVuelo.precio_base * travelers;
                const feeTotal = mejorVuelo.fee_total;
                const precioTotal = mejorVuelo.precio_final * travelers;
                
                document.getElementById('basePrice').textContent = `${mejorVuelo.moneda_final} ${precioBase.toLocaleString('es-PE')}`;
                document.getElementById('flightLabel').textContent = `Fee de servicio (${mejorVuelo.aerolinea})`;
                document.getElementById('flightCost').textContent = `${mejorVuelo.moneda_final} ${(feeTotal * (resultado.moneda === 'PEN' ? 3.60 : 1)).toLocaleString('es-PE')}`;
                
                // Sin descuento por grupo en esta versión
                document.getElementById('groupDiscount').textContent = 'S/ 0';
                document.getElementById('groupDiscount').style.color = 'rgba(255,255,255,0.6)';
                
                // Sin ajuste de temporada visible
                document.getElementById('seasonLabel').textContent = 'Ajuste de temporada';
                document.getElementById('seasonAdjustment').textContent = 'S/ 0';
                
                // Precio total
                document.getElementById('totalPrice').textContent = `${mejorVuelo.moneda_final} ${precioTotal.toLocaleString('es-PE')}`;
                
                // Información adicional del vuelo en consola
                console.log('✈️ Detalles del mejor vuelo:', {
                    aerolinea: mejorVuelo.aerolinea,
                    salida: mejorVuelo.hora_salida,
                    llegada: mejorVuelo.hora_llegada,
                    duracion: mejorVuelo.duracion,
                    escalas: mejorVuelo.escalas,
                    equipaje: mejorVuelo.equipaje,
                    precio: `${mejorVuelo.moneda_final} ${mejorVuelo.precio_final}`
                });
                
                // Guardar datos para referencia
                window.lastQuoteData = resultado;
                
            } else {
                throw new Error(resultado.error || 'No se encontraron vuelos disponibles');
            }
            
        } catch (error) {
            console.error('❌ Error en cotización:', error);
            
            if (quoteLoading) quoteLoading.style.display = 'none';
            if (quoteResult) {
                quoteResult.style.display = 'block';
                quoteResult.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: white;">
                        <h2 style="font-size: 2rem; margin-bottom: 1rem;">❌ Error</h2>
                        <p style="margin-bottom: 1.5rem;">${error.message}</p>
                        <button onclick="document.getElementById('quoteModal').classList.remove('active'); document.body.style.overflow='';" 
                                style="background: white; color: #1a3a52; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            Cerrar
                        </button>
                    </div>
                `;
            }
            
            showNotification(`❌ ${error.message}`, 'error');
        }
    });
    
    // Botón cerrar modal
    if (closeQuoteBtn) {
        closeQuoteBtn.addEventListener('click', () => {
            quoteModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Botón nueva búsqueda
    if (newSearchBtn) {
        newSearchBtn.addEventListener('click', () => {
            quoteModal.classList.remove('active');
            document.body.style.overflow = '';
            searchForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Botón reservar ahora
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', () => {
            quoteModal.classList.remove('active');
            document.body.style.overflow = '';
            showNotification('✅ ¡Excelente! Redirigiendo al formulario de contacto...', 'success');
            setTimeout(() => {
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        });
    }
    
    // Cerrar modal al hacer clic fuera
    quoteModal.addEventListener('click', (e) => {
        if (e.target === quoteModal) {
            quoteModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    console.log('✅ Formulario de búsqueda inicializado con API REAL de Costamar');
}

console.log('%c✨ Good Call Travel - Con API Real de Costamar', 'font-size: 16px; font-weight: bold; color: #2e5d7f; padding: 5px;');
