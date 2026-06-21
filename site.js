/**
 * SAMJOHN'S Pizza & Buffet Website Shared JavaScript
 * Provides responsive navbar toggles, modal handling, and notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Dynamic Elements
    injectReservationModal();
    injectMobileMenu();
    injectToastContainer();
    injectThemeToggle();

    // 2. Setup Event Listeners
    setupNavbarScroll();
    setupMobileMenuListeners();
    setupReservationTriggers();
    setupStarRatingSelector();
    setupGalleryFiltering();
});

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function injectToastContainer() {
    if (document.getElementById('toast-container')) return;
    
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container px-6 py-3 rounded-xl shadow-lg border text-white font-label-bold flex items-center gap-3 bg-inverse-surface dark:bg-surface text-on-primary dark:text-on-surface';
    container.innerHTML = `
        <span class="material-symbols-outlined text-secondary-container" id="toast-icon">check_circle</span>
        <span id="toast-text">Success message goes here</span>
    `;
    document.body.appendChild(container);
}

function showToast(message, icon = 'check_circle', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconEl = document.getElementById('toast-icon');
    const textEl = document.getElementById('toast-text');

    iconEl.textContent = icon;
    textEl.textContent = message;

    container.classList.add('show');

    setTimeout(() => {
        container.classList.remove('show');
    }, duration);
}

/* ==========================================================================
   Table Reservation Modal
   ========================================================================== */
function injectReservationModal() {
    if (document.getElementById('reservation-modal')) return;

    const modalHTML = `
        <div class="modal-backdrop flex items-center justify-center p-4" id="reservation-modal" onclick="closeReservationModal(event)">
            <div class="modal-container bg-surface dark:bg-inverse-surface rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative border border-outline-variant/30 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                <!-- Close Button -->
                <button class="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-variant/50" onclick="closeReservationModal(event)">
                    <span class="material-symbols-outlined">close</span>
                </button>

                <h2 class="font-display-lg text-headline-md text-on-surface mb-2">Book a Table</h2>
                <p class="font-body-md text-on-surface-variant mb-6">Enjoy Hyderabad's premium buffet experience. Unlimited pizzas, biryani, and live counters await you.</p>

                <form id="reservation-form" class="space-y-4" onsubmit="handleReservationSubmit(event)">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-label-bold text-sm text-on-surface mb-1.5" for="res-name">Your Name *</label>
                            <input class="w-full bg-surface-container-low text-on-surface rounded-xl border border-outline-variant p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow font-body-md" id="res-name" placeholder="John Doe" type="text" required>
                        </div>
                        <div>
                            <label class="block font-label-bold text-sm text-on-surface mb-1.5" for="res-phone">Phone Number *</label>
                            <input class="w-full bg-surface-container-low text-on-surface rounded-xl border border-outline-variant p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow font-body-md" id="res-phone" placeholder="9876543210" type="tel" pattern="[0-9]{10}" title="Ten digit phone number" required>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-label-bold text-sm text-on-surface mb-1.5" for="res-date">Date *</label>
                            <input class="w-full bg-surface-container-low text-on-surface rounded-xl border border-outline-variant p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow font-body-md" id="res-date" type="date" required>
                        </div>
                        <div>
                            <label class="block font-label-bold text-sm text-on-surface mb-1.5" for="res-time">Time Slot *</label>
                            <select class="w-full bg-surface-container-low text-on-surface rounded-xl border border-outline-variant p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow font-body-md" id="res-time" required>
                                <optgroup label="Lunch Slots">
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="1:00 PM">1:00 PM</option>
                                    <option value="2:00 PM">2:00 PM</option>
                                    <option value="3:00 PM">3:00 PM</option>
                                </optgroup>
                                <optgroup label="Dinner Slots">
                                    <option value="7:00 PM">7:00 PM</option>
                                    <option value="8:00 PM" selected>8:00 PM</option>
                                    <option value="9:00 PM">9:00 PM</option>
                                    <option value="10:00 PM">10:00 PM</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block font-label-bold text-sm text-on-surface mb-1.5" for="res-guests">Total Party Size *</label>
                        <select class="w-full bg-surface-container-low text-on-surface rounded-xl border border-outline-variant p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow font-body-md" id="res-guests" required>
                            <option value="1">1 Guest</option>
                            <option value="2" selected>2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="5">5 Guests</option>
                            <option value="6">6 Guests</option>
                            <option value="8">8 Guests</option>
                            <option value="10">10 Guests</option>
                            <option value="12">12 Guests</option>
                        </select>
                    </div>

                    <div class="glass-panel p-4 rounded-xl border border-outline-variant/35 bg-surface-container-lowest flex flex-col gap-3">
                        <label class="block font-label-bold text-sm text-on-surface">Guest Meal Breakdown *</label>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-on-surface-variant mb-1" for="res-veg-count">Vegetarian Guests</label>
                                <input type="number" class="w-full bg-surface-container-low text-on-surface rounded-xl border border-outline-variant p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow font-body-md font-semibold" id="res-veg-count" min="0" value="2" required>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-on-surface-variant mb-1" for="res-nonveg-count">Non-Vegetarian Guests</label>
                                <input type="number" class="w-full bg-surface-container-low text-on-surface rounded-xl border border-outline-variant p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow font-body-md font-semibold" id="res-nonveg-count" min="0" value="0" required>
                            </div>
                        </div>
                        <div class="flex justify-between items-center text-xs font-label-bold text-on-surface-variant mt-1.5 border-t border-outline-variant/20 pt-2">
                            <span>Status:</span>
                            <span id="res-total-badge" class="bg-tertiary-container/35 text-tertiary px-3 py-1 rounded-full text-[13px] font-bold border border-tertiary/20">✓ Sum matches total</span>
                        </div>
                    </div>

                    <button class="w-full bg-primary-container text-on-primary font-label-bold py-3.5 rounded-full hover:scale-[1.02] active:scale-95 transition-all duration-150 shadow-md shadow-primary/20 mt-2 flex items-center justify-center gap-2" type="submit">
                        <span class="material-symbols-outlined text-[20px]">restaurant</span>
                        Confirm Reservation
                    </button>
                </form>
            </div>
        </div>
    `;

    const placeholder = document.createElement('div');
    placeholder.innerHTML = modalHTML;
    document.body.appendChild(placeholder.firstElementChild);

    // Set minimum date to today
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    // Auto-align and compute total guests
    const guestsSelect = document.getElementById('res-guests');
    const vegInput = document.getElementById('res-veg-count');
    const nonVegInput = document.getElementById('res-nonveg-count');
    const totalBadge = document.getElementById('res-total-badge');
    
    window.updateTotalBadge = function() {
        const guestsSelect = document.getElementById('res-guests');
        const vegInput = document.getElementById('res-veg-count');
        const nonVegInput = document.getElementById('res-nonveg-count');
        const totalBadge = document.getElementById('res-total-badge');
        if (guestsSelect && vegInput && nonVegInput && totalBadge) {
            const target = parseInt(guestsSelect.value) || 0;
            let veg = parseInt(vegInput.value);
            let nonveg = parseInt(nonVegInput.value);
            
            // Enforce non-negative values dynamically
            if (isNaN(veg) || veg < 0) {
                veg = 0;
                vegInput.value = 0;
            }
            if (isNaN(nonveg) || nonveg < 0) {
                nonveg = 0;
                nonVegInput.value = 0;
            }

            const sum = veg + nonveg;
            if (sum === target) {
                totalBadge.textContent = `✓ Sum matches total`;
                totalBadge.className = "bg-tertiary-container/35 text-tertiary px-3 py-1 rounded-full text-[13px] font-bold border border-tertiary/20";
            } else {
                totalBadge.textContent = `⚠ Sum (${sum}) must equal Total (${target})`;
                totalBadge.className = "bg-error-container/20 text-error px-3 py-1 rounded-full text-[13px] font-bold border border-error/20";
            }
        }
    };
    
    if (guestsSelect && vegInput && nonVegInput) {
        guestsSelect.addEventListener('change', () => {
            vegInput.value = guestsSelect.value;
            nonVegInput.value = 0;
            window.updateTotalBadge();
        });
        
        vegInput.addEventListener('input', window.updateTotalBadge);
        nonVegInput.addEventListener('input', window.updateTotalBadge);
        vegInput.addEventListener('change', window.updateTotalBadge);
        nonVegInput.addEventListener('change', window.updateTotalBadge);
        window.updateTotalBadge(); // initial update
    }
}

window.openReservationModal = function() {
    const modal = document.getElementById('reservation-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
};

window.closeReservationModal = function(event) {
    const modal = document.getElementById('reservation-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
};

window.handleReservationSubmit = function(event) {
    event.preventDefault();
    const name = document.getElementById('res-name').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const totalGuests = parseInt(document.getElementById('res-guests').value) || 0;
    const vegCount = parseInt(document.getElementById('res-veg-count').value);
    const nonvegCount = parseInt(document.getElementById('res-nonveg-count').value);

    // Re-verify counts validity
    if (isNaN(vegCount) || vegCount < 0 || isNaN(nonvegCount) || nonvegCount < 0) {
        showToast('Guest counts cannot be negative or empty!', 'error');
        return;
    }

    const sum = vegCount + nonvegCount;

    // Validate sum strictly matches totalGuests
    if (sum !== totalGuests) {
        showToast(`Vegetarian guests (${vegCount}) and Non-Vegetarian guests (${nonvegCount}) must add up to Total Guests (${totalGuests})!`, 'error');
        return;
    }

    // Save booking to localStorage with both original keys and new columns
    const booking = {
        id: 'bk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name: name,
        phone: phone,
        date: date,
        time: time,
        guests: totalGuests,
        vegCount: vegCount,
        nonvegCount: nonvegCount,
        party_size: totalGuests,
        veg_count: vegCount,
        non_veg_count: nonvegCount,
        timestamp: new Date().toISOString()
    };

    let bookings = [];
    try {
        bookings = JSON.parse(localStorage.getItem('samjhones_bookings')) || [];
    } catch(e) {
        bookings = [];
    }

    bookings.push(booking);
    localStorage.setItem('samjhones_bookings', JSON.stringify(bookings));

    closeReservationModal();
    
    // Show premium confirmation notification
    showToast(`Table reserved successfully for ${totalGuests} guests (${vegCount} Veg, ${nonvegCount} Non-Veg) on ${date} at ${time}!`, 'check_circle');

    // Reset form
    document.getElementById('reservation-form').reset();
    if (typeof window.updateTotalBadge === 'function') {
        window.updateTotalBadge();
    }
};

/* ==========================================================================
   Mobile Nav Drawer Injection & Handling
   ========================================================================== */
function injectMobileMenu() {
    if (document.getElementById('mobile-menu-drawer')) return;

    // Get current filename to highlight active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const menuHTML = `
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300 flex justify-end" id="mobile-menu-drawer" onclick="closeMobileMenu()">
            <div class="w-72 max-w-xs h-full bg-surface dark:bg-inverse-surface shadow-2xl p-6 flex flex-col justify-between translate-x-full transition-transform duration-300" onclick="event.stopPropagation()">
                <div>
                    <!-- Drawer Header -->
                    <div class="flex justify-between items-center mb-8">
                        <span class="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed tracking-tight">SAMJOHN'S</span>
                        <button class="p-2 rounded-full hover:bg-surface-variant" onclick="closeMobileMenu()">
                            <span class="material-symbols-outlined text-on-surface">close</span>
                        </button>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="flex flex-col gap-4">
                        <a class="flex items-center gap-3 py-3 px-4 rounded-xl font-label-bold text-lg transition-colors ${currentPage === 'index.html' || currentPage === '' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}" href="index.html">
                            <span class="material-symbols-outlined">home</span> Home
                        </a>
                        <a class="flex items-center gap-3 py-3 px-4 rounded-xl font-label-bold text-lg transition-colors ${currentPage === 'about.html' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}" href="about.html">
                            <span class="material-symbols-outlined">info</span> About Us
                        </a>
                        <a class="flex items-center gap-3 py-3 px-4 rounded-xl font-label-bold text-lg transition-colors ${currentPage === 'menu.html' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}" href="menu.html">
                            <span class="material-symbols-outlined">restaurant_menu</span> Menu
                        </a>
                        <a class="flex items-center gap-3 py-3 px-4 rounded-xl font-label-bold text-lg transition-colors ${currentPage === 'buffet.html' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}" href="buffet.html">
                            <span class="material-symbols-outlined">local_pizza</span> Buffet Plans
                        </a>
                        <a class="flex items-center gap-3 py-3 px-4 rounded-xl font-label-bold text-lg transition-colors ${currentPage === 'gallery.html' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}" href="gallery.html">
                            <span class="material-symbols-outlined">gallery_thumbnail</span> Gallery
                        </a>
                        <a class="flex items-center gap-3 py-3 px-4 rounded-xl font-label-bold text-lg transition-colors ${currentPage === 'reviews.html' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}" href="reviews.html">
                            <span class="material-symbols-outlined">reviews</span> Reviews
                        </a>
                    </nav>
                </div>

                <!-- Reservation Button -->
                <div class="flex flex-col gap-4">
                    <button class="w-full bg-primary-container text-on-primary font-label-bold py-3.5 rounded-full hover-scale active:scale-95 transition-all shadow-md" onclick="openReservationModal(); closeMobileMenu();">
                        Reserve a Table
                    </button>
                    <a href="tel:+919876543210" class="flex items-center justify-center gap-2 py-2 text-primary font-body-md hover:underline">
                        <span class="material-symbols-outlined text-[18px]">call</span> Call Us Now
                    </a>
                </div>
            </div>
        </div>
    `;

    const placeholder = document.createElement('div');
    placeholder.innerHTML = menuHTML;
    document.body.appendChild(placeholder.firstElementChild);
}

window.openMobileMenu = function() {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (drawer) {
        drawer.classList.remove('pointer-events-none');
        drawer.classList.add('opacity-100');
        drawer.firstElementChild.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    }
};

window.closeMobileMenu = function() {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (drawer) {
        drawer.classList.add('pointer-events-none');
        drawer.classList.remove('opacity-100');
        drawer.firstElementChild.classList.add('translate-x-full');
        document.body.style.overflow = 'auto';
    }
};

function setupMobileMenuListeners() {
    // Find all buttons on the page and filter them
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        const label = (btn.getAttribute('aria-label') || '').toLowerCase();
        const hasMenuIcon = Array.from(btn.querySelectorAll('.material-symbols-outlined')).some(icon => icon.textContent.trim() === 'menu');
        if (label === 'menu' || hasMenuIcon) {
            btn.onclick = (e) => {
                e.preventDefault();
                openMobileMenu();
            };
        }
    });
}

/* ==========================================================================
   General Event Handling & Initializers
   ========================================================================== */
function setupNavbarScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('shadow-md');
        } else {
            nav.classList.remove('shadow-md');
        }
    });
}

function setupReservationTriggers() {
    // Make any button with "Reserve a Table" or similar content trigger the modal
    document.querySelectorAll('button, a').forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Reserve a Table' || text === 'Book a Table' || el.classList.contains('btn-reserve')) {
            el.removeAttribute('href');
            el.onclick = (e) => {
                e.preventDefault();
                openReservationModal();
            };
        }
    });
}

/* ==========================================================================
   Reviews Page Star Rating Interactive Selector
   ========================================================================== */
function setupStarRatingSelector() {
    const starContainer = document.getElementById('star-rating-selector');
    if (!starContainer) return;

    const stars = starContainer.querySelectorAll('span');
    let selectedRating = 5;

    stars.forEach((star, index) => {
        star.classList.add('filled', 'text-secondary-container');
        star.classList.remove('text-surface-dim');

        star.addEventListener('mouseover', () => {
            stars.forEach((s, idx) => {
                if (idx <= index) {
                    s.classList.add('filled', 'text-secondary-container');
                    s.classList.remove('text-surface-dim');
                } else {
                    s.classList.remove('filled', 'text-secondary-container');
                    s.classList.add('text-surface-dim');
                }
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach((s, idx) => {
                if (idx < selectedRating) {
                    s.classList.add('filled', 'text-secondary-container');
                    s.classList.remove('text-surface-dim');
                } else {
                    s.classList.remove('filled', 'text-secondary-container');
                    s.classList.add('text-surface-dim');
                }
            });
        });

        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach((s, idx) => {
                if (idx < selectedRating) {
                    s.classList.add('filled', 'text-secondary-container');
                    s.classList.remove('text-surface-dim');
                } else {
                    s.classList.remove('filled', 'text-secondary-container');
                    s.classList.add('text-surface-dim');
                }
            });
        });
    });

    // Make Submit button submit and show a Toast
    const form = starContainer.closest('form');
    if (form) {
        const submitBtn = form.querySelector('button[type="button"], button[type="submit"]');
        if (submitBtn) {
            submitBtn.onclick = (e) => {
                e.preventDefault();
                const name = document.getElementById('reviewer-name').value.trim();
                const email = document.getElementById('reviewer-email').value.trim();
                const text = document.getElementById('review-text').value.trim();

                if (!name || !email || !text) {
                    showToast('Please fill out all required fields.', 'error');
                    return;
                }

                showToast(`Thank you, ${name}! Your ${selectedRating}-star review has been submitted for approval.`, 'check_circle');
                form.reset();
                selectedRating = 5;
                stars.forEach(s => {
                    s.classList.add('filled', 'text-secondary-container');
                    s.classList.remove('text-surface-dim');
                });
            };
        }
    }
}

/* ==========================================================================
   Gallery Page Filter Logic & Fixed Lightbox
   ========================================================================== */
function setupGalleryFiltering() {
    const chips = document.querySelectorAll('.chip-btn');
    const items = document.querySelectorAll('.masonry-item');
    if (chips.length === 0 || items.length === 0) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filterText = chip.textContent.trim().toLowerCase();
            
            // Set active chip styling
            chips.forEach(c => {
                c.className = 'chip-btn px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-bold text-label-bold whitespace-nowrap hover:border-primary hover:text-primary transition-colors';
            });
            chip.className = 'chip-btn px-6 py-2 rounded-full border-2 border-primary bg-primary/10 text-primary font-label-bold text-label-bold whitespace-nowrap transition-colors';

            // Filter items
            items.forEach(item => {
                const img = item.querySelector('img');
                if (!img) return;

                const altText = (img.getAttribute('data-alt') || img.alt || '').toLowerCase();
                
                // Mapping categories to alt text keywords
                let matches = false;
                if (filterText === 'all photos') {
                    matches = true;
                } else if (filterText === 'food spread' && (altText.includes('food') || altText.includes('pizza') || altText.includes('dessert') || altText.includes('pastry') || altText.includes('spread') || altText.includes('biryani') || altText.includes('paneer') || altText.includes('tikka') || altText.includes('lollipop'))) {
                    matches = true;
                } else if (filterText === 'restaurant interior' && (altText.includes('interior') || altText.includes('seating') || altText.includes('atmosphere') || altText.includes('lights') || altText.includes('tables') || altText.includes('modern space'))) {
                    matches = true;
                } else if (filterText === 'live counters' && (altText.includes('counter') || altText.includes('live') || altText.includes('chef') || altText.includes('pasta') || altText.includes('action'))) {
                    matches = true;
                } else if (filterText === 'happy families' && (altText.includes('family') || altText.includes('people') || altText.includes('sharing') || altText.includes('laughter') || altText.includes('happy'))) {
                    matches = true;
                }

                if (matches) {
                    item.classList.remove('hidden-item');
                } else {
                    item.classList.add('hidden-item');
                }
            });
        });
    });

    // Lightbox triggers are handled directly inline in gallery.html to prevent DOM binding order conflicts.
}

/* ==========================================================================
   SAMJOHN'S Menu Database & LocalStorage Helper
   ========================================================================== */

const DEFAULT_MENU_DATABASE = {
  veg: [
    {
      category: "Veg Soup",
      icon: "soup_kitchen",
      items: [
        { id: "v_soup_1", name: "Soup of the Day (Asian Veg Soup)", price: 120 }
      ]
    },
    {
      category: "Appetizers",
      icon: "restaurant",
      items: [
        { id: "v_app_1", name: "Peri Peri Paneer Tikka", price: 250 },
        { id: "v_app_2", name: "Veg Cheese Roll / Hara Bhara Kabab", price: 220 },
        { id: "v_app_3", name: "Veg Spring Roll", price: 200 },
        { id: "v_app_4", name: "Butter Chilli Garlic Mushroom", price: 240 },
        { id: "v_app_5", name: "Crispy Baby Corn", price: 210 },
        { id: "v_app_6", name: "Crispy Corn", price: 180 },
        { id: "v_app_7", name: "French Fries", price: 150 },
        { id: "v_app_8", name: "Honey Cinnamon Pineapple", price: 190 }
      ]
    },
    {
      category: "Salads",
      icon: "eco",
      items: [
        { id: "v_sal_1", name: "Healthy Veg Salads", price: 160 },
        { id: "v_sal_2", name: "Watermelon, Papaya & Pineapple", price: 170 }
      ]
    },
    {
      category: "Veg Italian",
      icon: "local_pizza",
      items: [
        { id: "v_it_1", name: "Veg Garlic Bread", price: 180 },
        { id: "v_it_2", name: "Margherita Pizza", price: 299 },
        { id: "v_it_3", name: "Yummy Dummy Cheese Burst Pizza", price: 399 }
      ]
    },
    {
      category: "Indian Breads",
      icon: "flatware",
      items: [
        { id: "v_ib_1", name: "Tandoori Roti", price: 40 },
        { id: "v_ib_2", name: "Tandoori Naan", price: 60 }
      ]
    },
    {
      category: "Veg Main Course",
      icon: "dinner_dining",
      items: [
        { id: "v_mc_1", name: "Mix Dum Biryani", price: 280 },
        { id: "v_mc_2", name: "Fried Rice / Bagara Rice / Pulao", price: 240 },
        { id: "v_mc_3", name: "Veg Soft Noodles / Mix Noodles", price: 240 },
        { id: "v_mc_4", name: "Veg Manchurian", price: 220 },
        { id: "v_mc_5", name: "Paneer Curry (Daily Changes)", price: 260 },
        { id: "v_mc_6", name: "Veg Curry (Daily Changes)", price: 210 },
        { id: "v_mc_7", name: "Dal Tadka / Dal Makhani / Chana Masala", price: 190 },
        { id: "v_mc_8", name: "Steam Rice", price: 120 }
      ]
    },
    {
      category: "Live Counter",
      icon: "skillet",
      items: [
        { id: "v_lc_1", name: "Pasta & Spaghetti", price: 250 },
        { id: "v_lc_2", name: "Fried Momos", price: 180 }
      ]
    },
    {
      category: "Chaat",
      icon: "kebab_dining",
      items: [
        { id: "v_ch_1", name: "Pani Puri", price: 80 },
        { id: "v_ch_2", name: "Dahi Puri", price: 100 },
        { id: "v_ch_3", name: "Papdi Chaat", price: 90 }
      ]
    },
    {
      category: "Accompaniments",
      icon: "dining",
      items: [
        { id: "v_acc_1", name: "Curd Rice", price: 150 },
        { id: "v_acc_2", name: "Curd", price: 60 },
        { id: "v_acc_3", name: "Fried Papad", price: 30 },
        { id: "v_acc_4", name: "Raita", price: 50 },
        { id: "v_acc_5", name: "Pickle", price: 20 }
      ]
    },
    {
      category: "Desserts",
      icon: "cake",
      items: [
        { id: "v_des_1", name: "Flavours of Pastry", price: 180 },
        { id: "v_des_2", name: "Flavours of Ice Cream with Soft Cone and Brownie", price: 220 },
        { id: "v_des_3", name: "Gulab Jamun", price: 100 },
        { id: "v_des_4", name: "Halwa/Kheer", price: 120 },
        { id: "v_des_5", name: "Jalebi", price: 110 },
        { id: "v_des_6", name: "Chocolate Fountain", price: 250 }
      ]
    },
    {
      category: "Soft Drinks",
      icon: "local_bar",
      items: [
        { id: "v_sd_1", name: "Unlimited Coke", price: 90 },
        { id: "v_sd_2", name: "Unlimited Fanta", price: 90 },
        { id: "v_sd_3", name: "Unlimited Sprite", price: 90 },
        { id: "v_sd_4", name: "Unlimited Thums Up", price: 90 }
      ]
    }
  ],
  nonveg: [
    {
      category: "Non-Veg Soup",
      icon: "soup_kitchen",
      items: [
        { id: "nv_soup_1", name: "Soup of the Day (Asian Non-Veg Soup)", price: 150 }
      ]
    },
    {
      category: "Appetizers",
      icon: "restaurant",
      items: [
        { id: "nv_app_1", name: "Tandoori Al-Faham Chicken", price: 320 },
        { id: "nv_app_2", name: "Peri Peri Chicken Tikka", price: 310 },
        { id: "nv_app_3", name: "Chicken Lollipop", price: 280 },
        { id: "nv_app_4", name: "Andhra Royyala Vepudu", price: 350 },
        { id: "nv_app_5", name: "Pepper Fish Fry", price: 330 },
        { id: "nv_app_6", name: "Crispy Mutton Kebab Roll", price: 360 }
      ]
    },
    {
      category: "Salads",
      icon: "eco",
      items: [
        { id: "nv_sal_1", name: "Healthy Veg Salads", price: 160 },
        { id: "nv_sal_2", name: "Watermelon, Papaya & Pineapple", price: 170 }
      ]
    },
    {
      category: "Non-Veg Italian",
      icon: "local_pizza",
      items: [
        { id: "nv_it_1", name: "Non-Veg Garlic Bread", price: 210 },
        { id: "nv_it_2", name: "Herb Chicken Pizza", price: 349 },
        { id: "nv_it_3", name: "Pollo Forza Cheese Burst Pizza", price: 449 }
      ]
    },
    {
      category: "Indian Breads",
      icon: "flatware",
      items: [
        { id: "nv_ib_1", name: "Tandoori Roti", price: 40 },
        { id: "nv_ib_2", name: "Tandoori Naan", price: 60 }
      ]
    },
    {
      category: "Non-Veg Main Course",
      icon: "dinner_dining",
      items: [
        { id: "nv_mc_1", name: "Hyderabadi Dum Biryani", price: 320 },
        { id: "nv_mc_2", name: "Egg Fried Rice", price: 250 },
        { id: "nv_mc_3", name: "Chicken Majestic / Chilli Wings", price: 290 },
        { id: "nv_mc_4", name: "Chicken Soft Noodles / Egg Noodles", price: 260 },
        { id: "nv_mc_5", name: "Mutton Curry / Mutton Rogan Josh", price: 380 },
        { id: "nv_mc_6", name: "Andhra Chicken Curry / Chicken Kaju Masala", price: 310 },
        { id: "nv_mc_7", name: "Korameenu Chepala Pulusu", price: 340 }
      ]
    },
    {
      category: "Live Counter",
      icon: "skillet",
      items: [
        { id: "nv_lc_1", name: "Pasta & Spaghetti", price: 250 },
        { id: "nv_lc_2", name: "Egg Kulfi", price: 150 }
      ]
    },
    {
      category: "Chaat",
      icon: "kebab_dining",
      items: [
        { id: "nv_ch_1", name: "Pani Puri", price: 80 },
        { id: "nv_ch_2", name: "Dahi Puri", price: 100 },
        { id: "nv_ch_3", name: "Papdi Chaat", price: 90 }
      ]
    },
    {
      category: "Accompaniments",
      icon: "dining",
      items: [
        { id: "nv_acc_1", name: "Curd Rice", price: 150 },
        { id: "nv_acc_2", name: "Curd", price: 60 },
        { id: "nv_acc_3", name: "Fried Papad", price: 30 },
        { id: "nv_acc_4", name: "Raita", price: 50 },
        { id: "nv_acc_5", name: "Pickle", price: 20 }
      ]
    },
    {
      category: "Desserts",
      icon: "cake",
      items: [
        { id: "nv_des_1", name: "Flavours of Pastry", price: 180 },
        { id: "nv_des_2", name: "Flavours of Ice Cream with Soft Cone and Brownie", price: 220 },
        { id: "nv_des_3", name: "Gulab Jamun", price: 100 },
        { id: "nv_des_4", name: "Halwa/Kheer", price: 120 },
        { id: "nv_des_5", name: "Jalebi", price: 110 },
        { id: "nv_des_6", name: "Chocolate Fountain", price: 250 }
      ]
    },
    {
      category: "Soft Drinks",
      icon: "local_bar",
      items: [
        { id: "nv_sd_1", name: "Unlimited Coke", price: 90 },
        { id: "nv_sd_2", name: "Unlimited Fanta", price: 90 },
        { id: "nv_sd_3", name: "Unlimited Sprite", price: 90 },
        { id: "nv_sd_4", name: "Unlimited Thums Up", price: 90 }
      ]
    }
  ]
};

window.getMenuDatabase = function() {
    let menu = localStorage.getItem('samjhones_menu');
    if (!menu) {
        menu = JSON.stringify(DEFAULT_MENU_DATABASE);
        localStorage.setItem('samjhones_menu', menu);
    }
    return JSON.parse(menu);
};

window.saveMenuDatabase = function(data) {
    localStorage.setItem('samjhones_menu', JSON.stringify(data));
};

window.resetMenuDatabase = function() {
    localStorage.setItem('samjhones_menu', JSON.stringify(DEFAULT_MENU_DATABASE));
    return DEFAULT_MENU_DATABASE;
};

/* ==========================================================================
   Global Light Mode / Dark Mode Theme Toggler
   ========================================================================== */
function injectThemeToggle() {
    if (document.getElementById('theme-toggle')) return;

    // 1. Create the desktop theme toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'p-2 rounded-full hover:bg-surface-variant/40 transition-colors text-primary flex items-center justify-center';
    toggleBtn.setAttribute('aria-label', 'Toggle theme');
    toggleBtn.innerHTML = `<span class="material-symbols-outlined text-[20px] font-bold" id="theme-toggle-icon">dark_mode</span>`;
    
    // 2. Find insertion point in the top navbar
    const navRightContainer = document.querySelector('nav .flex.items-center.gap-4') || 
                              document.querySelector('nav div.flex.items-center.gap-4');
    
    if (navRightContainer) {
        // Insert as first element in the action container for maximum aesthetic symmetry
        navRightContainer.insertBefore(toggleBtn, navRightContainer.firstChild);
    } else {
        const navMainRow = document.querySelector('nav > div');
        if (navMainRow) {
            navMainRow.appendChild(toggleBtn);
        }
    }

    // 3. Add mobile menu drawer theme toggle
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    if (mobileDrawer) {
        const drawerContainer = mobileDrawer.querySelector('.w-72') || mobileDrawer.querySelector('div');
        if (drawerContainer) {
            const drawerFooter = drawerContainer.lastElementChild;
            if (drawerFooter) {
                const drawerToggleContainer = document.createElement('div');
                drawerToggleContainer.className = 'flex items-center justify-between border-t border-outline-variant/20 pt-4 mt-2';
                drawerToggleContainer.innerHTML = `
                    <span class="text-on-surface-variant dark:text-outline-variant font-label-bold text-sm">Theme</span>
                    <button id="mobile-theme-toggle" class="p-2 rounded-full hover:bg-surface-variant/40 transition-colors text-primary flex items-center justify-center" aria-label="Toggle theme">
                        <span class="material-symbols-outlined text-[20px] font-bold" id="mobile-theme-toggle-icon">dark_mode</span>
                    </button>
                `;
                drawerFooter.insertBefore(drawerToggleContainer, drawerFooter.firstChild);
            }
        }
    }

    // 4. Bind event listeners
    const desktopToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-theme-toggle');

    function handleToggle() {
        const isDark = document.documentElement.classList.toggle('dark');
        const theme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateToggleIcons(isDark);
        showToast(`Theme switched to ${theme} mode!`, isDark ? 'light_mode' : 'dark_mode');
    }

    if (desktopToggle) desktopToggle.addEventListener('click', handleToggle);
    if (mobileToggle) mobileToggle.addEventListener('click', handleToggle);

    // 5. Initialize active icon based on current root class
    const isDarkOnLoad = document.documentElement.classList.contains('dark');
    updateToggleIcons(isDarkOnLoad);
}

function updateToggleIcons(isDark) {
    const desktopIcon = document.getElementById('theme-toggle-icon');
    const mobileIcon = document.getElementById('mobile-theme-toggle-icon');
    
    // Icon represents the theme to switch TO, or matching state representation.
    // If dark mode is active, we display 'light_mode' (Sun) to allow switching to light mode.
    const iconName = isDark ? 'light_mode' : 'dark_mode';
    if (desktopIcon) desktopIcon.textContent = iconName;
    if (mobileIcon) mobileIcon.textContent = iconName;
}

