/**
 * LifeOS — Authentication & Demo Session Management Module
 */

const LifeAuth = (() => {
  function init() {
    // Bind quick demo login button
    $(document).on("click", "#btn-quick-demo-login", function (e) {
      e.preventDefault();
      handleDemoLogin();
    });

    // Bind standard login form
    $(document).on("submit", "#form-login", function (e) {
      e.preventDefault();
      const email = $("#login-email").val().trim();
      const password = $("#login-password").val();
      const rememberMe = $("#login-remember").is(":checked");

      if (email === "demo@lifeos.app" && password === "Demo@123") {
        handleDemoLogin(rememberMe);
      } else {
        // Friendly SweetAlert2 error
        window.Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: "Use demo@lifeos.app with password Demo@123, or click 'Quick Demo Login'.",
          confirmButtonColor: "#635BFF"
        });
      }
    });

    // Password visibility toggle
    $(document).on("click", "#toggle-password-visibility", function () {
      const input = $("#login-password");
      const icon = $(this).find("i");
      if (input.attr("type") === "password") {
        input.attr("type", "text");
        icon.removeClass("bi-eye").addClass("bi-eye-slash");
      } else {
        input.attr("type", "password");
        icon.removeClass("bi-eye-slash").addClass("bi-eye");
      }
    });

    // Logout buttons
    $(document).on("click", ".btn-logout", function (e) {
      e.preventDefault();
      logout();
    });
  }

  function handleDemoLogin(remember = true) {
    const user = LifeStorage.get("user") || window.SEED_DATA.user;
    LifeStorage.setAuthSession(user);

    // Toast feedback
    if (window.Swal) {
      const Toast = window.Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true
      });
      Toast.fire({
        icon: "success",
        title: `Welcome back, ${user.name.split(" ")[0]}!`
      });
    }

    $("#auth-view").addClass("d-none");
    $("#app-shell").removeClass("d-none");

    // Initialize 3D ambient visual for dashboard
    if (window.LifeThreeScene) {
      setTimeout(() => {
        window.LifeThreeScene.initAmbientParticles("dashboard-three-canvas");
        window.LifeThreeScene.bind3DCardTilt(".life-card-3d");
      }, 200);
    }

    // Navigate to default or current page
    if (window.LifeApp) {
      window.LifeApp.navigateTo("dashboard");
    }
  }

  function logout() {
    window.Swal.fire({
      title: "Log out of LifeOS?",
      text: "Your demo data and preferences will remain safely stored locally.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#635BFF",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Log Out"
    }).then(result => {
      if (result.isConfirmed) {
        LifeStorage.clearAuthSession();
        $("#app-shell").addClass("d-none");
        $("#auth-view").removeClass("d-none");

        // Reinitialize login 3D visual
        if (window.LifeThreeScene) {
          setTimeout(() => {
            window.LifeThreeScene.initAmbientParticles("login-three-canvas");
          }, 100);
        }
      }
    });
  }

  function checkSession() {
    if (LifeStorage.isAuthenticated()) {
      $("#auth-view").addClass("d-none");
      $("#app-shell").removeClass("d-none");
      if (window.LifeThreeScene) {
        setTimeout(() => {
          window.LifeThreeScene.initAmbientParticles("dashboard-three-canvas");
          window.LifeThreeScene.bind3DCardTilt(".life-card-3d");
        }, 200);
      }
      return true;
    } else {
      $("#app-shell").addClass("d-none");
      $("#auth-view").removeClass("d-none");
      if (window.LifeThreeScene) {
        setTimeout(() => {
          window.LifeThreeScene.initAmbientParticles("login-three-canvas");
        }, 100);
      }
      return false;
    }
  }

  return {
    init,
    checkSession,
    handleDemoLogin,
    logout
  };
})();

if (typeof window !== "undefined") {
  window.LifeAuth = LifeAuth;
}
