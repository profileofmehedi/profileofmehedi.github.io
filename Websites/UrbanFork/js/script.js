// Main App Logic for UrbanFork SPA
const app = {
    state: {
        currentView: 'home',
        menuFilter: 'all'
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.renderData();
        
        // Handle navbar background blur on scroll
        $(window).scroll(function() {
            if ($(this).scrollTop() > 50) {
                $('.navbar').addClass('shadow-lg').removeClass('py-2');
            } else {
                $('.navbar').removeClass('shadow-lg').addClass('py-2');
            }
        });
        
        $('#year').text(new Date().getFullYear());
    },

    cacheDOM: function() {
        this.$views = $('.view-section');
        this.$navLinks = $('.nav-link');
    },

    bindEvents: function() {
        const self = this;

        // Menu Filtering
        $('.menu-tab').on('click', function() {
            $('.menu-tab').removeClass('active text-white').addClass('text-white-50');
            $(this).addClass('active text-white').removeClass('text-white-50');
            self.state.menuFilter = $(this).data('category');
            self.renderMenu();
        });

        // Reservation Form
        $('#reservation-form').on('submit', function(e) {
            e.preventDefault();
            const btn = $(this).find('button[type="submit"]');
            const originalText = btn.html();
            btn.html('<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...');
            btn.prop('disabled', true);
            
            setTimeout(() => {
                $(this).addClass('d-none');
                $('#reservation-success').removeClass('d-none');
                // Reset after 5 seconds to allow another booking
                setTimeout(() => {
                    $(this).removeClass('d-none')[0].reset();
                    $('#reservation-success').addClass('d-none');
                    btn.html(originalText).prop('disabled', false);
                }, 5000);
            }, 1500);
        });
    },

    navigate: function(viewId) {
        this.state.currentView = viewId;
        
        // Update Views
        this.$views.removeClass('active');
        $(`#view-${viewId}`).addClass('active');
        
        // Update Nav
        this.$navLinks.removeClass('active text-white').addClass('text-white-50');
        $(`.nav-link[onclick="app.navigate('${viewId}')"]`).addClass('active text-white').removeClass('text-white-50');

        // Close mobile nav
        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-toggler').click();
        }
        
        window.scrollTo(0, 0);
    },

    renderData: function() {
        this.renderMenu();

        // Render Featured Dishes
        const featuredHtml = urbanData.featuredDishes.map(d => `
            <div class="col-md-6">
                <div class="dish-card bg-black h-100" onclick="app.navigate('menu')">
                    <img src="${d.image}" alt="${d.title}" class="img-fluid w-100 object-fit-cover" style="height: 400px; opacity: 0.8;">
                    <div class="dish-card-overlay">
                        <h3 class="font-serif fst-italic text-white mb-2">${d.title}</h3>
                        <p class="text-white-50 font-sans small mb-0">${d.desc}</p>
                    </div>
                </div>
            </div>
        `).join('');
        $('#featured-dishes-grid').html(featuredHtml);

        // Render Offers
        const offersHtml = urbanData.offers.map(o => `
            <div class="col-md-6">
                <div class="bg-black border border-secondary border-opacity-25 h-100 p-0 overflow-hidden d-flex flex-column">
                    <img src="${o.image}" alt="${o.title}" class="img-fluid w-100 object-fit-cover" style="height: 300px; filter: brightness(0.8);">
                    <div class="p-4 p-lg-5 text-center flex-grow-1 d-flex flex-column justify-content-center">
                        <h6 class="text-accent text-uppercase tracking-widest small mb-3">${o.subtitle}</h6>
                        <h3 class="font-serif fst-italic text-white mb-3">${o.title}</h3>
                        <p class="text-white-50 font-sans mb-4 mx-auto" style="max-width: 400px;">${o.desc}</p>
                        <h4 class="text-white font-sans fw-bold mb-4">${o.price}</h4>
                        <button class="btn btn-outline-accent rounded-0 px-4 py-2 text-uppercase tracking-widest small fw-bold mx-auto" onclick="app.navigate('reservations')">Book Now</button>
                    </div>
                </div>
            </div>
        `).join('');
        $('#offers-grid').html(offersHtml);

        // Render Reviews
        const reviewsHtml = urbanData.reviews.map((r, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <h4 class="font-sans fw-light text-white lh-lg mb-4">"${r.text}"</h4>
                <p class="text-accent text-uppercase tracking-widest small fw-bold mb-0">${r.author}</p>
                <p class="text-white-50 font-sans small">${r.role}</p>
            </div>
        `).join('');
        
        const carouselHtml = `
            <div id="reviewCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${reviewsHtml}
                </div>
                <div class="d-flex justify-content-center mt-4 gap-2">
                    <button class="btn btn-outline-light rounded-circle p-0" style="width: 40px; height: 40px;" type="button" data-bs-target="#reviewCarousel" data-bs-slide="prev">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button class="btn btn-outline-light rounded-circle p-0" style="width: 40px; height: 40px;" type="button" data-bs-target="#reviewCarousel" data-bs-slide="next">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        $('#reviews-slider').html(carouselHtml);
    },

    renderMenu: function() {
        let categoriesToRender = urbanData.menu;
        
        if (this.state.menuFilter !== 'all') {
            categoriesToRender = urbanData.menu.filter(c => c.category === this.state.menuFilter);
        }

        const menuHtml = categoriesToRender.map(category => `
            <div class="col-12 mb-5">
                <h2 class="display-6 font-serif fst-italic text-white text-center mb-5">${category.category}</h2>
                <div class="row g-4">
                    ${category.items.map(item => this.generateMenuItem(item)).join('')}
                </div>
            </div>
        `).join('');

        $('#menu-grid').html(menuHtml);
    },

    generateMenuItem: function(item) {
        let tagHtml = '';
        if(item.tags.includes('v')) tagHtml += '<span class="badge border border-success text-success ms-2 font-sans rounded-0" title="Vegetarian">V</span>';
        if(item.tags.includes('gf')) tagHtml += '<span class="badge border border-warning text-warning ms-2 font-sans rounded-0" title="Gluten-Free">GF</span>';

        return `
            <div class="col-lg-6">
                <div class="d-flex align-items-center mb-4">
                    <img src="${item.image}" alt="${item.name}" class="menu-item-img me-4">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-end mb-1">
                            <h5 class="font-serif text-white mb-0 d-flex align-items-center">${item.name} ${tagHtml}</h5>
                            <div class="menu-dotted-leader"></div>
                            <span class="menu-item-price font-sans">$${item.price}</span>
                        </div>
                        <p class="text-white-50 font-sans small mb-0 pe-4">${item.desc}</p>
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
