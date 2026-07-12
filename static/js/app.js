// ==========================================================================
// Application State & Global References
// ==========================================================================
let placesData = [];       // Loaded from API on start
let activeItinerary = null; // Stored current plan
let costChart = null;      // Chart.js instance reference
let travelMap = null;      // Leaflet.js map instance reference
let mapMarkers = [];       // Array to track Leaflet markers
let mapRouteLine = null;   // Route line between starting city and destination

// Coordinates for major starting cities
const startingCityCoordinates = {
    "Delhi": [28.61, 77.20],
    "Mumbai": [19.07, 72.87],
    "Kolkata": [22.57, 88.36],
    "Chennai": [13.08, 80.27],
    "Bangalore": [12.97, 77.59],
    "Hyderabad": [17.38, 78.48],
    "Raipur": [21.25, 81.63],
    "Ahmedabad": [23.02, 72.57],
    "Jaipur": [26.91, 75.78],
    "Guwahati": [26.14, 91.74],
    "Lucknow": [26.85, 80.94],
    "Patna": [25.59, 85.13],
    "Kochi": [9.93, 76.26],
    "Bhopal": [23.25, 77.41],
    "Bhubaneswar": [20.29, 85.82],
    "Ranchi": [23.34, 85.30],
    "Jagdalpur": [19.07, 82.03],
    "Bilaspur": [22.08, 82.14],
    "Srinagar": [34.08, 74.80],
    "Shillong": [25.57, 91.88],
    "Rishikesh": [30.08, 78.27],
    "Chandigarh": [30.73, 76.78],
    "Aurangabad": [19.87, 75.34],
    "Siliguri": [26.72, 88.42],
    "Madurai": [9.92, 78.11],
    "Sambalpur": [21.46, 83.97],
    "Ambikapur": [23.12, 83.19],
    "Aut": [31.75, 77.20],
    "Itanagar": [27.08, 93.60],
    "Kadapa": [14.47, 78.82],
    "Bandipora": [34.42, 74.65],
    "Warangal": [18.00, 79.58],
    "Himmatnagar": [23.60, 72.96],
    "Kottayam": [9.59, 76.52],
    "Panaji": [15.49, 73.82],
    "Margao": [15.27, 73.95],
    "Darjeeling": [27.04, 88.26],
    "Gorakhpur": [26.76, 83.37],
    "Agra": [27.17, 78.00],
    "Gwalior": [26.21, 78.17],
    "Dimapur": [25.90, 93.72],
    "Kohima": [25.67, 94.11],
    "Imphal": [24.81, 93.93],
    "Silchar": [24.83, 92.77],
    "Agartala": [23.83, 91.28],
    "Dharmanagar": [24.36, 92.16],
    "Aizawl": [23.73, 92.71],
    "Panchkula": [30.69, 76.86],
    "Ludhiana": [30.90, 75.85],
    "Visakhapatnam": [17.68, 83.21],
    "Vijayawada": [16.50, 80.64],
    "Tezpur": [26.63, 92.79],
    "Gaya": [24.79, 85.00],
    "Goa (Dabolim)": [15.38, 73.83],
    "Kalka": [30.83, 76.93],
    "Coimbatore": [11.01, 76.95],
    "Rameswaram": [9.28, 79.31],
    "Jhanshi": [25.44, 78.56],
    "Jabalpur": [23.16, 79.93],
    "Pune": [18.52, 73.85],
    "Puri": [19.81, 85.83],
    "Rajkot": [22.30, 70.80],
    "Junagadh": [21.52, 70.45],
    "Jamshedpur": [22.80, 86.20],
    "Mysore Junction": [12.31, 76.64],
    "Khajuraho": [24.85, 79.93],
    "Jalna": [19.84, 75.88],
    "Jaipur Airport": [26.82, 75.80],
    "Kota Junction": [25.21, 75.86],
    "Kullu": [31.95, 77.10]
};

// DOM Elements
const elements = {
    homeSelect: document.getElementById('home-select'),
    stateSelect: document.getElementById('state-select'),
    citySelect: document.getElementById('city-select'),
    destinationHiddenInput: document.getElementById('destination-hidden-input'),
    popularDestList: document.getElementById('popular-dest-list'),
    hiddenDestList: document.getElementById('hidden-dest-list'),
    budgetInput: document.getElementById('budget-input'),
    daysInput: document.getElementById('days-input'),
    daysVal: document.getElementById('days-val'),
    itineraryForm: document.getElementById('itinerary-form'),
    submitBtn: document.getElementById('submit-btn'),
    
    // Panel States
    emptyState: document.getElementById('empty-state'),
    loadingState: document.getElementById('loading-state'),
    itineraryShowcase: document.getElementById('itinerary-showcase'),
    
    // Overview Fields
    stateBadge: document.getElementById('state-badge'),
    destName: document.getElementById('itinerary-dest-name'),
    description: document.getElementById('itinerary-description'),
    bestSeason: document.getElementById('itinerary-season'),
    aiStatus: document.getElementById('itinerary-ai-status'),
    startingPoint: document.getElementById('itinerary-starting-point'),
    
    // Safety & Comparison
    safetyContainer: document.getElementById('safety-container'),
    warningsContainer: document.getElementById('warnings-container'),
    prosContainer: document.getElementById('pros-container'),
    consContainer: document.getElementById('cons-container'),
    
    // Budget Fields
    valTargetBudget: document.getElementById('val-target-budget'),
    valEstTotal: document.getElementById('val-est-total'),
    progressFill: document.getElementById('budget-progress-fill'),
    budgetStatusMsg: document.getElementById('budget-status-message'),
    
    // Breakdown values
    costLodging: document.getElementById('val-cost-lodging'),
    costHomeTransit: document.getElementById('val-cost-home-transit'),
    costTransport: document.getElementById('val-cost-transport'),
    costTickets: document.getElementById('val-cost-tickets'),
    costFood: document.getElementById('val-cost-food'),
    costMisc: document.getElementById('val-cost-misc'),
    
    // Content Containers
    timelineContainer: document.getElementById('timeline-container'),
    tipsContainer: document.getElementById('tips-container'),
    factsContainer: document.getElementById('facts-container'),
    previewTagsContainer: document.getElementById('preview-tags-container'),
    dealsContainer: document.getElementById('deals-container'),
    
    // Settings panel
    settingsToggle: document.getElementById('settings-toggle'),
    settingsPanel: document.getElementById('settings-panel'),
    userApiKey: document.getElementById('user-api-key'),
    saveSettings: document.getElementById('save-settings'),
    closeSettings: document.getElementById('close-settings'),
    
    // Action buttons
    printBtn: document.getElementById('print-itinerary-btn'),
    
    // Lead Generation & Admin elements
    leadFormTrigger: document.getElementById('lead-form-trigger'),
    leadModal: document.getElementById('lead-modal'),
    closeLeadModal: document.getElementById('close-lead-modal'),
    leadInquiryForm: document.getElementById('lead-inquiry-form'),
    leadStartCity: document.getElementById('lead-start-city'),
    leadDestName: document.getElementById('lead-dest-name'),
    
    viewLeadsDashboard: document.getElementById('view-leads-dashboard'),
    leadsDashboardModal: document.getElementById('leads-dashboard-modal'),
    closeLeadsDashboard: document.getElementById('close-leads-dashboard'),
    leadsTableBody: document.getElementById('leads-table-body'),
    clearLeadsBtn: document.getElementById('clear-leads'),
    exportLeadsCsvBtn: document.getElementById('export-leads-csv')
};

// ==========================================================================
// Initialization & Event Binding
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    bindEvents();
});

function initApp() {
    // 1. Load saved API key if it exists
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        elements.userApiKey.value = savedKey;
    }
    
    // 2. Fetch available destinations list
    fetchDestinations();
}

function bindEvents() {
    // Update days counter in form when slider is adjusted
    elements.daysInput.addEventListener('input', (e) => {
        elements.daysVal.textContent = `${e.target.value} Days`;
    });

    // Cascading Dropdown Listeners
    elements.stateSelect.addEventListener('change', handleStateChange);
    elements.citySelect.addEventListener('change', handleCityChange);

    // Form submission
    elements.itineraryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        generateItinerary();
    });

    // Settings panel toggles
    elements.settingsToggle.addEventListener('click', () => {
        elements.settingsPanel.classList.remove('hidden');
    });
    
    elements.closeSettings.addEventListener('click', () => {
        elements.settingsPanel.classList.add('hidden');
    });
    
    elements.saveSettings.addEventListener('click', () => {
        const keyVal = elements.userApiKey.value.trim();
        if (keyVal) {
            localStorage.setItem('gemini_api_key', keyVal);
            showNotification('Success', 'Gemini API Key saved locally.', 'success');
        } else {
            localStorage.removeItem('gemini_api_key');
            showNotification('Removed', 'API Key cleared. Utilizing local fallback rules.', 'info');
        }
        elements.settingsPanel.classList.add('hidden');
    });

    // Print button handler
    elements.printBtn.addEventListener('click', () => {
        window.print();
    });

    // Lead Form triggers
    elements.leadFormTrigger.addEventListener('click', () => {
        if (!activeItinerary) return;
        elements.leadStartCity.textContent = activeItinerary.starting_city;
        elements.leadDestName.textContent = activeItinerary.destination;
        elements.leadModal.classList.remove('hidden');
    });
    
    elements.closeLeadModal.addEventListener('click', () => {
        elements.leadModal.classList.add('hidden');
    });
    
    // Submit Lead Inquiry
    elements.leadInquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitLeadInquiry();
    });
    
    // Admin Dashboard triggers
    elements.viewLeadsDashboard.addEventListener('click', () => {
        elements.settingsPanel.classList.add('hidden');
        renderLeadsTable();
        elements.leadsDashboardModal.classList.remove('hidden');
    });
    
    elements.closeLeadsDashboard.addEventListener('click', () => {
        elements.leadsDashboardModal.classList.add('hidden');
    });
    
    elements.clearLeadsBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete all collected leads? This action is permanent.")) {
            localStorage.removeItem('travel_leads');
            renderLeadsTable();
            showNotification('Database Cleared', 'All travel leads have been deleted.', 'info');
        }
    });
    
    elements.exportLeadsCsvBtn.addEventListener('click', () => {
        exportLeadsToCSV();
    });
}

// ==========================================================================
// Cascading Dropdowns Logic
// ==========================================================================

function handleStateChange() {
    const selectedState = elements.stateSelect.value;
    
    // Clear and disable child dropdowns
    elements.citySelect.innerHTML = `<option value="" disabled selected>-- Select City --</option>`;
    elements.citySelect.removeAttribute('disabled');
    
    // Reset columns select state
    elements.destinationHiddenInput.value = '';
    elements.popularDestList.innerHTML = `<div class="dest-list-placeholder">Choose starting city first</div>`;
    elements.popularDestList.classList.add('disabled');
    elements.hiddenDestList.innerHTML = `<div class="dest-list-placeholder">Choose starting city first</div>`;
    elements.hiddenDestList.classList.add('disabled');
    
    // Find all starting cities for places in the selected state
    const matchingPlaces = placesData.filter(place => place.state === selectedState);
    const uniqueCities = new Set();
    matchingPlaces.forEach(place => {
        place.starting_cities.forEach(city => uniqueCities.add(city));
    });
    
    // Populate Starting Cities
    Array.from(uniqueCities).sort().forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        elements.citySelect.appendChild(option);
    });
}

function handleCityChange() {
    const selectedState = elements.stateSelect.value;
    const selectedCity = elements.citySelect.value;
    
    elements.destinationHiddenInput.value = '';
    
    // Enable list columns
    elements.popularDestList.classList.remove('disabled');
    elements.hiddenDestList.classList.remove('disabled');
    elements.popularDestList.innerHTML = '';
    elements.hiddenDestList.innerHTML = '';
    
    // Filter places in selected state that have selected starting city
    const matchingPlaces = placesData.filter(place => 
        place.state === selectedState && 
        place.starting_cities.includes(selectedCity)
    );
    
    // Split into categories
    const popularPlaces = matchingPlaces.filter(place => place.is_popular);
    const hiddenPlaces = matchingPlaces.filter(place => !place.is_popular);
    
    // Render popular columns
    if (popularPlaces.length === 0) {
        elements.popularDestList.innerHTML = `<div class="dest-list-placeholder">No popular hotspots in this area</div>`;
    } else {
        popularPlaces.sort((a,b) => a.name.localeCompare(b.name)).forEach(place => {
            const card = createDestinationCard(place, 'popular');
            elements.popularDestList.appendChild(card);
        });
    }
    
    // Render hidden gems columns
    if (hiddenPlaces.length === 0) {
        elements.hiddenDestList.innerHTML = `<div class="dest-list-placeholder">No hidden gems in this area</div>`;
    } else {
        hiddenPlaces.sort((a,b) => a.name.localeCompare(b.name)).forEach(place => {
            const card = createDestinationCard(place, 'hidden-gem');
            elements.hiddenDestList.appendChild(card);
        });
    }
}

function createDestinationCard(place, type) {
    const item = document.createElement('div');
    item.className = 'dest-card-item';
    item.setAttribute('data-id', place.id);
    
    // Add appropriate icon based on category type
    const iconClass = type === 'popular' ? 'fa-star' : 'fa-wand-magic-sparkles';
    
    item.innerHTML = `
        <span>${place.name}</span>
        <i class="fa-solid ${iconClass}"></i>
    `;
    
    item.addEventListener('click', () => {
        // Clear active class from all items in both lists
        document.querySelectorAll('.dest-card-item').forEach(el => el.classList.remove('active'));
        
        // Mark clicked item active
        item.classList.add('active');
        
        // Update hidden input form value
        elements.destinationHiddenInput.value = place.id;
    });
    
    return item;
}

// ==========================================================================
// API Communications
// ==========================================================================

async function fetchDestinations() {
    try {
        const response = await fetch('/api/places');
        if (!response.ok) throw new Error("Failed to load destinations.");
        
        placesData = await response.json();
        populateStatesDropdown(placesData);
        populatePreviewTags(placesData);
        
    } catch (error) {
        console.error("Error fetching places:", error);
        elements.stateSelect.innerHTML = `<option value="" disabled>Error loading states</option>`;
        showNotification('Network Error', 'Could not load destinations from the backend server.', 'error');
    }
}

function populateStatesDropdown(places) {
    elements.stateSelect.innerHTML = `<option value="" disabled selected>-- Select State --</option>`;
    
    // Get unique sorted states list
    const uniqueStates = [...new Set(places.map(p => p.state))].sort();
    
    uniqueStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        elements.stateSelect.appendChild(option);
    });
}

function populatePreviewTags(places) {
    elements.previewTagsContainer.innerHTML = '';
    
    // Specifically prioritize Chhattisgarh places for home previews
    const cgPlaces = places.filter(p => p.state === 'Chhattisgarh');
    const otherPlaces = places.filter(p => p.state !== 'Chhattisgarh').sort(() => 0.5 - Math.random());
    
    // Combine to showcase CG offbeats first
    const combined = [...cgPlaces, ...otherPlaces.slice(0, 3)];
    
    combined.forEach(place => {
        const tag = document.createElement('div');
        tag.className = 'preview-tag';
        tag.textContent = `${place.name} (${place.state})`;
        tag.addEventListener('click', () => {
            // Preset values in dropdowns
            elements.stateSelect.value = place.state;
            handleStateChange();
            
            elements.destinationHiddenInput.value = place.id;
            
            // Mark corresponding card active
            const targetCard = document.querySelector(`.dest-card-item[data-id="${place.id}"]`);
            if (targetCard) {
                document.querySelectorAll('.dest-card-item').forEach(el => el.classList.remove('active'));
                targetCard.classList.add('active');
            }
            
            // Highlight selectors into focus
            elements.stateSelect.focus();
            elements.stateSelect.style.borderColor = 'var(--accent-cyan)';
            setTimeout(() => {
                elements.stateSelect.style.borderColor = '';
            }, 1500);
        });
        elements.previewTagsContainer.appendChild(tag);
    });
}

async function generateItinerary() {
    const placeId = elements.destinationHiddenInput.value;
    const startingCity = elements.citySelect.value;
    const homeCity = elements.homeSelect.value;
    const days = parseInt(elements.daysInput.value);
    const budget = parseFloat(elements.budgetInput.value);
    const travelStyle = document.querySelector('input[name="travel-style"]:checked').value;
    const apiKey = localStorage.getItem('gemini_api_key') || '';
    
    if (!placeId || !startingCity) {
        showNotification('Input Needed', 'Please complete State, City, and Destination selections.', 'info');
        return;
    }

    // Toggle loading states
    showState('loading');
    
    // Dynamic loading texts
    const loadingHeadings = [
        "Consulting local databases...",
        "Measuring starting city distances...",
        "Checking safety parameters...",
        "Balancing cost allocations..."
    ];
    let headingIndex = 0;
    const headingInterval = setInterval(() => {
        const headingEl = document.getElementById('loading-heading');
        if (headingEl) {
            headingEl.textContent = loadingHeadings[headingIndex];
            headingIndex = (headingIndex + 1) % loadingHeadings.length;
        }
    }, 2500);

    try {
        const response = await fetch('/api/generate-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                place_id: placeId,
                starting_city: startingCity,
                home_city: homeCity,
                days: days,
                budget: budget,
                travel_style: travelStyle,
                api_key: apiKey
            })
        });

        clearInterval(headingInterval);

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Itinerary generation failed.");
        }

        const data = await response.json();
        activeItinerary = data;
        
        // Render outputs
        renderItinerary(data, budget);
        showState('itinerary');
        
    } catch (error) {
        clearInterval(headingInterval);
        console.error("Error generating itinerary:", error);
        showState('empty');
        showNotification('Generation Failed', error.message || 'An error occurred during calculations.', 'error');
    }
}

// ==========================================================================
// Rendering Elements & Charts
// ==========================================================================

function renderItinerary(data, targetBudget) {
    // 1. Base Metadata
    elements.stateBadge.innerHTML = `${data.state} <span style="opacity: 0.5; margin: 0 4px;">|</span> ${data.is_popular ? '<i class="fa-solid fa-star" style="color: var(--accent-sunset);"></i> Popular Hotspot' : '<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-cyan);"></i> Hidden Gem'}`;
    elements.destName.textContent = data.destination;
    elements.description.textContent = data.description;
    elements.bestSeason.textContent = data.best_season;
    elements.startingPoint.textContent = data.starting_city;
    
    if (data.is_ai_generated) {
        elements.aiStatus.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Gemini AI Optimized';
        elements.aiStatus.style.color = 'var(--accent-cyan)';
    } else {
        elements.aiStatus.innerHTML = '<i class="fa-solid fa-server"></i> Local Database Engine';
        elements.aiStatus.style.color = 'var(--accent-gold)';
    }

    // 2. Budget status & progress bar
    const totalEst = data.cost_summary.total_estimated;
    elements.valTargetBudget.textContent = `₹${targetBudget.toLocaleString('en-IN')}`;
    elements.valEstTotal.textContent = `₹${totalEst.toLocaleString('en-IN')}`;
    
    const pct = Math.min((totalEst / targetBudget) * 100, 100);
    elements.progressFill.style.width = `${pct}%`;
    
    if (totalEst <= targetBudget) {
        elements.progressFill.className = "progress-bar-fill";
        elements.budgetStatusMsg.textContent = `Excellent! You save ₹${(targetBudget - totalEst).toLocaleString('en-IN')} within budget limit.`;
        elements.budgetStatusMsg.className = "budget-status under";
    } else {
        elements.progressFill.className = "progress-bar-fill warning";
        elements.budgetStatusMsg.textContent = `Caution: Exceeds budget by ₹${(totalEst - targetBudget).toLocaleString('en-IN')}. Consider shifting comfort style.`;
        elements.budgetStatusMsg.className = "budget-status over";
    }

    // 3. Costs Table Items
    elements.costLodging.textContent = `₹${data.cost_summary.lodging_cost.toLocaleString('en-IN')}`;
    elements.costHomeTransit.textContent = `₹${data.cost_summary.home_transit_cost.toLocaleString('en-IN')}`;
    elements.costTransport.textContent = `₹${data.cost_summary.transport_cost.toLocaleString('en-IN')}`;
    elements.costTickets.textContent = `₹${data.cost_summary.tickets_cost.toLocaleString('en-IN')}`;
    elements.costFood.textContent = `₹${data.cost_summary.food_cost.toLocaleString('en-IN')}`;
    elements.costMisc.textContent = `₹${data.cost_summary.misc_cost.toLocaleString('en-IN')}`;

    // 4. Initialize or Update Chart.js
    renderCostChart(data.cost_summary);

    // 5. Draw Day-by-Day Timeline
    renderTimeline(data.itinerary);

    // 6. Draw Leaflet Map
    renderMap(data);

    // 7. Render Tips & Facts
    renderTipsAndFacts(data.cost_saving_tips, data.fun_facts);

    // 8. Render Safety, Warnings, and Pros & Cons
    renderSafetyAndWarnings(data);

    // 9. Render Targeted Affiliate Booking Deals
    renderAffiliateDeals(data);
}

function renderCostChart(summary) {
    const ctx = document.getElementById('costDoughnutChart').getContext('2d');
    
    if (costChart) {
        costChart.destroy();
    }
    
    const chartData = {
        labels: ['Lodging', 'Home Travel', 'Local Transport', 'Tickets', 'Food', 'Misc'],
        datasets: [{
            data: [
                summary.lodging_cost,
                summary.home_transit_cost || 0,
                summary.transport_cost,
                summary.tickets_cost,
                summary.food_cost,
                summary.misc_cost
            ],
            backgroundColor: [
                '#4facfe',
                '#ffd269',
                '#00f2fe',
                '#a855f7',
                '#ff7e5f',
                '#64748b'
            ],
            borderWidth: 1,
            borderColor: '#0f172a'
        }]
    };

    costChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ₹${context.raw.toLocaleString('en-IN')}`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

function renderTimeline(daysList) {
    elements.timelineContainer.innerHTML = '';
    
    daysList.forEach((dayData) => {
        const step = document.createElement('div');
        step.className = 'timeline-step';
        
        let activitiesHTML = '';
        dayData.activities.forEach(activity => {
            activitiesHTML += `<li>${activity}</li>`;
        });
        
        let sightsHTML = '';
        if (dayData.sights && dayData.sights.length > 0) {
            dayData.sights.forEach(sight => {
                sightsHTML += `<span class="sight-tag"><i class="fa-solid fa-location-crosshairs"></i> ${sight}</span>`;
            });
        }
        
        let ticketPriceHTML = '';
        if (dayData.estimated_tickets_cost > 0) {
            ticketPriceHTML = `<span class="ticket-tag"><i class="fa-solid fa-ticket"></i> Entry: ₹${dayData.estimated_tickets_cost}</span>`;
        } else {
            ticketPriceHTML = `<span class="ticket-tag free"><i class="fa-solid fa-circle-check"></i> Free Sights</span>`;
        }

        step.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-day">Day ${dayData.day}</div>
                <h4 class="timeline-title">${dayData.title}</h4>
                <ul class="activities-list">
                    ${activitiesHTML}
                </ul>
                <div class="timeline-meta">
                    ${sightsHTML}
                    ${ticketPriceHTML}
                </div>
            </div>
        `;
        elements.timelineContainer.appendChild(step);
    });
}

function renderMap(data) {
    if (travelMap) {
        travelMap.remove();
        travelMap = null;
    }
    
    const centerLat = data.lat;
    const centerLon = data.lon;
    
    travelMap = L.map('map-container', {
        zoomControl: true,
        scrollWheelZoom: false
    }).setView([centerLat, centerLon], 10);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 20
    }).addTo(travelMap);
    
    // Plot destination marker
    const destinationMarker = L.marker([centerLat, centerLon]).addTo(travelMap);
    destinationMarker.bindPopup(`
        <div style="color: #040814; font-family: sans-serif; font-size: 13px;">
            <strong>${data.destination}</strong><br>
            ${data.state}
        </div>
    `).openPopup();
    mapMarkers.push(destinationMarker);
    
    // Plot home city marker and route connection if home city is provided and different
    const homeCoords = startingCityCoordinates[data.home_city];
    const startCoords = startingCityCoordinates[data.starting_city];
    
    if (homeCoords && data.home_city !== data.starting_city) {
        const homeMarker = L.circleMarker(homeCoords, {
            radius: 12,
            fillColor: '#ffd269',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(travelMap);
        
        homeMarker.bindPopup(`
            <div style="color: #040814; font-family: sans-serif; font-size: 12px;">
                <strong>Home Origin: ${data.home_city}</strong><br>
                Travel starts here.
            </div>
        `);
        mapMarkers.push(homeMarker);
        
        // Draw dotted home-to-start connection line
        const homeToStartLine = L.polyline([homeCoords, startCoords], {
            color: '#ff7e5f',
            weight: 4,
            dashArray: '12, 12',
            opacity: 0.8
        }).addTo(travelMap);
        mapMarkers.push(homeToStartLine);
    }

    // Plot starting city marker if coordinates are resolved
    if (startCoords) {
        const startMarker = L.circleMarker(startCoords, {
            radius: 10,
            fillColor: '#ff7e5f',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(travelMap);
        
        startMarker.bindPopup(`
            <div style="color: #040814; font-family: sans-serif; font-size: 12px;">
                <strong>Starting Hub: ${data.starting_city}</strong><br>
                Local journey origin point.
            </div>
        `);
        mapMarkers.push(startMarker);
        
        // Draw dashed route connection line
        mapRouteLine = L.polyline([startCoords, [centerLat, centerLon]], {
            color: '#ffd269',
            weight: 3,
            dashArray: '8, 8',
            opacity: 0.8
        }).addTo(travelMap);
        mapMarkers.push(mapRouteLine);
        
        // Fit map bounds to show everything (home, starting point, and destination)
        const bounds = [ [centerLat, centerLon] ];
        if (startCoords) bounds.push(startCoords);
        if (homeCoords && data.home_city !== data.starting_city) bounds.push(homeCoords);
        
        if (bounds.length > 1) {
            travelMap.fitBounds(bounds, {
                padding: [50, 50]
            });
        } else {
            travelMap.setView([centerLat, centerLon], 10);
        }
    }
    
    // Scatter sub-sights around destination
    const allSights = [];
    data.itinerary.forEach(day => {
        if (day.sights) {
            day.sights.forEach(sight => {
                if (!allSights.includes(sight)) allSights.push(sight);
            });
        }
    });

    if (allSights.length > 0) {
        allSights.forEach((sight, idx) => {
            const angle = (idx / allSights.length) * 2 * Math.PI;
            const radius = 0.015 + (Math.sin(idx) * 0.005);
            const offsetLat = centerLat + (radius * Math.cos(angle));
            const offsetLon = centerLon + (radius * Math.sin(angle) * 1.2);
            
            const sightMarker = L.circleMarker([offsetLat, offsetLon], {
                radius: 7,
                fillColor: '#00f2fe',
                color: '#4facfe',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(travelMap);
            
            sightMarker.bindPopup(`
                <div style="color: #040814; font-family: sans-serif; font-size: 12px;">
                    <strong style="color: #4facfe;">Sight: ${sight}</strong><br>
                    Included in daily schedule.
                </div>
            `);
            mapMarkers.push(sightMarker);
        });
    }
}

function renderTipsAndFacts(tips, facts) {
    elements.tipsContainer.innerHTML = '';
    tips.forEach(tip => {
        const item = document.createElement('li');
        item.textContent = tip;
        elements.tipsContainer.appendChild(item);
    });
    
    elements.factsContainer.innerHTML = '';
    facts.forEach(fact => {
        const item = document.createElement('div');
        item.className = 'fact-item';
        item.innerHTML = `<p class="fact-text"><i class="fa-solid fa-lightbulb" style="color: var(--accent-cyan); margin-right: 6px;"></i> ${fact}</p>`;
        elements.factsContainer.appendChild(item);
    });
}

function renderSafetyAndWarnings(data) {
    // 1. Women Safety
    elements.safetyContainer.innerHTML = '';
    
    // Detect safety level for correct badge styling
    const safetyText = data.women_safety.toLowerCase();
    const isHigh = safetyText.includes('high safety') || safetyText.includes('very safe');
    
    const badge = document.createElement('div');
    badge.className = `safety-badge ${isHigh ? 'high' : 'medium'}`;
    badge.innerHTML = isHigh 
        ? '<i class="fa-solid fa-shield-halved"></i> Highly Secure for Women' 
        : '<i class="fa-solid fa-triangle-exclamation"></i> Moderately Safe for Women';
    
    const textEl = document.createElement('p');
    textEl.textContent = data.women_safety;
    
    elements.safetyContainer.appendChild(badge);
    elements.safetyContainer.appendChild(textEl);
    
    // 2. Local Warnings
    elements.warningsContainer.innerHTML = '';
    data.warnings.forEach(warning => {
        const item = document.createElement('li');
        item.textContent = warning;
        elements.warningsContainer.appendChild(item);
    });
    
    // 3. Pros
    elements.prosContainer.innerHTML = '';
    data.pros.forEach(pro => {
        const item = document.createElement('li');
        item.textContent = pro;
        elements.prosContainer.appendChild(item);
    });
    
    // 4. Cons
    elements.consContainer.innerHTML = '';
    data.cons.forEach(con => {
        const item = document.createElement('li');
        item.textContent = con;
        elements.consContainer.appendChild(item);
    });
}

// ==========================================================================
// Interface State Management helpers
// ==========================================================================

function showState(state) {
    elements.emptyState.classList.add('hidden');
    elements.loadingState.classList.add('hidden');
    elements.itineraryShowcase.classList.add('hidden');
    
    if (state === 'empty') {
        elements.emptyState.classList.remove('hidden');
        elements.submitBtn.removeAttribute('disabled');
        elements.submitBtn.querySelector('span').textContent = 'Generate Itinerary';
    } else if (state === 'loading') {
        elements.loadingState.classList.remove('hidden');
        elements.submitBtn.setAttribute('disabled', 'true');
        elements.submitBtn.querySelector('span').textContent = 'Planning...';
    } else if (state === 'itinerary') {
        elements.itineraryShowcase.classList.remove('hidden');
        elements.submitBtn.removeAttribute('disabled');
        elements.submitBtn.querySelector('span').textContent = 'Regenerate Itinerary';
    }
}

function showNotification(title, message, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `notification-toast ${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-triangle';
    
    notif.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px;">
            <i class="fa-solid ${iconClass}" style="margin-top: 3px;"></i>
            <div>
                <strong style="display: block; font-size: 13px;">${title}</strong>
                <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 2px;">${message}</span>
            </div>
        </div>
    `;
    
    Object.assign(notif.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#0f172a',
        border: '1px solid var(--border-light)',
        borderLeft: `4px solid ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--accent-sunset)' : 'var(--accent-blue)'}`,
        color: '#f8fafc',
        padding: '12px 18px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        zIndex: '1000',
        minWidth: '260px',
        maxWidth: '360px',
        animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
    });
    
    const styleTag = document.getElementById('toast-animation-style') || document.createElement('style');
    styleTag.id = 'toast-animation-style';
    styleTag.textContent = `
        @keyframes slideIn {
            from { transform: translateX(120%); }
            to { transform: translateX(0); }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(120%); opacity: 0; }
        }
    `;
    document.head.appendChild(styleTag);
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}

function renderAffiliateDeals(data) {
    elements.dealsContainer.innerHTML = '';
    
    // Encode parameters to build secure travel links
    const destEncoded = encodeURIComponent(data.destination);
    const homeEncoded = encodeURIComponent(data.home_city);
    const startEncoded = encodeURIComponent(data.starting_city);
    
    // Deal 1: Accommodation stay recommendation (Booking.com affiliate mock redirect)
    const hotelDeal = document.createElement('a');
    hotelDeal.href = `https://www.booking.com/searchresults.html?ss=${destEncoded}&aid=20261234`;
    hotelDeal.target = '_blank';
    hotelDeal.className = 'deal-btn-link';
    hotelDeal.innerHTML = `
        <span><i class="fa-solid fa-hotel"></i> Book stays in ${data.destination} (Booking.com)</span>
        <i class="fa-solid fa-up-right-from-square"></i>
    `;
    elements.dealsContainer.appendChild(hotelDeal);
    
    // Deal 2: Transport booking recommendation (MakeMyTrip transit flights/trains)
    const flightDeal = document.createElement('a');
    flightDeal.href = `https://www.makemytrip.com/flights/search?tripType=O&itinerary=${homeEncoded}-${startEncoded}-12/08/2026`;
    flightDeal.target = '_blank';
    flightDeal.className = 'deal-btn-link';
    flightDeal.innerHTML = `
        <span><i class="fa-solid fa-plane"></i> Book travel from ${data.home_city} to ${data.starting_city} (MakeMyTrip)</span>
        <i class="fa-solid fa-up-right-from-square"></i>
    `;
    elements.dealsContainer.appendChild(flightDeal);
    
    // Deal 3: Tours & Sights packages (Thrillophilia offbeat bookings)
    const tourDeal = document.createElement('a');
    tourDeal.href = `https://www.thrillophilia.com/search?q=${destEncoded}`;
    tourDeal.target = '_blank';
    tourDeal.className = 'deal-btn-link';
    tourDeal.innerHTML = `
        <span><i class="fa-solid fa-map-location-dot"></i> Book local tours & experiences (Thrillophilia)</span>
        <i class="fa-solid fa-up-right-from-square"></i>
    `;
    elements.dealsContainer.appendChild(tourDeal);
}

function submitLeadInquiry() {
    const name = document.getElementById('lead-name').value.trim();
    const whatsapp = document.getElementById('lead-whatsapp').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const travelDate = document.getElementById('lead-date').value;
    const notes = document.getElementById('lead-notes').value.trim();
    
    const lead = {
        id: Date.now(),
        dateSubmitted: new Date().toLocaleDateString('en-IN'),
        name: name,
        whatsapp: whatsapp,
        email: email,
        travelDate: travelDate,
        notes: notes,
        destination: activeItinerary.destination,
        state: activeItinerary.state,
        starting_city: activeItinerary.starting_city,
        duration: activeItinerary.duration_days,
        budget: activeItinerary.cost_summary.total_estimated,
        style: activeItinerary.travel_style
    };
    
    // Save to localStorage
    const currentLeads = JSON.parse(localStorage.getItem('travel_leads') || '[]');
    currentLeads.push(lead);
    localStorage.setItem('travel_leads', JSON.stringify(currentLeads));
    
    // Reset and close
    elements.leadInquiryForm.reset();
    elements.leadModal.classList.add('hidden');
    
    showNotification('Inquiry Submitted!', 'Our travel partner will reach out via WhatsApp/Email shortly.', 'success');
}

function renderLeadsTable() {
    elements.leadsTableBody.innerHTML = '';
    const leads = JSON.parse(localStorage.getItem('travel_leads') || '[]');
    
    if (leads.length === 0) {
        elements.leadsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted); background: rgba(0,0,0,0.1);">No leads collected yet. Submit a quote request on the showcase to see them here!</td>
            </tr>
        `;
        return;
    }
    
    // Render descending (newest first)
    leads.slice().reverse().forEach(lead => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border-light)';
        tr.innerHTML = `
            <td style="padding: 8px; border-right: 1px solid var(--border-light); color: var(--text-muted);">${lead.dateSubmitted}</td>
            <td style="padding: 8px; border-right: 1px solid var(--border-light); font-weight: 600;">${lead.name}</td>
            <td style="padding: 8px; border-right: 1px solid var(--border-light); line-height: 1.3;">
                <div><i class="fa-brands fa-whatsapp" style="color: #25d366;"></i> ${lead.whatsapp}</div>
                <div style="font-size: 10px; opacity: 0.7;"><i class="fa-solid fa-envelope"></i> ${lead.email}</div>
            </td>
            <td style="padding: 8px; border-right: 1px solid var(--border-light); line-height: 1.3;">
                <strong>${lead.destination}</strong><br>
                <span style="font-size: 10px; opacity: 0.7;">${lead.duration} Days | ${lead.starting_city} starting</span>
            </td>
            <td style="padding: 8px; font-weight: 600; color: var(--accent-sunset);">₹${lead.budget.toLocaleString('en-IN')}</td>
        `;
        elements.leadsTableBody.appendChild(tr);
    });
}

function exportLeadsToCSV() {
    const leads = JSON.parse(localStorage.getItem('travel_leads') || '[]');
    if (leads.length === 0) {
        showNotification('No Data', 'No leads available to export.', 'info');
        return;
    }
    
    // Create CSV content headers
    let csvContent = "date_submitted,name,whatsapp,email,travel_date,destination,state,starting_city,duration_days,estimated_cost_inr,travel_style,notes\n";
    
    // Append rows
    leads.forEach(lead => {
        const cleanNotes = (lead.notes || '').replace(/"/g, '""');
        const row = [
            `"${lead.dateSubmitted}"`,
            `"${lead.name}"`,
            `"${lead.whatsapp}"`,
            `"${lead.email}"`,
            `"${lead.travelDate}"`,
            `"${lead.destination}"`,
            `"${lead.state}"`,
            `"${lead.starting_city}"`,
            lead.duration,
            lead.budget,
            `"${lead.style}"`,
            `"${cleanNotes}"`
        ].join(",");
        csvContent += row + "\n";
    });
    
    // Download Link creation
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `travel_leads_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Export Successful', 'Leads spreadsheet downloaded as CSV.', 'success');
}
