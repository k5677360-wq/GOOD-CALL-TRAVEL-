/**
 * Good Call Travel - Cotizador de Vuelos
 */

(function () {
    'use strict';

    var API_URL = 'http://localhost:5000';
    var USE_MOCK = true; // cambiar a false cuando el backend esté activo

    var AIRPORTS = {
        'LIM': { name:'Lima',      full:'Aeropuerto Internacional Jorge Chavez' },
        'CUZ': { name:'Cusco',     full:'Aeropuerto Velazco Astete' },
        'AQP': { name:'Arequipa',  full:'Aeropuerto Rodríguez Ballón' },
        'TRU': { name:'Trujillo',  full:'Aeropuerto Carlos Martínez' },
        'IQT': { name:'Iquitos',   full:'Aeropuerto Francisco Secada' },
        'PIU': { name:'Piura',     full:'Aeropuerto Guillermo Concha' },
        'TCQ': { name:'Tacna',     full:'Aeropuerto Carlos Ciriani' },
        'JUL': { name:'Juliaca',   full:'Aeropuerto Inca Manco Cápac' },
        'CIX': { name:'Chiclayo',  full:'Aeropuerto José A. Quiñones' },
        'PEM': { name:'Pto. Maldonado', full:'Aeropuerto Padre Aldamiz' },
        'MIA': { name:'Miami',     full:'Miami International Airport' },
        'CUN': { name:'Cancún',    full:'Cancún International Airport' },
        'BOG': { name:'Bogotá',    full:'Aeropuerto El Dorado' },
        'SCL': { name:'Santiago',  full:'Aeropuerto Arturo Merino' },
        'MEX': { name:'México DF', full:'Aeropuerto Benito Juárez' },
        'MAD': { name:'Madrid',    full:'Aeropuerto Madrid-Barajas' },
        'JFK': { name:'New York',  full:'John F. Kennedy Airport' },
        'LAX': { name:'Los Ángeles', full:'Los Angeles International' }
    };

    // Mapeo de códigos de aerolínea a archivos de logo
    // Coloca tus logos en la carpeta "logos/" con el formato: LA.png, H2.png, etc.
    var AIRLINE_LOGOS = {
        'LA': 'logos/LA.png',     // LATAM Airlines
        'H2': 'logos/H2.png',     // Sky Airline
        'W4': 'logos/W4.png',     // Wingo
        'VY': 'logos/VY.png',     // Viva Air
        'JA': 'logos/JA.png',     // JetSMART
        'IB': 'logos/IB.png',     // Iberia
        'AA': 'logos/AA.png',     // American Airlines
        'AV': 'logos/AV.png',     // Avianca
        'CM': 'logos/CM.png',     // Copa Airlines
    };

    var MOCK_AIRLINES = [
        { code:'LA', name:'LATAM Airlines' },
        { code:'H2', name:'Sky Airline' },
        { code:'JA', name:'JetSMART' },
    ];

    var MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    // -- State --
    var state = {
        tripType: 'roundtrip',
        passengers: { adults:1, children:0, infants:0 },
        results: { outbound:[], return:[] },
        selected: { outbound:null, return:null },
        fare: null,
        params: null
    };

    var el = {};

    function cacheDom() {
        el.form = document.getElementById('searchForm');
        el.tripRadios = document.querySelectorAll('input[name="tripType"]');
        el.origin = document.getElementById('origin');
        el.destination = document.getElementById('destination');
        el.swapBtn = document.getElementById('swapBtn');
        el.departDate = document.getElementById('departDate');
        el.returnDate = document.getElementById('returnDate');
        el.returnGroup = document.getElementById('returnDateGroup');
        el.passInput = document.getElementById('passengers');
        el.passDropdown = document.getElementById('passengersDropdown');
        el.adultsCount = document.getElementById('adultsCount');
        el.childrenCount = document.getElementById('childrenCount');
        el.infantsCount = document.getElementById('infantsCount');
        el.resultsSection = document.getElementById('resultsSection');
        el.loadingState = document.getElementById('loadingState');
        el.resultsHeader = document.getElementById('resultsHeader');
        el.resultsTitle = document.getElementById('resultsTitle');
        el.resultsSubtitle = document.getElementById('resultsSubtitle');
        el.resultsGrid = document.getElementById('resultsGrid');
        el.outboundList = document.getElementById('outboundFlights');
        el.returnList = document.getElementById('returnFlights');
        el.returnSection = document.getElementById('returnSection');
        el.emptyState = document.getElementById('emptyState');
        el.priceSidebar = document.getElementById('priceSidebar');
        el.priceBreakdown = document.getElementById('priceBreakdown');
        el.fareOptions = document.getElementById('fareOptions');
        el.selectBtn = document.getElementById('selectFlightBtn');
        el.sortBy = document.getElementById('sortBy');
        el.directOnly = document.getElementById('directOnly');
        el.searchBtn = document.getElementById('searchBtn');
    }

    // -- Init --
    function init() {
        cacheDom();
        bindEvents();
        setDefaultDates();
        refreshPassengers();
    }

    function bindEvents() {
        el.tripRadios.forEach(function(r){ r.addEventListener('change', onTripType); });
        el.swapBtn.addEventListener('click', onSwap);
        el.passInput.addEventListener('click', function(e){ e.stopPropagation(); el.passDropdown.classList.toggle('active'); });
        document.addEventListener('click', function(e){ if(!e.target.closest('.passengers-input') && !e.target.closest('.passengers-dropdown')) el.passDropdown.classList.remove('active'); });
        document.querySelectorAll('.counter-btn').forEach(function(b){ b.addEventListener('click', onCounter); });
        el.form.addEventListener('submit', onSearch);
        el.departDate.addEventListener('change', onDepartChange);
        el.sortBy.addEventListener('change', applySort);
        el.directOnly.addEventListener('change', function(){ renderFlightList(); });
        el.selectBtn.addEventListener('click', onConfirm);
    }

    function setDefaultDates() {
        var now = new Date();
        var dep = addDays(now, 1);
        var ret = addDays(dep, 7);
        el.departDate.value = dateStr(dep);
        el.returnDate.value = dateStr(ret);
        el.departDate.min = dateStr(now);
        el.returnDate.min = el.departDate.value;
    }

    // -- Handlers --
    function onTripType(e) {
        state.tripType = e.target.value;
        el.returnGroup.style.display = (state.tripType === 'oneway') ? 'none' : '';
    }
    function onSwap() { var t=el.origin.value; el.origin.value=el.destination.value; el.destination.value=t; }
    function onCounter(e) {
        e.stopPropagation();
        var a = e.currentTarget.dataset.action, f = e.currentTarget.dataset.field;
        if (a==='increase') { if(f==='infants' && state.passengers.infants >= state.passengers.adults) return; state.passengers[f]++; }
        else { if(f==='adults' && state.passengers.adults<=1) return; if(state.passengers[f]<=0) return; state.passengers[f]--; }
        if(state.passengers.infants > state.passengers.adults) state.passengers.infants = state.passengers.adults;
        refreshPassengers();
    }
    function refreshPassengers() {
        var p=state.passengers;
        el.adultsCount.textContent=p.adults; el.childrenCount.textContent=p.children; el.infantsCount.textContent=p.infants;
        var parts=[];
        if(p.adults>0) parts.push(p.adults+' Adulto'+(p.adults>1?'s':''));
        if(p.children>0) parts.push(p.children+' Niño'+(p.children>1?'s':''));
        if(p.infants>0) parts.push(p.infants+' Bebé'+(p.infants>1?'s':''));
        el.passInput.value = parts.join(', ');
        qs('[data-field="adults"][data-action="decrease"]').disabled = (p.adults<=1);
        qs('[data-field="children"][data-action="decrease"]').disabled = (p.children<=0);
        qs('[data-field="infants"][data-action="decrease"]').disabled = (p.infants<=0);
        qs('[data-field="infants"][data-action="increase"]').disabled = (p.infants>=p.adults);
    }
    function onDepartChange() {
        var d=new Date(el.departDate.value), r=new Date(el.returnDate.value);
        if(r<=d) el.returnDate.value = dateStr(addDays(d,1));
        el.returnDate.min = el.departDate.value;
    }

    async function onSearch(e) {
        e.preventDefault();
        var ori=extractCode(el.origin.value), dst=extractCode(el.destination.value);
        if(!ori||!dst){ alert('Selecciona aeropuertos válidos.'); return; }
        if(ori===dst){ alert('Origen y destino deben ser diferentes.'); return; }
        state.params = {
            origin:ori, destination:dst,
            departDate: el.departDate.value.replace(/-/g,''),
            returnDate: state.tripType==='roundtrip'? el.returnDate.value.replace(/-/g,'') : null,
            tripType: state.tripType,
            passengers: Object.assign({}, state.passengers)
        };
        await searchFlights();
    }

    // -- Search --
    async function searchFlights() {
        showLoading();
        try {
            if (USE_MOCK) {
                await delay(1200);
                state.results.outbound = buildMockFlights(state.params.origin, state.params.destination, state.params.departDate);
                state.results.return = state.params.returnDate
                    ? buildMockFlights(state.params.destination, state.params.origin, state.params.returnDate)
                    : [];
            } else {
                var resp = await fetch(API_URL+'/api/search', {
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify(state.params)
                });
                if(!resp.ok) throw new Error('Error '+resp.status);
                var data = await resp.json();
                if(!data.success) throw new Error(data.error||'Búsqueda fallida');
                state.results.outbound = data.outbound||[];
                state.results.return = data.return||[];
            }
            showResults();
        } catch(err) {
            console.error(err);
            hideLoading();
            alert('Error al buscar vuelos. Verifica tu conexión.');
        }
    }

    // -- Render --
    function showLoading() {
        el.resultsSection.style.display='block'; el.loadingState.style.display='block';
        el.resultsHeader.style.display='none'; el.resultsGrid.style.display='none';
        el.searchBtn.disabled=true; el.searchBtn.textContent='Buscando...';
        setTimeout(function(){ el.resultsSection.scrollIntoView({behavior:'smooth'}); },100);
    }
    function hideLoading() {
        el.loadingState.style.display='none'; el.searchBtn.disabled=false;
        el.searchBtn.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> Buscar vuelos';
    }

    function showResults() {
        hideLoading();
        if(!state.results.outbound.length){ el.emptyState.style.display='block'; el.resultsHeader.style.display='none'; el.resultsGrid.style.display='none'; return; }
        el.emptyState.style.display='none'; el.resultsHeader.style.display='flex';
        el.resultsGrid.style.display='grid'; el.priceSidebar.style.display='block';

        var dn = airportName(state.params.origin), an = airportName(state.params.destination);
        el.resultsTitle.textContent = dn+' \u2192 '+an;
        var t = state.passengers.adults+state.passengers.children+state.passengers.infants;
        el.resultsSubtitle.textContent = t+' pasajero'+(t>1?'s':'')+' \u00b7 '+fmtDate(state.params.departDate)+(state.params.returnDate?' - '+fmtDate(state.params.returnDate):'');

        el.returnSection.style.display = state.results.return.length>0?'block':'none';
        state.selected.outbound=null; state.selected.return=null; state.fare=null;
        applySort();
        refreshPrice();
    }

    function renderFlightList() {
        var out = getFiltered(state.results.outbound);
        var ret = getFiltered(state.results.return);
        el.outboundList.innerHTML = out.length ? out.map(function(f,i){ return flightCardHTML(f,'outbound',i); }).join('') : '<p class="text-muted" style="padding:1rem">No hay vuelos que coincidan.</p>';
        if(ret.length) el.returnList.innerHTML = ret.map(function(f,i){ return flightCardHTML(f,'return',i); }).join('');

        // Bind events
        document.querySelectorAll('.flight-card').forEach(function(card){
            card.querySelector('.flight-card__summary').addEventListener('click', function(){ onFlightSelect(card); });
            card.querySelector('.flight-card__toggle').addEventListener('click', function(e){
                e.stopPropagation();
                card.classList.toggle('expanded');
            });
        });
    }

    // ===== Flight card HTML =====
    function flightCardHTML(f, type, idx) {
        var badges = [];
        if(f.isDirect) badges.push('<span class="badge badge-direct">Directo</span>');
        if(idx===0) badges.push('<span class="badge badge-cheapest">Mejor precio</span>');

        var airlineCode = (f.flightNumber||'').substring(0,2).trim();
        var logoSrc = AIRLINE_LOGOS[airlineCode];
        var logoHTML = logoSrc
            ? '<img src="'+esc(logoSrc)+'" alt="'+esc(f.airline)+'" class="airline-logo" onerror="this.outerHTML=\'<div class=airline-logo-placeholder>'+esc(airlineCode)+'</div>\'">'
            : '<div class="airline-logo-placeholder">'+esc(airlineCode||'--')+'</div>';

        var stopsClass = f.isDirect ? '' : ' has-stops';
        var stopsLabel = f.isDirect ? 'Directo' : (f.stops||1)+' escala'+(f.stops>1?'s':'');

        // Detalle de equipaje
        var personalItem = f.personalItem || 'Incluido (bolso/mochila)';
        var handBaggage = f.handBaggage || 'No especificado';
        var checkedBaggage = f.checkedBaggage || 'No especificado';

        var piIncl = personalItem.toLowerCase().indexOf('incluido')!==-1 || personalItem.toLowerCase().indexOf('pieza')!==-1;
        var hbIncl = handBaggage.toLowerCase().indexOf('incluido')!==-1 || handBaggage.toLowerCase().indexOf('pieza')!==-1;
        var cbIncl = checkedBaggage.toLowerCase().indexOf('incluido')!==-1 || checkedBaggage.toLowerCase().indexOf('maleta')!==-1;

        var fromFull = (AIRPORTS[f.from]||{}).full || f.from;
        var toFull = (AIRPORTS[f.to]||{}).full || f.to;

        return '<div class="flight-card" data-type="'+type+'" data-index="'+idx+'">' +
            '<div class="flight-card__summary">' +
                '<div class="flight-card__airline">' +
                    logoHTML +
                    '<div class="airline-text">' +
                        '<div class="airline-name">'+esc(f.airline)+'</div>' +
                        '<div class="flight-number">'+esc(f.flightNumber)+'</div>' +
                    '</div>' +
                '</div>' +
                '<div class="flight-card__schedule">' +
                    '<div class="flight-card__time"><div class="time">'+f.departTime+'</div><div class="airport-code">'+f.from+'</div></div>' +
                    '<div class="flight-card__duration">' +
                        '<div class="duration-text">'+fmtDuration(f.duration)+'</div>' +
                        '<div class="duration-line"></div>' +
                        '<div class="stops-text'+stopsClass+'">'+stopsLabel+'</div>' +
                    '</div>' +
                    '<div class="flight-card__time"><div class="time">'+f.arrivalTime+'</div><div class="airport-code">'+f.to+'</div></div>' +
                '</div>' +
                '<div class="flight-card__price"><div class="price-label">Desde</div><div class="price-amount">$'+f.price+'</div></div>' +
            '</div>' +
            (badges.length?'<div class="flight-card__badges">'+badges.join('')+'</div>':'') +
            '<div class="flight-card__toggle"><span>Detalle de vuelo</span>'+chevronSVG()+'</div>' +
            '<div class="flight-card__detail">' +
                '<div class="detail-header">' +
                    '<span>Detalle de vuelo</span>' +
                    '<span class="fare-badge">TARIFA '+(f.fareClass||'BASIC').toUpperCase()+'</span>' +
                '</div>' +
                '<div class="detail-route">' +
                    '<div class="detail-route__stop">' +
                        '<span class="stop-time">'+f.departTime+'</span>' +
                        '<span class="stop-airport">'+esc(fromFull)+' ('+f.from+')</span>' +
                    '</div>' +
                    '<div class="detail-route__stop">' +
                        '<span class="stop-time">'+f.arrivalTime+'</span>' +
                        '<span class="stop-airport">'+esc(toFull)+' ('+f.to+')</span>' +
                    '</div>' +
                '</div>' +
                '<div class="detail-meta">' +
                    esc(f.airline)+' \u00b7 Vuelo '+esc(f.flightNumber)+(f.fareClass?' \u00b7 Clase '+esc(f.fareClass):'') +
                '</div>' +
                '<div class="detail-baggage">' +
                    '<div class="detail-baggage__title">Equipaje incluido</div>' +
                    baggageItemHTML(piIncl, personalItem, 'backpack') +
                    baggageItemHTML(hbIncl, hbIncl?handBaggage:'No incluye equipaje de mano', 'carryon') +
                    baggageItemHTML(cbIncl, cbIncl?checkedBaggage:'No incluye equipaje facturado', 'suitcase') +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function baggageItemHTML(included, text, iconType) {
        var cls = included ? 'included' : 'not-included';
        return '<div class="baggage-item">' +
            '<div class="baggage-icon '+cls+'">'+baggageSVG(iconType, included)+'</div>' +
            '<span class="baggage-text'+(included?'':' not-included')+'">'+esc(text)+'</span>' +
        '</div>';
    }

    // SVG icons para equipaje
    function baggageSVG(type, included) {
        var color = included ? '#059669' : '#9ca3af';
        if (type === 'backpack') {
            return '<svg width="22" height="22" viewBox="0 0 24 24" fill="'+color+'"><path d="M20 8v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8c0-1.86 1.28-3.41 3-3.86V3c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v1.14c1.72.45 3 2 3 3.86zM9 3v1h6V3H9zm-3 5v12h12V8H6z"/></svg>';
        }
        if (type === 'carryon') {
            return '<svg width="22" height="22" viewBox="0 0 24 24" fill="'+color+'"><path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-3h2v3h-2V3zm6 16H7V8h10v11z"/></svg>';
        }
        // suitcase
        return '<svg width="22" height="22" viewBox="0 0 24 24" fill="'+color+'"><path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 3h4v3h-4V3zm7 16H7V8h10v11zm-1-8H8v-1h8v1zm0 3H8v-1h8v1z"/></svg>';
    }

    function chevronSVG() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>';
    }

    // -- Selección --
    function onFlightSelect(card) {
        var type = card.dataset.type;
        var idx = parseInt(card.dataset.index,10);
        document.querySelectorAll('.flight-card[data-type="'+type+'"]').forEach(function(c){ c.classList.remove('selected'); });
        card.classList.add('selected');
        var list = getFiltered(state.results[type==='outbound'?'outbound':'return']);
        state.selected[type] = list[idx];
        if(state.selected.outbound) renderFareOptions();
        refreshPrice();
    }

    // -- Tarifas --
    function getFares(base) {
        return [
            { name:'LIGHT', price:base, features:[
                {text:'Bolso personal incluido',ok:true},{text:'Sin equipaje de mano',ok:false},{text:'Sin equipaje facturado',ok:false},{text:'Sin cambios',ok:false}]},
            { name:'PLUS', price:Math.round(base*1.35), features:[
                {text:'Bolso personal incluido',ok:true},{text:'Equipaje de mano 8 kg',ok:true},{text:'1 maleta facturada 23 kg',ok:true},{text:'Cambios con cargo',ok:true}]},
            { name:'FULL', price:Math.round(base*1.75), features:[
                {text:'Bolso personal incluido',ok:true},{text:'Equipaje de mano 8 kg',ok:true},{text:'2 maletas facturadas 23 kg',ok:true},{text:'Cambios sin cargo',ok:true}]}
        ];
    }

    function renderFareOptions() {
        var fares = getFares(state.selected.outbound.price);
        var html = '<h4 class="fare-options-title">Selecciona tu tarifa</h4>';
        fares.forEach(function(f,i){
            var sel = i===1?' selected':'';
            html += '<div class="fare-option'+sel+'" data-fare="'+i+'"><div class="fare-header"><span class="fare-name">'+f.name+'</span><span class="fare-price">$'+f.price+'</span></div><ul class="fare-features">'+f.features.map(function(ft){ return '<li class="'+(ft.ok?'':'excluded')+'">'+ft.text+'</li>'; }).join('')+'</ul></div>';
        });
        el.fareOptions.innerHTML = html;
        document.querySelectorAll('.fare-option').forEach(function(o){ o.addEventListener('click', onFareSelect); });
        state.fare = fares[1];
        refreshPrice();
    }

    function onFareSelect(e) {
        var o=e.currentTarget, i=parseInt(o.dataset.fare,10);
        document.querySelectorAll('.fare-option').forEach(function(x){ x.classList.remove('selected'); });
        o.classList.add('selected');
        state.fare = getFares(state.selected.outbound.price)[i];
        refreshPrice();
    }

    function refreshPrice() {
        if(!state.selected.outbound||!state.fare){
            el.priceBreakdown.innerHTML='<p class="text-muted">Selecciona un vuelo para ver el precio</p>';
            el.selectBtn.disabled=true; return;
        }
        var p=state.passengers, fp=state.fare.price;
        var m=(state.params.tripType==='roundtrip'&&state.selected.return)?2:1;
        var at=fp*m*p.adults, ct=fp*m*0.75*p.children, it=fp*m*0.10*p.infants;
        var sub=at+ct+it, tax=sub*0.18, tot=sub+tax;
        var rows='';
        if(p.adults>0) rows+=priceRow('Adultos ('+p.adults+')', at);
        if(p.children>0) rows+=priceRow('Niños ('+p.children+')', ct);
        if(p.infants>0) rows+=priceRow('Bebés ('+p.infants+')', it);
        rows+='<div class="price-row"><span class="text-muted">Impuestos y tasas</span><span>$'+tax.toFixed(2)+'</span></div>';
        rows+='<div class="price-row total"><span>Total</span><span>$'+tot.toFixed(2)+'</span></div>';
        el.priceBreakdown.innerHTML=rows;
        el.selectBtn.disabled = !(state.selected.outbound && (state.params.tripType==='oneway'||state.selected.return));
    }
    function priceRow(l,a){ return '<div class="price-row"><span>'+l+'</span><span>$'+a.toFixed(2)+'</span></div>'; }

    // -- Sort/filter --
    function applySort() {
        var k=el.sortBy.value;
        var fn = k==='duration'?function(a,b){return a.duration-b.duration}:k==='departure'?function(a,b){return a.departTime.localeCompare(b.departTime)}:function(a,b){return a.price-b.price};
        state.results.outbound.sort(fn);
        if(state.results.return.length) state.results.return.sort(fn);
        renderFlightList();
    }
    function getFiltered(list) {
        if(!el.directOnly.checked) return list;
        return list.filter(function(f){ return f.isDirect; });
    }

    function onConfirm() {
        if(!state.selected.outbound||!state.fare) return;
        var o=state.selected.outbound, r=state.selected.return;
        alert('Reserva confirmada\n\nIda: '+o.airline+' '+o.flightNumber+'\n'+(r?'Vuelta: '+r.airline+' '+r.flightNumber+'\n':'')+'Tarifa: '+state.fare.name+'\n\nEsta es una demo'+(USE_MOCK?' con datos simulados':'')+'.');
    }

    // -- Mock data --
    function buildMockFlights(from, to, dateStr) {
        var flights=[], count=4+Math.floor(Math.random()*4);
        var fareClasses = ['BASIC','LIGHT','PLUS'];
        for(var i=0; i<count; i++){
            var al=MOCK_AIRLINES[Math.floor(Math.random()*MOCK_AIRLINES.length)];
            var isDirect=Math.random()>0.3;
            var base=isDirect?(100+Math.random()*200):(80+Math.random()*250);
            var dH=5+Math.floor(Math.random()*15), dM=[0,15,30,45][Math.floor(Math.random()*4)];
            var dur=isDirect?55+Math.floor(Math.random()*70):140+Math.floor(Math.random()*120);
            var am=(dH*60+dM+dur); var aH=Math.floor(am/60)%24, aM=am%60;
            var fc=fareClasses[Math.floor(Math.random()*fareClasses.length)];
            var hasHand=fc!=='BASIC', hasChecked=fc==='PLUS';

            flights.push({
                id: al.code+(1000+Math.floor(Math.random()*9000)),
                airline: al.name,
                from: from, to: to,
                departTime: pad(dH)+':'+pad(dM),
                arrivalTime: pad(aH)+':'+pad(aM),
                duration: dur,
                isDirect: isDirect,
                stops: isDirect?0:1,
                price: Math.round(base),
                flightNumber: al.code+' '+(100+Math.floor(Math.random()*900)),
                fareClass: fc,
                personalItem: 'Incluido (bolso o mochila)',
                handBaggage: hasHand?'1 pieza':'No incluido',
                checkedBaggage: hasChecked?'1 maleta(s) 23kg':'No incluido'
            });
        }
        return flights.sort(function(a,b){ return a.price-b.price; });
    }

    // -- Helpers --
    function extractCode(v){ if(!v) return null; var m=v.match(/^([A-Z]{3})/); return m?m[1]:null; }
    function airportName(c){ return (AIRPORTS[c]||{}).name||c; }
    function dateStr(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
    function addDays(d,n){ var r=new Date(d); r.setDate(r.getDate()+n); return r; }
    function fmtDate(s){ return s.substring(6,8)+' '+MESES[parseInt(s.substring(4,6),10)-1]; }
    function fmtDuration(m){ return Math.floor(m/60)+'h '+m%60+'m'; }
    function pad(n){ return String(n).padStart(2,'0'); }
    function esc(s){ var d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
    function qs(s){ return document.querySelector(s); }
    function delay(ms){ return new Promise(function(r){setTimeout(r,ms);}); }

    document.addEventListener('DOMContentLoaded', init);
})();
