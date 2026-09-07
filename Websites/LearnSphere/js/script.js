// Main App Logic for LearnSphere SPA
const app = {
    state: {
        currentView: 'home',
        filters: {
            category: [],
            level: [],
            price: 'all',
            search: ''
        },
        sortBy: 'popular',
        currentCourseId: null
    },

    init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.renderHome();
        this.setupFilters();
        
        // Handle navbar scroll
        $(window).scroll(function() {
            if ($(this).scrollTop() > 50) {
                $('.navbar').addClass('shadow-sm py-2').removeClass('py-3');
            } else {
                $('.navbar').removeClass('shadow-sm py-2').addClass('py-3');
            }
        });
        
        // Initial setup
        $('.navbar').addClass('py-3');
        $('#year').text(new Date().getFullYear());
    },

    cacheDOM: function() {
        this.$views = $('.view-section');
        this.$coursesGrid = $('#coursesGrid');
        this.$emptyState = $('#emptyState');
        this.$coursesCount = $('#coursesCount');
        this.$navLinks = $('.nav-link');
    },

    bindEvents: function() {
        const self = this;
        
        // Search
        $('#searchInput').on('input', function(e) {
            self.state.filters.search = e.target.value.toLowerCase();
            self.renderCoursesListing();
        });

        // Category Filter
        $(document).on('change', '.filter-category', function() {
            const val = $(this).val();
            if(this.checked) {
                self.state.filters.category.push(val);
            } else {
                self.state.filters.category = self.state.filters.category.filter(c => c !== val);
            }
            self.renderCoursesListing();
        });

        // Level Filter
        $('.filter-level').on('change', function() {
            const val = $(this).val();
            if(this.checked) {
                self.state.filters.level.push(val);
            } else {
                self.state.filters.level = self.state.filters.level.filter(l => l !== val);
            }
            self.renderCoursesListing();
        });

        // Price Filter
        $('.filter-price').on('change', function() {
            self.state.filters.price = $(this).val();
            self.renderCoursesListing();
        });

        // Sort
        $('#sortSelect').on('change', function() {
            self.state.sortBy = $(this).val();
            self.renderCoursesListing();
        });

        // Clear Filters
        $('#clearFiltersBtn').on('click', function() {
            self.state.filters = { category: [], level: [], price: 'all', search: '' };
            $('input[type="checkbox"]').prop('checked', false);
            $('#price-all').prop('checked', true);
            $('#searchInput').val('');
            self.renderCoursesListing();
        });

        // Contact Form
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            const btn = $(this).find('button[type="submit"]');
            const originalText = btn.html();
            btn.html('<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...');
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

    navigate: function(viewId, scrollToSection = null) {
        this.state.currentView = viewId;
        
        // Update Views
        this.$views.removeClass('active');
        $(`#view-${viewId}`).addClass('active');
        
        // Update Nav
        this.$navLinks.removeClass('active');
        if(viewId !== 'course-details') {
            $(`.nav-link[onclick="app.navigate('${viewId}')"]`).addClass('active');
        }

        // Close mobile nav
        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-toggler').click();
        }
        
        // Render specific view data
        if(viewId === 'courses') {
            this.renderCoursesListing();
            window.scrollTo(0, 0);
        } else if(viewId === 'home') {
            if(!scrollToSection) window.scrollTo(0, 0);
        }
        
        // Scroll if needed
        if(scrollToSection) {
            setTimeout(() => {
                const target = $(`#${scrollToSection}`);
                if(target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 500);
                }
            }, 100);
        }
    },

    openCourseDetails: function(courseId) {
        this.state.currentCourseId = courseId;
        const course = mockData.courses.find(c => c.id === courseId);
        if(!course) return;

        // Populate Details View
        $('#detail-title').text(course.title);
        $('#detail-category').text(course.category);
        $('#detail-level').text(course.level);
        $('#detail-short-desc').text(course.overview.substring(0, 100) + '...');
        $('#detail-rating').text(course.rating);
        $('#detail-reviews-count').text(course.reviews);
        $('#detail-students').text(course.students.toLocaleString());
        $('#detail-duration').text(course.duration);
        $('#detail-sidebar-duration').text(course.duration);
        
        $('#detail-thumbnail').attr('src', course.thumbnail);
        $('#detail-price').text(course.price === 0 ? 'Free' : `$${course.price}`);
        
        if(course.featured) {
            $('#detail-badge-featured').show();
        } else {
            $('#detail-badge-featured').hide();
        }

        // Overview Tab
        $('#detail-overview').html(`<p>${course.overview}</p>`);
        
        const outcomesHtml = course.outcomes.map(o => `
            <div class="col-md-6 d-flex">
                <i class="fa-solid fa-check text-primary mt-1 me-2"></i>
                <span class="text-muted small">${o}</span>
            </div>
        `).join('');
        $('#detail-outcomes').html(outcomesHtml);
        
        const reqsHtml = course.requirements.map(r => `<li>${r}</li>`).join('');
        $('#detail-requirements').html(reqsHtml);

        // Curriculum Tab
        $('#detail-lectures-count').text(`${course.curriculum.reduce((acc, curr) => acc + curr.lectures, 0)} Lectures`);
        const currHtml = course.curriculum.map((section, index) => `
            <div class="accordion-item border rounded mb-2 overflow-hidden">
                <h2 class="accordion-header">
                    <button class="accordion-button ${index !== 0 ? 'collapsed' : ''} bg-white shadow-none fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#curr-${index}">
                        ${section.title}
                        <span class="ms-auto badge bg-light text-muted fw-normal">${section.lectures} lectures</span>
                    </button>
                </h2>
                <div id="curr-${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}">
                    <div class="accordion-body bg-light-gray py-2">
                        <div class="d-flex justify-content-between text-muted small py-2 border-bottom">
                            <span><i class="fa-solid fa-play-circle me-2 text-primary"></i> Introduction to module</span>
                            <span>05:30</span>
                        </div>
                        <div class="d-flex justify-content-between text-muted small py-2">
                            <span><i class="fa-solid fa-play-circle me-2 text-primary"></i> Main concepts</span>
                            <span>15:00</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        $('#curriculumAccordion').html(currHtml);

        // Instructor Tab
        const instructorInfo = mockData.instructors.find(i => i.name === course.instructor) || mockData.instructors[0];
        $('#detail-instructor-name').text(course.instructor);
        $('#detail-instructor-title').text(instructorInfo.role);
        $('#detail-instructor-img').attr('src', instructorInfo.image);
        $('#detail-instructor-bio').text(course.instructorBio);

        this.navigate('course-details');
        window.scrollTo(0, 0);
    },

    renderHome: function() {
        // Render Stats
        this.animateCounter('#stat-courses', mockData.stats.courses);
        this.animateCounter('#stat-students', mockData.stats.students, true);
        this.animateCounter('#stat-instructors', mockData.stats.instructors);
        this.animateCounter('#stat-hours', mockData.stats.hours, true);

        // Render Featured Courses
        const featuredHtml = mockData.courses.filter(c => c.featured).slice(0, 3).map(c => this.generateCourseCard(c, 'col-lg-4 col-md-6')).join('');
        $('#featured-courses-container').html(featuredHtml);

        // Render Instructors
        const instHtml = mockData.instructors.map(i => `
            <div class="col-lg-3 col-md-6">
                <div class="instructor-card p-4 text-center rounded-4 h-100">
                    <img src="${i.image}" alt="${i.name}" class="rounded-circle mb-3 border" style="width: 100px; height: 100px; object-fit: cover;">
                    <h5 class="fw-bold text-dark mb-1">${i.name}</h5>
                    <p class="text-primary small mb-3">${i.role}</p>
                    <div class="d-flex justify-content-center gap-2">
                        <a href="#" class="text-muted text-hover-primary"><i class="fa-brands fa-linkedin"></i></a>
                        <a href="#" class="text-muted text-hover-primary"><i class="fa-brands fa-twitter"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
        $('#instructors-container').html(instHtml);

        // Render Testimonials
        const testHtml = mockData.testimonials.map((t, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div class="testimonial-card p-4 p-md-5 rounded-4 mx-auto" style="max-width: 600px;">
                    <div class="text-warning mb-3">
                        ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
                    </div>
                    <p class="fs-5 fst-italic mb-4">"${t.text}"</p>
                    <h6 class="fw-bold mb-0">${t.name}</h6>
                    <span class="small opacity-75">${t.role}</span>
                </div>
            </div>
        `).join('');
        $('#testimonials-container').html(testHtml);

        // Render FAQ
        const faqHtml = mockData.faqs.map((f, index) => `
            <div class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header">
                    <button class="accordion-button ${index !== 0 ? 'collapsed' : ''} bg-transparent fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#homeFaq-${index}">
                        ${f.q}
                    </button>
                </h2>
                <div id="homeFaq-${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#mainFaqAccordion">
                    <div class="accordion-body text-muted pt-0 pb-4">
                        ${f.a}
                    </div>
                </div>
            </div>
        `).join('');
        $('#mainFaqAccordion').html(faqHtml);
    },

    setupFilters: function() {
        const catHtml = mockData.categories.map((c, i) => `
            <div class="form-check mb-2">
                <input class="form-check-input filter-category" type="checkbox" value="${c}" id="cat-${i}">
                <label class="form-check-label text-muted" for="cat-${i}">${c}</label>
            </div>
        `).join('');
        $('#filter-categories').html(catHtml);
    },

    renderCoursesListing: function() {
        let filtered = [...mockData.courses];

        // Apply Search
        if(this.state.filters.search) {
            filtered = filtered.filter(c => c.title.toLowerCase().includes(this.state.filters.search));
        }

        // Apply Category Filter
        if(this.state.filters.category.length > 0) {
            filtered = filtered.filter(c => this.state.filters.category.includes(c.category));
        }

        // Apply Level Filter
        if(this.state.filters.level.length > 0) {
            filtered = filtered.filter(c => this.state.filters.level.includes(c.level));
        }

        // Apply Price Filter
        if(this.state.filters.price === 'free') {
            filtered = filtered.filter(c => c.price === 0);
        } else if(this.state.filters.price === 'paid') {
            filtered = filtered.filter(c => c.price > 0);
        }

        // Apply Sort
        switch(this.state.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                filtered.sort((a, b) => b.students - a.students);
                break;
        }

        // Render
        this.$coursesCount.text(filtered.length);
        
        if(filtered.length === 0) {
            this.$coursesGrid.hide();
            this.$emptyState.removeClass('d-none');
        } else {
            this.$emptyState.addClass('d-none');
            this.$coursesGrid.show();
            const gridHtml = filtered.map(c => this.generateCourseCard(c, 'col-md-6 col-xl-4')).join('');
            this.$coursesGrid.html(gridHtml);
        }
    },

    generateCourseCard: function(course, colClass) {
        const badge = course.featured ? `<div class="course-badge badge bg-warning text-dark fw-bold shadow-sm">Featured</div>` : '';
        const priceDisplay = course.price === 0 ? 'Free' : `$${course.price}`;
        
        return `
            <div class="${colClass}">
                <div class="card course-card h-100 rounded-4 overflow-hidden cursor-pointer" onclick="app.openCourseDetails(${course.id})">
                    <div class="position-relative">
                        <img src="${course.thumbnail}" class="card-img-top w-100" alt="${course.title}">
                        ${badge}
                        <div class="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded small fw-medium" style="opacity: 0.8">${course.duration}</div>
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary-subtle text-primary fw-medium">${course.category}</span>
                            <span class="text-muted small"><i class="fa-solid fa-signal ms-2 me-1"></i>${course.level}</span>
                        </div>
                        <h5 class="fw-bold text-dark course-card-title mb-2">${course.title}</h5>
                        <p class="text-muted small mb-3">By ${course.instructor}</p>
                        
                        <div class="d-flex align-items-center mb-3 mt-auto">
                            <span class="text-warning me-1"><i class="fa-solid fa-star"></i></span>
                            <span class="fw-bold me-1">${course.rating}</span>
                            <span class="text-muted small">(${course.reviews})</span>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center border-top pt-3">
                            <span class="text-muted small"><i class="fa-solid fa-users me-1"></i>${course.students.toLocaleString()}</span>
                            <h5 class="fw-bolder text-primary-dark mb-0">${priceDisplay}</h5>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    animateCounter: function(selector, target, isK = false) {
        let displayTarget = target;
        let suffix = '';
        if(isK && target >= 1000) {
            displayTarget = target / 1000;
            suffix = 'k+';
        }
        
        $({ countNum: 0 }).animate({ countNum: displayTarget }, {
            duration: 2000,
            easing: 'swing',
            step: function() {
                $(selector).text(Math.floor(this.countNum) + suffix);
            },
            complete: function() {
                $(selector).text(displayTarget + suffix);
            }
        });
    }
};

// Initialize App
$(document).ready(function() {
    app.init();
});
