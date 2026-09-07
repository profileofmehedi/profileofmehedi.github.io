// Main App Logic for PrimeEstate SPA
const app = {
    state: {
        currentView: 'home',
        savedProperties: [],
        viewMode: 'grid', // 'grid' or 'list'
        filters: {
            status: 'all',
            type: 'all',
            location: '',
            maxPrice: 10000000,
            minBeds: 0,
            minBaths: 0
        },
        sortBy: 'newest'
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.renderHome();
        this.renderAgents();
        
        // Handle navbar scroll
        $(window).scroll(function() {
            if ($(this).scrollTop() > 50) {
                $('.navbar').addClass('py-2').removeClass('py-3');
            } else {
                $('.navbar').removeClass('py-2').addClass('py-3');
            }
        });
        
        // Initial setup
        $('.navbar').addClass('py-3');
        $('#year').text(new Date().getFullYear());
        this.updateSavedCount();
    },

    cacheDOM: function() {
        this.$views = $('.view-section');
        this.$navLinks = $('.nav-link');
        this.$propertiesGrid = $('#properties-grid');
    },

    bindEvents: function() {
        const self = this;

        // --- Home Search ---
        $('#search-tabs .nav-link').on('click', function() {
            $('#search-tabs .nav-link').removeClass('active text-white').addClass('text-slate');
            $(this).addClass('active text-white').removeClass('text-slate');
        });

        $('#hero-search-form').on('submit', function(e) {
            e.preventDefault();
            self.state.filters.status = $('#search-tabs .nav-link.active').data('type');
            self.state.filters.location = $('#hero-location').val().toLowerCase();
            self.state.filters.type = $('#hero-type').val();
            
            // Parse price
            const priceVal = $('#hero-price').val();
            if(priceVal === 'all') self.state.filters.maxPrice = 100000000;
            else if(priceVal === '0-500000') self.state.filters.maxPrice = 500000;
            else if(priceVal === '500000-1000000') self.state.filters.maxPrice = 1000000;
            else if(priceVal === '1000000-5000000') self.state.filters.maxPrice = 5000000;
            else self.state.filters.maxPrice = 100000000;

            // Sync with sidebar filters
            $(`.filter-status[value="${self.state.filters.status}"]`).prop('checked', true);
            $('#filter-type').val(self.state.filters.type);
            $('#filter-location').val(self.state.filters.location);
            $('#filter-price').val(self.state.filters.maxPrice);
            self.updatePriceLabel();

            self.navigate('properties');
        });

        // --- Sidebar Filters ---
        $('.filter-status').on('change', function() {
            self.state.filters.status = $(this).val();
            self.renderPropertiesListing();
        });

        $('#filter-type').on('change', function() {
            self.state.filters.type = $(this).val();
            self.renderPropertiesListing();
        });

        $('#filter-location').on('input', function() {
            self.state.filters.location = $(this).val().toLowerCase();
            self.renderPropertiesListing();
        });

        $('#filter-price').on('input', function() {
            self.state.filters.maxPrice = parseInt($(this).val());
            self.updatePriceLabel();
            self.renderPropertiesListing();
        });

        $('#filter-beds').on('change', function() {
            self.state.filters.minBeds = parseInt($(this).val());
            self.renderPropertiesListing();
        });

        $('#filter-baths').on('change', function() {
            self.state.filters.minBaths = parseInt($(this).val());
            self.renderPropertiesListing();
        });

        $('#clearFiltersBtn').on('click', function(e) {
            e.preventDefault();
            self.state.filters = { status: 'all', type: 'all', location: '', maxPrice: 10000000, minBeds: 0, minBaths: 0 };
            $('#filter-form')[0].reset();
            $(`.filter-status[value="all"]`).prop('checked', true);
            self.updatePriceLabel();
            self.renderPropertiesListing();
        });

        // --- Sorting & View Mode ---
        $('#sortSelect').on('change', function() {
            self.state.sortBy = $(this).val();
            self.renderPropertiesListing();
        });

        $('#btn-grid-view').on('click', function() {
            self.state.viewMode = 'grid';
            $(this).addClass('active');
            $('#btn-list-view').removeClass('active');
            self.renderPropertiesListing();
        });

        $('#btn-list-view').on('click', function() {
            self.state.viewMode = 'list';
            $(this).addClass('active');
            $('#btn-grid-view').removeClass('active');
            self.renderPropertiesListing();
        });

        // --- Favorites ---
        $(document).on('click', '.btn-favorite', function(e) {
            e.stopPropagation();
            const id = parseInt($(this).data('id'));
            const idx = self.state.savedProperties.indexOf(id);
            
            if(idx === -1) {
                self.state.savedProperties.push(id);
                $(this).addClass('active');
                $(this).find('i').removeClass('fa-regular').addClass('fa-solid');
            } else {
                self.state.savedProperties.splice(idx, 1);
                $(this).removeClass('active');
                $(this).find('i').removeClass('fa-solid').addClass('fa-regular');
            }
            self.updateSavedCount();
        });

        // --- Forms ---
        $('#property-inquiry-form, #general-contact-form').on('submit', function(e) {
            e.preventDefault();
            const btn = $(this).find('button[type="submit"]');
            const originalText = btn.html();
            btn.html('<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...');
            btn.prop('disabled', true);
            
            setTimeout(() => {
                btn.removeClass('btn-teal').addClass('bg-success text-white border-0');
                btn.html('Message Sent <i class="fa-solid fa-check ms-2"></i>');
                this.reset();
                setTimeout(() => {
                    btn.removeClass('bg-success text-white border-0').addClass('btn-teal').html(originalText).prop('disabled', false);
                }, 3000);
            }, 1500);
        });
    },

    updatePriceLabel: function() {
        let val = this.state.filters.maxPrice;
        let label = '';
        if(val >= 10000000) label = '$10M+';
        else if(val >= 1000000) label = `$${(val/1000000).toFixed(1)}M`;
        else label = `$${(val/1000).toFixed(0)}k`;
        $('#price-label').text(label);
    },

    updateSavedCount: function() {
        $('#saved-count').text(this.state.savedProperties.length);
        // Also update favorite buttons on detail page if needed
        const currentDetId = $('#det-btn-fav').data('id');
        if(currentDetId) {
            if(this.state.savedProperties.includes(currentDetId)) {
                $('#det-btn-fav').addClass('active').html('<i class="fa-solid fa-heart"></i>');
            } else {
                $('#det-btn-fav').removeClass('active').html('<i class="fa-regular fa-heart"></i>');
            }
        }
    },

    navigate: function(viewId) {
        this.state.currentView = viewId;
        
        // Update Views
        this.$views.removeClass('active');
        $(`#view-${viewId}`).addClass('active');
        
        // Update Nav
        this.$navLinks.removeClass('active fw-bold text-teal');
        if(viewId !== 'details') {
            $(`.nav-link[onclick="app.navigate('${viewId}')"]`).addClass('active fw-bold text-teal');
        }

        // Close mobile nav
        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-toggler').click();
        }
        
        // Render specific view data
        if(viewId === 'properties') {
            this.renderPropertiesListing();
        }
        
        window.scrollTo(0, 0);
    },

    openPropertyDetails: function(id) {
        const prop = primeData.properties.find(p => p.id === id);
        if(!prop) return;

        $('#det-breadcrumb').text(prop.title);
        $('#det-title').text(prop.title);
        $('#det-location').text(prop.location);
        $('#det-map-loc').text(prop.location);
        
        const priceFmt = prop.status === 'rent' ? `$${prop.price.toLocaleString()}/mo` : `$${prop.price.toLocaleString()}`;
        $('#det-price').text(priceFmt);
        
        $('#det-status').text(`For ${prop.status}`);
        $('#det-type').text(prop.type);
        
        $('#det-beds').text(prop.beds || '--');
        $('#det-baths').text(prop.baths || '--');
        $('#det-area').text(prop.area ? prop.area.toLocaleString() : '--');
        $('#det-year').text(prop.year || '--');

        $('#det-img-main').attr('src', prop.gallery[0]);
        $('#det-img-2').attr('src', prop.gallery[1] || prop.gallery[0]);
        $('#det-img-3').attr('src', prop.gallery[2] || prop.gallery[0]);

        $('#det-desc').html(`<p>${prop.overview}</p>`);

        const amHtml = prop.amenities.map(a => `
            <div class="col-md-6 d-flex align-items-center">
                <i class="fa-solid fa-check text-teal me-2"></i>
                <span class="text-slate">${a}</span>
            </div>
        `).join('');
        $('#det-amenities').html(amHtml);

        const agent = primeData.agents.find(a => a.id === prop.agentId);
        if(agent) {
            $('#det-agent-img').attr('src', agent.image);
            $('#det-agent-name').text(agent.name);
            $('#det-agent-role').text(agent.role);
            $('#det-agent-phone').text(agent.phone);
        }

        $('#det-btn-fav').data('id', prop.id);
        this.updateSavedCount();

        // Render similar properties (just taking 3 random ones for demo)
        const similarHtml = primeData.properties.filter(p => p.id !== id).slice(0, 3).map(p => this.generatePropertyCard(p, 'col-lg-4 col-md-6', 'grid')).join('');
        $('#similar-properties-grid').html(similarHtml);

        this.navigate('details');
    },

    renderHome: function() {
        const featuredHtml = primeData.properties.filter(p => p.featured).slice(0, 3).map(p => this.generatePropertyCard(p, 'col-lg-4 col-md-6', 'grid')).join('');
        $('#featured-properties-grid').html(featuredHtml);
    },

    renderAgents: function() {
        const agentsHtml = primeData.agents.map(a => `
            <div class="col-lg-4 col-md-6">
                <div class="agent-card">
                    <img src="${a.image}" alt="${a.name}" class="agent-img">
                    <h4 class="fw-bold text-slate mb-1">${a.name}</h4>
                    <p class="text-teal small fw-bold text-uppercase tracking-wider mb-3">${a.role}</p>
                    <div class="d-flex justify-content-center gap-3 mb-4">
                        <a href="tel:${a.phone}" class="btn btn-outline-slate rounded-circle btn-icon"><i class="fa-solid fa-phone"></i></a>
                        <a href="mailto:${a.email}" class="btn btn-outline-slate rounded-circle btn-icon"><i class="fa-solid fa-envelope"></i></a>
                    </div>
                    <button class="btn btn-slate w-100 bg-slate text-white py-2 rounded-pill">View Listings</button>
                </div>
            </div>
        `).join('');
        $('#agents-grid').html(agentsHtml);
    },

    renderPropertiesListing: function() {
        let filtered = [...primeData.properties];

        // Status
        if(this.state.filters.status !== 'all') {
            filtered = filtered.filter(p => p.status === this.state.filters.status);
        }

        // Type
        if(this.state.filters.type !== 'all') {
            filtered = filtered.filter(p => p.type === this.state.filters.type);
        }

        // Location
        if(this.state.filters.location) {
            filtered = filtered.filter(p => p.location.toLowerCase().includes(this.state.filters.location));
        }

        // Price
        if(this.state.filters.maxPrice < 10000000) {
            filtered = filtered.filter(p => p.price <= this.state.filters.maxPrice);
        }

        // Beds & Baths
        if(this.state.filters.minBeds > 0) {
            filtered = filtered.filter(p => p.beds >= this.state.filters.minBeds);
        }
        if(this.state.filters.minBaths > 0) {
            filtered = filtered.filter(p => p.baths >= this.state.filters.minBaths);
        }

        // Sort
        switch(this.state.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'area':
                filtered.sort((a, b) => b.area - a.area);
                break;
            case 'newest':
                filtered.sort((a, b) => b.year - a.year);
                break;
        }

        // Render
        $('#results-count').text(filtered.length);
        
        if(filtered.length === 0) {
            this.$propertiesGrid.hide();
            $('#pagination-nav').hide();
            $('#empty-state').removeClass('d-none');
        } else {
            $('#empty-state').addClass('d-none');
            this.$propertiesGrid.show();
            $('#pagination-nav').show();
            
            const colClass = this.state.viewMode === 'grid' ? 'col-md-6 col-xl-4' : 'col-12';
            const gridHtml = filtered.map(p => this.generatePropertyCard(p, colClass, this.state.viewMode)).join('');
            this.$propertiesGrid.html(gridHtml);
        }
    },

    generatePropertyCard: function(prop, colClass, mode) {
        const isFav = this.state.savedProperties.includes(prop.id);
        const favIcon = isFav ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
        const favActive = isFav ? 'active' : '';
        const priceFmt = prop.status === 'rent' ? `$${prop.price.toLocaleString()}/mo` : `$${prop.price.toLocaleString()}`;
        const typeBadge = `<span class="badge bg-teal fw-normal text-uppercase tracking-wider">For ${prop.status}</span>`;
        
        const cardClass = mode === 'list' ? 'property-card list-view cursor-pointer' : 'property-card cursor-pointer';

        return `
            <div class="${colClass}">
                <div class="${cardClass}" onclick="app.openPropertyDetails(${prop.id})">
                    <div class="property-img-wrapper">
                        <div class="property-badges d-flex gap-2">
                            ${typeBadge}
                        </div>
                        <button class="btn-favorite shadow-sm ${favActive}" data-id="${prop.id}" onclick="event.stopPropagation();">
                            ${favIcon}
                        </button>
                        <img src="${prop.image}" alt="${prop.title}">
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <h4 class="fw-bold text-teal mb-2">${priceFmt}</h4>
                        <h5 class="fw-bold text-slate text-truncate mb-1">${prop.title}</h5>
                        <p class="text-muted small mb-3"><i class="fa-solid fa-location-dot me-2"></i>${prop.location}</p>
                        
                        <div class="d-flex align-items-center gap-3 text-slate small mt-auto border-top pt-3">
                            <span title="Bedrooms"><i class="fa-solid fa-bed me-1 text-muted"></i> ${prop.beds || '-'}</span>
                            <span title="Bathrooms"><i class="fa-solid fa-bath me-1 text-muted"></i> ${prop.baths || '-'}</span>
                            <span title="Square Feet"><i class="fa-solid fa-ruler-combined me-1 text-muted"></i> ${prop.area ? prop.area.toLocaleString() : '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Initialize App
$(document).ready(function() {
    app.init();
});
