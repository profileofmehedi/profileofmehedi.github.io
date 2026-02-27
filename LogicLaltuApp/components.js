/* components.js */
$(document).ready(function () {
  // --- 1. Navbar Render ---
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container">
            <a class="navbar-brand" href="index.html">📙 Logic Laltu</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="index.html">হোম (Home)</a></li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">.NET এর রোজনামচা</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="dotnet-basics.html">1. .NET Ecosystem</a></li>
                            <li><a class="dropdown-item" href="csharp-oop.html">2. OOP & C#</a></li>
                            <li><a class="dropdown-item" href="linq-magic.html">3. LINQ Magic</a></li>
                            <li><a class="dropdown-item" href="async-await.html">4. Async/Await</a></li>
                            <li><a class="dropdown-item" href="dependency-injection.html">5. Dependency Injection</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">সিস্টেম ডিজাইন</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="sql-vs-oracle.html">SQL vs Databases</a></li>
                            <li><a class="dropdown-item" href="system-design.html">Scalability & Caching</a></li>
                            <li><a class="dropdown-item" href="git-github.html">Git Time Machine</a></li>
                        </ul>
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
            <p class="mb-0">© 2025 Logic Laltu's Diary | শেখো বাংলায়, গড়ো দুনিয়া।</p>
            <small class="text-muted">Developed with ❤️ and ☕</small>
        </div>
    </footer>
    `;

  // Inject Navbar & Footer
  $("#navbar-placeholder").html(navbarHTML);
  $("#footer-placeholder").html(footerHTML);

  // Active Link Highlighter
  var path = window.location.pathname.split("/").pop();
  if (path == "") path = "index.html";
  $(".nav-link").each(function () {
    var href = $(this).attr("href");
    if (path === href) {
      $(this).addClass("active");
    }
  });

  // --- 3. Scroll to Top Button (Rocket) ---
  $("body").append('<button id="scrollTopBtn" title="উপরে যান">🚀</button>');

  // CSS for the button (Applied via JS for easy setup)
  $("#scrollTopBtn").css({
    display: "none",
    position: "fixed",
    bottom: "30px",
    right: "30px",
    "z-index": "999",
    border: "none",
    outline: "none",
    "background-color": "#e67e22",
    color: "white",
    cursor: "pointer",
    padding: "15px",
    "border-radius": "50%",
    "font-size": "20px",
    "box-shadow": "0 4px 10px rgba(0,0,0,0.3)",
    transition: "background-color 0.3s",
  });

  // Show/Hide on Scroll
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $("#scrollTopBtn").fadeIn();
    } else {
      $("#scrollTopBtn").fadeOut();
    }
  });

  // Click Action
  $("#scrollTopBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 100);
    return false;
  });

  // --- 4. Copy Code Button Logic ---
  $("pre").each(function () {
    // Create Button
    var $btn = $(
      '<button class="btn btn-sm btn-dark" style="position: absolute; right: 10px; top: 10px; opacity: 0.8;">কপি মারেন 📋</button>',
    );

    // Make parent relative
    $(this).css("position", "relative");
    $(this).append($btn);

    // Click Event
    $btn.click(function () {
      // Get text excluding the button text itself
      var codeText = $(this)
        .parent()
        .text()
        .replace("কপি মারেন 📋", "")
        .replace("কপি হইছে! ✅", "");

      navigator.clipboard.writeText(codeText.trim()).then(
        function () {
          $btn.text("কপি হইছে! ✅");
          $btn.removeClass("btn-dark").addClass("btn-success");

          setTimeout(function () {
            $btn.text("কপি মারেন 📋");
            $btn.removeClass("btn-success").addClass("btn-dark");
          }, 2000);
        },
        function (err) {
          console.error("Could not copy text: ", err);
        },
      );
    });
  });

  // --- 5. Quiz Logic Handler ---
  // This works for any page with a quiz button class 'check-quiz-btn'
  $(".check-quiz-btn").click(function () {
    // Find the parent container of the clicked button
    var $quizContainer = $(this).closest(".card");

    // Find the selected radio button inside this container
    var selected = $quizContainer.find('input[type="radio"]:checked').val();
    var $resultText = $quizContainer.find(".quiz-result");

    if (!selected) {
      $resultText
        .text("আরে মামা! একটা অপশন তো সিলেক্ট করবি! 🤔")
        .css("color", "#d35400");
    } else if (selected === "correct") {
      $resultText
        .text("সাবাস ওস্তাদ! একদম সঠিক উত্তর। লাল্টু খুশি হয়েছে। 🎉")
        .css("color", "green");
      // Disable inputs after correct answer
      $quizContainer.find("input").prop("disabled", true);
      $(this).prop("disabled", true).text("লক করা হয়েছে");
    } else {
      $resultText
        .text("হইলো না মামা! আবার চেষ্টা কর। লজিক খাটা! 😅")
        .css("color", "red");
    }
  });
});
