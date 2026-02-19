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
// Redundant initSearchForm removed (Moved to line 948)

// Old modal logic removed (Merged into initSearchForm and new modal)

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

    handleForm(contactForm, '¡Gracias! Nos pondremos en contacto contigo pronto.');
    handleForm(hiringForm, '¡Postulación recibida! Revisaremos tu perfil pronto.');
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
    showNotification('Precios actualizados correctamente', 'success');

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
    console.log('%cGood Call Travel - Sistema Inicializado', 'font-size: 20px; font-weight: bold; color: #1a3a52; background: #e8f2f7; padding: 10px; border-radius: 5px;');

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

    console.log('Todos los módulos cargados correctamente');
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

console.log('%cGood Call Travel - Premium Experience', 'font-size: 16px; font-weight: bold; color: #2e5d7f; padding: 5px;');
// ===========================================
// FORMULARIO DE BÚSQUEDA CON REDIRECCIÓN A RESULTADOS
// ===========================================
function initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    const searchError = document.getElementById('searchError');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const returnField = document.getElementById('returnField');
    const returnDateInput = document.getElementById('returnDate');
    const dateInput = document.getElementById('date');

    if (!searchForm) {
        console.warn('Elementos del formulario de búsqueda no encontrados');
        return;
    }

    // Lógica de Toggles de Tipo de Viaje
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const isRoundTrip = btn.dataset.type === 'roundtrip';
            if (returnField) {
                returnField.style.display = isRoundTrip ? 'flex' : 'none';
            }
            if (returnDateInput) {
                returnDateInput.required = isRoundTrip;
                if (!isRoundTrip) returnDateInput.value = '';
            }
        });
    });

    // Configurar fechas mínimas
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
        if (returnDateInput) {
            returnDateInput.min = tomorrow.toISOString().split('T')[0];
        }
    }

    // Manejar envío del formulario
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ocultar error previo
        if (searchError) searchError.style.display = 'none';

        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const date = document.getElementById('date').value;
        const returnDate = document.getElementById('returnDate')?.value || '';
        const adults = document.getElementById('adults')?.value || '1';
        const children = document.getElementById('children')?.value || '0';
        const cabinClass = document.getElementById('cabinClass')?.value || 'ECONOMY';

        if (!origin || !destination || !date) {
            if (searchError) {
                searchError.style.display = 'block';
                searchError.textContent = 'Por favor, completa todos los campos.';
            }
            return;
        }

        const params = new URLSearchParams({
            origin, destination, date, returnDate, adults, children, cabinClass
        });

        window.location.href = `resultados.html?${params.toString()}`;
    });

    console.log('Formulario de búsqueda inicializado con redirección');
}

console.log('%cGood Call Travel - Con API Real de Costamar', 'font-size: 16px; font-weight: bold; color: #2e5d7f; padding: 5px;');
