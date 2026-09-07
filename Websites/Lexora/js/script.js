// Main App Logic for Lexora SPA
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
                $('.navbar').addClass('scrolled');
            } else {
                $('.navbar').removeClass('scrolled');
            }
        });
        
        // Initial setup
        $('#year').text(new Date().getFullYear());
    },

    cacheDOM: function() {
        this.$views = $('.view-section');
        this.$navLinks = $('.nav-link');
    },

    bindEvents: function() {
        const self = this;

        // Consultation Form
        $('#consultationForm').on('submit', function(e) {
            e.preventDefault();
            const btn = $(this).find('button[type="submit"]');
            const originalText = btn.html();
            btn.html('<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Inquiry...');
            btn.prop('disabled', true);
            
            setTimeout(() => {
                btn.removeClass('btn-navy').addClass('bg-success text-white border-0');
                btn.html('Inquiry Received <i class="fa-solid fa-check ms-2"></i>');
                this.reset();
                setTimeout(() => {
                    btn.removeClass('bg-success text-white border-0').addClass('btn-navy').html(originalText).prop('disabled', false);
                }, 4000);
            }, 1500);
        });
    },

    navigate: function(viewId) {
        this.state.currentView = viewId;
        
        // Update Views
        this.$views.removeClass('active');
        $(`#view-${viewId}`).addClass('active');
        
        // Update Nav
        this.$navLinks.removeClass('active text-gold');
        $(`.nav-link[onclick="app.navigate('${viewId}')"]`).addClass('active text-gold');

        // Close mobile nav
        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-toggler').click();
        }
        
        window.scrollTo(0, 0);
    },

    renderData: function() {
        // Render Practice Areas
        const practiceHtml = lexoraData.practiceAreas.map(p => `
            <div class="col-lg-4 col-md-6">
                <div class="practice-card p-5">
                    <div class="practice-icon"><i class="${p.icon}"></i></div>
                    <h4 class="mb-3">${p.title}</h4>
                    <p class="font-sans text-muted small lh-lg mb-4">${p.description}</p>
                    <a href="#" class="practice-link" onclick="event.preventDefault(); app.navigate('consultation')">Consult with us</a>
                </div>
            </div>
        `).join('');
        $('#practice-grid').html(practiceHtml);

        // Populate Consultation select
        const selectHtml = lexoraData.practiceAreas.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
        $('#consult-area').append(selectHtml);

        // Render Attorneys
        const attorneysHtml = lexoraData.attorneys.map(a => `
            <div class="col-lg-4 col-md-6">
                <div class="attorney-card h-100 shadow-sm border border-light">
                    <div class="attorney-img-wrapper">
                        <img src="${a.image}" alt="${a.name}" class="w-100" style="height: 350px; object-fit: cover; object-position: top;">
                    </div>
                    <div class="p-4 p-xl-5">
                        <h4 class="mb-1 text-navy">${a.name}</h4>
                        <span class="font-sans text-gold small text-uppercase tracking-widest fw-bold d-block mb-4">${a.position}</span>
                        <p class="font-sans text-muted small lh-lg mb-4">${a.bio}</p>
                        
                        <div class="mb-3">
                            <h6 class="font-serif text-navy mb-2">Education</h6>
                            <ul class="font-sans text-muted small ps-3 mb-0">
                                ${a.education.map(e => `<li>${e}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div>
                            <h6 class="font-serif text-navy mb-2">Admissions</h6>
                            <p class="font-sans text-muted small mb-0">${a.admissions.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        $('#attorneys-grid').html(attorneysHtml);

        // Render Cases
        const casesHtml = lexoraData.cases.map(c => `
            <div class="case-item p-4 p-md-5 mb-4 shadow-sm border border-light border-start border-4 border-start-navy rounded-end">
                <span class="font-sans text-gold small text-uppercase tracking-widest fw-bold d-block mb-3">${c.category}</span>
                
                <h5 class="text-navy mb-2">The Challenge</h5>
                <p class="font-sans text-muted small lh-lg mb-4">${c.challenge}</p>
                
                <h5 class="text-navy mb-2">Our Strategic Approach</h5>
                <p class="font-sans text-muted small lh-lg mb-4">${c.approach}</p>
                
                <div class="bg-navy-light text-white p-4 rounded-3 mt-4">
                    <h6 class="font-serif text-gold mb-2">The Outcome</h6>
                    <p class="font-sans text-white-75 small lh-lg mb-0">${c.outcome}</p>
                </div>
            </div>
        `).join('');
        $('#cases-list').html(casesHtml);

        // Render Articles
        const articlesHtml = lexoraData.articles.map(a => `
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 border-0 shadow-sm rounded-0">
                    <div class="card-body p-5 d-flex flex-column">
                        <span class="font-sans text-gold small text-uppercase tracking-widest fw-bold d-block mb-3">${a.category}</span>
                        <h4 class="text-navy mb-3">${a.title}</h4>
                        <p class="font-sans text-muted small lh-lg mb-4 flex-grow-1">${a.summary}</p>
                        <div class="border-top pt-3 mt-auto">
                            <span class="font-sans small text-muted d-block">By ${a.author}</span>
                            <span class="font-sans small text-muted opacity-75">${a.date}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        $('#articles-grid').html(articlesHtml);
    }
};

// Initialize App
$(document).ready(function() {
    app.init();
});
