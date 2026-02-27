/* components.js - Full Updated Code */
$(document).ready(function () {
  // --- 1. Navbar Render (Updated with new links) ---
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container">
            <a class="navbar-brand" href="index.html">📙 Logic Laltu</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item"><a class="nav-link" href="index.html">হোম</a></li>
                    
                    <!-- Basic Section -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">বেসিক .NET</a>
                        <ul class="dropdown-menu border-0 shadow">
                            <li><a class="dropdown-item" href="dotnet-basics.html">1. .NET Ecosystem</a></li>
                            <li><a class="dropdown-item" href="csharp-oop.html">2. OOP & C#</a></li>
                            <li><a class="dropdown-item" href="linq-magic.html">3. LINQ Magic</a></li>
                            <li><a class="dropdown-item" href="async-await.html">4. Async/Await</a></li>
                            <li><a class="dropdown-item" href="dependency-injection.html">5. Dependency Injection</a></li>
                        </ul>
                    </li>

                    <!-- Advanced Section (New) -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">অ্যাডভান্সড</a>
                        <ul class="dropdown-menu border-0 shadow">
                            <li><a class="dropdown-item" href="web-api.html">6. Web API (New)</a></li>
                            <li><a class="dropdown-item" href="sql-vs-oracle.html">7. Databases</a></li>
                            <li><a class="dropdown-item" href="system-design.html">8. System Design</a></li>
                            <li><a class="dropdown-item" href="docker-kubernetes.html">9. Docker & K8s (New)</a></li>
                            <li><a class="dropdown-item" href="git-github.html">10. Git & GitHub</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item fw-bold text-primary" href="interview-prep.html">🔥 ভাইভা বোর্ড</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link btn btn-sm btn-outline-success text-success px-3 ms-2" href="certificate.html" style="border-radius: 20px;">🎓 সনদপত্র</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

  // --- 2. Footer Render ---
  const footerHTML = `
    <footer>
        <div class="container">
            <h5 style="color: var(--primary-color)">📙 লজিক লাল্টুর ডায়েরি</h5>
            <p class="mb-0 text-muted">শেখো বাংলায়, গড়ো দুনিয়া। কপিরাইট © ২০২৫</p>
        </div>
    </footer>
    `;

  $("#navbar-placeholder").html(navbarHTML);
  $("#footer-placeholder").html(footerHTML);

  // Active Link Highlight logic
  var path = window.location.pathname.split("/").pop();
  if (path == "") path = "index.html";
  $(".nav-link").each(function () {
    if ($(this).attr("href") === path) $(this).addClass("active");
  });
  $(".dropdown-item").each(function () {
    if ($(this).attr("href") === path) $(this).addClass("active");
  });

  // --- 3. Scroll to Top Rocket ---
  $("body").append('<button id="scrollTopBtn" title="উপরে যান">🚀</button>');
  $("#scrollTopBtn").css({
    display: "none",
    position: "fixed",
    bottom: "30px",
    right: "30px",
    "z-index": "999",
    border: "none",
    "background-color": "#008080",
    color: "white",
    cursor: "pointer",
    padding: "15px",
    "border-radius": "50%",
    "font-size": "22px",
    "box-shadow": "0 5px 15px rgba(0,0,0,0.2)",
  });

  $(window).scroll(function () {
    $(this).scrollTop() > 300
      ? $("#scrollTopBtn").fadeIn()
      : $("#scrollTopBtn").fadeOut();
  });
  $("#scrollTopBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 100);
    return false;
  });

  // --- 4. Copy Code & Quiz Logic ---
  $("pre").each(function () {
    var $btn = $(
      '<button class="btn btn-sm btn-light border" style="position: absolute; right: 10px; top: 10px; color: #333;">Copy</button>',
    );
    $(this).css("position", "relative").append($btn);
    $btn.click(function () {
      var code = $(this).parent().text().replace("Copy", "");
      navigator.clipboard.writeText(code);
      $(this).text("Copied!").removeClass("btn-light").addClass("btn-success");
      setTimeout(
        () =>
          $(this).text("Copy").removeClass("btn-success").addClass("btn-light"),
        2000,
      );
    });
  });

  $(".check-quiz-btn").click(function () {
    var $card = $(this).closest(".card");
    var val = $card.find("input:checked").val();
    var $res = $card.find(".quiz-result");
    if (!val) $res.text("অপশন সিলেক্ট কর মামা!").css("color", "orange");
    else if (val === "correct")
      $res.text("ফাটিয়ে দিছোস! সঠিক উত্তর। 🎉").css("color", "green");
    else $res.text("ভুল উত্তর! আবার পড়। 😐").css("color", "red");
  });
});
