// Main App Logic for Nexora Technologies SPA
const app = {
    state: {
        currentView: 'home'
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.renderData();
        
        // Handle navbar scroll
        $(window).scroll(function() {
            if ($(this).scrollTop() > 50) {
                $('.navbar').addClass('shadow-sm').removeClass('py-2');
            } else {
                $('.navbar').removeClass('shadow-sm').addClass('py-2');
            }
        });
        
        $('#year').text(new Date().getFullYear());
    },

    cacheDOM: function() {
        this.$views = $('.view-section');
        this.$navLinks = $('.nav-link');
    },

    bindEvents: function() {
        $('#contact-form').on('submit', function(e) {
            e.preventDefault();
            const btn = $(this).find('button[type="submit"]');
            const originalText = btn.html();
            btn.html('<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...');
            btn.prop('disabled', true);
            
            setTimeout(() => {
                btn.removeClass('btn-primary-custom').addClass('bg-success text-white border-0');
                btn.html('Request Received <i class="fa-solid fa-check ms-2"></i>');
                this.reset();
                setTimeout(() => {
                    btn.removeClass('bg-success text-white border-0').addClass('btn-primary-custom').html(originalText).prop('disabled', false);
                }, 3000);
            }, 1500);
        });
    },

    navigate: function(viewId) {
        this.state.currentView = viewId;
        
        // Update Views
        this.$views.removeClass('active');
        $(`#view-${viewId}`).addClass('active');
        
        // Update Nav
        this.$navLinks.removeClass('active');
        $(`.nav-link[onclick="app.navigate('${viewId}')"]`).addClass('active');

        // Close mobile nav
        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-toggler').click();
        }
        
        window.scrollTo(0, 0);
    },

    renderData: function() {
        // Render Home Services (First 4)
        const homeServicesHtml = nexoraData.services.slice(0, 4).map(s => this.generateServiceCard(s)).join('');
        $('#home-services-grid').html(homeServicesHtml);

        // Render All Services
        const fullServicesHtml = nexoraData.services.map(s => this.generateServiceCard(s)).join('');
        $('#full-services-grid').html(fullServicesHtml);

        // Render Home Case Studies (First 2)
        const homeCasesHtml = nexoraData.cases.slice(0, 2).map(c => this.generateCaseCard(c, true)).join('');
        $('#home-cases-grid').html(homeCasesHtml);

        // Render All Case Studies
        const fullCasesHtml = nexoraData.cases.map(c => this.generateCaseCard(c, false)).join('');
        $('#full-cases-list').html(fullCasesHtml);

        // Render Products
        const productsHtml = nexoraData.products.map(p => `
            <div class="col-lg-4 col-md-6">
                <div class="service-card rounded-4 p-4 p-lg-5 text-center">
                    <div class="icon-box bg-primary-subtle text-primary mx-auto">
                        <i class="${p.icon}"></i>
                    </div>
                    <h4 class="fw-bold text-dark mb-3">${p.name}</h4>
                    <p class="text-muted mb-4">${p.desc}</p>
                    <button class="btn btn-outline-dark rounded-pill px-4" onclick="app.navigate('contact')">Request Demo</button>
                </div>
            </div>
        `).join('');
        $('#products-grid').html(productsHtml);

        // Render Jobs
        const jobsHtml = nexoraData.jobs.map(j => `
            <div class="col-12">
                <div class="case-card p-4 p-lg-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                    <div class="mb-4 mb-md-0 pe-md-4">
                        <h4 class="fw-bold text-dark mb-2">${j.title}</h4>
                        <div class="d-flex gap-3 text-muted small fw-bold mb-3">
                            <span><i class="fa-solid fa-briefcase me-1"></i> ${j.type}</span>
                            <span><i class="fa-solid fa-location-dot me-1"></i> ${j.location}</span>
                        </div>
                        <p class="text-muted mb-0">${j.desc}</p>
                    </div>
                    <div>
                        <button class="btn btn-primary-custom rounded-pill px-5 text-nowrap" onclick="app.navigate('contact')">Apply Now</button>
                    </div>
                </div>
            </div>
        `).join('');
        $('#jobs-list').html(jobsHtml);
    },

    generateServiceCard: function(service) {
        return `
            <div class="col-lg-3 col-md-6">
                <div class="service-card rounded-4 p-4 p-lg-5">
                    <div class="icon-box ${service.colorClass}">
                        <i class="${service.icon}"></i>
                    </div>
                    <h5 class="fw-bold text-dark mb-3">${service.title}</h5>
                    <p class="text-muted small mb-0 lh-lg">${service.description}</p>
                </div>
            </div>
        `;
    },

    generateCaseCard: function(caseItem, isHome) {
        const techTags = caseItem.tech.map(t => `<span class="badge bg-light text-dark border border-dark border-opacity-10 py-2 px-3 fw-medium">${t}</span>`).join('');
        const colClass = isHome ? 'col-lg-6' : 'col-12 mb-5';
        const imgClass = isHome ? 'card-img-top' : 'img-fluid h-100 object-fit-cover';
        const bodyClass = isHome ? 'p-4 p-lg-5' : 'p-4 p-lg-5 d-flex flex-column justify-content-center h-100';

        if(isHome) {
            return `
                <div class="${colClass}">
                    <div class="case-card h-100">
                        <img src="${caseItem.image}" alt="${caseItem.title}" class="${imgClass}" style="height: 250px; object-fit: cover;">
                        <div class="${bodyClass}">
                            <span class="text-primary fw-bold small text-uppercase tracking-wide">${caseItem.industry}</span>
                            <h4 class="fw-bold text-dark mt-2 mb-4">${caseItem.title}</h4>
                            <p class="text-muted mb-4">${caseItem.challenge}</p>
                            <button class="btn btn-link text-primary p-0 fw-bold text-decoration-none" onclick="app.navigate('cases')">Read Full Study <i class="fa-solid fa-arrow-right ms-1"></i></button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="${colClass}">
                    <div class="case-card">
                        <div class="row g-0">
                            <div class="col-lg-5">
                                <img src="${caseItem.image}" alt="${caseItem.title}" class="${imgClass}">
                            </div>
                            <div class="col-lg-7">
                                <div class="${bodyClass}">
                                    <span class="text-primary fw-bold small text-uppercase tracking-wide">${caseItem.industry}</span>
                                    <h3 class="fw-bold text-dark mt-2 mb-4">${caseItem.title}</h3>
                                    
                                    <h6 class="fw-bold text-dark mb-2">The Challenge</h6>
                                    <p class="text-muted small mb-4">${caseItem.challenge}</p>
                                    
                                    <h6 class="fw-bold text-dark mb-2">Our Solution</h6>
                                    <p class="text-muted small mb-4">${caseItem.solution}</p>
                                    
                                    <h6 class="fw-bold text-dark mb-2">Architecture Preview (Tech Stack)</h6>
                                    <div class="d-flex flex-wrap gap-2 mb-4">
                                        ${techTags}
                                    </div>

                                    <div class="bg-success-subtle border border-success-subtle rounded-3 p-3 mt-auto">
                                        <h6 class="text-success fw-bold mb-1"><i class="fa-solid fa-chart-line me-2"></i>Results</h6>
                                        <p class="text-success small mb-0">${caseItem.results}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
};

// Initialize App
$(document).ready(function() {
    app.init();
});
