/**
 * ToLet BD - Core Application Logic
 * Modularized for scalability and performance.
 */

const app = {
  // === 1. STATE MANAGEMENT ===
  state: {
    currentLang: "en",
    posts: [],
    users: [],
    messages: [], // Stores private messages
    currentUser: null, // { id, username, role, ... }
    activePostId: null,
    amenitiesList: [
      "WiFi",
      "Gas",
      "Lift",
      "Generator",
      "CCTV",
      "Guard",
      "Parking",
      "Geyser",
    ],
  },

  // === 2. TRANSLATIONS ===
  translations: {
    en: {
      brand: "ToLet BD",
      login: "Login",
      dashboard: "Dashboard",
      postAdBtn: "Post Ad",
      heroTitle: "Find Your Next Sanctuary",
      heroSubtitle: "Thousands of apartments, rooms, and commercial spaces.",
      optAll: "All Types",
      optFamily: "Family House",
      optBachelor: "Bachelor Mess",
      optFlat: "Flat/Apartment",
      optSublet: "Sublet",
      optOffice: "Office Space",
      btnSearch: "SEARCH",
      latestListings: "Latest Opportunities",
      postAdTitle: "List Your Property",
      lblTitle: "Ad Title",
      lblType: "Category",
      lblRent: "Monthly Rent (BDT)",
      lblDesc: "Description",
      btnSubmit: "PUBLISH AD",
      securityPin: "Security Check",
      pinPrompt: "Enter PIN 1234 to reveal contact",
      statusAvailable: "Available",
      statusRented: "Rented",
      btnCall: "Show Number",
      btnMsg: "Send Message",
      ownerPanel: "Owner Control",
      markRented: "Mark Rented",
      alertRented: "This property is currently off the market.",
      backHome: "Back",
      myAds: "My Ads",
      allUsers: "All Users",
      manageAds: "Manage Advertisements",
    },
    bn: {
      brand: "টু-লেট বিডি",
      login: "লগিন",
      dashboard: "ড্যাশবোর্ড",
      postAdBtn: "বিজ্ঞাপন দিন",
      heroTitle: "আপনার স্বপ্নের বাসা খুঁজুন",
      heroSubtitle: "ফ্ল্যাট, মেস, এবং অফিস স্পেস ভাড়ার সেরা মাধ্যম।",
      optAll: "সব ধরণ",
      optFamily: "ফ্যামিলি বাসা",
      optBachelor: "ব্যাচেলর মেস",
      optFlat: "ফ্ল্যাট/অ্যাপার্টমেন্ট",
      optSublet: "সাবলেট",
      optOffice: "অফিস স্পেস",
      btnSearch: "খুঁজুন",
      latestListings: "নতুন বিজ্ঞাপনসমূহ",
      postAdTitle: "ভাড়ার বিজ্ঞাপন দিন",
      lblTitle: "শিরোনাম",
      lblType: "ধরণ",
      lblRent: "মাসিক ভাড়া (টাকা)",
      lblDesc: "বিস্তারিত বিবরণ",
      btnSubmit: "প্রকাশ করুন",
      securityPin: "নিরাপত্তা চেক",
      pinPrompt: "নম্বর দেখতে ১২৩৪ পিন দিন",
      statusAvailable: "ভাড়া হবে",
      statusRented: "ভাড়া হয়েছে",
      btnCall: "নম্বর দেখুন",
      btnMsg: "মেসেজ দিন",
      ownerPanel: "মালিক প্যানেল",
      markRented: "ভাড়া হয়েছে মার্ক করুন",
      alertRented: "এই প্রপার্টিটি ভাড়া হয়ে গেছে।",
      backHome: "ফিরে যান",
      myAds: "আমার বিজ্ঞাপন",
      allUsers: "সব ব্যবহারকারী",
      manageAds: "বিজ্ঞাপন ম্যানেজ করুন",
    },
  },

  // === 3. INITIALIZATION ===
  init: function () {
    // Clear old version data
    localStorage.removeItem("tolet_posts_v2");
    localStorage.removeItem("tolet_users_v2");
    localStorage.removeItem("tolet_msgs_v2");

    this.data.load();
    this.auth.checkSession();
    this.views.showHome();
    this.logic.renderAmenities();
    this.events.bind();
    console.log("ToLet BD App Initialized");
    console.log("Users loaded:", app.state.users);
    console.log("Posts loaded:", app.state.posts.length, "posts");
  },

  // === 4. DATA LAYER ===
  data: {
    load: function () {
      // Load or Seed Posts
      const storedPosts = localStorage.getItem("tolet_posts_v3");
      if (storedPosts) {
        app.state.posts = JSON.parse(storedPosts);
        console.log("Loaded posts from localStorage:", app.state.posts.length);
      } else {
        console.log("No posts in localStorage, seeding demo data...");
        app.data.seedPosts();
      }

      // Load or Seed Users - force reseed if empty
      const storedUsers = localStorage.getItem("tolet_users_v3");
      if (storedUsers) {
        app.state.users = JSON.parse(storedUsers);
        // Force reseed if empty
        if (!app.state.users || app.state.users.length === 0) {
          console.log("Users array empty, reseeding...");
          app.data.seedUsers();
        }
      } else {
        console.log("No users in localStorage, seeding demo users...");
        app.data.seedUsers();
      }

      // Load Messages
      const storedMsgs = localStorage.getItem("tolet_msgs_v3");
      if (storedMsgs) app.state.messages = JSON.parse(storedMsgs);
    },
    save: function () {
      localStorage.setItem("tolet_posts_v3", JSON.stringify(app.state.posts));
      localStorage.setItem("tolet_users_v3", JSON.stringify(app.state.users));
      localStorage.setItem("tolet_msgs_v3", JSON.stringify(app.state.messages));
    },
    seedPosts: function () {
      app.state.posts = [
        {
          id: 101,
          userId: 1,
          title: "Premium 3 Bed Flat in Gulshan 1",
          type: "Flat",
          rent: 45000,
          city: "Dhaka",
          area: "Gulshan 1",
          address: "House 10, Road 5",
          contact: "01711000000",
          bed: 3,
          bath: 4,
          floor: 5,
          size: 2200,
          availableFrom: "2023-11-01",
          amenities: ["Lift", "Generator", "Gas", "CCTV", "Parking"],
          desc: "South facing, fully tiled, modern kitchen cabinet. Service charge included.",
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-10-25",
          comments: [],
        },
        {
          id: 102,
          userId: 2,
          title: "Affordable Room for Bachelor",
          type: "Bachelor",
          rent: 6000,
          city: "Dhaka",
          area: "Mirpur 10",
          address: "Block D, Lane 2",
          contact: "01999888777",
          bed: 1,
          bath: 1,
          floor: 2,
          size: 120,
          availableFrom: "2023-10-28",
          amenities: ["WiFi", "Maid"],
          desc: "Looking for a decent student or job holder. Meal system available.",
          images: [
            "https://images.unsplash.com/photo-1596296362848-6b83f4d0c946?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-10-26",
          comments: [],
        },
        {
          id: 103,
          userId: 2,
          title: "Commercial Office Space",
          type: "Office",
          rent: 80000,
          city: "Chittagong",
          area: "Agrabad",
          address: "Commercial Area",
          contact: "01888111222",
          bed: 0,
          bath: 2,
          floor: 8,
          size: 1500,
          availableFrom: "2023-12-01",
          amenities: ["Lift", "Guard", "Generator"],
          desc: "Open floor plan, glass fittings, ready for corporate office.",
          images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: true,
          date: "2023-09-15",
          comments: [],
        },
        {
          id: 104,
          userId: 1,
          title: "Luxury Duplex Villa with Garden",
          type: "Family",
          rent: 120000,
          city: "Dhaka",
          area: "Banani",
          address: "Road 12, House 8",
          contact: "01811222333",
          bed: 5,
          bath: 5,
          floor: 1,
          size: 4500,
          availableFrom: "2024-01-01",
          amenities: [
            "WiFi",
            "Lift",
            "Generator",
            "Guard",
            "Parking",
            "CCTV",
            "Geyser",
            "Garden",
          ],
          desc: "Stunning duplex villa with private garden, modern amenities, and 24/7 security. Perfect for large families.",
          images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-11-01",
          comments: [],
        },
        {
          id: 105,
          userId: 2,
          title: "Cozy Studio Apartment",
          type: "Sublet",
          rent: 12000,
          city: "Dhaka",
          area: "Dhanmondi",
          address: "Road 8, Building 4",
          contact: "01922333444",
          bed: 1,
          bath: 1,
          floor: 3,
          size: 450,
          availableFrom: "2023-12-15",
          amenities: ["WiFi", "Lift", "Generator"],
          desc: "Modern studio perfect for working professionals. Furnished with AC, fridge, and washing machine.",
          images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-11-05",
          comments: [],
        },
        {
          id: 106,
          userId: 1,
          title: "Spacious Bachelor Hostel Room",
          type: "Bachelor",
          rent: 8000,
          city: "Dhaka",
          area: "Mohammadpur",
          address: "Block B, Lane 5",
          contact: "01733444555",
          bed: 1,
          bath: 1,
          floor: 4,
          size: 200,
          availableFrom: "2023-11-20",
          amenities: ["WiFi", "Generator", "Gas"],
          desc: "Clean and spacious room in a peaceful neighborhood. Suitable for students and working bachelors.",
          images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-11-08",
          comments: [],
        },
        {
          id: 107,
          userId: 2,
          title: "Modern Office Space Near Airport",
          type: "Office",
          rent: 95000,
          city: "Dhaka",
          area: "Uttara",
          address: "Sector 7, Plot 15",
          contact: "01644555666",
          bed: 0,
          bath: 3,
          floor: 10,
          size: 2000,
          availableFrom: "2023-12-01",
          amenities: ["Lift", "Generator", "CCTV", "Guard", "Parking"],
          desc: "Prime location office space with excellent connectivity. Includes conference rooms and parking facilities.",
          images: [
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-11-10",
          comments: [],
        },
        {
          id: 108,
          userId: 1,
          title: "Elegant 2 Bedroom Apartment",
          type: "Flat",
          rent: 28000,
          city: "Sylhet",
          area: "Zindabazar",
          address: "Main Road, Building 7",
          contact: "01755666777",
          bed: 2,
          bath: 2,
          floor: 6,
          size: 1100,
          availableFrom: "2023-11-25",
          amenities: ["Lift", "Gas", "CCTV"],
          desc: "Beautiful apartment with ample natural light. Excellent for small families or couples.",
          images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-11-12",
          comments: [],
        },
        {
          id: 109,
          userId: 2,
          title: "Prime Retail Shop Space",
          type: "Shop",
          rent: 55000,
          city: "Chittagong",
          area: "GEC Circle",
          address: "Commercial Building A",
          contact: "01866777888",
          bed: 0,
          bath: 1,
          floor: 0,
          size: 800,
          availableFrom: "2023-12-10",
          amenities: ["Generator", "CCTV", "Guard"],
          desc: "High traffic location perfect for retail business. Ground floor with large display windows.",
          images: [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-11-15",
          comments: [],
        },
        {
          id: 110,
          userId: 1,
          title: "Beautiful Family House",
          type: "Family",
          rent: 65000,
          city: "Rajshahi",
          area: "Shaheb Bazar",
          address: "House 5, Lane 3",
          contact: "01977888999",
          bed: 4,
          bath: 3,
          floor: 2,
          size: 2500,
          availableFrom: "2024-01-01",
          amenities: ["WiFi", "Generator", "Gas", "Guard", "Parking"],
          desc: "Spacious family house with garden and rooftop terrace. Peaceful neighborhood with all amenities nearby.",
          images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=60",
          ],
          isRented: false,
          date: "2023-11-18",
          comments: [],
        },
      ];
      this.save();
    },
    seedUsers: function () {
      app.state.users = [
        {
          id: 1,
          username: "admin",
          password: "123456",
          role: "admin",
          name: "Admin Boss",
        },
        {
          id: 2,
          username: "user",
          password: "123456",
          role: "user",
          name: "Rahim Ahmed",
        },
      ];
      this.save();
    },
  },

  // === 5. AUTHENTICATION ===
  auth: {
    checkSession: function () {
      const session = sessionStorage.getItem("tolet_session");
      if (session) {
        app.state.currentUser = JSON.parse(session);
        app.views.updateNavAuth();
      }
    },
    showLoginModal: function () {
      const loginModal = new bootstrap.Modal(
        document.getElementById("loginModal")
      );
      loginModal.show();
    },
    login: function (u, p) {
      // Trim inputs to remove whitespace
      u = u.trim();
      p = p.trim();

      console.log("Login attempt:", u, p);
      console.log("Available users:", app.state.users);

      const user = app.state.users.find(
        (usr) => usr.username === u && usr.password === p
      );

      console.log("Found user:", user);

      if (user) {
        app.state.currentUser = user;
        sessionStorage.setItem("tolet_session", JSON.stringify(user));
        app.views.updateNavAuth();
        const modalElement = document.getElementById("loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        app.views.showToast("Login Successful", "success");

        // Redirect to appropriate dashboard
        if (user.role === "admin") {
          window.location.href = "dashboard-admin.html";
        } else {
          window.location.href = "dashboard-user.html";
        }
      } else {
        app.views.showToast("Invalid Credentials", "danger");
      }
    },
    logout: function () {
      app.state.currentUser = null;
      sessionStorage.removeItem("tolet_session");
      window.location.href = "index.html";
    },
  },

  // === 6. VIEW MANAGEMENT ===
  views: {
    showHome: function () {
      $(".view-section").removeClass("active");
      $("#home-view").addClass("active");
      app.logic.renderPosts(app.state.posts);
      window.scrollTo(0, 0);
    },
    showDashboard: function () {
      if (!app.state.currentUser) return;

      $(".view-section").removeClass("active");
      $("#dashboard-view").addClass("active");

      // Populate Sidebar
      $("#dashName").text(
        app.state.currentUser.name || app.state.currentUser.username
      );
      $("#dashRole").text(app.state.currentUser.role.toUpperCase());

      // Stats (Admin)
      if (app.state.currentUser.role === "admin") {
        $(".admin-only").removeClass("d-none");
        $("#statUsers").text(app.state.users.length);
        $("#statAds").text(app.state.posts.length);
      } else {
        $(".admin-only").addClass("d-none");
      }

      // Message Badge
      const myMsgs = app.state.messages.filter(
        (m) => m.toUserId === app.state.currentUser.id
      );
      $("#msgCount").text(myMsgs.length);

      // Default Tab
      this.switchDashTab("ads");
    },
    switchDashTab: function (tabName) {
      $(".dash-tab").addClass("d-none");
      $(`#tab-${tabName}`).removeClass("d-none");

      // Logic based on tab
      if (tabName === "ads") app.logic.renderDashboardAds();
      if (tabName === "users" && app.state.currentUser.role === "admin")
        app.logic.renderUserList();
      if (tabName === "msgs") app.logic.renderMessages();
    },
    showPostAd: function () {
      $(".view-section").removeClass("active");
      $("#post-ad-view").addClass("active");
      window.scrollTo(0, 0);
    },
    handlePostAdClick: function () {
      if (app.state.currentUser) {
        this.showPostAd();
      } else {
        app.views.showToast("You must login to post an ad", "warning");
        new bootstrap.Modal("#loginModal").show();
      }
    },
    showDetails: function (id) {
      $(".view-section").removeClass("active");
      $("#details-view").addClass("active");
      app.logic.renderDetails(id);
      window.scrollTo(0, 0);
    },
    updateNavAuth: function () {
      if (app.state.currentUser) {
        $(".guest-only").addClass("d-none");
        $(".auth-only").removeClass("d-none");
        $("#navUsername").text(app.state.currentUser.username);
        $("#navRole").text(app.state.currentUser.role.toUpperCase());
      } else {
        $(".guest-only").removeClass("d-none");
        $(".auth-only").addClass("d-none");
      }
    },
    showToast: function (msg, type = "primary") {
      const icon =
        type === "success"
          ? "check-circle"
          : type === "danger"
          ? "exclamation-circle"
          : "info-circle";
      const id = "toast-" + Date.now();
      const html = `
                <div id="${id}" class="toast align-items-center text-white bg-${type} border-0 show mb-2 shadow-lg animate__animated animate__fadeInRight" role="alert">
                    <div class="d-flex">
                        <div class="toast-body fs-6"><i class="fa-solid fa-${icon} me-2"></i> ${msg}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>`;
      $("#toast-container").append(html);
      setTimeout(() => {
        $(`#${id}`)
          .removeClass("animate__fadeInRight")
          .addClass("animate__fadeOutRight");
        setTimeout(() => $(`#${id}`).remove(), 500);
      }, 3000);
    },
  },

  // === 7. LOGIC & RENDERING ===
  logic: {
    renderAmenities: function () {
      const container = $("#amenitiesCheckboxes");
      container.empty();
      app.state.amenitiesList.forEach((am) => {
        container.append(`
                    <div class="col-6 col-md-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${am}" id="chk-${am}">
                            <label class="form-check-label" for="chk-${am}">${am}</label>
                        </div>
                    </div>
                `);
      });
    },

    renderPosts: function (data, page = 1) {
      const container = $("#posts-container");
      const paginationContainer = $("#posts-pagination");
      const postsPerPage = 9;
      const totalPages = Math.ceil(data.length / postsPerPage);
      const startIndex = (page - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const paginatedData = data.slice(startIndex, endIndex);

      container.empty();

      if (data.length === 0) {
        container.html(`
                    <div class="col-12 text-center py-5">
                        <i class="fa-solid fa-ghost fs-1 text-muted mb-3"></i>
                        <h4 class="text-muted">No properties found. Try adjusting filters.</h4>
                    </div>
                `);
        paginationContainer.empty();
        return;
      }

      paginatedData.forEach((post, index) => {
        // Animation delay for staggered effect
        const delay = index * 100;
        const img =
          post.images && post.images.length > 0
            ? post.images[0]
            : "https://via.placeholder.com/500x300?text=No+Image";
        const badge = post.isRented
          ? `<span class="badge bg-danger position-absolute top-0 end-0 m-3 shadow">RENTED</span>`
          : `<span class="badge bg-success position-absolute top-0 end-0 m-3 shadow">AVAILABLE</span>`;

        const html = `
                <div class="col-md-6 col-lg-4 animate__animated animate__fadeInUp" style="animation-delay: ${delay}ms">
                    <div class="card h-100 border-0 shadow-sm overflow-hidden" onclick="window.location.href='details.html?id=${
                      post.id
                    }'" style="cursor: pointer;">
                        <div class="post-img-wrapper">
                            <img src="${img}" class="post-img-top" alt="Prop">
                            ${badge}
                            <div class="price-tag">৳ ${post.rent.toLocaleString()}</div>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-primary fw-bold text-uppercase ls-1">${
                                  post.type
                                }</small>
                                <small class="text-muted"><i class="fa-regular fa-clock"></i> ${
                                  post.date
                                }</small>
                            </div>
                            <h5 class="card-title fw-bold text-truncate">${
                              post.title
                            }</h5>
                            <p class="text-muted small mb-3"><i class="fa-solid fa-location-dot text-danger"></i> ${
                              post.area
                            }, ${post.city}</p>
                            
                            <div class="border-top pt-3">
                                <span class="feature-pill"><i class="fa-solid fa-bed"></i> ${
                                  post.bed
                                } Bed</span>
                                <span class="feature-pill"><i class="fa-solid fa-bath"></i> ${
                                  post.bath
                                } Bath</span>
                                <span class="feature-pill"><i class="fa-solid fa-ruler-combined"></i> ${
                                  post.size
                                } sft</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        container.append(html);
      });

      // Render pagination
      if (paginationContainer.length) {
        paginationContainer.empty();
      }

      if (totalPages > 1 && paginationContainer.length) {
        let paginationHtml =
          '<nav aria-label="Page navigation"><ul class="pagination justify-content-center">';

        // Previous button
        paginationHtml += `<li class="page-item ${
          page === 1 ? "disabled" : ""
        }">
          <a class="page-link" href="#" onclick="app.logic.renderPosts(app.state.filteredPosts || app.state.posts, ${
            page - 1
          }); return false;">Previous</a>
        </li>`;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
          if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
            paginationHtml += `<li class="page-item ${
              i === page ? "active" : ""
            }">
              <a class="page-link" href="#" onclick="app.logic.renderPosts(app.state.filteredPosts || app.state.posts, ${i}); return false;">${i}</a>
            </li>`;
          } else if (i === page - 3 || i === page + 3) {
            paginationHtml +=
              '<li class="page-item disabled"><span class="page-link">...</span></li>';
          }
        }

        // Next button
        paginationHtml += `<li class="page-item ${
          page === totalPages ? "disabled" : ""
        }">
          <a class="page-link" href="#" onclick="app.logic.renderPosts(app.state.filteredPosts || app.state.posts, ${
            page + 1
          }); return false;">Next</a>
        </li>`;

        paginationHtml += "</ul></nav>";
        paginationContainer.html(paginationHtml);
      }

      app.events.applyLang();

      // Scroll to top of posts
      if (page > 1 && $("#posts-container").length) {
        $("html, body").animate(
          { scrollTop: $("#posts-container").offset().top - 100 },
          300
        );
      }
    },

    renderDetails: function (id) {
      const post = app.state.posts.find((p) => p.id === id);
      if (!post) return;
      app.state.activePostId = id;
      const t = app.translations[app.state.currentLang];

      // Initialize comments array if not exists
      if (!post.comments) post.comments = [];

      // Images
      let carouselInner = "";
      if (post.images && post.images.length > 0) {
        carouselInner = post.images
          .map(
            (img, i) => `
                    <div class="carousel-item ${i === 0 ? "active" : ""}">
                        <img src="${img}" class="d-block w-100 detail-carousel-img" alt="Slide">
                    </div>`
          )
          .join("");
      } else {
        carouselInner = `<div class="carousel-item active"><img src="https://via.placeholder.com/800x400?text=No+Image" class="d-block w-100 detail-carousel-img"></div>`;
      }

      // Amenities Tags
      const amenitiesHtml = (post.amenities || [])
        .map(
          (a) =>
            `<span class="badge bg-light text-dark border me-2 mb-2 p-2"><i class="fa-solid fa-check text-success"></i> ${a}</span>`
        )
        .join("");

      // Action Buttons
      let actions = "";
      if (post.isRented) {
        actions = `<div class="alert alert-danger text-center fw-bold"><i class="fa-solid fa-lock"></i> ${t.alertRented}</div>`;
      } else {
        actions = `
                    <div class="row g-2">
                        <div class="col-6">
                            <button class="btn btn-primary w-100 py-3 fw-bold shadow-sm" onclick="app.auth.showLoginModal ? $('#pinModal').modal('show') : null">
                                <i class="fa-solid fa-phone"></i> ${t.btnCall}
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-outline-primary w-100 py-3 fw-bold shadow-sm" onclick="$('#msgModal').modal('show')">
                                <i class="fa-regular fa-envelope"></i> ${t.btnMsg}
                            </button>
                        </div>
                    </div>`;
      }

      // Owner Panel
      let ownerPanel = "";
      const isOwner =
        app.state.currentUser &&
        (app.state.currentUser.id === post.userId ||
          app.state.currentUser.role === "admin");
      if (isOwner && !post.isRented) {
        ownerPanel = `
                    <div class="card border-warning bg-warning bg-opacity-10 mt-4">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <strong><i class="fa-solid fa-user-gear"></i> ${t.ownerPanel}</strong>
                            <button class="btn btn-warning btn-sm fw-bold" onclick="app.logic.markRented(${post.id})">${t.markRented}</button>
                        </div>
                    </div>`;
      }

      // Comments Section
      let commentsHtml = "";
      if (post.comments && post.comments.length > 0) {
        commentsHtml = post.comments
          .map((c) => {
            const replies =
              c.replies && c.replies.length > 0
                ? c.replies
                    .map(
                      (r) => `
                        <div class="comment-reply ps-4 border-start border-2 border-primary ms-4 mt-2">
                            <div class="d-flex align-items-start gap-2">
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  r.author
                                )}&background=random" class="rounded-circle" width="30">
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between">
                                        <strong class="text-primary">${
                                          r.author
                                        }</strong>
                                        <small class="text-muted">${
                                          r.date
                                        }</small>
                                    </div>
                                    <p class="mb-0 mt-1">${r.text}</p>
                                </div>
                            </div>
                        </div>
                    `
                    )
                    .join("")
                : "";

            return `
                        <div class="comment-item mb-3 p-3 bg-light rounded-3">
                            <div class="d-flex align-items-start gap-2">
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  c.author
                                )}&background=random" class="rounded-circle" width="40">
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between">
                                        <strong>${c.author}</strong>
                                        <small class="text-muted">${
                                          c.date
                                        }</small>
                                    </div>
                                    <p class="mb-2 mt-1">${c.text}</p>
                                    ${
                                      app.state.currentUser
                                        ? `<button class="btn btn-sm btn-outline-primary" onclick="app.logic.showReplyForm(${c.id})"><i class="fa-solid fa-reply"></i> Reply</button>`
                                        : ""
                                    }
                                    <div id="reply-form-${
                                      c.id
                                    }" class="d-none mt-2">
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="reply-text-${
                                              c.id
                                            }" placeholder="Write a reply...">
                                            <button class="btn btn-primary" onclick="app.logic.postReply(${
                                              c.id
                                            })">Post</button>
                                        </div>
                                    </div>
                                    ${replies}
                                </div>
                            </div>
                        </div>
                    `;
          })
          .join("");
      } else {
        commentsHtml =
          '<p class="text-muted text-center py-3">No comments yet. Be the first to comment!</p>';
      }

      const html = `
                <div class="row">
                    <div class="col-lg-8">
                        <div id="detailCarousel" class="carousel slide mb-4 rounded-4 overflow-hidden shadow" data-bs-ride="carousel">
                            <div class="carousel-inner">${carouselInner}</div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#detailCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
                            <button class="carousel-control-next" type="button" data-bs-target="#detailCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
                        </div>

                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h2 class="fw-bold mb-1">${post.title}</h2>
                                <p class="text-muted"><i class="fa-solid fa-location-dot text-danger"></i> ${
                                  post.address
                                }, ${post.area}, ${post.city}</p>
                            </div>
                            <h3 class="text-primary fw-bold">৳ ${post.rent.toLocaleString()}</h3>
                        </div>

                        <!-- Stats Grid -->
                        <div class="row g-3 mb-4">
                            <div class="col-3"><div class="prop-stat-box"><h5>${
                              post.bed
                            }</h5><small>Bed</small></div></div>
                            <div class="col-3"><div class="prop-stat-box"><h5>${
                              post.bath
                            }</h5><small>Bath</small></div></div>
                            <div class="col-3"><div class="prop-stat-box"><h5>${
                              post.floor
                            }</h5><small>Floor</small></div></div>
                            <div class="col-3"><div class="prop-stat-box"><h5>${
                              post.size
                            }</h5><small>Sq Ft</small></div></div>
                        </div>

                        <h5 class="fw-bold border-start border-4 border-primary ps-2 mb-3">Description</h5>
                        <p class="text-secondary mb-4" style="white-space: pre-line;">${
                          post.desc
                        }</p>
                        
                        <h5 class="fw-bold border-start border-4 border-primary ps-2 mb-3">Amenities</h5>
                        <div class="mb-4">${amenitiesHtml}</div>

                        <!-- Comments Section -->
                        <div class="mt-5">
                            <h5 class="fw-bold border-start border-4 border-primary ps-2 mb-3">Comments (${
                              post.comments.length
                            })</h5>
                            
                            <div class="card border-0 shadow-sm mb-4">
                                <div class="card-body">
                                    <div class="mb-2">
                                        <input type="text" class="form-control mb-2" id="commentAuthor" placeholder="Your name" value="${
                                          app.state.currentUser
                                            ? app.state.currentUser.name ||
                                              app.state.currentUser.username
                                            : ""
                                        }">
                                    </div>
                                    <textarea class="form-control mb-2" id="commentText" rows="3" placeholder="Share your thoughts or questions..."></textarea>
                                    <button class="btn btn-primary" onclick="app.logic.postComment()"><i class="fa-solid fa-comment"></i> Post Comment</button>
                                </div>
                            </div>
                            
                            <div id="comments-list">
                                ${commentsHtml}
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card border-0 shadow-lg rounded-4 sticky-top" style="top: 100px;">
                            <div class="card-body p-4">
                                <h5 class="fw-bold mb-3">Contact Info</h5>
                                ${actions}
                                
                                <div id="contactReveal" class="d-none alert alert-success mt-3 text-center animate__animated animate__fadeIn">
                                    <h4 class="fw-bold m-0"><i class="fa-solid fa-phone-volume"></i> ${
                                      post.contact
                                    }</h4>
                                    <small>Don't forget to mention ToLet BD!</small>
                                </div>

                                ${ownerPanel}
                            </div>
                        </div>
                    </div>
                </div>`;

      $("#detail-content").html(html);
      app.events.applyLang();
    },

    createPost: function () {
      const files = $("#pImages")[0].files;

      // Image Processing Logic
      const processImages = async () => {
        const promises = [];
        // Limit to 3 images to save LocalStorage space
        for (let i = 0; i < Math.min(files.length, 3); i++) {
          promises.push(
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.readAsDataURL(files[i]);
            })
          );
        }
        return Promise.all(promises);
      };

      processImages()
        .then((base64Images) => {
          // Collect Checked Amenities
          const selectedAmenities = [];
          $("#amenitiesCheckboxes input:checked").each(function () {
            selectedAmenities.push($(this).val());
          });

          const newPost = {
            id: Date.now(),
            userId: app.state.currentUser.id,
            title: $("#pTitle").val(),
            type: $("#pType").val(),
            rent: parseInt($("#pRent").val()),
            city: $("#pCity").val(),
            area: $("#pArea").val(),
            address: $("#pAddress").val(),
            contact: $("#pContact").val(),
            availableFrom: $("#pDate").val(),
            bed: $("#pBed").val() || 0,
            bath: $("#pBath").val() || 0,
            floor: $("#pFloor").val() || 0,
            size: $("#pSize").val() || 0,
            amenities: selectedAmenities,
            desc: $("#pDesc").val(),
            images: base64Images.length
              ? base64Images
              : ["https://via.placeholder.com/500x300?text=No+Image"],
            isRented: false,
            date: new Date().toLocaleDateString(),
          };

          app.state.posts.unshift(newPost);
          app.data.save();
          $("#rentalForm")[0].reset();
          app.views.showToast("Ad Published Successfully!", "success");
          app.views.showDashboard();
        })
        .catch((err) => {
          console.error(err);
          alert("Error uploading images. Try smaller files.");
        });
    },

    verifyPin: function () {
      if ($("#inputPin").val() === "1234") {
        $("#pinModal").modal("hide");
        $("#contactReveal").removeClass("d-none");
      } else {
        $("#pinError").removeClass("d-none");
      }
    },

    sendMessage: function () {
      if (!app.state.currentUser) {
        $("#msgModal").modal("hide");
        app.views.showToast("Please login first", "warning");
        return;
      }

      const post = app.state.posts.find((p) => p.id === app.state.activePostId);
      const msg = {
        id: Date.now(),
        fromUser: app.state.currentUser.username,
        toUserId: post.userId,
        postId: post.id,
        postTitle: post.title,
        body: $("#msgBody").val(),
        date: new Date().toLocaleDateString(),
      };

      app.state.messages.push(msg);
      app.data.save();
      $("#msgModal").modal("hide");
      $("#msgBody").val("");
      app.views.showToast("Message Sent!", "success");
    },

    markRented: function (id) {
      if (confirm("Are you sure? This will hide contact details.")) {
        const p = app.state.posts.find((x) => x.id === id);
        p.isRented = true;
        app.data.save();
        app.views.showDetails(id);
      }
    },

    deletePost: function (id) {
      if (confirm("Delete this ad permanently?")) {
        app.state.posts = app.state.posts.filter((p) => p.id !== id);
        app.data.save();
        app.views.switchDashTab("ads"); // Refresh list
        app.views.showToast("Ad Deleted", "danger");
      }
    },

    filterPosts: function () {
      const cat = $("#searchCategory").val();
      const city = $("#searchCity").val();
      const keyword = $("#searchKeyword").val().toLowerCase();

      const filtered = app.state.posts.filter((p) => {
        const matchCat = cat === "all" || p.type === cat;
        const matchCity = city === "all" || p.city === city;
        const matchKey =
          p.title.toLowerCase().includes(keyword) ||
          p.area.toLowerCase().includes(keyword);
        return matchCat && matchCity && matchKey;
      });

      // Store filtered results for pagination
      app.state.filteredPosts = filtered;
      app.logic.renderPosts(filtered, 1);
    },

    // Dashboard Renderers
    renderDashboardAds: function () {
      const isAdmin = app.state.currentUser.role === "admin";
      const ads = isAdmin
        ? app.state.posts
        : app.state.posts.filter((p) => p.userId === app.state.currentUser.id);
      const tbody = $("#dash-ads-body");

      // Destroy existing DataTable if it exists
      if ($.fn.DataTable.isDataTable("#dash-ads-table")) {
        $("#dash-ads-table").DataTable().destroy();
      }

      tbody.empty();

      if (ads.length === 0)
        tbody.html(
          '<tr><td colspan="5" class="text-center p-4">No ads found.</td></tr>'
        );

      ads.forEach((p) => {
        const ownerName = isAdmin
          ? app.state.users.find((u) => u.id === p.userId)?.username ||
            "Unknown"
          : "";
        const ownerBadge = isAdmin
          ? `<div class="small text-muted">By: ${ownerName}</div>`
          : "";

        tbody.append(`
                    <tr>
                        <td class="ps-4">
                            <div class="d-flex align-items-center">
                                <img src="${
                                  p.images[0]
                                }" class="rounded me-2" width="40" height="40" style="object-fit:cover;">
                                <div>
                                    <div class="fw-bold text-truncate" style="max-width: 150px;">${
                                      p.title
                                    }</div>
                                    <div class="small text-muted">${
                                      p.area
                                    }</div>
                                    ${ownerBadge}
                                </div>
                            </div>
                        </td>
                        <td>৳${p.rent.toLocaleString()}</td>
                        <td>${
                          p.isRented
                            ? '<span class="badge bg-danger">Rented</span>'
                            : '<span class="badge bg-success">Active</span>'
                        }</td>
                        <td>${p.date}</td>
                        <td class="text-end pe-4">
                            <button class="btn btn-sm btn-light border" onclick="window.location.href='details.html?id=${
                              p.id
                            }'" title="View"><i class="fa-solid fa-eye"></i></button>
                            ${
                              !p.isRented
                                ? `<button class="btn btn-sm btn-warning" onclick="app.logic.toggleRentalStatus(${p.id})" title="Mark as Rented"><i class="fa-solid fa-check"></i></button>`
                                : `<button class="btn btn-sm btn-success" onclick="app.logic.toggleRentalStatus(${p.id})" title="Mark as Available"><i class="fa-solid fa-undo"></i></button>`
                            }
                            <button class="btn btn-sm btn-danger" onclick="app.logic.deletePost(${
                              p.id
                            })" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `);
      });
    },

    toggleRentalStatus: function (id) {
      const post = app.state.posts.find((p) => p.id === id);
      post.isRented = !post.isRented;
      app.data.save();
      app.logic.renderDashboardAds();
      app.views.showToast(
        `Property marked as ${post.isRented ? "Rented" : "Available"}`,
        "success"
      );
    },

    renderUserList: function () {
      const list = $("#user-list-group");
      list.empty();
      app.state.users.forEach((u) => {
        const isBlocked = u.blocked || false;
        const blockBtn =
          u.role !== "admin"
            ? isBlocked
              ? `<button class="btn btn-sm btn-success" onclick="app.logic.toggleUserBlock(${u.id})"><i class="fa-solid fa-unlock"></i> Unblock</button>`
              : `<button class="btn btn-sm btn-outline-danger" onclick="app.logic.toggleUserBlock(${u.id})"><i class="fa-solid fa-ban"></i> Block</button>`
            : '<span class="badge bg-primary">Admin</span>';

        const userPosts = app.state.posts.filter(
          (p) => p.userId === u.id
        ).length;

        list.append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center p-3 ${
                      isBlocked ? "bg-light text-muted" : ""
                    }">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-light rounded-circle p-2">
                                <i class="fa-solid fa-user ${
                                  isBlocked ? "text-danger" : "text-secondary"
                                }"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">${u.username} ${
          isBlocked ? '<span class="badge bg-danger ms-2">Blocked</span>' : ""
        }</h6>
                                <small class="text-muted">Role: ${
                                  u.role
                                } | Posts: ${userPosts}</small>
                            </div>
                        </div>
                        ${blockBtn}
                    </li>`);
      });
    },

    toggleUserBlock: function (userId) {
      const user = app.state.users.find((u) => u.id === userId);
      user.blocked = !user.blocked;
      app.data.save();

      // If blocking user, also hide their posts
      if (user.blocked) {
        app.state.posts
          .filter((p) => p.userId === userId)
          .forEach((p) => (p.isRented = true));
      }

      app.logic.renderUserList();
      app.views.showToast(
        `User ${user.blocked ? "blocked" : "unblocked"} successfully`,
        user.blocked ? "warning" : "success"
      );
    },

    renderMessages: function () {
      const list = $("#msg-list-group");
      list.empty();
      const myMsgs = app.state.messages.filter(
        (m) => m.toUserId === app.state.currentUser.id
      );

      if (myMsgs.length === 0) {
        list.html(
          '<div class="p-4 text-center text-muted">No messages received.</div>'
        );
        return;
      }

      myMsgs.forEach((m) => {
        const repliesHtml =
          m.replies && m.replies.length > 0
            ? m.replies
                .map(
                  (r) => `
                    <div class="ps-4 mt-2 border-start border-2 border-primary">
                        <small class="text-muted">${r.date}</small>
                        <p class="mb-0 small">${r.text}</p>
                    </div>
                `
                )
                .join("")
            : "";

        list.append(`
                    <div class="list-group-item list-group-item-action p-3" aria-current="true">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1 text-primary fw-bold">From: ${m.fromUser}</h6>
                            <small class="text-muted">${m.date}</small>
                        </div>
                        <p class="mb-1 small">Re: <strong>${m.postTitle}</strong></p>
                        <p class="mb-1 text-secondary fst-italic">"${m.body}"</p>
                        ${repliesHtml}
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="app.logic.showMessageReplyForm(${m.id})">
                            <i class="fa-solid fa-reply"></i> Reply
                        </button>
                        <div id="msg-reply-form-${m.id}" class="d-none mt-2">
                            <div class="input-group">
                                <input type="text" class="form-control" id="msg-reply-text-${m.id}" placeholder="Type your reply...">
                                <button class="btn btn-primary" onclick="app.logic.postMessageReply(${m.id})">Send</button>
                            </div>
                        </div>
                    </div>
                `);
      });
    },

    postComment: function () {
      const text = $("#commentText").val().trim();
      const author = $("#commentAuthor").val().trim() || "Anonymous";

      if (!text)
        return app.views.showToast("Please write a comment", "warning");

      const post = app.state.posts.find((p) => p.id === app.state.activePostId);
      if (!post.comments) post.comments = [];

      const newComment = {
        id: Date.now(),
        author: author,
        text: text,
        date: new Date().toLocaleDateString(),
        replies: [],
      };

      post.comments.push(newComment);
      app.data.save();
      $("#commentText").val("");
      if (!app.state.currentUser) $("#commentAuthor").val("");
      app.logic.renderDetails(app.state.activePostId);
      app.views.showToast("Comment posted!", "success");
    },

    showReplyForm: function (commentId) {
      $(`#reply-form-${commentId}`).toggleClass("d-none");
    },

    postReply: function (commentId) {
      const text = $(`#reply-text-${commentId}`).val().trim();
      if (!text) return app.views.showToast("Please write a reply", "warning");

      const post = app.state.posts.find((p) => p.id === app.state.activePostId);
      const comment = post.comments.find((c) => c.id === commentId);

      if (!comment.replies) comment.replies = [];

      comment.replies.push({
        author: app.state.currentUser.name || app.state.currentUser.username,
        text: text,
        date: new Date().toLocaleDateString(),
      });

      app.data.save();
      $(`#reply-text-${commentId}`).val("");
      app.logic.renderDetails(app.state.activePostId);
      app.views.showToast("Reply posted!", "success");
    },

    showMessageReplyForm: function (msgId) {
      $(`#msg-reply-form-${msgId}`).toggleClass("d-none");
    },

    postMessageReply: function (msgId) {
      const text = $(`#msg-reply-text-${msgId}`).val().trim();
      if (!text) return app.views.showToast("Please write a reply", "warning");

      const message = app.state.messages.find((m) => m.id === msgId);
      if (!message.replies) message.replies = [];

      message.replies.push({
        text: text,
        date: new Date().toLocaleDateString(),
      });

      app.data.save();
      $(`#msg-reply-text-${msgId}`).val("");
      app.logic.renderMessages();
      app.views.showToast("Reply sent!", "success");
    },
  },

  // === 8. EVENT BINDING ===
  events: {
    bind: function () {
      // Lang Toggle
      this.toggleLang = function () {
        app.state.currentLang = app.state.currentLang === "en" ? "bn" : "en";
        $("#langLabel").text(app.state.currentLang === "en" ? "EN" : "বাংলা");
        $("body")
          .removeClass("lang-en lang-bn")
          .addClass("lang-" + app.state.currentLang);
        app.events.applyLang();
      };

      // Login
      $("#loginForm").on("submit", function (e) {
        e.preventDefault();
        app.auth.login($("#loginUser").val(), $("#loginPass").val());
      });

      // Post Ad
      $("#rentalForm").on("submit", function (e) {
        e.preventDefault();
        app.logic.createPost();
      });
    },

    applyLang: function () {
      const t = app.translations[app.state.currentLang];
      $("[data-i18n]").each(function () {
        const key = $(this).data("i18n");
        if (t[key]) {
          if ($(this).is("input, textarea"))
            $(this).attr("placeholder", t[key]);
          else $(this).text(t[key]);
        }
      });
    },
  },
};

// Note: Initialization is now handled in index.html after ViewLoader completes
