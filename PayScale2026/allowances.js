(function (global) {
  /**
   * Allowance rules — Service (Pay and Allowances) Order, 2026 + health sector (SR Staff Nurse).
   * House rent: percentage × ২০১৫ স্কেলের মূল (৩০ জুন ২০২৬ পর্যন্ত), নতুন ২০২৬ ধাপের মূলে নয়।
   */
  const PROFILES = {
    civil: {
      id: "civil",
      label: "সাধারণ civil (গেজেট)",
      defaultGrade: 11,
    },
    seniorStaffNurse: {
      id: "seniorStaffNurse",
      label: "Senior Staff Nurse (১০ম গ্রেড)",
      defaultGrade: 10,
      fixedGrade: 10,
    },
  };

  /** Dhaka N/S CC: 40% (gr 1) → 60% (gr 20) — Financial Express / gazette summary */
  function houseRentPercentDhaka(grade) {
    const g = Math.max(1, Math.min(20, grade));
    return 0.4 + ((g - 1) / 19) * 0.2;
  }

  function houseRentPercentDivision(grade) {
    const g = Math.max(1, Math.min(20, grade));
    return 0.3 + ((g - 1) / 19) * 0.2;
  }

  function houseRentPercentOther(grade) {
    const g = Math.max(1, Math.min(20, grade));
    return 0.25 + ((g - 1) / 19) * 0.2;
  }

  function houseRentRate(grade, areaTier) {
    if (areaTier === "dhaka") return houseRentPercentDhaka(grade);
    if (areaTier === "division") return houseRentPercentDivision(grade);
    return houseRentPercentOther(grade);
  }

  function computePayPackage(basic, grade, opts) {
    const o = opts || {};
    const profile = o.profile || "civil";
    const g = profile === "seniorStaffNurse" ? 10 : grade;
    const area = o.areaTier || "dhaka";
    const payBasic = basic;
    const hrBasic =
      o.houseRentBasic != null && o.houseRentBasic > 0 ? o.houseRentBasic : payBasic;

    const medical = o.ageOver50 ? 4000 : 3000;
    const dholai = o.dholaiMonthly != null ? o.dholaiMonthly : 300;

    let poshak = 0;
    if (profile === "seniorStaffNurse") {
      poshak = o.poshakMonthly != null ? o.poshakMonthly : 550;
    }

    const hrRate = houseRentRate(g, area);
    const houseRent = Math.round(hrBasic * hrRate);

    let mobile = 0;
    if (g <= 5) mobile = 500;
    else if (g <= 20) mobile = 150;

    const tiffin = g >= 11 && g <= 20 ? 500 : 0;
    const transport = g >= 11 && g <= 20 ? 600 : 0;
    const children = Math.min(2, Math.max(0, parseInt(o.children, 10) || 0));
    const education = children * 500;

    const pohelaBoishakh = Math.round(payBasic * 0.15);

    const coreAllowances =
      houseRent + medical + dholai + poshak + mobile + tiffin + transport + education;
    const grossMonthly = payBasic + coreAllowances;
    const grossWithFestivalMonthly = grossMonthly + Math.round(pohelaBoishakh / 12);

    return {
      profile,
      grade: g,
      basic: payBasic,
      houseRentBasic: hrBasic,
      houseRent,
      houseRentRate: hrRate,
      medical,
      dholai,
      poshak,
      mobile,
      tiffin,
      transport,
      education,
      pohelaBoishakh,
      coreAllowances,
      grossMonthly,
      grossWithFestivalMonthly,
      lines: [
        { key: "basic", label: "মূল বেতন (ধাপ)", amount: payBasic, core: true },
        {
          key: "houseRent",
          label:
            hrBasic !== payBasic
              ? `বাড়ি ভাড়া (${Math.round(hrRate * 100)}% × ২০১৫ মূল)`
              : "বাড়ি ভাড়া ভাতা",
          amount: houseRent,
          core: true,
        },
        { key: "medical", label: "চিকিৎসা ভাতা", amount: medical, core: true },
        { key: "poshak", label: "পোশাক ভাতা", amount: poshak, core: true, nurse: true },
        { key: "dholai", label: "ধোলাই ভাতা", amount: dholai, core: true },
        { key: "mobile", label: "মোবাইল ভাতা", amount: mobile, core: false },
        { key: "tiffin", label: "টিফিন ভাতা", amount: tiffin, core: false },
        { key: "transport", label: "যাতায়াত ভাতা", amount: transport, core: false },
        { key: "education", label: "শিক্ষা সহায়ক", amount: education, core: false },
      ].filter((l) => l.amount > 0 || l.key === "basic"),
      note:
        profile === "seniorStaffNurse"
          ? "বাড়ি ভাড়া = ২০১৫ স্কেলের মূল (৩০ জুন ২০২৬) × অঞ্চলভিত্তিক % — নতুন ধাপের মূলে HR নয়। পোশাক/ধোলাই iBAS++ যাচাই করুন।"
          : "বাড়ি ভাড়া ২০১৫ মূল ভিত্তিক (৩০ জুন ২০২৬)। ১/১/২০২৮ থেকে গেজেটে নতুন HR কাঠামো — এখানে অনুমান নয়।",
    };
  }

  global.PayAllowances = {
    PROFILES,
    computePayPackage,
    houseRentRate,
  };
})(typeof window !== "undefined" ? window : globalThis);
