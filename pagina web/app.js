// ============================================
// APP.JS - COTIZADOR DE VUELOS PROFESIONAL
// ============================================

// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================

const API_URL = 'http://localhost:5000'; // URL del backend Flask

const AIRPORTS = [
    { code: 'LIM', name: 'Lima', fullName: 'Jorge Chávez' },
    { code: 'CUZ', name: 'Cusco', fullName: 'Alejandro Velasco Astete' },
    { code: 'AQP', name: 'Arequipa', fullName: 'Rodríguez Ballón' },
    { code: 'TRU', name: 'Trujillo', fullName: 'Carlos Martínez' },
    { code: 'IQT', name: 'Iquitos', fullName: 'Francisco Secada' },
    { code: 'PIU', name: 'Piura', fullName: 'Guillermo Concha' },
    { code: 'MIA', name: 'Miami', fullName: 'Internacional' },
    { code: 'CUN', name: 'Cancún', fullName: 'Internacional' },
    { code: 'BOG', name: 'Bogotá', fullName: 'El Dorado' },
    { code: 'SCL', name: 'Santiago', fullName: 'Arturo Merino' }
];

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================

const state = {
    tripType: 'roundtrip',
    passengers: {
        adults: 1,
        children: 0,
        infants: 0
    },
    searchResults: {
        outbound: [],
        return: []
    },
    selectedFlights: {
        outbound: null,
        return: null
    },
    selectedFare: null,
    searchParams: null
};

// ============================================
// ELEMENTOS DOM
// ============================================

const DOM = {
    // Form elements
    searchForm: document.getElementById('searchForm'),
    tripTypeRadios: document.querySelectorAll('input[name="tripType"]'),
    originInput: document.getElementById('origin'),
    destinationInput: document.getElementById('destination'),
    swapBtn: document.getElementById('swapBtn'),
    departDateInput: document.getElementById('departDate'),
    returnDateInput: document.getElementById('returnDate'),
    returnDateGroup: document.getElementById('returnDateGroup'),
    passengersInput: document.getElementById('passengers'),
    passengersDropdown: document.getElementById('passengersDropdown'),
    
    // Counter elements
    adultsCount: document.getElementById('adultsCount'),
    childrenCount: document.getElementById('childrenCount'),
    infantsCount: document.getElementById('infantsCount'),
    
    // Results elements
    resultsSection: document.getElementById('resultsSection'),
    loadingState: document.getElementById('loadingState'),
    resultsHeader: document.getElementById('resultsHeader'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultsSubtitle: document.getElementById('resultsSubtitle'),
    resultsGrid: document.getElementById('resultsGrid'),
    outboundFlights: document.getElementById('outboundFlights'),
    returnFlights: document.getElementById('returnFlights'),
    returnSection: document.getElementById('returnSection'),
    emptyState: document.getElementById('emptyState'),
    
    // Price sidebar
    priceSidebar: document.getElementById('priceSidebar'),
    priceBreakdown: document.getElementById('priceBreakdown'),
    fareOptions: document.getElementById('fareOptions'),
    selectFlightBtn: document.getElementById('selectFlightBtn'),
    
    // Filters
    sortBy: document.getElementById('sortBy'),
    directOnly: document.getElementById('directOnly')
};

// ============================================
// INICIALIZACIÓN
// ============================================

function init() {
    setupEventListeners();
    setDefaultDates();
    updatePassengersDisplay();
}

function setupEventListeners() {
    // Trip type change
    DOM.tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleTripTypeChange);
    });
    
    // Swap button
    DOM.swapBtn.addEventListener('click', handleSwap);
    
    // Passengers dropdown
    DOM.passengersInput.addEventListener('click', togglePassengersDropdown);
    document.addEventListener('click', handleOutsideClick);
    
    // Counter buttons
    document.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', handleCounterClick);
    });
    
    // Form submit
    DOM.searchForm.addEventListener('submit', handleSearchSubmit);
    
    // Date inputs
    DOM.departDateInput.addEventListener('change', handleDepartDateChange);
    
    // Filters
    DOM.sortBy.addEventListener('change', handleSort);
    DOM.directOnly.addEventListener('change', handleFilter);
    
    // Select flight button
    DOM.selectFlightBtn.addEventListener('click', handleSelectFlight);
}

function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekLater = new Date(tomorrow);
    weekLater.setDate(weekLater.getDate() + 7);
    
    DOM.departDateInput.value = formatDateInput(tomorrow);
    DOM.returnDateInput.value = formatDateInput(weekLater);
    DOM.departDateInput.min = formatDateInput(today);
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleTripTypeChange(e) {
    state.tripType = e.target.value;
    
    if (state.tripType === 'oneway') {
        DOM.returnDateGroup.style.display = 'none';
        DOM.returnDateInput.removeAttribute('required');
    } else if (state.tripType === 'roundtrip') {
        DOM.returnDateGroup.style.display = '';
        DOM.returnDateInput.setAttribute('required', '');
    } else if (state.tripType === 'multicity') {
        alert('La opción multidestino estará disponible próximamente.');
        // Reset to roundtrip
        document.querySelector('input[name="tripType"][value="roundtrip"]').checked = true;
        state.tripType = 'roundtrip';
    }
}

function handleSwap() {
    const temp = DOM.originInput.value;
    DOM.originInput.value = DOM.destinationInput.value;
    DOM.destinationInput.value = temp;
}

function togglePassengersDropdown(e) {
    e.stopPropagation();
    DOM.passengersDropdown.classList.toggle('active');
}

function handleOutsideClick(e) {
    if (!e.target.closest('.passengers-input') && !e.target.closest('.passengers-dropdown')) {
        DOM.passengersDropdown.classList.remove('active');
    }
}

function handleCounterClick(e) {
    e.stopPropagation();
    const action = e.currentTarget.dataset.action;
    const field = e.currentTarget.dataset.field;
    
    if (action === 'increase') {
        state.passengers[field]++;
    } else if (action === 'decrease' && state.passengers[field] > 0) {
        if (field === 'adults' && state.passengers[field] === 1) {
            return; // Minimum 1 adult
        }
        state.passengers[field]--;
    }
    
    // Validate infants <= adults
    if (state.passengers.infants > state.passengers.adults) {
        state.passengers.infants = state.passengers.adults;
    }
    
    updatePassengersDisplay();
}

function updatePassengersDisplay() {
    const { adults, children, infants } = state.passengers;
    
    DOM.adultsCount.textContent = adults;
    DOM.childrenCount.textContent = children;
    DOM.infantsCount.textContent = infants;
    
    const total = adults + children + infants;
    let text = '';
    const parts = [];
    
    if (adults > 0) parts.push(`${adults} Adulto${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Niño${children > 1 ? 's' : ''}`);
    if (infants > 0) parts.push(`${infants} Bebé${infants > 1 ? 's' : ''}`);
    
    text = parts.join(', ');
    DOM.passengersInput.value = text;
    
    // Update counter buttons state
    document.querySelector('[data-field="adults"][data-action="decrease"]').disabled = (adults <= 1);
    document.querySelector('[data-field="children"][data-action="decrease"]').disabled = (children <= 0);
    document.querySelector('[data-field="infants"][data-action="decrease"]').disabled = (infants <= 0);
}

function handleDepartDateChange() {
    const departDate = new Date(DOM.departDateInput.value);
    const returnDate = new Date(DOM.returnDateInput.value);
    
    if (returnDate <= departDate) {
        const newReturn = new Date(departDate);
        newReturn.setDate(newReturn.getDate() + 1);
        DOM.returnDateInput.value = formatDateInput(newReturn);
    }
    
    DOM.returnDateInput.min = DOM.departDateInput.value;
}

async function handleSearchSubmit(e) {
    e.preventDefault();
    
    const origin = extractAirportCode(DOM.originInput.value);
    const destination = extractAirportCode(DOM.destinationInput.value);
    
    if (!origin || !destination) {
        alert('Por favor, selecciona aeropuertos válidos de la lista.');
        return;
    }
    
    if (origin === destination) {
        alert('El origen y destino deben ser diferentes.');
        return;
    }
    
    const departDate = DOM.departDateInput.value.replace(/-/g, '');
    const returnDate = state.tripType === 'roundtrip' ? DOM.returnDateInput.value.replace(/-/g, '') : null;
    
    state.searchParams = {
        origin,
        destination,
        departDate,
        returnDate,
        tripType: state.tripType,
        passengers: { ...state.passengers }
    };
    
    await searchFlights();
}

async function searchFlights() {
    showLoading();
    
    try {
        // Use mock data if backend is not available
        const useMockData = true; // Change to false when backend is ready
        
        if (useMockData) {
            await mockSearchFlights();
        } else {
            await realSearchFlights();
        }
        
        displayResults();
    } catch (error) {
        console.error('Error searching flights:', error);
        alert('Hubo un error al buscar vuelos. Por favor, intenta nuevamente.');
        hideLoading();
    }
}

async function mockSearchFlights() {
    // Simulate API delay
    await sleep(1500);
    
    // Generate mock flights
    state.searchResults.outbound = generateMockFlights(
        state.searchParams.origin,
        state.searchParams.destination,
        state.searchParams.departDate
    );
    
    if (state.searchParams.returnDate) {
        state.searchResults.return = generateMockFlights(
            state.searchParams.destination,
            state.searchParams.origin,
            state.searchParams.returnDate
        );
    } else {
        state.searchResults.return = [];
    }
}

async function realSearchFlights() {
    const response = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.searchParams)
    });
    
    if (!response.ok) {
        throw new Error('Error fetching flights');
    }
    
    const data = await response.json();
    state.searchResults.outbound = data.outbound || [];
    state.searchResults.return = data.return || [];
}

function showLoading() {
    DOM.resultsSection.style.display = 'block';
    DOM.loadingState.style.display = 'block';
    DOM.resultsHeader.style.display = 'none';
    DOM.resultsGrid.style.display = 'none';
    
    // Scroll to results
    setTimeout(() => {
        DOM.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function hideLoading() {
    DOM.loadingState.style.display = 'none';
}

function displayResults() {
    hideLoading();
    
    if (state.searchResults.outbound.length === 0) {
        DOM.emptyState.style.display = 'block';
        DOM.resultsHeader.style.display = 'none';
        DOM.resultsGrid.style.display = 'none';
        return;
    }
    
    DOM.emptyState.style.display = 'none';
    DOM.resultsHeader.style.display = 'flex';
    DOM.resultsGrid.style.display = 'grid';
    DOM.priceSidebar.style.display = 'block';
    
    // Update results header
    const originName = getAirportName(state.searchParams.origin);
    const destName = getAirportName(state.searchParams.destination);
    DOM.resultsTitle.textContent = `${originName} → ${destName}`;
    
    const total = state.passengers.adults + state.passengers.children + state.passengers.infants;
    DOM.resultsSubtitle.textContent = `${total} pasajero${total > 1 ? 's' : ''} • ${formatDate(state.searchParams.departDate)}${state.searchParams.returnDate ? ' - ' + formatDate(state.searchParams.returnDate) : ''}`;
    
    // Render flights
    renderFlights();
    
    // Show return section if needed
    if (state.searchResults.return.length > 0) {
        DOM.returnSection.style.display = 'block';
    } else {
        DOM.returnSection.style.display = 'none';
    }
    
    // Reset selections
    state.selectedFlights.outbound = null;
    state.selectedFlights.return = null;
    state.selectedFare = null;
    updatePriceBreakdown();
}

function renderFlights() {
    DOM.outboundFlights.innerHTML = state.searchResults.outbound.map((flight, index) => 
        createFlightCard(flight, 'outbound', index)
    ).join('');
    
    if (state.searchResults.return.length > 0) {
        DOM.returnFlights.innerHTML = state.searchResults.return.map((flight, index) => 
            createFlightCard(flight, 'return', index)
        ).join('');
    }
    
    // Add click handlers
    document.querySelectorAll('.flight-card').forEach(card => {
        card.addEventListener('click', handleFlightSelect);
    });
}

function createFlightCard(flight, type, index) {
    const badges = [];
    if (flight.isDirect) {
        badges.push('<span class="badge badge-direct"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg> Directo</span>');
    }
    if (index === 0) {
        badges.push('<span class="badge badge-cheapest">Más económico</span>');
    }
    
    return `
        <div class="flight-card" data-type="${type}" data-index="${index}">
            <div class="flight-header">
                <div class="airline-info">
                    <img src="${flight.logo}" alt="${flight.airline}" class="airline-logo" onerror="this.style.display='none'">
                    <div>
                        <div class="airline-name">${flight.airline}</div>
                    </div>
                </div>
                <div class="flight-price">
                    <div class="price-label">Desde</div>
                    <div class="price-value">$${flight.price}</div>
                </div>
            </div>
            
            <div class="flight-details">
                <div class="flight-time">
                    <div class="time">${flight.departTime}</div>
                    <div class="airport">${flight.from}</div>
                </div>
                
                <div class="flight-duration">
                    <div class="duration-line"></div>
                    <div class="duration-info">${formatDuration(flight.duration)}${!flight.isDirect ? ' • 1 escala' : ''}</div>
                </div>
                
                <div class="flight-time">
                    <div class="time">${flight.arrivalTime}</div>
                    <div class="airport">${flight.to}</div>
                </div>
            </div>
            
            ${badges.length > 0 ? `<div class="flight-badges">${badges.join('')}</div>` : ''}
        </div>
    `;
}

function handleFlightSelect(e) {
    const card = e.currentTarget;
    const type = card.dataset.type;
    const index = parseInt(card.dataset.index);
    
    // Remove selection from other cards of same type
    document.querySelectorAll(`.flight-card[data-type="${type}"]`).forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
    
    // Update state
    if (type === 'outbound') {
        state.selectedFlights.outbound = state.searchResults.outbound[index];
    } else {
        state.selectedFlights.return = state.searchResults.return[index];
    }
    
    // Show fare options if outbound is selected
    if (state.selectedFlights.outbound) {
        renderFareOptions();
    }
    
    updatePriceBreakdown();
}

function renderFareOptions() {
    const baseFlight = state.selectedFlights.outbound;
    const fares = generateFareOptions(baseFlight);
    
    DOM.fareOptions.innerHTML = `
        <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: var(--spacing-md);">Selecciona tu tarifa</h4>
        ${fares.map((fare, index) => `
            <div class="fare-option ${index === 1 ? 'selected' : ''}" data-index="${index}">
                <div class="fare-header">
                    <span class="fare-name">${fare.name}</span>
                    <span class="fare-price">$${fare.price}</span>
                </div>
                <ul class="fare-features">
                    ${fare.features.map(f => `
                        <li class="${f.included ? '' : 'excluded'}">${f.text}</li>
                    `).join('')}
                </ul>
            </div>
        `).join('')}
    `;
    
    // Add click handlers
    document.querySelectorAll('.fare-option').forEach(option => {
        option.addEventListener('click', handleFareSelect);
    });
    
    // Select PLUS by default
    if (fares.length >= 2) {
        state.selectedFare = fares[1];
        updatePriceBreakdown();
    }
}

function handleFareSelect(e) {
    const option = e.currentTarget;
    const index = parseInt(option.dataset.index);
    
    // Remove selection from other options
    document.querySelectorAll('.fare-option').forEach(o => {
        o.classList.remove('selected');
    });
    
    // Add selection to clicked option
    option.classList.add('selected');
    
    // Get fare data
    const baseFlight = state.selectedFlights.outbound;
    const fares = generateFareOptions(baseFlight);
    state.selectedFare = fares[index];
    
    updatePriceBreakdown();
}

function updatePriceBreakdown() {
    if (!state.selectedFlights.outbound || !state.selectedFare) {
        DOM.priceBreakdown.innerHTML = '<p class="text-muted">Selecciona un vuelo para ver el precio</p>';
        DOM.selectFlightBtn.disabled = true;
        return;
    }
    
    const { adults, children, infants } = state.passengers;
    const farePrice = state.selectedFare.price;
    const isRoundTrip = state.searchParams.tripType === 'roundtrip' && state.selectedFlights.return;
    const multiplier = isRoundTrip ? 2 : 1;
    
    const adultsTotal = farePrice * multiplier * adults;
    const childrenTotal = farePrice * multiplier * 0.75 * children;
    const infantsTotal = farePrice * multiplier * 0.1 * infants;
    
    const subtotal = adultsTotal + childrenTotal + infantsTotal;
    const taxes = subtotal * 0.18;
    const total = subtotal + taxes;
    
    let html = '';
    
    if (adults > 0) {
        html += `<div class="price-row"><span>Adultos (${adults})</span><span>$${adultsTotal.toFixed(2)}</span></div>`;
    }
    if (children > 0) {
        html += `<div class="price-row"><span>Niños (${children})</span><span>$${childrenTotal.toFixed(2)}</span></div>`;
    }
    if (infants > 0) {
        html += `<div class="price-row"><span>Bebés (${infants})</span><span>$${infantsTotal.toFixed(2)}</span></div>`;
    }
    
    html += `<div class="price-row"><span class="text-muted">Impuestos y tasas</span><span>$${taxes.toFixed(2)}</span></div>`;
    html += `<div class="price-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>`;
    
    DOM.priceBreakdown.innerHTML = html;
    
    // Enable select button if all required flights are selected
    const canSelect = state.selectedFlights.outbound && 
                     (state.searchParams.tripType === 'oneway' || state.selectedFlights.return);
    DOM.selectFlightBtn.disabled = !canSelect;
}

function handleSort() {
    const sortBy = DOM.sortBy.value;
    
    // Sort outbound flights
    state.searchResults.outbound.sort(getSortFunction(sortBy));
    
    // Sort return flights
    if (state.searchResults.return.length > 0) {
        state.searchResults.return.sort(getSortFunction(sortBy));
    }
    
    renderFlights();
}

function handleFilter() {
    // This would filter the results, but we'll keep it simple for now
    console.log('Filter changed:', DOM.directOnly.checked);
}

function handleSelectFlight() {
    if (!state.selectedFlights.outbound || !state.selectedFare) {
        return;
    }
    
    const message = `¡Reserva confirmada!\n\nVuelo de ida: ${state.selectedFlights.outbound.airline} ${state.selectedFlights.outbound.flightNumber}\n` +
        (state.selectedFlights.return ? `Vuelo de regreso: ${state.selectedFlights.return.airline} ${state.selectedFlights.return.flightNumber}\n` : '') +
        `Tarifa: ${state.selectedFare.name}\n\nEsta es una demo con datos simulados.`;
    
    alert(message);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractAirportCode(value) {
    if (!value) return null;
    const match = value.match(/^([A-Z]{3})/);
    return match ? match[1] : null;
}

function getAirportName(code) {
    const airport = AIRPORTS.find(a => a.code === code);
    return airport ? airport.name : code;
}

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(dateStr) {
    // Convert YYYYMMDD to readable format
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const date = new Date(year, month - 1, day);
    
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${day} ${monthNames[date.getMonth()]}`;
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function getSortFunction(sortBy) {
    switch (sortBy) {
        case 'price':
            return (a, b) => a.price - b.price;
        case 'duration':
            return (a, b) => a.duration - b.duration;
        case 'departure':
            return (a, b) => a.departTime.localeCompare(b.departTime);
        default:
            return (a, b) => a.price - b.price;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// MOCK DATA GENERATORS
// ============================================

function generateMockFlights(from, to, date) {
    const airlines = [
        { code: 'LA', name: 'LATAM Airlines', logo: './sky.png' },
        { code: 'P9', name: 'Peruvian Airlines', logo: './sky.png' },
        { code: 'JZ', name: 'Sky Airline', logo: './sky.png' }
    ];
    
    const flights = [];
    const numFlights = 5;
    
    for (let i = 0; i < numFlights; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const isDirect = Math.random() > 0.3;
        const basePrice = 150 + Math.random() * 300;
        
        const departHour = Math.floor(Math.random() * 14) + 6;
        const departMinute = Math.floor(Math.random() * 4) * 15;
        const duration = isDirect ? 60 + Math.random() * 60 : 120 + Math.random() * 120;
        
        const arrivalTime = new Date(2026, 1, 20, departHour, departMinute);
        arrivalTime.setMinutes(arrivalTime.getMinutes() + duration);
        
        flights.push({
            id: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
            airline: airline.name,
            logo: airline.logo,
            from,
            to,
            departTime: `${String(departHour).padStart(2, '0')}:${String(departMinute).padStart(2, '0')}`,
            arrivalTime: `${String(arrivalTime.getHours()).padStart(2, '0')}:${String(arrivalTime.getMinutes()).padStart(2, '0')}`,
            duration: Math.floor(duration),
            isDirect,
            price: Math.round(basePrice),
            flightNumber: `${airline.code} ${Math.floor(Math.random() * 900) + 100}`
        });
    }
    
    return flights.sort((a, b) => a.price - b.price);
}

function generateFareOptions(baseFlight) {
    const basePrice = baseFlight.price;
    
    return [
        {
            name: 'LIGHT',
            price: basePrice,
            features: [
                { text: 'Bolso personal incluido', included: true },
                { text: 'Sin equipaje de mano', included: false },
                { text: 'Sin equipaje facturado', included: false },
                { text: 'Sin cambios', included: false }
            ]
        },
        {
            name: 'PLUS',
            price: Math.round(basePrice * 1.35),
            features: [
                { text: 'Bolso personal incluido', included: true },
                { text: 'Equipaje de mano 8kg', included: true },
                { text: '1 equipaje facturado 23kg', included: true },
                { text: 'Cambios con cargo', included: true }
            ]
        },
        {
            name: 'FULL',
            price: Math.round(basePrice * 1.75),
            features: [
                { text: 'Bolso personal incluido', included: true },
                { text: 'Equipaje de mano 8kg', included: true },
                { text: '2 equipajes facturados 23kg', included: true },
                { text: 'Cambios sin cargo', included: true }
            ]
        }
    ];
}

// ============================================
// INITIALIZE APP
// ============================================

document.addEventListener('DOMContentLoaded', init);
