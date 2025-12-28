/**
 * Load Admin Panel Data to Main Website
 * This script fetches data from localStorage (set by admin panel)
 * and updates the index.html content dynamically
 */

document.addEventListener("DOMContentLoaded", function () {
  loadHeroData();
  loadAboutData();
  loadServicesData();
  loadCoreValuesData();
  loadClientsData();
  loadContactData();
  updateMetaTags();
});

/**
 * Load and Update Hero Section
 */
function loadHeroData() {
  const heroData = JSON.parse(localStorage.getItem("heroData")) || {
    title: "Innovative IT Solutions",
    subtitle:
      "We deliver cutting-edge technology services to transform your digital presence",
    primaryBtnText: "Explore Services",
    primaryBtnLink: "#services",
    secondaryBtnText: "Learn More",
    secondaryBtnLink: "#about",
    videoUrl: "assets/video/it-sector-explainer.mp4",
  };

  // Update hero title
  const heroTitle = document.querySelector(".hero-content .typewriter-text");
  if (heroTitle) {
    heroTitle.textContent = heroData.title;
  }

  // Update hero subtitle
  const heroSubtitle = document.querySelector(".hero-content .fade-in-text");
  if (heroSubtitle) {
    heroSubtitle.textContent = heroData.subtitle;
  }

  // Update primary button
  const primaryBtn = document.querySelector(".btn-get-started");
  if (primaryBtn) {
    primaryBtn.textContent = heroData.primaryBtnText;
    primaryBtn.href = heroData.primaryBtnLink;
  }

  // Update secondary button
  const secondaryBtn = document.querySelector(".btn-watch-video");
  if (secondaryBtn) {
    const span = secondaryBtn.querySelector("span");
    if (span) {
      span.textContent = heroData.secondaryBtnText;
    }
    secondaryBtn.href = heroData.secondaryBtnLink;
  }

  // Update video URL
  const videoSource = document.querySelector(".hero-video source");
  if (videoSource) {
    videoSource.src = heroData.videoUrl;
  }
}

/**
 * Load and Update About Section
 */
function loadAboutData() {
  const aboutData = JSON.parse(localStorage.getItem("aboutData")) || {
    title: "About Leading Edge Technology",
    tagline: "Revolutionizing IT solutions in Bangladesh since 2004.",
    content:
      "We are proud to be at the forefront of technological innovation in our region. Since our inception in 2004, Leading Edge Technology has been scaling new heights with international standard services and sincere efforts.",
    features:
      "Expert team of qualified IT professionals|Customized IT solutions for businesses of all sizes|Comprehensive support and maintenance services",
    learnMoreLink: "about.html",
  };

  // Update about title
  const aboutTitle = document.querySelector(".content h3");
  if (aboutTitle) {
    aboutTitle.textContent = aboutData.title;
  }

  // Update tagline
  const tagline = document.querySelector(".content .fst-italic");
  if (tagline) {
    tagline.textContent = aboutData.tagline;
  }

  // Update content
  const aboutContent = document.querySelector(".content > p:not(.fst-italic)");
  if (aboutContent) {
    aboutContent.textContent = aboutData.content;
  }

  // Update features list
  const featuresList = document.querySelector(".content ul");
  if (featuresList && aboutData.features) {
    const features = aboutData.features
      .split("|")
      .map((f) => f.trim())
      .filter((f) => f);
    featuresList.innerHTML = features
      .map(
        (feature) => `
            <li style="margin-bottom: 12px;">
                <i class="ri-check-double-line" style="color: #FF0000; margin-right: 10px; font-size: 1.2rem;"></i>
                <span style="font-size: 1.1rem;">${feature}</span>
            </li>
        `
      )
      .join("");
  }

  // Update learn more button
  const learnMoreBtn = document.querySelector(".content .read-more");
  if (learnMoreBtn) {
    learnMoreBtn.href = aboutData.learnMoreLink;
  }
}

/**
 * Load and Update Services Section
 */
function loadServicesData() {
  const defaultServices = [
    {
      id: 1,
      title: "Network Solutions",
      description:
        "Comprehensive network setup, maintenance, and security services for businesses of all sizes",
    },
    {
      id: 2,
      title: "Security Systems",
      description:
        "Advanced security solutions including CCTV, access control, and attendance systems",
    },
    {
      id: 3,
      title: "Hardware Support",
      description:
        "Expert hardware installation, maintenance, and troubleshooting services",
    },
    {
      id: 4,
      title: "Software Solutions",
      description:
        "Custom software development and application solutions tailored to your business needs",
    },
    {
      id: 5,
      title: "Hire From Us",
      description:
        "Access our pool of skilled IT professionals for your project requirements",
    },
    {
      id: 6,
      title: "IT Consultancy",
      description:
        "Strategic IT consulting to optimize your technology infrastructure",
    },
  ];

  const services =
    JSON.parse(localStorage.getItem("services")) || defaultServices;

  const servicesContainer = document.querySelector("#services .row");
  if (servicesContainer) {
    // Get existing service items count
    const existingItems = servicesContainer.querySelectorAll(".col-lg-4");

    existingItems.forEach((item, index) => {
      const service = services[index] || defaultServices[index];
      if (service) {
        const titleEl = item.querySelector("h4");
        const descEl = item.querySelector("p");

        if (titleEl) titleEl.textContent = service.title;
        if (descEl) descEl.textContent = service.description;
      }
    });
  }
}

/**
 * Load and Update Core Values Section
 */
function loadCoreValuesData() {
  const iconMap = {
    0: "ri-award-line",
    1: "ri-lightbulb-flash-line",
    2: "ri-team-line",
    3: "ri-heart-pulse-line",
    4: "ri-shield-check-line",
    5: "ri-focus-3-line",
    6: "ri-recycle-line",
    7: "ri-hand-heart-line",
  };

  const defaultValues = [
    {
      id: 1,
      title: "Quality Service",
      description: "Believe in high quality and best customer service",
    },
    {
      id: 2,
      title: "Innovation",
      description: "Commitment to innovation and excellence",
    },
    {
      id: 3,
      title: "Team Spirit",
      description: "Positive team spirit for ensuring success",
    },
    {
      id: 4,
      title: "Passion",
      description: "Always passionate and determined",
    },
    {
      id: 5,
      title: "Reliability",
      description: "Work with reliability, loyalty, honesty",
    },
    {
      id: 6,
      title: "Efficiency",
      description: "Optimistic and efficient points of view",
    },
    {
      id: 7,
      title: "Sustainability",
      description: "Work with sustainable eco-friendly ways",
    },
    {
      id: 8,
      title: "Social Responsibility",
      description: "Commitment of doing good for society",
    },
  ];

  const coreValues =
    JSON.parse(localStorage.getItem("coreValues")) || defaultValues;

  const valuesContainer = document.querySelector("#core-values .row");
  if (valuesContainer) {
    const valueBoxes = valuesContainer.querySelectorAll(".col-lg-3");

    valueBoxes.forEach((box, index) => {
      const value = coreValues[index] || defaultValues[index];
      if (value) {
        const titleEl = box.querySelector("h4");
        const descEl = box.querySelector("p");
        const iconEl = box.querySelector(".icon i");

        if (titleEl) titleEl.textContent = value.title;
        if (descEl) descEl.textContent = value.description;
        if (iconEl) {
          iconEl.className = "ri-fw " + (iconMap[index] || "ri-star-line");
        }
      }
    });
  }
}

/**
 * Load and Update Clients Section
 */
function loadClientsData() {
  const clientsData = JSON.parse(localStorage.getItem("clientsData")) || {
    countriesServed: 10,
    totalClients: 100,
    projectsCompleted: 1000,
    techPartners: 15,
  };

  // Update statistics section
  const statItems = document.querySelectorAll("#statistics .stat-item");

  // Countries Served (index 2)
  if (statItems[2]) {
    const countEl = statItems[2].querySelector(".stat-number");
    if (countEl) countEl.textContent = clientsData.countriesServed + "+";
  }

  // Total Clients (index 3)
  if (statItems[3]) {
    const countEl = statItems[3].querySelector(".stat-number");
    if (countEl) countEl.textContent = clientsData.totalClients + "+";
  }

  // Projects Completed (index 4)
  if (statItems[4]) {
    const countEl = statItems[4].querySelector(".stat-number");
    if (countEl) countEl.textContent = clientsData.projectsCompleted + "+";
  }

  // Tech Partners (index 0)
  if (statItems[0]) {
    const countEl = statItems[0].querySelector(".stat-number");
    if (countEl) countEl.textContent = clientsData.techPartners + "+";
  }
}

/**
 * Load and Update Contact Section
 */
function loadContactData() {
  const defaultContact = {
    hqStreet: "3rd Floor, Motijheel Plaza, 193/C/1 Culvert Road, Fakirapool",
    hqArea: "",
    hqCity: "Dhaka-1000",
    hqZip: "1000",
    branchStreet: "222-223 Abdus Sattar Road",
    branchArea: "Anderkilla",
    branchCity: "Chattogram-4000",
    branchZip: "4000",
    phone: "+8801511379000",
    email: "info@leadingedge.net.bd",
    facebookUrl: "#",
    linkedinUrl: "#",
    latitude: "23.731972",
    longitude: "90.412662",
  };

  const contactData =
    JSON.parse(localStorage.getItem("contactData")) || defaultContact;

  // Update headquarters address
  const hqAddressEl = document.querySelector(".address p");
  if (hqAddressEl) {
    hqAddressEl.innerHTML = `${contactData.hqStreet}<br>${contactData.hqArea}<br>${contactData.hqCity}`;
  }

  // Update branch address - find the second address element
  const addressElements = document.querySelectorAll(".address p");
  if (addressElements[1]) {
    addressElements[1].innerHTML = `${contactData.branchStreet}<br>${contactData.branchArea}<br>${contactData.branchCity}`;
  }

  // Update phone
  const phoneEl = document.querySelector(".phone p");
  if (phoneEl) {
    phoneEl.textContent = contactData.phone;
  }

  // Update email
  const emailEl = document.querySelector(".email p a");
  if (emailEl) {
    emailEl.href = `mailto:${contactData.email}`;
    emailEl.textContent = contactData.email;
  }

  // Update map coordinates
  const mapIframe = document.querySelector(".map-container iframe");
  if (mapIframe) {
    const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2485.0964885383205!2d${contactData.longitude}!3d${contactData.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9e43e67167b%3A0x3817d4887a7e7842!2sLeading%20Edge%20Technology!5e0!3m2!1sen!2sbd!4v1748890711824!5m2!1sen!2sbd`;
    mapIframe.src = embedUrl;
  }
}

/**
 * Update Meta Tags
 */
function updateMetaTags() {
  const siteSettings = JSON.parse(localStorage.getItem("siteSettings")) || {};

  // Update title
  if (siteSettings.siteTitle) {
    document.title = siteSettings.siteTitle + " - Leading Edge Technology";
  }

  // Update meta description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && siteSettings.siteDescription) {
    descriptionMeta.setAttribute("content", siteSettings.siteDescription);
  }

  // Update meta keywords
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (keywordsMeta && siteSettings.siteKeywords) {
    keywordsMeta.setAttribute("content", siteSettings.siteKeywords);
  }
}

// Log data availability
console.log("✓ Admin data loader initialized");
console.log("Available data:", {
  heroData: localStorage.getItem("heroData") ? "✓" : "✗",
  aboutData: localStorage.getItem("aboutData") ? "✓" : "✗",
  services: localStorage.getItem("services") ? "✓" : "✗",
  coreValues: localStorage.getItem("coreValues") ? "✓" : "✗",
  clientsData: localStorage.getItem("clientsData") ? "✓" : "✗",
  contactData: localStorage.getItem("contactData") ? "✓" : "✗",
  siteSettings: localStorage.getItem("siteSettings") ? "✓" : "✗",
});
