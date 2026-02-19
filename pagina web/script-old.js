// =============================================
// GOOD CALL TRAVEL - JAVASCRIPT PROFESIONAL 2026
// =============================================

// =============================================
// DATOS DE DESTINOS
// =============================================
const destinationsData = [
    {
        id: 1,
        name: "Machu Picchu",
        location: "Cusco, Peru",
        category: "Aventura",
        price: "6,650",
        description: "La ciudad sagrada de los Incas. Historia milenaria, paisajes andinos impresionantes y una experiencia cultural unica en el mundo.",
        features: ["Guia certificado en historia inca", "Hotel 4 estrellas en Cusco", "Tren panoramico incluido", "5 dias / 4 noches"],
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=85",
        badge: "Mas Popular",
        featured: true
    },
    {
        id: 2,
        name: "Santorini",
        location: "Grecia",
        category: "Premium",
        price: "9,250",
        description: "Atardeceres iconicos sobre el Mar Egeo, arquitectura cicladica y gastronomia mediterranea de primer nivel.",
        features: ["Hotel boutique con vista al mar", "Tour de vinos y cata incluida", "Crucero privado al atardecer", "7 dias / 6 noches"],
        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=85",
        badge: null,
        featured: false
    },
    {
        id: 3,
        name: "Maldivas",
        location: "Oceano Indico",
        category: "Playa",
        price: "11,840",
        description: "Aguas turquesas, arrecifes de coral y villas sobre el agua. El destino de playa mas exclusivo del mundo.",
        features: ["Villa privada sobre el agua", "Resort all-inclusive 5 estrellas", "Spa y deportes acuaticos", "6 dias / 5 noches"],
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=85",
        badge: null,
        featured: false
    },
    {
        id: 4,
        name: "Tokio",
        location: "Japon",
        category: "Cultural",
        price: "10,360",
        description: "La metropolis mas vibrante de Asia combina tradicion milenaria con tecnologia de vanguardia en perfecta armonia.",
        features: ["Guia cultural bilingue", "JR Pass nacional incluido", "Ceremonia del te tradicional", "8 dias / 7 noches"],
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=85",
        badge: null,
        featured: false
    },
    {
        id: 5,
        name: "Paris",
        location: "Francia",
        category: "Romance",
        price: "8,880",
        description: "La ciudad del arte, la moda y la gastronomia. Monumentos iconicos, museos de clase mundial y una atmosta inigualable.",
        features: ["Hotel boutique en Le Marais", "Acceso prioritario a museos", "Cena en la Torre Eiffel", "6 dias / 5 noches"],
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=85",
        badge: null,
        featured: false
    },
    {
        id: 6,
        name: "Bali",
        location: "Indonesia",
        category: "Bienestar",
        price: "7,770",
        description: "La Isla de los Dioses. Templos ancestrales, terrazas de arroz esmeraldas y una cultura espiritual unica.",
        features: ["Villa privada con piscina", "Retiro de yoga y meditacion", "Tour espiritual por templos", "7 dias / 6 noches"],
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=85",
        badge: null,
        featured: false
    }
];

// =============================================
// RENDERIZAR DESTINOS
// =============================================
function renderDestinations() {
    const container = document.getElementById('destinations-container');
    if (!container) return;

    container.innerHTML = destinationsData.map(dest => `
        <article class="dest-card fade-in">
            <div class="dest-img-wrap">
                <img src="${dest.image}" alt="${dest.name}" loading="lazy">
                ${dest.badge ? `<span class="dest-badge">${dest.badge}</span>` : ''}
                <span class="dest-tag">${dest.category}</span>
            </div>
            <div class="dest-body">
                <div class="dest-meta">
                    <div>
                        <h3 class="dest-name">${dest.name}</h3>
                        <p style="font-size:.775rem;color:var(--text-muted);margin-top:.15rem">${dest.location}</p>
                    </div>
                    <div class="dest-price">
                        <span class="dest-price-from">Desde</span>
                        <span class="dest-price-val">S/ ${dest.price}</span>
                    </div>
                </div>
                <p class="dest-desc">${dest.description}</p>
                <ul class="dest-feats">
                    ${dest.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <a href="#contacto" class="dest-link">
                    <span>Consultar disponibilidad</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            </div>
        </article>
    `).join('');

    observeFadeIns();
}

// =============================================
// PRECIOS DEL ADMIN (localStorage)
// =============================================
function loadSavedPrices() {
    const saved = localStorage.getItem('gct_prices');
    if (!saved) return;
    try {
        const prices = JSON.parse(saved);
        Object.entries(prices).forEach(([id, price]) => {
            const dest = destinationsData.find(d => d.id === parseInt(id));
            if (dest) dest.price = price;
        });
    } catch (e) { }
}

// =============================================
// NAVBAR
// =============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');

    if (!navbar) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Burger menu
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            burger.classList.toggle('open', isOpen);
            burger.setAttribute('aria-expanded', isOpen);
        });

        // Cerrar al hacer click en enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                burger.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                navLinks.classList.remove('open');
                burger.classList.remove('open');
            }
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
                navLinkEls.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + section.id) {
                        link.style.color = 'var(--navy)';
                    }
                });
            }
        });
    }, { passive: true });
}

// =============================================
// SMOOTH SCROLL
// =============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = 72;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        });
    });
}

// =============================================
// HERO SLIDESHOW
// =============================================
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;

    let current = 0;
    let timer;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
    }

    function autoPlay() {
        timer = setInterval(() => goTo(current + 1), 5500);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(timer);
            goTo(i);
            autoPlay();
        });
    });

    autoPlay();
}

// =============================================
// FORMULARIO DE BUSQUEDA
// =============================================
function initSearchForm() {
    const form = document.getElementById('searchForm');
    if (!form) return;

    // Fecha minima = manana
    const dateInput = document.getElementById('date');
    const returnInput = document.getElementById('returnDate');
    const returnField = document.getElementById('returnField');

    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const iso = tomorrow.toISOString().split('T')[0];
        dateInput.min = iso;
        dateInput.value = iso;
    }

    // --- LOGICA REFINADA TABS IDA / IDA Y VUELTA (Fase 3) ---
    const tabs = document.querySelectorAll('.cot-tab');
    let tripMode = 'oneway';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tripMode = tab.dataset.mode;

            if (tripMode === 'roundtrip') {
                if (returnInput) {
                    returnInput.disabled = false;
                    returnInput.required = true;
                }
                if (returnField) returnField.classList.add('enabled');
                if (dateInput && dateInput.value && returnInput) {
                    const min = new Date(dateInput.value);
                    min.setDate(min.getDate() + 1);
                    returnInput.min = min.toISOString().split('T')[0];
                }
            } else {
                if (returnInput) {
                    returnInput.disabled = true;
                    returnInput.required = false;
                    returnInput.value = '';
                }
                if (returnField) returnField.classList.remove('enabled');
            }
        });
    });

    dateInput?.addEventListener('change', () => {
        if (tripMode === 'roundtrip' && returnInput) {
            const min = new Date(dateInput.value);
            min.setDate(min.getDate() + 1);
            returnInput.min = min.toISOString().split('T')[0];
            if (returnInput.value && returnInput.value <= dateInput.value) {
                returnInput.value = '';
            }
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const errorEl = document.getElementById('cotError');
        if (errorEl) errorEl.style.display = 'none';

        const origin = document.getElementById('origin')?.value.trim();
        const destination = document.getElementById('destination')?.value.trim();
        const date = document.getElementById('date')?.value;
        const travelers = document.getElementById('travelers')?.value;
        const returnDate = document.getElementById('returnDate')?.value;

        // Validar campos base
        if (!origin || !destination || !date || !travelers) {
            showNotif('Por favor completa todos los campos de busqueda.', 'error');
            return;
        }

        // Validar fecha de regreso si es ida y vuelta
        if (tripMode === 'roundtrip' && !returnDate) {
            showNotif('Por favor selecciona la fecha de regreso.', 'error');
            return;
        }

        // Construir parametros
        const params = new URLSearchParams({
            origin,
            destination,
            date,
            travelers,
            tripMode,
            ...(tripMode === 'roundtrip' && returnDate ? { returnDate } : {})
        });

        // Si tienes el modulo CotizadorCostamar usa redirección
        if (window.CotizadorCostamar) {
            window.location.href = `resultados.html?${params.toString()}`;
        } else {
            // Fallback: scroll a contacto
            showNotif('Recibimos tu solicitud. Te redirigimos a nuestro formulario de contacto.', 'success');
            setTimeout(() => {
                const contact = document.getElementById('contacto');
                if (contact) {
                    window.scrollTo({ top: contact.offsetTop - 72, behavior: 'smooth' });
                }
            }, 1200);
        }
    });
}

// =============================================
// FORMULARIO DE CONTACTO
// =============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;

        btn.disabled = true;
        btn.textContent = 'Enviando...';

        // Simulacion de envio - reemplaza con tu backend
        await new Promise(r => setTimeout(r, 1600));

        btn.disabled = false;
        btn.textContent = original;
        form.reset();
        showNotif('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
    });
}

// =============================================
// BACK TO TOP
// =============================================
function initBackToTop() {
    const btn = document.getElementById('backTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =============================================
// NOTIFICACIONES
// =============================================
function showNotif(message, type = 'success') {
    const notif = document.getElementById('notif');
    if (!notif) return;

    notif.textContent = message;
    notif.className = `notif ${type} show`;

    clearTimeout(notif._timer);
    notif._timer = setTimeout(() => {
        notif.classList.remove('show');
    }, 4500);
}

// =============================================
// FADE IN ON SCROLL
// =============================================
function observeFadeIns() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
}

// =============================================
// ANIMACION NUMEROS HERO STATS
// =============================================
function animateStats() {
    const stats = document.querySelectorAll('.hstat strong');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent;
            const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
            if (isNaN(num)) return;

            const hasComma = raw.includes(',');
            const hasDot = raw.includes('.') && !hasComma;
            const suffix = raw.replace(/[\d.,]/g, '');
            const prefix = '';
            const duration = 1800;
            const steps = 50;
            let step = 0;

            const interval = setInterval(() => {
                step++;
                const progress = step / steps;
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = num * eased;

                let display;
                if (hasDot) {
                    display = current.toFixed(1);
                } else if (hasComma) {
                    display = Math.round(current).toLocaleString('es-PE');
                } else {
                    display = Math.round(current).toString();
                }

                el.textContent = prefix + display + suffix;

                if (step >= steps) {
                    clearInterval(interval);
                    el.textContent = raw;
                }
            }, duration / steps);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
}

// =============================================
// ADMIN PANEL (protegido por contrasena)
// =============================================
function initAdminPanel() {
    // Activar con Ctrl + Shift + A
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            const pass = prompt('Contrasena de administrador:');
            if (pass !== 'goodcall2026') {
                if (pass !== null) showNotif('Contrasena incorrecta.', 'error');
                return;
            }
            openAdminPanel();
        }
    });
}

function openAdminPanel() {
    const existing = document.getElementById('adminOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'adminOverlay';
    Object.assign(overlay.style, {
        position: 'fixed', inset: '0',
        background: 'rgba(0,0,0,.6)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
    });

    overlay.innerHTML = `
        <div style="background:#fff;border-radius:16px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
            <div style="background:var(--navy);padding:1.5rem;border-radius:16px 16px 0 0;display:flex;justify-content:space-between;align-items:center">
                <h3 style="color:#fff;font-family:var(--font-body);font-size:1rem;font-weight:600;letter-spacing:.03em">Panel de Administracion</h3>
                <button onclick="document.getElementById('adminOverlay').remove()" style="color:#fff;font-size:1.5rem;background:none;border:none;cursor:pointer;line-height:1;opacity:.7">&times;</button>
            </div>
            <div style="padding:1.5rem;display:flex;flex-direction:column;gap:1rem">
                <p style="font-size:.8rem;color:#6b6560;background:#f7f5f2;padding:.875rem;border-radius:8px;line-height:1.6">Los cambios se guardan localmente en el navegador y se aplican de forma inmediata.</p>
                ${destinationsData.map(dest => `
                    <div style="border:1px solid #ddd9d2;border-radius:8px;padding:1rem">
                        <p style="font-size:.825rem;font-weight:600;color:#0f2335;margin-bottom:.5rem">${dest.name} - ${dest.location}</p>
                        <label style="font-size:.7rem;color:#9e9990;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:.35rem">Precio en Soles (S/)</label>
                        <input type="number" data-dest-id="${dest.id}" value="${dest.price.replace(/,/g, '')}" step="50"
                            style="width:100%;padding:.625rem .875rem;border:1.5px solid #ddd9d2;border-radius:6px;font-size:.875rem;font-family:inherit;outline:none"
                        >
                    </div>
                `).join('')}
                <button onclick="saveAdminPrices()" style="padding:.875rem;background:var(--navy);color:#fff;border:none;border-radius:8px;font-size:.875rem;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:.04em">Guardar Cambios</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function saveAdminPrices() {
    const inputs = document.querySelectorAll('[data-dest-id]');
    const updates = {};
    inputs.forEach(input => {
        const id = parseInt(input.dataset.destId);
        const val = parseFloat(input.value) || 0;
        const formatted = val.toLocaleString('es-PE');
        const dest = destinationsData.find(d => d.id === id);
        if (dest) { dest.price = formatted; updates[id] = formatted; }
    });
    localStorage.setItem('gct_prices', JSON.stringify(updates));
    document.getElementById('adminOverlay')?.remove();
    renderDestinations();
    showNotif('Precios actualizados correctamente.', 'success');
}

// =============================================
// INICIALIZACION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    loadSavedPrices();
    renderDestinations();
    initNavbar();
    initSmoothScroll();
    initHeroSlideshow();
    initSearchForm();
    initContactForm();
    initBackToTop();
    animateStats();
    initAdminPanel();

    // Fade in para secciones
    document.querySelectorAll('.serv-card, .test-card, .about-feat, .trust-item, .contact-item').forEach(el => {
        el.classList.add('fade-in');
    });
    observeFadeIns();
});