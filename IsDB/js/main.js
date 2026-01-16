// --- 1. Data Initialization & Auth Logic ---

// Seed data with passwords if not present
const initialMembers = [
  {
    id: 1,
    name: "Mehedi Hasan",
    username: "mehedi9339",
    usernameChanged: false, // Track if username was changed
    title: "Senior Software Engineer",
    batch: "ESAD-CS/45",
    location: "Dhaka, Bangladesh",
    email: "mehedi@example.com",
    mobile: "+880 1712-345678",
    password: "123456", // Demo password
    avatar: "https://i.pravatar.cc/300?img=11",
    cover:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    social: {
      linkedin: "https://linkedin.com/in/mehedi9339",
      github: "https://github.com/mehedihasan9339",
    },
    privacy: {
      email: "public", // public, connections, hidden
      mobile: "connections",
      batch: "public",
      location: "public",
      title: "public",
    },
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Python"],
    education: [
      { degree: "B.Sc in CSE", institution: "Dhaka University", year: "2018" },
      {
        degree: "IDB-BISEW Scholarship",
        institution: "New Horizons",
        year: "2019",
      },
    ],
    experience: [
      {
        role: "Frontend Developer",
        company: "TechSoft BD",
        year: "2019 - 2021",
      },
      { role: "Senior Engineer", company: "Global IT", year: "2021 - Present" },
    ],
    about:
      "Passionate developer with a strong background in web technologies. Proud IDB-BISEW alumni.",
    connections: [2, 3], // IDs of connected members
  },
  {
    id: 2,
    name: "Sarah Khan",
    title: "Full Stack Developer",
    batch: "ESAD-CS/46",
    location: "Chittagong, Bangladesh",
    email: "sarah@example.com",
    password: "123456",
    avatar: "https://i.pravatar.cc/300?img=5",
    cover:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    social: { linkedin: "https://linkedin.com", github: "" },
    skills: [".NET Core", "C#", "Azure", "Angular"],
    education: [
      {
        degree: "M.Sc in Physics",
        institution: "Chittagong University",
        year: "2020",
      },
    ],
    experience: [
      { role: "Software Engineer", company: "DataSys", year: "2021 - Present" },
    ],
    about: ".NET enthusiast and open source contributor.",
    connections: [1],
  },
  {
    id: 3,
    name: "Rahim Ahmed",
    title: "Network Administrator",
    batch: "NT/32",
    location: "Sylhet, Bangladesh",
    email: "rahim@example.com",
    password: "123456",
    avatar: "https://i.pravatar.cc/300?img=3",
    cover:
      "https://images.unsplash.com/photo-1558494949-ef2bb3b9248c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    social: { linkedin: "", github: "https://github.com" },
    skills: ["Cisco", "Linux", "AWS", "Security"],
    education: [
      { degree: "BBA", institution: "National University", year: "2017" },
    ],
    experience: [
      { role: "System Admin", company: "NetLinks", year: "2018 - Present" },
    ],
    about: "Ensuring 99.9% uptime is my passion.",
    connections: [1],
  },
  {
    id: 4,
    name: "Ayesha Siddiqua",
    title: "UI/UX Designer",
    batch: "GAVE/12",
    location: "Dhaka, Bangladesh",
    email: "ayesha@example.com",
    password: "123456",
    avatar: "https://i.pravatar.cc/300?img=9",
    cover:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    social: { linkedin: "https://linkedin.com", github: "https://github.com" },
    skills: ["Figma", "Adobe XD", "Illustration", "HTML/CSS"],
    education: [
      { degree: "Fine Arts", institution: "Dhaka Art College", year: "2019" },
    ],
    experience: [
      {
        role: "Product Designer",
        company: "Creative Agency",
        year: "2020 - Present",
      },
    ],
    about: "Designing user-centric digital experiences.",
    connections: [],
  },
  {
    id: 5,
    name: "Karim Uddin",
    title: "Java Developer",
    batch: "J2EE/40",
    location: "Rajshahi, Bangladesh",
    email: "karim@example.com",
    password: "123456",
    avatar: "https://i.pravatar.cc/300?img=13",
    cover:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    social: { linkedin: "", github: "" },
    skills: ["Java", "Spring Boot", "Microservices", "Oracle"],
    education: [
      {
        degree: "B.Sc in Math",
        institution: "Rajshahi University",
        year: "2018",
      },
    ],
    experience: [
      { role: "Backend Dev", company: "JavaSolutions", year: "2019 - Present" },
    ],
    about: "Expert in enterprise application development.",
    connections: [],
  },
];

// Load members from localStorage or initialize
let members = JSON.parse(localStorage.getItem("isdb_members"));
if (!members) {
  members = initialMembers;
  localStorage.setItem("isdb_members", JSON.stringify(members));
}

// Get Logged In User
let currentUser = JSON.parse(localStorage.getItem("isdb_user"));
// Ensure current user has latest data
if (currentUser) {
  const updatedUser = members.find((m) => m.id === currentUser.id);
  if (updatedUser) {
    currentUser = updatedUser;
    localStorage.setItem("isdb_user", JSON.stringify(currentUser));
  }
}

// Mock Posts
let posts = JSON.parse(localStorage.getItem("isdb_posts"));
if (!posts) {
  posts = [
    {
      id: 1,
      userId: 2,
      content:
        "Just finished a new project using Blazor and .NET 8! The performance improvements are incredible. #dotNET #Blazor #IDB",
      time: "2 hours ago",
      likesCount: 15,
      likedBy: [3], // User ID 3 liked it
      comments: [
        {
          id: 101,
          userId: 1,
          text: "Great work! I've been meaning to try Blazor.",
          likesCount: 2,
          likedBy: [],
          replies: [
            {
              id: 102,
              userId: 2,
              text: "You should! It's a game changer.",
              likesCount: 0,
              likedBy: [],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      userId: 1,
      content:
        "Looking for a Junior Frontend Developer to join our team in Dhaka. Must have React experience. DM me if interested! #Job #Hiring #React",
      time: "5 hours ago",
      likesCount: 32,
      likedBy: [],
      comments: [],
    },
    {
      id: 3,
      userId: 3,
      content: "Attending the National IT Fest this weekend? Let's connect!",
      time: "1 day ago",
      likesCount: 8,
      likedBy: [],
      comments: [],
    },
  ];
  localStorage.setItem("isdb_posts", JSON.stringify(posts));
}

function getUrlParameter(name) {
  name = name.replace(/[\[\'\]]/g, "\\$&"); // Corrected escaping for regex
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function updateNavigation() {
  if (currentUser) {
    $(".nav-user-name").text(currentUser.name);
    $(".nav-user-username").text(currentUser.username || "user");
    $(".nav-user-avatar").attr("src", currentUser.avatar);
    $(".nav-user-profile-link").attr(
      "href",
      `profile.html?id=${currentUser.id}`
    );

    // Update personal information in sidebar
    $(".nav-user-email").text(currentUser.email || "N/A");
    $(".nav-user-batch").text(currentUser.batch || "N/A");
    $(".nav-user-location").text(currentUser.location || "N/A");
    $(".nav-user-title").text(currentUser.title || "N/A");

    // Update contact information
    $(".nav-user-mobile").text(currentUser.mobile || "N/A");

    // Update privacy icons
    updatePrivacyIcons();

    // Update contact links
    const linkedinUrl =
      currentUser.social?.linkedin || "https://linkedin.com/in/mehedi9339";
    const githubUrl =
      currentUser.social?.github || "https://github.com/mehedihasan9339";

    $(".nav-user-linkedin").attr("href", linkedinUrl).css("display", "block");
    $(".nav-user-github").attr("href", githubUrl).css("display", "block");

    if (!$("#logout-link").length) {
      const logoutHtml = `<li class="nav-item ms-2"><a class="nav-link text-danger" href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i></a></li>`;
      $(".navbar-nav").append(logoutHtml);
    }
  }
}

// Global Connect Handler
function handleConnect(targetId, btnElement) {
  if (!currentUser) return;

  let userRecord = members.find((m) => m.id === currentUser.id);
  if (!userRecord.connections) userRecord.connections = [];

  if (userRecord.connections.includes(targetId)) {
    $(btnElement)
      .text("Connected")
      .removeClass("btn-primary")
      .addClass("btn-success")
      .prop("disabled", true);
  } else {
    userRecord.connections.push(targetId);
    const idx = members.findIndex((m) => m.id === currentUser.id);
    members[idx] = userRecord;
    localStorage.setItem("isdb_members", JSON.stringify(members));
    localStorage.setItem("isdb_user", JSON.stringify(userRecord));

    $(btnElement)
      .html('<i class="fas fa-check"></i> Connected')
      .removeClass("btn-primary")
      .addClass("btn-success")
      .prop("disabled", true);
  }
}

$(document).ready(function () {
  // --- AUTH LOGIC ---

  const path = window.location.pathname;
  const isProtected =
    path.includes("dashboard.html") ||
    path.includes("members.html") ||
    path.includes("profile.html");

  if (isProtected && !currentUser) {
    window.location.href = "index.html";
    return;
  } else if (!isProtected && currentUser && path.includes("index.html")) {
    $(".navbar-nav .btn-primary")
      .text("Go to Dashboard")
      .attr("href", "dashboard.html")
      .removeAttr("data-bs-toggle");
  }

  updateNavigation();

  // Login Handler
  $("#loginForm").submit(function (e) {
    e.preventDefault();
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();

    const user = members.find(
      (m) => m.email === email && m.password === password
    );

    if (user) {
      localStorage.setItem("isdb_user", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else {
      $("#loginError").removeClass("d-none");
    }
  });

  // Register Handler
  $("#registerForm").submit(function (e) {
    e.preventDefault();
    const name = $("#regName").val();
    const email = $("#regEmail").val();
    const password = $("#regPassword").val();
    const batch = $("#regBatch").val();

    if (members.find((m) => m.email === email)) {
      $("#regError").text("Email already exists.").removeClass("d-none");
      return;
    }

    const newId =
      members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name: name,
      email: email,
      password: password,
      batch: batch,
      title: "New Member",
      location: "Bangladesh",
      avatar: `https://i.pravatar.cc/300?img=${newId + 10}`,
      cover:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      social: { linkedin: "", github: "" },
      connections: [],
      skills: [],
      education: [],
      about: "I am a new member of the IsDB professional network.",
    };

    members.push(newUser);
    localStorage.setItem("isdb_members", JSON.stringify(members));
    localStorage.setItem("isdb_user", JSON.stringify(newUser));

    alert("Account created successfully!");
    window.location.href = "dashboard.html";
  });

  // Toggle Forms
  $("#showRegister").click(function (e) {
    e.preventDefault();
    $("#loginForm").addClass("d-none");
    $("#registerForm").removeClass("d-none");
    $("#authTitle").text("Create Account");
  });

  $("#showLogin").click(function (e) {
    e.preventDefault();
    $("#registerForm").addClass("d-none");
    $("#loginForm").removeClass("d-none");
    $("#authTitle").text("Welcome Back");
  });

  // Logout
  $(document).on("click", "#logout-link", function (e) {
    e.preventDefault();
    localStorage.removeItem("isdb_user");
    window.location.href = "index.html";
  });

  // --- PAGE SPECIFIC LOGIC ---

  // Members Page
  if ($("#members-grid").length) {
    let currentPage = 1;
    let itemsPerPage = 9;
    let currentFilter = "";
    let currentBatch = "";
    let currentSort = "name";
    let viewMode = "grid";

    // Update stats
    function updateStats() {
      const totalMembers = members.filter(
        (m) => m.id !== currentUser.id
      ).length;
      const myConnections = currentUser.connections
        ? currentUser.connections.length
        : 0;
      const batches = new Set(members.map((m) => m.batch)).size;
      const skills = new Set(members.flatMap((m) => m.skills || [])).size;

      $(".total-members").text(totalMembers);
      $(".my-connections").text(myConnections);
      $(".batches-count").text(batches);
      $(".skills-count").text(skills);
    }

    function renderMembers(
      filterText = "",
      batch = "",
      sort = "name",
      page = 1
    ) {
      const grid = $("#members-grid");
      grid.empty();

      let filtered = members.filter((m) => m.id !== currentUser.id);

      // Apply search filter
      if (filterText) {
        filtered = filtered.filter(
          (m) =>
            m.name.toLowerCase().includes(filterText.toLowerCase()) ||
            (m.skills &&
              m.skills.some((s) =>
                s.toLowerCase().includes(filterText.toLowerCase())
              )) ||
            m.batch.toLowerCase().includes(filterText.toLowerCase()) ||
            (m.title &&
              m.title.toLowerCase().includes(filterText.toLowerCase()))
        );
      }

      // Apply batch filter
      if (batch) {
        filtered = filtered.filter((m) => m.batch === batch);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        if (sort === "name") {
          return a.name.localeCompare(b.name);
        } else if (sort === "name-desc") {
          return b.name.localeCompare(a.name);
        } else if (sort === "recent") {
          return b.id - a.id;
        }
        return 0;
      });

      // Show no results message
      if (filtered.length === 0) {
        $("#no-results").removeClass("d-none");
        $("#pagination").hide();
        $("#results-info").text("No results found");
        return;
      } else {
        $("#no-results").addClass("d-none");
        $("#pagination").show();
      }

      // Calculate pagination
      const totalItems = filtered.length;
      const totalPages =
        itemsPerPage === "all" ? 1 : Math.ceil(totalItems / itemsPerPage);
      const startIndex = itemsPerPage === "all" ? 0 : (page - 1) * itemsPerPage;
      const endIndex =
        itemsPerPage === "all" ? totalItems : startIndex + itemsPerPage;
      const paginatedMembers = filtered.slice(startIndex, endIndex);

      // Update results info
      $("#results-info").text(
        `Showing ${startIndex + 1}-${Math.min(
          endIndex,
          totalItems
        )} of ${totalItems} members`
      );

      // Render members
      paginatedMembers.forEach((m, index) => {
        const isConnected =
          currentUser.connections && currentUser.connections.includes(m.id);
        const btnClass = isConnected ? "btn-success disabled" : "btn-primary";
        const btnText = isConnected
          ? '<i class="fas fa-check"></i> Connected'
          : '<i class="fas fa-user-plus"></i> Connect';
        const btnAttr = isConnected ? "disabled" : "";

        const colClass = viewMode === "grid" ? "col-lg-4 col-md-6" : "col-12";
        const animationDelay = `style="animation-delay: ${index * 0.1}s;"`;

        const card = `
          <div class="${colClass} mb-4 fade-in" ${animationDelay}>
            <div class="card member-card h-100 shadow-sm border-0">
              <span class="badge bg-primary position-absolute top-0 end-0 m-2">${
                m.batch
              }</span>
              <img src="${
                m.cover
              }" class="card-img-top" alt="Cover" style="height: 150px; object-fit: cover;">
              <div class="card-body text-center">
                <img src="${
                  m.avatar
                }" class="rounded-circle mb-3" width="100" height="100" style="margin-top: -60px;">
                <h5 class="card-title mb-1">${m.name}</h5>
                <p class="text-muted small mb-2">${m.title}</p>
                <p class="card-text small text-secondary mb-3">
                  <i class="fas fa-map-marker-alt text-danger"></i> ${
                    m.location
                  }
                </p>
                <div class="mb-3 d-flex flex-wrap gap-1 justify-content-center">
                  ${(m.skills || [])
                    .slice(0, 3)
                    .map(
                      (s) =>
                        `<span class="badge bg-light text-dark border skill-tag">${s}</span>`
                    )
                    .join("")}
                  ${
                    (m.skills || []).length > 3
                      ? `<span class="badge bg-light text-dark border">+${
                          m.skills.length - 3
                        }</span>`
                      : ""
                  }
                </div>
                <div class="d-flex gap-2 justify-content-center">
                  <a href="profile.html?id=${
                    m.id
                  }" class="btn btn-outline-primary btn-sm flex-grow-1">
                    <i class="fas fa-eye"></i> View Profile
                  </a>
                  <button class="btn ${btnClass} btn-sm btn-connect" data-id="${
          m.id
        }" ${btnAttr}>
                    ${btnText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        grid.append(card);
      });

      // Render pagination
      renderPagination(totalPages, page);

      // Trigger scroll animation
      setTimeout(() => {
        $(".fade-in").css("opacity", "1");
      }, 100);
    }

    function renderPagination(totalPages, currentPage) {
      const pagination = $("#pagination");
      pagination.empty();

      if (totalPages <= 1) {
        pagination.hide();
        return;
      }

      pagination.show();

      // Previous button
      const prevDisabled = currentPage === 1 ? "disabled" : "";
      pagination.append(`
        <li class="page-item ${prevDisabled}">
          <a class="page-link" href="#" data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
          </a>
        </li>
      `);

      // Page numbers
      const maxVisible = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      if (startPage > 1) {
        pagination.append(`
          <li class="page-item">
            <a class="page-link" href="#" data-page="1">1</a>
          </li>
        `);
        if (startPage > 2) {
          pagination.append(
            `<li class="page-item disabled"><span class="page-link">...</span></li>`
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        const active = i === currentPage ? "active" : "";
        pagination.append(`
          <li class="page-item ${active}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pagination.append(
            `<li class="page-item disabled"><span class="page-link">...</span></li>`
          );
        }
        pagination.append(`
          <li class="page-item">
            <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
          </li>
        `);
      }

      // Next button
      const nextDisabled = currentPage === totalPages ? "disabled" : "";
      pagination.append(`
        <li class="page-item ${nextDisabled}">
          <a class="page-link" href="#" data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
          </a>
        </li>
      `);
    }

    // Initialize
    updateStats();
    renderMembers(currentFilter, currentBatch, currentSort, currentPage);

    // Search handler
    $("#member-search").on("keyup", function () {
      currentFilter = $(this).val();
      currentPage = 1;
      renderMembers(currentFilter, currentBatch, currentSort, currentPage);
    });

    // Batch filter
    $("#batch-filter").on("change", function () {
      currentBatch = $(this).val();
      currentPage = 1;
      renderMembers(currentFilter, currentBatch, currentSort, currentPage);
    });

    // Sort filter
    $("#sort-filter").on("change", function () {
      currentSort = $(this).val();
      currentPage = 1;
      renderMembers(currentFilter, currentBatch, currentSort, currentPage);
    });

    // Items per page
    $("#items-per-page").on("change", function () {
      const value = $(this).val();
      itemsPerPage = value === "all" ? "all" : parseInt(value);
      currentPage = 1;
      renderMembers(currentFilter, currentBatch, currentSort, currentPage);
    });

    // Pagination click
    $(document).on("click", "#pagination .page-link", function (e) {
      e.preventDefault();
      if ($(this).parent().hasClass("disabled")) return;

      const page = parseInt($(this).data("page"));
      if (page && page !== currentPage) {
        currentPage = page;
        renderMembers(currentFilter, currentBatch, currentSort, currentPage);

        // Smooth scroll to top
        $("html, body").animate(
          { scrollTop: $("#members-grid").offset().top - 100 },
          600
        );
      }
    });

    // View mode toggle
    $("#view-grid").on("click", function () {
      viewMode = "grid";
      $(this).addClass("active");
      $("#view-list").removeClass("active");
      renderMembers(currentFilter, currentBatch, currentSort, currentPage);
    });

    $("#view-list").on("click", function () {
      viewMode = "list";
      $(this).addClass("active");
      $("#view-grid").removeClass("active");
      renderMembers(currentFilter, currentBatch, currentSort, currentPage);
    });

    // Connect button handler
    $(document).on("click", ".btn-connect", function () {
      const id = $(this).data("id");
      const btn = this;

      handleConnect(id, btn);

      // Update stats
      setTimeout(() => {
        updateStats();
      }, 500);
    });
  }

  // Profile Page
  if ($("#profile-container").length) {
    const id = getUrlParameter("id") || (currentUser ? currentUser.id : 1);
    const profile = members.find((m) => m.id == id);
    const isMe = currentUser && currentUser.id == id;

    if (profile) {
      $("#profile-cover").css("background-image", `url(${profile.cover})`);
      $("#profile-avatar").css("background-image", `url(${profile.avatar})`);
      $("#profile-name").text(profile.name);
      $("#profile-title").text(profile.title);
      $("#profile-location").html(
        `<i class="fas fa-map-marker-alt text-danger"></i> ${profile.location}`
      );
      $("#profile-batch").text(profile.batch);
      $("#profile-about").text(profile.about);

      // Update quick stats
      $("#connections-count").text(
        profile.connections ? profile.connections.length : 0
      );
      $("#skills-count").text(profile.skills.length);
      $("#experience-count").text(profile.experience.length);
      $("#education-count").text(profile.education.length);

      // Contact information
      $("#contact-email").text(profile.email || "Not provided");
      $("#contact-phone").text(profile.mobile || "Not provided");

      let socialHtml = "";
      if (profile.social && profile.social.linkedin) {
        socialHtml += `<a href="${profile.social.linkedin}" target="_blank" class="btn btn-sm btn-primary rounded-pill me-2"><i class="fab fa-linkedin me-1"></i> LinkedIn</a>`;
      }
      if (profile.social && profile.social.github) {
        socialHtml += `<a href="${profile.social.github}" target="_blank" class="btn btn-sm btn-dark rounded-pill me-2"><i class="fab fa-github me-1"></i> GitHub</a>`;
      }
      if (profile.social && profile.social.twitter) {
        socialHtml += `<a href="${profile.social.twitter}" target="_blank" class="btn btn-sm btn-info rounded-pill text-white"><i class="fab fa-twitter me-1"></i> Twitter</a>`;
      }
      $("#social-links-container").html(socialHtml);

      if (!isMe) {
        const isConnected =
          currentUser.connections &&
          currentUser.connections.includes(profile.id);
        if (isConnected) {
          $("#profile-action-btn")
            .html('<i class="fas fa-check-circle"></i> Connected')
            .removeClass("btn-primary")
            .addClass("btn-success")
            .prop("disabled", true);
        } else {
          $("#profile-action-btn")
            .html('<i class="fas fa-user-plus"></i> Connect')
            .addClass("btn-primary")
            .click(function () {
              handleConnect(profile.id, this);
            });
        }
      } else {
        $("#profile-action-btn")
          .html('<i class="fas fa-edit"></i> Edit Profile')
          .removeClass("btn-primary")
          .addClass("btn-secondary");
      }

      const expHtml = profile.experience.length
        ? profile.experience
            .map(
              (e) => `
                <div class="experience-item">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 class="mb-1 fw-bold text-dark">${e.role}</h5>
                            <h6 class="text-primary mb-2">${e.company}</h6>
                        </div>
                        <span class="badge bg-light text-dark">${e.year}</span>
                    </div>
                    <p class="text-secondary mb-0"><i class="fas fa-calendar-alt me-2"></i>Duration: ${e.year}</p>
                </div>
            `
            )
            .join("")
        : '<div class="text-center py-4"><i class="fas fa-briefcase fa-3x text-muted mb-3"></i><p class="text-muted">No experience added yet.</p></div>';
      $("#experience-list").html(expHtml);

      const eduHtml = profile.education.length
        ? profile.education
            .map(
              (e) => `
                <div class="education-item">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 class="mb-1 fw-bold text-dark">${e.degree}</h5>
                            <h6 class="text-primary mb-2">${e.institution}</h6>
                        </div>
                        <span class="badge bg-light text-dark">${e.year}</span>
                    </div>
                    <p class="text-secondary mb-0"><i class="fas fa-calendar-alt me-2"></i>Graduated: ${e.year}</p>
                </div>
            `
            )
            .join("")
        : '<div class="text-center py-4"><i class="fas fa-graduation-cap fa-3x text-muted mb-3"></i><p class="text-muted">No education added yet.</p></div>';
      $("#education-list").html(eduHtml);

      const skillsHtml = profile.skills.length
        ? profile.skills
            .map(
              (s) =>
                `<span class="badge bg-primary skill-badge fs-6 me-2 mb-2 px-3 py-2">${s}</span>`
            )
            .join("")
        : '<div class="text-center py-4"><i class="fas fa-code fa-3x text-muted mb-3"></i><p class="text-muted">No skills added yet.</p></div>';
      $("#skills-list").html(skillsHtml);
    }
  }

  // Dashboard/Feed
  if ($("#feed-container").length) {
    function formatText(text) {
      return text.replace(
        /(@\w+)/g,
        '<span class="text-primary fw-bold">$1</span>'
      );
    }

    function generateCommentHTML(c) {
      const author = members.find((m) => m.id === c.userId) || {
        name: "Unknown User",
        avatar: "https://i.pravatar.cc/300",
      };

      // --- Comment Like Logic ---
      const isLiked = c.likedBy && c.likedBy.includes(currentUser.id);
      const likeClass = isLiked ? "text-primary fw-bold" : "text-muted";
      const likeText = isLiked ? "Unlike" : "Like";

      const repliesHtml =
        c.replies && c.replies.length > 0
          ? c.replies.map((r) => generateCommentHTML(r)).join("")
          : "";

      return `
                <div class="d-flex mb-2" id="comment-${c.id}">
                    <img src="${
                      author.avatar
                    }" class="rounded-circle me-2" width="30" height="30">
                    <div class="flex-grow-1">
                        <div class="comment-bubble d-inline-block p-2 px-3 rounded-3 bg-light">
                            <h6 class="mb-0 small fw-bold"><a href="profile.html?id=${
                              author.id
                            }" class="text-decoration-none text-dark">${
        author.name
      }</a></h6>
                            <p class="mb-0 small text-break">${formatText(
                              c.text
                            )}</p>
                            <!-- Likes Count Bubble -->
                            ${
                              c.likesCount > 0
                                ? `<div class="position-absolute bg-white rounded-pill px-1 shadow-sm small text-primary" style="bottom: -5px; right: -5px; font-size: 0.7rem;"><i class="fas fa-thumbs-up"></i> ${c.likesCount}</div>`
                                : ""
                            }
                        </div>
                        <div class="d-flex align-items-center mt-1 ms-1 gap-3">
                            <button class="btn btn-link btn-sm p-0 text-decoration-none small ${likeClass} btn-like-comment" data-id="${
        c.id
      }">${likeText}</button>
                            <button class="btn btn-link btn-sm p-0 text-decoration-none small text-muted btn-reply" data-id="${
                              c.id
                            }" data-author="${author.name}">Reply</button>
                            <small class="text-muted" style="font-size: 0.75rem;">Just now</small>
                        </div>
                        <div class="ms-3 mt-2 comments-container-${c.id}">
                            ${repliesHtml}
                        </div>
                        <div class="reply-box-container d-none mt-2" id="reply-box-${
                          c.id
                        }">
                            <div class="d-flex">
                                <img src="${
                                  currentUser.avatar
                                }" class="rounded-circle me-2" width="25" height="25">
                                <input type="text" class="form-control form-control-sm me-2 reply-input" placeholder="Reply to ${
                                  author.name
                                }...">
                                <button class="btn btn-primary btn-sm btn-submit-reply" data-parent-id="${
                                  c.id
                                }">Reply</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }

    function createPostHTML(p) {
      const author = members.find((m) => m.id === p.userId) || {
        name: "Unknown",
        avatar: "https://i.pravatar.cc/300",
        id: 0,
      };
      const commentsHtml = p.comments
        .map((c) => generateCommentHTML(c))
        .join("");

      const isLiked = p.likedBy && p.likedBy.includes(currentUser.id);
      const likeBtnText = isLiked ? "Unlike" : "Like";
      const likeBtnClass = isLiked ? "text-primary" : "text-secondary";
      const likeIconClass = isLiked ? "fas" : "far";

      return `
                <div class="card mb-3 slide-up" data-id="${p.id}">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <img src="${
                              author.avatar
                            }" class="rounded-circle me-2" width="40" height="40">
                            <div>
                                <h6 class="mb-0"><a href="profile.html?id=${
                                  author.id
                                }" class="text-decoration-none text-dark">${
        author.name
      }</a></h6>
                                <small class="text-muted">${p.time}</small>
                            </div>
                        </div>
                        <p class="card-text">${p.content}</p>
                        
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small text-muted like-count-display"><i class="fas fa-thumbs-up text-primary"></i> ${
                              p.likesCount || 0
                            } Likes</span>
                            <span class="small text-muted comment-count-display">${
                              p.comments ? p.comments.length : 0
                            } Comments</span>
                        </div>

                        <hr class="my-2">
                        
                        <div class="d-flex justify-content-between mb-3">
                            <button class="btn btn-light btn-sm w-100 me-1 btn-like fw-bold ${likeBtnClass}"><i class="${likeIconClass} fa-thumbs-up"></i> ${likeBtnText}</button>
                            <button class="btn btn-light btn-sm w-100 ms-1 btn-focus-comment fw-bold text-secondary"><i class="far fa-comment"></i> Comment</button>
                        </div>

                        <div class="d-flex mb-3">
                            <img src="${
                              currentUser.avatar
                            }" class="rounded-circle me-2" width="35" height="35">
                            <div class="input-group">
                                <input type="text" class="form-control rounded-pill bg-light border-0 px-3 comment-input main-comment-input" placeholder="Write a comment...">
                                <button class="btn btn-primary rounded-pill ms-2 px-3 btn-submit-comment"><i class="fas fa-paper-plane"></i></button>
                            </div>
                        </div>

                        <div class="mt-3 border-top pt-3 comments-wrapper">
                            ${commentsHtml}
                        </div>
                    </div>
                </div>
            `;
    }

    function initFeed() {
      $("#feed-container").empty();
      posts.forEach((p) => {
        $("#feed-container").prepend(createPostHTML(p));
      });
    }
    initFeed();

    // --- Auto-Resize Textarea ---
    $(document).on("input", "#post-input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });

    // --- Expand textarea on focus/click ---
    $(document).on("focus click", "#post-input", function () {
      $(this).attr("rows", "3");
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });

    // --- Collapse textarea on blur if empty ---
    $(document).on("blur", "#post-input", function () {
      if ($(this).val().trim() === "") {
        $(this).attr("rows", "1");
        this.style.height = "auto";
      }
    });

    $("#btn-post").click(function () {
      const input = $("#post-input");
      const content = input.val();
      if (content.trim() !== "") {
        const newPost = {
          id: Date.now(),
          userId: currentUser.id,
          content: content,
          time: "Just now",
          likesCount: 0,
          likedBy: [],
          comments: [],
        };
        posts.push(newPost);
        localStorage.setItem("isdb_posts", JSON.stringify(posts));
        $("#feed-container").prepend(createPostHTML(newPost));
        input.val("");
        input.css("height", "auto"); // Reset height
      }
    });

    // Function to render suggestions list
    function renderSuggestions() {
      const suggestionsList = $("#suggestions-list");
      if (!suggestionsList.length) return;

      suggestionsList.empty();

      // Get users that are not the current user and not already connected
      const currentConnections = currentUser.connections || [];
      const suggestions = members
        .filter(
          (m) => m.id !== currentUser.id && !currentConnections.includes(m.id)
        )
        .slice(0, 5); // Show max 5 suggestions

      suggestions.forEach((user) => {
        const html = `
          <div class="d-flex align-items-center mb-3">
            <img
              src="${user.avatar}"
              class="rounded-circle me-2"
              width="40"
              height="40"
            />
            <div class="flex-grow-1">
              <h6 class="mb-0 small fw-bold">
                <a
                  href="profile.html?id=${user.id}"
                  class="text-decoration-none text-dark"
                  >${user.name}</a
                >
              </h6>
              <small class="text-muted d-block" style="font-size: 0.75rem"
                >${user.batch || "Member"}</small
              >
            </div>
            <button
              class="btn btn-outline-primary btn-sm rounded-circle btn-add-connection"
              data-user-id="${user.id}"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        `;
        suggestionsList.append(html);
      });

      if (suggestions.length === 0) {
        suggestionsList.html(
          '<p class="text-muted text-center small">No suggestions available</p>'
        );
      }
    }

    // Initial render of suggestions
    renderSuggestions();

    // Add Connection from "People you may know" section
    $(document).on("click", ".btn-add-connection", function (e) {
      e.preventDefault();
      const btn = $(this);
      const userId = parseInt(btn.data("user-id"));

      if (!userId) return;

      // Change to minus button
      btn
        .removeClass("btn-outline-primary")
        .addClass("btn-danger")
        .html('<i class="fas fa-minus"></i>')
        .prop("disabled", true);

      // Add connection
      handleConnect(userId, btn[0]);

      // After 5 seconds, reload the suggestions list
      setTimeout(() => {
        renderSuggestions();
      }, 5000);
    });

    // Like Post
    $(document).on("click", ".btn-like", function (e) {
      e.preventDefault();
      const btn = $(this);
      const card = btn.closest(".card");
      const postId = card.data("id");

      setTimeout(() => {
        const post = posts.find((p) => p.id === postId);
        if (post) {
          if (!post.likedBy) post.likedBy = [];
          if (!post.likesCount) post.likesCount = 0;

          const userIdx = post.likedBy.indexOf(currentUser.id);
          const isNowLiked = userIdx === -1;

          if (isNowLiked) {
            post.likedBy.push(currentUser.id);
            post.likesCount++;
            btn
              .html('<i class="fas fa-thumbs-up"></i> Unlike')
              .removeClass("text-secondary")
              .addClass("text-primary");
          } else {
            post.likedBy.splice(userIdx, 1);
            post.likesCount--;
            btn
              .html('<i class="far fa-thumbs-up"></i> Like')
              .removeClass("text-primary")
              .addClass("text-secondary");
          }

          localStorage.setItem("isdb_posts", JSON.stringify(posts));
          card
            .find(".like-count-display")
            .html(
              `<i class="fas fa-thumbs-up text-primary"></i> ${post.likesCount} Likes`
            );
        }
      }, 100);
    });

    // Like Comment
    $(document).on("click", ".btn-like-comment", function (e) {
      e.preventDefault();
      const btn = $(this);
      const commentId = btn.data("id");
      const card = btn.closest(".card");
      const postId = card.data("id");

      function findCommentRecursive(comments) {
        for (let c of comments) {
          if (c.id === commentId) return c;
          if (c.replies) {
            const found = findCommentRecursive(c.replies);
            if (found) return found;
          }
        }
        return null;
      }

      const post = posts.find((p) => p.id === postId);
      if (post) {
        const comment = findCommentRecursive(post.comments);
        if (comment) {
          if (!comment.likedBy) comment.likedBy = [];
          if (!comment.likesCount) comment.likesCount = 0;

          const userIdx = comment.likedBy.indexOf(currentUser.id);
          const isLiked = userIdx !== -1;

          if (!isLiked) {
            comment.likedBy.push(currentUser.id);
            comment.likesCount++;
          } else {
            comment.likedBy.splice(userIdx, 1);
            comment.likesCount--;
          }

          localStorage.setItem("isdb_posts", JSON.stringify(posts));
          const newHtml = generateCommentHTML(comment);
          $(`#comment-${comment.id}`).replaceWith(newHtml);
        }
      }
    });

    $(document).on("click", ".btn-focus-comment", function (e) {
      e.preventDefault();
      $(this).closest(".card").find(".main-comment-input").focus();
    });

    $(document).on("click", ".btn-reply", function (e) {
      e.preventDefault();
      const commentId = $(this).data("id");
      const authorName = $(this).data("author");
      const replyBox = $(`#reply-box-${commentId}`);

      replyBox.toggleClass("d-none");
      const input = replyBox.find("input");
      if (!replyBox.hasClass("d-none")) {
        input.val(`@${authorName} `).focus();
      }
    });

    function handleAddComment(card, postId, text, parentId = null) {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const newComment = {
        id: Date.now(),
        userId: currentUser.id,
        text: text,
        likesCount: 0,
        likedBy: [],
        replies: [],
      };

      if (parentId) {
        function findComment(comments) {
          for (let c of comments) {
            if (c.id === parentId) return c;
            if (c.replies) {
              const found = findComment(c.replies);
              if (found) return found;
            }
          }
          return null;
        }
        const parent = findComment(post.comments);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(newComment);
          const html = generateCommentHTML(newComment);
          $(`.comments-container-${parentId}`).append(html);
          $(`#reply-box-${parentId}`).addClass("d-none");
        }
      } else {
        if (!post.comments) post.comments = [];
        post.comments.push(newComment);
        const html = generateCommentHTML(newComment);
        card.find(".comments-wrapper").append(html);
        card
          .find(".comment-count-display")
          .text(`${post.comments.length} Comments`);
      }

      localStorage.setItem("isdb_posts", JSON.stringify(posts));
    }

    $(document).on("click", ".btn-submit-comment", function (e) {
      e.preventDefault();
      const card = $(this).closest(".card");
      const postId = card.data("id");
      const input = card.find(".main-comment-input");
      const text = input.val();

      if (text.trim()) {
        handleAddComment(card, postId, text);
        input.val("");
      }
    });

    $(document).on("click", ".btn-submit-reply", function (e) {
      e.preventDefault();
      const card = $(this).closest(".card");
      const postId = card.data("id");
      const parentId = $(this).data("parent-id");
      const input = $(this).siblings("input");
      const text = input.val();

      if (text.trim()) {
        handleAddComment(card, postId, text, parentId);
        input.val("");
      }
    });

    $(document).on("keypress", ".comment-input, .reply-input", function (e) {
      if (e.which === 13) {
        e.preventDefault();
        $(this).siblings("button").click();
      }
    });

    $("form").submit(function (e) {
      e.preventDefault();
    });
  }
});

// --- Profile Editing Functions ---
function updatePrivacyIcons() {
  if (!currentUser || !currentUser.privacy) return;

  const privacyIconMap = {
    public: { icon: "fa-globe", title: "Public", color: "text-success" },
    connections: {
      icon: "fa-user-friends",
      title: "Connections Only",
      color: "text-warning",
    },
    hidden: { icon: "fa-eye-slash", title: "Hidden", color: "text-muted" },
  };

  Object.keys(currentUser.privacy).forEach((field) => {
    const privacy = currentUser.privacy[field];
    const iconData = privacyIconMap[privacy] || privacyIconMap.public;
    $(`.privacy-icon-${field}`)
      .removeClass(
        "fa-globe fa-user-friends fa-eye-slash text-success text-warning text-muted"
      )
      .addClass(`fas ${iconData.icon} ${iconData.color}`)
      .attr("title", iconData.title);
  });
}

function openEditProfileModal() {
  if (!currentUser) return;

  // Populate form fields
  $("#edit-name").val(currentUser.name);
  $("#edit-username").val(currentUser.username || "");
  $("#edit-title").val(currentUser.title || "");
  $("#edit-email").val(currentUser.email || "");
  $("#edit-batch").val(currentUser.batch || "");
  $("#edit-location").val(currentUser.location || "");
  $("#edit-mobile").val(currentUser.mobile || "");

  // Extract social usernames
  if (currentUser.social) {
    const linkedinMatch = currentUser.social.linkedin?.match(
      /linkedin\.com\/in\/(.+)/
    );
    const githubMatch = currentUser.social.github?.match(/github\.com\/(.+)/);
    $("#edit-linkedin").val(linkedinMatch ? linkedinMatch[1] : "");
    $("#edit-github").val(githubMatch ? githubMatch[1] : "");
  }

  // Set privacy settings
  if (currentUser.privacy) {
    Object.keys(currentUser.privacy).forEach((field) => {
      $(
        `input[name="privacy-${field}"][value="${currentUser.privacy[field]}"]`
      ).prop("checked", true);
    });
  }

  // Show username warning if already changed
  if (currentUser.usernameChanged) {
    $("#username-warning").show();
    $("#edit-username").prop("readonly", true);
  } else {
    $("#username-warning").hide();
    $("#edit-username").prop("readonly", false);
  }

  // Open modal
  $("#editProfileModal").modal("show");
}

function saveProfile() {
  if (!currentUser) return;

  const originalUsername = currentUser.username;

  // Get form values
  currentUser.name = $("#edit-name").val();
  const newUsername = $("#edit-username").val();

  // Check username change
  if (newUsername !== originalUsername && !currentUser.usernameChanged) {
    currentUser.username = newUsername;
    currentUser.usernameChanged = true;
  } else if (currentUser.usernameChanged) {
    currentUser.username = originalUsername; // Keep original if already changed
  } else {
    currentUser.username = newUsername;
  }

  currentUser.title = $("#edit-title").val();
  currentUser.email = $("#edit-email").val();
  currentUser.batch = $("#edit-batch").val();
  currentUser.location = $("#edit-location").val();
  currentUser.mobile = $("#edit-mobile").val();

  // Update social links
  const linkedinUsername = $("#edit-linkedin").val();
  const githubUsername = $("#edit-github").val();

  if (!currentUser.social) currentUser.social = {};
  currentUser.social.linkedin = linkedinUsername
    ? `https://linkedin.com/in/${linkedinUsername}`
    : "";
  currentUser.social.github = githubUsername
    ? `https://github.com/${githubUsername}`
    : "";

  // Update privacy settings
  if (!currentUser.privacy) currentUser.privacy = {};
  currentUser.privacy.title = $('input[name="privacy-title"]:checked').val();
  currentUser.privacy.email = $('input[name="privacy-email"]:checked').val();
  currentUser.privacy.batch = $('input[name="privacy-batch"]:checked').val();
  currentUser.privacy.location = $(
    'input[name="privacy-location"]:checked'
  ).val();
  currentUser.privacy.mobile = $('input[name="privacy-mobile"]:checked').val();

  // Save to localStorage
  const members = JSON.parse(localStorage.getItem("isdb_members")) || [];
  const index = members.findIndex((m) => m.id === currentUser.id);
  if (index !== -1) {
    members[index] = currentUser;
    localStorage.setItem("isdb_members", JSON.stringify(members));
  }

  localStorage.setItem("isdb_currentUser", JSON.stringify(currentUser));

  // Update UI
  updateNavigation();
  $("#editProfileModal").modal("hide");

  // Show success message
  alert("Profile updated successfully!");
}

// Event handlers for profile editing
$(document).ready(function () {
  $("#btn-edit-profile").click(function () {
    openEditProfileModal();
  });

  $("#btn-save-profile").click(function () {
    saveProfile();
  });
});
