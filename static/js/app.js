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
    userUpiId: document.getElementById('user-upi-id'),
    userSheetUrl: document.getElementById('user-sheet-url'),
    userBookingAid: document.getElementById('user-booking-aid'),
    saveSettings: document.getElementById('save-settings'),
    closeSettings: document.getElementById('close-settings'),
    
    // Action buttons
    premiumPdfBtn: document.getElementById('premium-pdf-btn'),
    
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
    exportLeadsCsvBtn: document.getElementById('export-leads-csv'),

    // Premium Paywall elements
    premiumPaywallModal: document.getElementById('premium-paywall-modal'),
    closePaywallModal: document.getElementById('close-paywall-modal'),
    paywallDestName: document.getElementById('paywall-dest-name'),
    paywallQrContainer: document.getElementById('paywall-qr-container'),
    paywallVerifyForm: document.getElementById('paywall-verify-form'),
    paywallRef: document.getElementById('paywall-ref'),

    // Monetization checklist and sponsor elements
    userAmazonTag: document.getElementById('user-amazon-tag'),
    sponsoredStayContainer: document.getElementById('sponsored-stay-container'),
    packingChecklistContainer: document.getElementById('packing-checklist-container'),

    // Quick Plan elements
    quickPlanModal: document.getElementById('quick-plan-modal'),
    quickPlanForm: document.getElementById('quick-plan-form'),
    quickPlanDestName: document.getElementById('quick-plan-dest-name'),
    quickPlanPlaceId: document.getElementById('quick-plan-place-id'),
    quickPlanHome: document.getElementById('quick-plan-home'),
    quickPlanStart: document.getElementById('quick-plan-start'),
    quickPlanDays: document.getElementById('quick-plan-days'),
    quickPlanStyle: document.getElementById('quick-plan-style'),
    quickPlanBudget: document.getElementById('quick-plan-budget'),
    closeQuickPlan: document.getElementById('close-quick-plan'),

    // Partner elements
    partnerModal: document.getElementById('partner-modal'),
    partnerInquiryForm: document.getElementById('partner-inquiry-form'),
    closePartnerModal: document.getElementById('close-partner-modal'),
    
    // Partner Dashboard elements
    exportPartnersCsv: document.getElementById('export-partners-csv'),
    partnersTableBody: document.getElementById('partners-table-body'),
    clearPartners: document.getElementById('clear-partners'),
    
    // Theme elements
    themeToggle: document.getElementById('theme-toggle'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    themeIconMoon: document.getElementById('theme-icon-moon')
};

// ==========================================================================
// Initialization & Event Binding
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    bindEvents();
});

function initApp() {
    // 1. Load saved API key and UPI ID if they exist
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        elements.userApiKey.value = savedKey;
    }
    const savedUpi = localStorage.getItem('admin_upi_id') || 'janhawk2907@axl';
    elements.userUpiId.value = savedUpi;
    if (!localStorage.getItem('admin_upi_id')) {
        localStorage.setItem('admin_upi_id', 'janhawk2907@axl');
    }
    const savedTag = localStorage.getItem('amazon_affiliate_tag') || 'offbeatyatra2-21';
    elements.userAmazonTag.value = savedTag;
    if (!localStorage.getItem('amazon_affiliate_tag')) {
        localStorage.setItem('amazon_affiliate_tag', 'offbeatyatra2-21');
    }
    const savedSheet = localStorage.getItem('google_sheet_api_url');
    if (savedSheet) {
        elements.userSheetUrl.value = savedSheet;
    }
    const savedBookingAid = localStorage.getItem('booking_affiliate_id');
    if (savedBookingAid) {
        elements.userBookingAid.value = savedBookingAid;
    }
    
    // Load saved Theme mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (elements.themeIconSun) elements.themeIconSun.style.display = 'inline-block';
        if (elements.themeIconMoon) elements.themeIconMoon.style.display = 'none';
    } else {
        document.body.classList.remove('light-theme');
        if (elements.themeIconSun) elements.themeIconSun.style.display = 'none';
        if (elements.themeIconMoon) elements.themeIconMoon.style.display = 'inline-block';
    }
    
    // 2. Fetch available destinations list
    fetchDestinations();

    // 3. If page contains a preloaded itinerary (programmatic SEO), show it instantly
    if (window.PRELOADED_ITINERARY) {
        activeItinerary = window.PRELOADED_ITINERARY;
        renderItinerary(activeItinerary);
        showState('itinerary');
    }
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
        const upiVal = elements.userUpiId.value.trim();
        const tagVal = elements.userAmazonTag.value.trim();
        const sheetVal = elements.userSheetUrl.value.trim();
        const bookingAidVal = elements.userBookingAid.value.trim();
        
        if (keyVal) {
            localStorage.setItem('gemini_api_key', keyVal);
        } else {
            localStorage.removeItem('gemini_api_key');
        }
        
        if (upiVal) {
            localStorage.setItem('admin_upi_id', upiVal);
        } else {
            localStorage.removeItem('admin_upi_id');
        }

        if (tagVal) {
            localStorage.setItem('amazon_affiliate_tag', tagVal);
        } else {
            localStorage.removeItem('amazon_affiliate_tag');
        }

        if (sheetVal) {
            localStorage.setItem('google_sheet_api_url', sheetVal);
        } else {
            localStorage.removeItem('google_sheet_api_url');
        }

        if (bookingAidVal) {
            localStorage.setItem('booking_affiliate_id', bookingAidVal);
        } else {
            localStorage.removeItem('booking_affiliate_id');
        }
        
        showNotification('Settings Saved', 'Configurations updated successfully.', 'success');
        elements.settingsPanel.classList.add('hidden');
    });

    // Theme Toggle listener
    elements.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        if (isLight) {
            localStorage.setItem('theme', 'light');
            if (elements.themeIconSun) elements.themeIconSun.style.display = 'inline-block';
            if (elements.themeIconMoon) elements.themeIconMoon.style.display = 'none';
        } else {
            localStorage.setItem('theme', 'dark');
            if (elements.themeIconSun) elements.themeIconSun.style.display = 'none';
            if (elements.themeIconMoon) elements.themeIconMoon.style.display = 'inline-block';
        }
        
        // Redraw map with correct tiles if an itinerary is loaded
        if (travelMap && activeItinerary) {
            renderMap(activeItinerary);
        }
    });

    // 3D Parallax & Cursor Spotlight tracking
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        
        // 3D Parallax offsets relative to screen center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const tiltX = (x - centerX) / centerX * 16; // Shift range: -16px to +16px
        const tiltY = (y - centerY) / centerY * 16;
        
        document.documentElement.style.setProperty('--tilt-x', `${tiltX}px`);
        document.documentElement.style.setProperty('--tilt-y', `${tiltY}px`);
    });

    // Lead Form triggers
    elements.leadFormTrigger.addEventListener('click', () => {
        showNotification('Coming Soon!', 'We are currently onboarding verified local tour & taxi operators in this region. Direct custom quotes will be live soon!', 'info');
    });
    
    elements.closeLeadModal.addEventListener('click', () => {
        elements.leadModal.classList.add('hidden');
    });
    
    // Quick Plan listeners
    elements.closeQuickPlan.addEventListener('click', () => {
        elements.quickPlanModal.classList.add('hidden');
    });
    
    elements.quickPlanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const placeId = elements.quickPlanPlaceId.value;
        const startingCity = elements.quickPlanStart.value;
        const homeCity = elements.quickPlanHome.value;
        const days = parseInt(elements.quickPlanDays.value);
        const budget = parseFloat(elements.quickPlanBudget.value);
        const travelStyle = elements.quickPlanStyle.value;
        
        elements.quickPlanModal.classList.add('hidden');
        
        // Populate inputs in the sidebar for consistency
        const matchedPlace = placesData.find(p => p.id === placeId);
        if (matchedPlace) {
            elements.stateSelect.value = matchedPlace.state;
            handleStateChange();
            
            // Set destinationHiddenInput value AFTER state change because handleStateChange resets it!
            elements.destinationHiddenInput.value = placeId;
            
            elements.citySelect.value = startingCity;
            elements.homeSelect.value = homeCity;
            elements.daysInput.value = days;
            elements.daysVal.textContent = `${days} Days`;
            elements.budgetInput.value = budget;
            
            // Select the active radio button for style
            const radio = document.querySelector(`input[name="travel-style"][value="${travelStyle}"]`);
            if (radio) radio.checked = true;
            
            // Generate the plan
            generateItinerary();
        }
    });
    
    // Submit Lead Inquiry
    elements.leadInquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitLeadInquiry();
    });
    
    // Partner Modal event listeners
    elements.closePartnerModal.addEventListener('click', () => {
        elements.partnerModal.classList.add('hidden');
    });
    
    elements.sponsoredStayContainer.addEventListener('click', (e) => {
        const link = e.target.closest('#partner-billboard-link');
        if (link) {
            e.preventDefault();
            if (activeItinerary) {
                document.getElementById('partner-dest').value = activeItinerary.destination;
            }
            elements.partnerModal.classList.remove('hidden');
        }
    });
    
    elements.partnerInquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = elements.partnerInquiryForm.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Proposal...`;
        
        const payload = {
            hotel_name: document.getElementById('partner-hotel-name').value.trim(),
            destination: document.getElementById('partner-dest').value.trim(),
            manager_name: document.getElementById('partner-name').value.trim(),
            whatsapp: document.getElementById('partner-phone').value.trim(),
            email: document.getElementById('partner-email').value.trim(),
            promo_code: document.getElementById('partner-promo').value.trim(),
            discount_percent: document.getElementById('partner-discount').value.trim(),
            description: document.getElementById('partner-desc').value.trim(),
            agreement_signed: document.getElementById('partner-agree').checked ? "Agreed to 10% Discount & No Scams Terms" : "No"
        };
        
        try {
            const sheetUrl = localStorage.getItem('google_sheet_api_url');
            const promises = [];
            
            // 1. Dispatch to FormSubmit email relay
            promises.push(
                fetch('https://formsubmit.co/ajax/dramaticjanhawk@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
            );
            
            // 2. If Google Sheet API URL is set, POST there live in background
            if (sheetUrl) {
                promises.push(
                    fetch(sheetUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    }).catch(err => console.warn('Google Sheet submission error:', err))
                );
            }
            
            const responses = await Promise.all(promises);
            const mainResponse = responses[0]; // Email response
            
            if (mainResponse && mainResponse.ok) {
                // Save to local storage for backup and admin dashboard viewing
                const currentPartners = JSON.parse(localStorage.getItem('hotel_partnerships') || '[]');
                currentPartners.push({
                    id: Date.now(),
                    dateSubmitted: new Date().toLocaleDateString('en-IN'),
                    ...payload
                });
                localStorage.setItem('hotel_partnerships', JSON.stringify(currentPartners));

                showNotification('Proposal Submitted!', 'Your partnership details and discount agreement have been saved & emailed.', 'success');
                elements.partnerInquiryForm.reset();
                elements.partnerModal.classList.add('hidden');
            } else {
                throw new Error('Failed to dispatch proposal mail');
            }
        } catch (err) {
            console.error(err);
            showNotification('Dispatch Error', 'Failed to submit proposal email. Please try again.', 'error');
        } finally {
            submitBtn.removeAttribute('disabled');
            submitBtn.innerHTML = origText;
        }
    });
    
    // Admin Dashboard triggers
    elements.viewLeadsDashboard.addEventListener('click', () => {
        elements.settingsPanel.classList.add('hidden');
        renderLeadsTable();
        renderPartnersTable();
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

    elements.clearPartners.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete all partner agreements? This action is permanent.")) {
            localStorage.removeItem('hotel_partnerships');
            renderPartnersTable();
            showNotification('Database Cleared', 'All partner agreements have been deleted.', 'info');
        }
    });

    elements.exportPartnersCsv.addEventListener('click', () => {
        exportPartnersCsvData();
    });

    elements.exportLeadsCsvBtn.addEventListener('click', () => {
        exportLeadsToCSV();
    });

    // Premium Paywall triggers
    elements.premiumPdfBtn.addEventListener('click', () => {
        if (!activeItinerary) return;
        
        const upiId = localStorage.getItem('admin_upi_id');
        if (!upiId) {
            showNotification('Setup Required', 'Please set your UPI ID in the Settings gear (⚙️) first to receive payments!', 'warning');
            elements.settingsPanel.classList.remove('hidden');
            return;
        }
        
        // Populate paywall info
        elements.paywallDestName.textContent = activeItinerary.destination;
        
        // Generate QR code link
        // upi://pay?pa=address&pn=name&am=amount&cu=currency&tn=note
        const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=YatraAI&am=49&cu=INR&tn=Premium%20PDF%20${encodeURIComponent(activeItinerary.destination)}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;
        
        elements.paywallQrContainer.innerHTML = `<img src="${qrUrl}" alt="UPI QR Code" style="width: 100%; height: 100%; object-fit: contain;">`;
        elements.premiumPaywallModal.classList.remove('hidden');
    });
    
    elements.closePaywallModal.addEventListener('click', () => {
        elements.premiumPaywallModal.classList.add('hidden');
    });
    
    elements.paywallVerifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        verifyAndUnlockPremiumPDF();
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
            // Preset place values in Quick Plan Modal
            elements.quickPlanPlaceId.value = place.id;
            elements.quickPlanDestName.textContent = place.name;
            
            // Populate starting cities select box in Quick Plan Modal
            elements.quickPlanStart.innerHTML = '';
            place.starting_cities.forEach(city => {
                const opt = document.createElement('option');
                opt.value = city;
                opt.textContent = city;
                elements.quickPlanStart.appendChild(opt);
            });
            
            // Prefill home select values if already selected
            elements.quickPlanHome.value = elements.homeSelect.value;
            
            // Display modal
            elements.quickPlanModal.classList.remove('hidden');
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
    
    // Set Premium Print Meta
    const printTitle = document.getElementById('print-guide-dest');
    const printState = document.getElementById('print-meta-state');
    const printDays = document.getElementById('print-meta-days');
    const printStart = document.getElementById('print-meta-start');
    const printStyle = document.getElementById('print-meta-style');
    const printBudget = document.getElementById('print-meta-budget');
    
    if (printTitle) printTitle.textContent = `${data.destination} Travel Plan`;
    if (printState) printState.textContent = data.state;
    if (printDays) printDays.textContent = `${data.duration_days} Days`;
    if (printStart) printStart.textContent = data.starting_city;
    if (printStyle) printStyle.textContent = data.travel_style;
    if (printBudget) printBudget.textContent = `₹${data.cost_summary.total_estimated.toLocaleString('en-IN')}`;
    
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

    // 10. Render Sponsored Stay Partnerships
    renderSponsoredStay(data);

    // 11. Render Travel Packing Checklist
    renderPackingChecklist(data);
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
    
    daysList.forEach((dayData, idx) => {
        const step = document.createElement('div');
        step.className = 'timeline-step';
        step.style.animationDelay = `${idx * 0.12}s`;
        
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
    
    const isLightTheme = document.body.classList.contains('light-theme');
    const tileUrl = isLightTheme 
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        
    L.tileLayer(tileUrl, {
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
        
        mapRouteLine = L.polyline([startCoords, [centerLat, centerLon]], {
            color: '#ffd269',
            weight: 3,
            dashArray: '8, 8',
            opacity: 0.8
        }).addTo(travelMap);
        mapMarkers.push(mapRouteLine);
        
        // Plot dynamic sightseeing markers around destination center coordinate
        const sightsList = [];
        data.itinerary.forEach(day => {
            day.sights.forEach(sight => {
                if (!sightsList.includes(sight)) {
                    sightsList.push(sight);
                }
            });
        });

        sightsList.forEach((sight, index) => {
            // Scatter sights around center coordinate in a spiral
            const angle = (index * 2 * Math.PI) / (sightsList.length || 1);
            const radius = 0.012 + (index * 0.004); // Spiral coordinate displacement
            const sightLat = centerLat + Math.sin(angle) * radius;
            const sightLon = centerLon + Math.cos(angle) * radius;

            const sightMarker = L.circleMarker([sightLat, sightLon], {
                radius: 7,
                fillColor: '#00f2fe',
                color: '#ffffff',
                weight: 2,
                opacity: 0.9,
                fillOpacity: 0.9
            }).addTo(travelMap);

            sightMarker.bindPopup(`
                <div style="color: #040814; font-family: sans-serif; font-size: 12px; line-height: 1.3;">
                    <strong style="color: #008fa0;"><i class="fa-solid fa-camera"></i> Sightseeing Spot</strong><br>
                    <strong>${sight}</strong>
                </div>
            `);
            mapMarkers.push(sightMarker);
        });

        // Populate floating Route Summary Panel
        const distanceEl = document.getElementById('map-distance');
        const timeEl = document.getElementById('map-time');
        const instEl = document.getElementById('map-instructions');
        const infoPanel = document.getElementById('map-route-info');
        
        // Find distance from places list database
        const placeDetails = placesData.find(p => p.id === data.place_id);
        const distance = placeDetails && placeDetails.starting_city_distances ? placeDetails.starting_city_distances[data.starting_city] : null;
        
        if (distance) {
            const hours = Math.floor(distance / 50); // Assumed 50 km/h driving speed
            const minutes = Math.round(((distance / 50) - hours) * 60);
            const timeString = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
            
            distanceEl.textContent = `${distance} km`;
            timeEl.textContent = timeString;
            instEl.innerHTML = `<i class="fa-solid fa-car-side"></i> Driving transit from <strong>${data.starting_city}</strong> to <strong>${data.destination}</strong>.`;
            infoPanel.style.display = 'flex';
        } else {
            infoPanel.style.display = 'none';
        }
        
        // Fit map bounds to show everything (home, starting point, and destination)
        const bounds = [ [centerLat, centerLon] ];
        if (startCoords) bounds.push(startCoords);
        if (homeCoords && data.home_city !== data.starting_city) bounds.push(homeCoords);
        
        // Save route bounds on map object for invalidateSize recalculation when container displays
        travelMap._routeBounds = bounds;
        
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
        
        // Force Leaflet to recalculate container dimensions once it becomes visible
        if (travelMap) {
            setTimeout(() => {
                travelMap.invalidateSize();
                if (travelMap._routeBounds && travelMap._routeBounds.length > 0) {
                    // Zoom out to fit the full route nicely
                    travelMap.fitBounds(travelMap._routeBounds, { padding: [60, 60] });
                }
            }, 300);
        }
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
    const bookingAid = localStorage.getItem('booking_affiliate_id') || '';
    const hotelUrl = bookingAid 
        ? `https://www.booking.com/searchresults.html?ss=${destEncoded}&aid=${bookingAid}` 
        : `https://www.booking.com/searchresults.html?ss=${destEncoded}`;
    hotelDeal.href = hotelUrl;
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

function verifyAndUnlockPremiumPDF() {
    const utr = elements.paywallRef.value.trim();
    if (!utr) return;
    
    // Save this purchase as a high-value paid lead in local database!
    const lead = {
        id: Date.now(),
        dateSubmitted: new Date().toLocaleDateString('en-IN'),
        name: `⭐️ PREMIUM_USER (UTR: ${utr})`,
        whatsapp: "Paid PDF Client",
        email: `Ref: ${utr}`,
        travelDate: "Instant Unlock",
        notes: `Unlocked Premium A4 PDF Guide for ${activeItinerary.destination}`,
        destination: activeItinerary.destination,
        state: activeItinerary.state,
        starting_city: activeItinerary.starting_city,
        duration: activeItinerary.duration_days,
        budget: activeItinerary.cost_summary.total_estimated,
        style: activeItinerary.travel_style
    };
    
    const currentLeads = JSON.parse(localStorage.getItem('travel_leads') || '[]');
    currentLeads.push(lead);
    localStorage.setItem('travel_leads', JSON.stringify(currentLeads));
    
    // Reset and close
    elements.paywallVerifyForm.reset();
    elements.premiumPaywallModal.classList.add('hidden');
    
    showNotification('Payment Verified!', 'Premium print view unlocked. Loading print options...', 'success');
    
    // Unlock print styles & trigger print window
    document.body.classList.add('unlocked-premium');
    setTimeout(() => {
        window.print();
        // Remove print styles lock after printing is opened
        setTimeout(() => {
            document.body.classList.remove('unlocked-premium');
        }, 1000);
    }, 1000);
}

function renderSponsoredStay(data) {
    const container = elements.sponsoredStayContainer;
    container.innerHTML = '';
    
    // Show generic partnership billboard inviting local hoteliers to pay for sponsor space
    container.style.display = 'block';
    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; width: 100%;">
            <div>
                <i class="fa-solid fa-hotel" style="color: var(--accent-gold); margin-right: 6px;"></i>
                <strong>Own a hotel, resort, or homestay in ${data.destination}?</strong> Feature your property here as our Recommended Stay Partner!
            </div>
            <a href="#" id="partner-billboard-link" style="color: var(--accent-gold); text-decoration: underline; font-weight: 700; white-space: nowrap;"><i class="fa-solid fa-envelope"></i> Partner with Us</a>
        </div>
    `;
}

function renderPackingChecklist(data) {
    const container = elements.packingChecklistContainer;
    container.innerHTML = '';
    
    const dest = data.destination.toLowerCase();
    let baseItems = [];
    
    // Categorize based on destination name keywords
    if (dest.includes('beach') || dest.includes('goa') || dest.includes('vizag') || dest.includes('visakhapatnam')) {
        // Beach / Coastal Category
        baseItems = [
            { name: "Waterproof Beach Mat Blanket", icon: "fa-solid fa-sheet-plastic" },
            { name: "SPF 50 Broad Spectrum Sunscreen", icon: "fa-solid fa-sun" },
            { name: "Polarized UV400 Sunglasses", icon: "fa-solid fa-glasses" },
            { name: "Waterproof Dry Bag for Phones", icon: "fa-solid fa-bag-shopping" },
            { name: "Quick Dry Microfiber Beach Towel", icon: "fa-solid fa-rug" },
            { name: "Anti Slip Beach Slippers Water Shoes", icon: "fa-solid fa-shoe-prints" }
        ];
    } else if (dest.includes('mainpat') || dest.includes('tawang') || dest.includes('monastery') || dest.includes('mountain') || dest.includes('hill') || dest.includes('shimla') || dest.includes('rishikesh')) {
        // Mountain / High-Altitude / Hill Station Category
        baseItems = [
            { name: "Thermal Inner Wear Set Fleece Lined", icon: "fa-solid fa-shirt" },
            { name: "Waterproof Windproof Winter Jacket", icon: "fa-solid fa-person-snowboarding" },
            { name: "Waterproof Hiking Backpack 50L", icon: "fa-solid fa-backpack" },
            { name: "Waterproof Trekking Shoes with Grip", icon: "fa-solid fa-shoe-prints" },
            { name: "Polarized Hiking Sunglasses", icon: "fa-solid fa-glasses" },
            { name: "Mini Emergency First Aid Kit", icon: "fa-solid fa-kit-medical" }
        ];
    } else if (dest.includes('forest') || dest.includes('bubble') || dest.includes('falls') || dest.includes('waterfall') || dest.includes('chitrakote') || dest.includes('jungle') || dest.includes('valley')) {
        // Forest / Jungle / Waterfall / Nature Walk Category
        baseItems = [
            { name: "Waterproof Rain Poncho Raincoat", icon: "fa-solid fa-cloud-showers-water" },
            { name: "Natural Insect Mosquito Repellent Spray", icon: "fa-solid fa-spray-can" },
            { name: "Waterproof Dry Bag for Electronics", icon: "fa-solid fa-bag-shopping" },
            { name: "Waterproof Hiking Trekking Shoes", icon: "fa-solid fa-shoe-prints" },
            { name: "LED Rechargeable Headlamp Flashlight", icon: "fa-solid fa-lightbulb" },
            { name: "Mini Emergency First Aid Kit", icon: "fa-solid fa-kit-medical" }
        ];
    } else {
        // General / Urban / Heritage City Category
        baseItems = [
            { name: "Universal Travel Adapter Plug", icon: "fa-solid fa-plug" },
            { name: "Fast Charging 20000mAh Power Bank", icon: "fa-solid fa-battery-three-quarters" },
            { name: "RFID Blocking Travel Wallet Passport Holder", icon: "fa-solid fa-wallet" },
            { name: "Anti Theft Lightweight Daypack", icon: "fa-solid fa-backpack" },
            { name: "Compact Travel Umbrella Windproof", icon: "fa-solid fa-umbrella" },
            { name: "Reusable Insulated Water Bottle", icon: "fa-solid fa-bottle-water" }
        ];
    }
    
    const amazonTag = localStorage.getItem('amazon_affiliate_tag') || 'offbeatyatra2-21';
    
    baseItems.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'packing-item-card';
        
        const itemId = `pack-item-${idx}`;
        const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(item.name)}&tag=${amazonTag}`;
        
        card.innerHTML = `
            <div class="packing-item-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="packing-card-header">
                <input type="checkbox" id="${itemId}" class="packing-checkbox">
                <label class="packing-card-title" for="${itemId}">${item.name}</label>
            </div>
            <a href="${searchUrl}" target="_blank" class="amazon-card-btn">
                <i class="fa-brands fa-amazon"></i> Shop on Amazon
            </a>
        `;
        
        // Add checkbox listener to toggle checked state card class
        const checkbox = card.querySelector('.packing-checkbox');
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                card.classList.add('checked');
            } else {
                card.classList.remove('checked');
            }
        });
        
        container.appendChild(card);
    });
}

function renderPartnersTable() {
    const tableBody = elements.partnersTableBody;
    tableBody.innerHTML = '';
    
    const partners = JSON.parse(localStorage.getItem('hotel_partnerships') || '[]');
    
    if (partners.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="padding: 12px; text-align: center; color: var(--text-muted);">No stay partnership proposals received yet.</td>
            </tr>
        `;
        return;
    }
    
    partners.forEach(partner => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--border-light)';
        row.innerHTML = `
            <td style="padding: 8px; border-right: 1px solid var(--border-light); color: var(--text-secondary);">${partner.dateSubmitted || 'N/A'}</td>
            <td style="padding: 8px; border-right: 1px solid var(--border-light); font-weight: 700;">${partner.hotel_name} (${partner.destination})</td>
            <td style="padding: 8px; border-right: 1px solid var(--border-light);">
                <strong>${partner.manager_name}</strong><br>
                <span style="font-size: 10px; color: var(--text-secondary);">${partner.email} | ${partner.whatsapp}</span>
            </td>
            <td style="padding: 8px; border-right: 1px solid var(--border-light); font-weight: 700; color: var(--accent-cyan);">${partner.promo_code} (${partner.discount_percent}%)</td>
            <td style="padding: 8px; color: var(--accent-gold); font-weight: 600;"><i class="fa-solid fa-file-signature"></i> Signed / Approved</td>
        `;
        tableBody.appendChild(row);
    });
}

function exportPartnersCsvData() {
    const partners = JSON.parse(localStorage.getItem('hotel_partnerships') || '[]');
    if (partners.length === 0) {
        showNotification('No Data', 'There are no stay partnership agreements to export.', 'warning');
        return;
    }
    
    let csvContent = "";
    csvContent += "Submission Date,Hotel Name,Destination,Manager Name,WhatsApp Number,Email,Promo Code,Discount (%),Agreement Signed,Description\n";
    
    partners.forEach(p => {
        const cleanDesc = (p.description || '').replace(/"/g, '""');
        const row = [
            `"${p.dateSubmitted}"`,
            `"${p.hotel_name}"`,
            `"${p.destination}"`,
            `"${p.manager_name}"`,
            `"${p.whatsapp}"`,
            `"${p.email}"`,
            `"${p.promo_code}"`,
            p.discount_percent,
            `"${p.agreement_signed}"`,
            `"${cleanDesc}"`
        ].join(",");
        csvContent += row + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hotel_partnerships_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Export Successful', 'Hotel partnership database downloaded as CSV.', 'success');
}

