/**
 * LifeOS — Settings & Preferences Module
 * Manages profile details, theme switcher, default currency, notification preferences, and demo reset.
 */

const LifeSettings = (() => {
  function init() {
    // Save profile form
    $(document).on("submit", "#form-settings-profile", function (e) {
      e.preventDefault();
      saveProfileSettings();
    });

    // Save preferences form
    $(document).on("submit", "#form-settings-preferences", function (e) {
      e.preventDefault();
      savePreferencesSettings();
    });

    // Theme toggle radio buttons in settings
    $(document).on("change", "input[name='settings-theme']", function () {
      const theme = $(this).val();
      applyTheme(theme);
    });

    // Reset demo data button
    $(document).on("click", "#btn-reset-demo-data", function () {
      window.Swal.fire({
        title: "সকল ডেমো ডেটা রিসেট করবেন?",
        text: "এটি সমস্ত অ্যাকাউন্ট, লেনদেন, অভ্যাস এবং টাস্ককে মূল অবস্থায় ফিরিয়ে আনবে। আপনার পরিবর্তনগুলো মুছে যাবে।",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#64748B",
        confirmButtonText: "হ্যাঁ, ডেটা রিসেট করুন",
        cancelButtonText: "বাতিল"
      }).then(res => {
        if (res.isConfirmed) {
          LifeStorage.resetDemoData();
          window.Swal.fire({
            icon: "success",
            title: "রিসেট সম্পন্ন",
            text: "ডেমো ডেটা পূর্বাবস্থায় ফিরিয়ে আনা হয়েছে।",
            timer: 1800,
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
        }
      });
    });

    // Global quick theme switch in header
    $(document).on("click", "#btn-toggle-theme", function () {
      const isDark = document.body.classList.contains("dark-mode");
      applyTheme(isDark ? "light" : "dark");
    });
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      $("#btn-toggle-theme i").removeClass("bi-moon-stars").addClass("bi-sun");
    } else {
      document.body.classList.remove("dark-mode");
      $("#btn-toggle-theme i").removeClass("bi-sun").addClass("bi-moon-stars");
    }

    const settings = LifeStorage.get("settings") || {};
    settings.theme = theme;
    LifeStorage.set("settings", settings, true);

    // Sync radio in settings if present
    $(`input[name='settings-theme'][value='${theme}']`).prop("checked", true);

    // Update Three.js and Chart.js themes
    if (window.LifeThreeScene) {
      window.LifeThreeScene.updateThemeColors();
    }
    if (window.LifeCharts) {
      window.LifeCharts.refreshAllCharts();
    }
  }

  function render() {
    const user = LifeStorage.get("user") || window.SEED_DATA.user;
    const settings = LifeStorage.get("settings") || window.SEED_DATA.settings;

    // Profile form
    $("#settings-name").val(user.name);
    $("#settings-email").val(user.email);
    $("#settings-role").val(user.role);
    $("#settings-location").val(user.location);
    $("#settings-bio").val(user.bio || "");

    // Preferences form
    $(`input[name='settings-theme'][value='${settings.theme || "light"}']`).prop("checked", true);
    $("#settings-currency").val(settings.currency || "BDT");
    $("#settings-date-format").val(settings.dateFormat || "DD MMM YYYY");
    $("#settings-first-day").val(settings.firstDayOfWeek || "Sunday");
    $("#settings-default-page").val(settings.defaultPage || "dashboard");
    $("#settings-privacy-default").prop("checked", !!settings.privacyMode);
    $("#settings-sound").prop("checked", settings.notificationSound !== false);
  }

  function saveProfileSettings() {
    const user = LifeStorage.get("user") || {};
    user.name = $("#settings-name").val().trim();
    user.email = $("#settings-email").val().trim();
    user.role = $("#settings-role").val().trim();
    user.location = $("#settings-location").val().trim();
    user.bio = $("#settings-bio").val().trim();

    LifeStorage.set("user", user);

    // Update user name in top nav and welcome banner
    $(".user-display-name").text(user.name);
    $(".user-display-email").text(user.email);

    window.Swal.fire({
      icon: "success",
      title: "প্রোফাইল সংরক্ষিত হয়েছে",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  function savePreferencesSettings() {
    const settings = LifeStorage.get("settings") || {};
    const theme = $("input[name='settings-theme']:checked").val() || "light";
    settings.theme = theme;
    settings.currency = $("#settings-currency").val();
    settings.currencySymbol = settings.currency === "BDT" ? "৳" : settings.currency === "USD" ? "$" : "€";
    settings.dateFormat = $("#settings-date-format").val();
    settings.firstDayOfWeek = $("#settings-first-day").val();
    settings.defaultPage = $("#settings-default-page").val();
    settings.privacyMode = $("#settings-privacy-default").is(":checked");
    settings.notificationSound = $("#settings-sound").is(":checked");

    LifeStorage.set("settings", settings);
    applyTheme(theme);

    window.Swal.fire({
      icon: "success",
      title: "পছন্দসমূহ সংরক্ষিত হয়েছে",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end"
    });
  }

  return {
    init,
    render,
    applyTheme
  };
})();

if (typeof window !== "undefined") {
  window.LifeSettings = LifeSettings;
}
