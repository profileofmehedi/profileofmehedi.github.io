// Shared Data Management & Utilities

const defaultData = {
  heroTitle: "Digital experiences that inspire.",
  heroSubtitle:
    "We craft world-class brands and digital products for forward-thinking companies.",
  aboutTitle: "Designing the future of brands.",
  aboutDesc:
    "We are a team of passionate designers and developers who believe in the power of good design to transform businesses.",
  contactPhone: "+1 (800) 555-0123",
  contactEmail: "hello@aurastudio.com",
  contactLocation: "San Francisco, CA",
  portfolio: [
    {
      title: "Neo Bank App",
      category: "Fintech",
      icon: "fa-wallet",
      color: "#6366f1",
    },
    {
      title: "Lumina Brand",
      category: "Branding",
      icon: "fa-lightbulb",
      color: "#ec4899",
    },
    {
      title: "Eco Store",
      category: "E-commerce",
      icon: "fa-leaf",
      color: "#10b981",
    },
    {
      title: "Travel UI Kit",
      category: "UI Design",
      icon: "fa-plane",
      color: "#f59e0b",
    },
    {
      title: "Tech Dashboard",
      category: "SaaS",
      icon: "fa-chart-pie",
      color: "#3b82f6",
    },
    {
      title: "Modern Realty",
      category: "Web Design",
      icon: "fa-building",
      color: "#8b5cf6",
    },
  ],
  services: [
    {
      title: "UI/UX Design",
      desc: "User-centric interfaces that are beautiful and functional.",
      icon: "fa-layer-group",
    },
    {
      title: "Brand Identity",
      desc: "Memorable logos and visual systems that stand out.",
      icon: "fa-fingerprint",
    },
    {
      title: "Web Development",
      desc: "Fast, responsive, and SEO-optimized websites.",
      icon: "fa-code",
    },
    {
      title: "Digital Marketing",
      desc: "Strategies to grow your audience and conversion.",
      icon: "fa-bullhorn",
    },
    {
      title: "Motion Graphics",
      desc: "Engaging animations that bring stories to life.",
      icon: "fa-film",
    },
    {
      title: "Consultancy",
      desc: "Expert advice on product strategy and design.",
      icon: "fa-comments",
    },
  ],
  skills: [
    { name: "Product Design", percentage: 95 },
    { name: "Brand Strategy", percentage: 90 },
    { name: "Web Development", percentage: 85 },
    { name: "Motion Design", percentage: 80 },
  ],
  process: [
    {
      step: "01",
      title: "Discover",
      desc: "We dive deep into your business goals.",
    },
    { step: "02", title: "Strategy", desc: "Planning the roadmap to success." },
    { step: "03", title: "Design", desc: "Crafting the visual experience." },
    { step: "04", title: "Launch", desc: "Bringing the product to the world." },
  ],
  testimonials: [
    {
      text: "Aura Studio completely transformed our digital presence. The attention to detail is unmatched.",
      author: "Alex Rivera",
      role: "CEO, TechFlow",
    },
    {
      text: "The best design team we've ever worked with. They just 'get' it.",
      author: "Sarah Chen",
      role: "Founder, Bloom",
    },
    {
      text: "Incredible workflow and stunning results. Highly recommended.",
      author: "Mike Ross",
      role: "Director, Apex",
    },
  ],
  blog: [
    {
      title: "The Future of UI Design",
      category: "Trends",
      image: "fa-eye",
      date: "Oct 24, 2024",
      author: "Team",
    },
    {
      title: "Building Accessible Web Apps",
      category: "Code",
      image: "fa-universal-access",
      date: "Oct 15, 2024",
      author: "Dev",
    },
    {
      title: "Color Theory in 2025",
      category: "Design",
      image: "fa-palette",
      date: "Oct 02, 2024",
      author: "Art Dir",
    },
  ],
  faq: [
    {
      question: "What is your typical timeline?",
      answer: "Projects usually range from 4-8 weeks depending on complexity.",
    },
    {
      question: "Do you offer maintenance?",
      answer: "Yes, we have monthly support packages available.",
    },
    {
      question: "What is your pricing model?",
      answer: "We offer both project-based and retainer pricing models.",
    },
  ],
};

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem("portfolioData");
  return savedData ? JSON.parse(savedData) : defaultData;
}

// Save data to localStorage
function saveData(data) {
  localStorage.setItem("portfolioData", JSON.stringify(data));
}

// Show alert notification
function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "20px";
  alertDiv.style.right = "20px";
  alertDiv.style.zIndex = "9999";
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

// Get data from localStorage
let portfolioData = loadData();
