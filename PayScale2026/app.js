(function () {
  const { SCALES_2015, formatBDT, formatNum, isOnScale } = PayScaleData;
  const { fullReport, suggestGradeFromBasic, exportSummaryText } = PayScaleCalc;

  const STORAGE_KEY = "payscale2026_form";
  const TAB_ORDER = ["summary", "chart", "ledger", "compare", "allowances"];
  let activeTab = "summary";
  let lastReport = null;
  let debounceTimer = null;
  let saveTimer = null;
  let kpiReady = false;
  let resultsReady = false;
  let lastHeroGross = 0;
  let lastRenderedTab = null;
  const RESULT_REVEAL_MS = 1000;
  const RESULT_CONTENT_DELAY_MS = 520;
  let resultsGateOpen = false;
  let pendingCalcAfterReveal = false;
  let tabAnimating = false;
  const kpiLast = { fixed: 0, gross: 0, pay: 0, arrearB: 0, arrearG: 0 };

  const MONTHS_BN = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const els = {
    grade: document.getElementById("grade"),
    basic: document.getElementById("basic"),
    stepSelect: document.getElementById("step-select"),
    stepHint: document.getElementById("step-hint"),
    form: document.getElementById("calc-form"),
    results: document.getElementById("results"),
    resultMeta: document.getElementById("result-meta"),
    arrearYear: document.getElementById("arrear-year"),
    arrearMonth: document.getElementById("arrear-month"),
    joining: document.getElementById("joining-date"),
    asofYear: document.getElementById("asof-year"),
    asofMonth: document.getElementById("asof-month"),
    areaTier: document.getElementById("area-tier"),
    children: document.getElementById("children"),
    ageOver50: document.getElementById("age-over-50"),
    designation: document.getElementById("designation"),
    designationWrap: document.getElementById("designation-wrap"),
    profile: document.getElementById("profile"),
    poshak: document.getElementById("poshak"),
    dholai: document.getElementById("dholai"),
    toolbar: document.getElementById("result-toolbar"),
    kpiStrip: document.getElementById("kpi-strip"),
    liveStatus: document.getElementById("live-status"),
    resultPanel: document.getElementById("result-panel"),
  };

  const EMPTY_RESULTS = els.results.innerHTML;

  function formatMonthLabel(y, m) {
    return `${MONTHS_BN[m - 1]} ${y}`;
  }

  function fillYearMonthSelects(yearSelect, monthSelect, defaultYear, defaultMonth) {
    yearSelect.innerHTML = "";
    for (let y = 2026; y <= 2028; y++) {
      const o = document.createElement("option");
      o.value = String(y);
      o.textContent = String(y);
      yearSelect.appendChild(o);
    }
    yearSelect.value = String(defaultYear);
    monthSelect.innerHTML = "";
    MONTHS_BN.forEach((name, i) => {
      const o = document.createElement("option");
      o.value = String(i + 1);
      o.textContent = name;
      monthSelect.appendChild(o);
    });
    monthSelect.value = String(defaultMonth);
  }

  function applyProfileLock() {
    const isNurse = els.profile.value === "seniorStaffNurse";
    els.grade.disabled = isNurse;
    if (isNurse) {
      els.grade.value = "10";
      refreshSteps();
      toggleDesignation();
    }
  }

  function initGrades() {
    for (let g = 1; g <= 20; g++) {
      const opt = document.createElement("option");
      const steps = SCALES_2015[g];
      opt.value = String(g);
      opt.textContent = `গ্রেড ${g} — ${formatNum(steps[0])}–${formatNum(steps[steps.length - 1])}`;
      els.grade.appendChild(opt);
    }
    els.grade.value = "10";
    applyProfileLock();
    refreshSteps();
    toggleDesignation();
  }

  function toggleDesignation() {
    const g = parseInt(els.grade.value, 10);
    els.designationWrap.hidden = g !== 1;
  }

  function refreshSteps() {
    const g = parseInt(els.grade.value, 10);
    const steps = SCALES_2015[g];
    els.stepSelect.innerHTML = '<option value="">— ধাপ নির্বাচন —</option>';
    steps.forEach((s, i) => {
      const o = document.createElement("option");
      o.value = String(s);
      o.textContent = `ধাপ ${i + 1}: ${formatNum(s)}`;
      els.stepSelect.appendChild(o);
    });
    const sel = parseInt(els.basic.value, 10);
    if (sel && steps.includes(sel)) els.stepSelect.value = String(sel);
    els.stepHint.textContent = `${steps.length} ধাপ · গ্রেড ${g}`;
    els.stepHint.classList.remove("warn");
  }

  function getOptions() {
    return {
      asOfYear: parseInt(els.asofYear.value, 10),
      asOfMonth: parseInt(els.asofMonth.value, 10),
      areaTier: els.areaTier.value,
      children: parseInt(els.children.value, 10) || 0,
      ageOver50: els.ageOver50.checked,
      designation: els.designation.value || "",
      profile: els.profile.value || "seniorStaffNurse",
      poshakMonthly: parseInt(els.poshak.value, 10) || 0,
      dholaiMonthly: parseInt(els.dholai.value, 10) || 0,
    };
  }

  function readForm() {
    return {
      grade: parseInt(els.grade.value, 10),
      basic: parseInt(els.basic.value, 10),
      joining: els.joining.value || "",
      arrearY: parseInt(els.arrearYear.value, 10),
      arrearM: parseInt(els.arrearMonth.value, 10),
      options: getOptions(),
    };
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          savedAt: new Date().toISOString(),
          grade: els.grade.value,
          basic: els.basic.value,
          stepSelect: els.stepSelect.value,
          joining: els.joining.value,
          arrearYear: els.arrearYear.value,
          arrearMonth: els.arrearMonth.value,
          asofYear: els.asofYear.value,
          asofMonth: els.asofMonth.value,
          areaTier: els.areaTier.value,
          children: els.children.value,
          ageOver50: els.ageOver50.checked,
          designation: els.designation.value,
          profile: els.profile.value,
          poshak: els.poshak.value,
          dholai: els.dholai.value,
          activeTab,
        })
      );
    } catch (_) {
      /* ignore */
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.grade) els.grade.value = s.grade;
      if (s.basic != null) els.basic.value = s.basic;
      if (s.stepSelect != null) els.stepSelect.value = s.stepSelect;
      if (s.joining != null) els.joining.value = s.joining;
      if (s.arrearYear) els.arrearYear.value = s.arrearYear;
      if (s.arrearMonth) els.arrearMonth.value = s.arrearMonth;
      if (s.asofYear) els.asofYear.value = s.asofYear;
      if (s.asofMonth) els.asofMonth.value = s.asofMonth;
      if (s.areaTier) els.areaTier.value = s.areaTier;
      if (s.children != null) els.children.value = s.children;
      if (s.ageOver50 != null) els.ageOver50.checked = !!s.ageOver50;
      if (s.designation) els.designation.value = s.designation;
      if (s.profile) els.profile.value = s.profile;
      if (s.poshak != null) els.poshak.value = s.poshak;
      if (s.dholai != null) els.dholai.value = s.dholai;
      if (s.activeTab) activeTab = s.activeTab;
      applyProfileLock();
      toggleDesignation();
      refreshSteps();
    } catch (_) {
      /* ignore */
    }
  }

  function validateBasic(grade, basic, fixationMode) {
    if (fixationMode === "newJoiner2026") return null;
    const steps = SCALES_2015[grade];
    if (basic < steps[0] || basic > steps[steps.length - 1]) {
      return `বেতন সীমার বাইরে (${formatNum(steps[0])}–${formatNum(steps[steps.length - 1])})`;
    }
    if (!isOnScale(steps, basic)) {
      return "স্কেলের কোনো ধাপে নেই — ফলাফল অনুমান";
    }
    return null;
  }

  function renderKpi(report) {
    const { fix, arrear, payAsOf, asOf, allowances, monthLedger } = report;
    const gross = allowances ? allowances.grossMonthly : payAsOf;
    const grossArrear = monthLedger ? monthLedger.cumulativeGross : 0;
    const arrearB = arrear ? arrear.totalArrear : 0;
    els.kpiStrip.hidden = false;

    if (!kpiReady) {
      els.kpiStrip.innerHTML = `
      <div class="kpi"><span>মূল (১০০%)</span><strong data-kpi="fixed">—</strong></div>
      <div class="kpi kpi-accent"><span>গ্রস / মাস</span><strong data-kpi="gross">—</strong></div>
      <div class="kpi"><span data-kpi-label="pay">${formatMonthLabel(asOf.year, asOf.month)} মূল</span><strong data-kpi="pay">—</strong></div>
      <div class="kpi"><span>বকেয়া মূল</span><strong data-kpi="arrearB">—</strong></div>
      <div class="kpi"><span>বকেয়া গ্রস</span><strong data-kpi="arrearG">—</strong></div>`;
      kpiReady = true;
    }

    const payLabel = els.kpiStrip.querySelector("[data-kpi-label='pay']");
    if (payLabel) payLabel.textContent = `${formatMonthLabel(asOf.year, asOf.month)} মূল`;

    setKpiValue("fixed", fix.fixedBasic, true);
    setKpiValue("gross", gross, true);
    setKpiValue("pay", payAsOf, true);
    setKpiValue("arrearB", arrearB, true);
    setKpiValue("arrearG", grossArrear, true);
  }

  function setKpiValue(key, to, smooth) {
    const node = els.kpiStrip.querySelector(`[data-kpi="${key}"]`);
    if (!node) return;
    const from = kpiLast[key] || 0;
    kpiLast[key] = to;
    if (to === 0 && (key === "arrearB" || key === "arrearG")) {
      stopAnimate(node);
      node.textContent = "—";
      return;
    }
    if (!smooth || from === to) {
      stopAnimate(node);
      node.textContent = formatKpiAmount(to);
      return;
    }
    animateNumber(node, from, to, 380, formatKpiAmount);
  }

  function stopAnimate(el) {
    if (el._animCancel) {
      el._animCancel();
      el._animCancel = null;
    }
  }

  function formatKpiAmount(n) {
    return `${formatNum(n)} ৳`;
  }

  function animateNumber(el, from, to, duration, formatFn) {
    const fmt = formatFn || formatBDT;
    stopAnimate(el);
    if (to === 0 && el.textContent === "—") return;
    if (from === to) {
      el.textContent = fmt(to);
      return;
    }
    const start = performance.now();
    let cancelled = false;
    el._animCancel = () => {
      cancelled = true;
    };
    const tick = (now) => {
      if (cancelled) return;
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = fmt(val);
      if (p < 1) requestAnimationFrame(tick);
      else {
        el._animCancel = null;
        el.classList.remove("value-pulse");
      }
    };
    el.classList.add("value-pulse");
    requestAnimationFrame(tick);
  }

  function ensureResultsPanel() {
    let panel = document.getElementById("tab-panel");
    if (!panel) {
      els.results.innerHTML = '<div id="tab-panel" class="tab-panel"></div>';
      panel = document.getElementById("tab-panel");
      resultsReady = true;
    }
    return panel;
  }

  function moveTabGlider() {
    const glider = document.getElementById("tab-glider");
    const active = document.querySelector("#result-tabs .tab.active");
    const shell = document.querySelector(".tabs-shell");
    if (!glider || !active || !shell || els.toolbar.hidden) return;
    const shellRect = shell.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    glider.style.width = `${rect.width}px`;
    glider.style.transform = `translate3d(${rect.left - shellRect.left}px, 0, 0)`;
    glider.style.opacity = "1";
  }

  function markRevealItems(panel, enabled) {
    if (!panel) return;
    panel.querySelectorAll(".reveal-item").forEach((el) => el.classList.remove("reveal-item"));
    if (!enabled) return;
    const nodes = panel.querySelectorAll(
      ".stat-hero, .section-title, .allow-row, .phase-item, .stat-card, .bar-row, .ledger-card, .note-box, .info-banner, .compare-progress, .scale-columns"
    );
    nodes.forEach((el, i) => {
      el.classList.add("reveal-item");
      el.style.setProperty("--reveal-i", Math.min(i, 14));
    });
  }

  function afterTabContent(report, animateEnter) {
    const panel = document.getElementById("tab-panel");
    markRevealItems(panel, animateEnter);
    if (activeTab === "summary") {
      animateHeroGross(report.allowances.grossMonthly, animateEnter);
    }
    if (activeTab === "chart") afterRenderChart(animateEnter);
  }

  function applyPanelContent(report, mode) {
    const panel = ensureResultsPanel();
    panel.classList.remove(
      "tab-panel--enter",
      "tab-panel--update",
      "tab-panel--soft",
      "slide-out-left",
      "slide-out-right",
      "slide-in-left",
      "slide-in-right"
    );
    if (mode === "enter") panel.classList.add("tab-panel--enter");
    else if (mode === "soft") panel.classList.add("tab-panel--soft");
    else if (mode === "update") panel.classList.add("tab-panel--update");
    panel.innerHTML = renderActiveTab(report);
    afterTabContent(report, mode === "enter" || mode === "soft");
    return panel;
  }

  function resetTabAnimClasses(panel) {
    if (!panel) return;
    panel.classList.remove(
      "slide-out-left",
      "slide-out-right",
      "slide-in-left",
      "slide-in-right"
    );
    tabAnimating = false;
  }

  function transitionTabPanel(report, direction) {
    if (tabAnimating) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyPanelContent(report, "soft");
      moveTabGlider();
      return;
    }

    const panel = ensureResultsPanel();
    tabAnimating = true;
    const outClass = direction > 0 ? "slide-out-left" : "slide-out-right";
    const inClass = direction > 0 ? "slide-in-right" : "slide-in-left";
    const safety = window.setTimeout(() => {
      if (!tabAnimating) return;
      panel.removeEventListener("animationend", onOut);
      panel.classList.remove(outClass, inClass);
      panel.innerHTML = renderActiveTab(report);
      panel.classList.add("tab-panel--soft");
      afterTabContent(report, true);
      tabAnimating = false;
    }, 850);

    panel.classList.remove("tab-panel--enter", "tab-panel--update", "slide-in-left", "slide-in-right");
    panel.classList.add(outClass);

    const finishIn = () => {
      window.clearTimeout(safety);
      panel.classList.remove(inClass);
      tabAnimating = false;
    };

    const onOut = (ev) => {
      if (ev.target !== panel) return;
      panel.removeEventListener("animationend", onOut);
      panel.classList.remove(outClass);
      panel.innerHTML = renderActiveTab(report);
      panel.classList.add("tab-panel--enter", inClass);
      afterTabContent(report, true);
      panel.addEventListener(
        "animationend",
        (ev2) => {
          if (ev2.target !== panel) return;
          finishIn();
        },
        { once: true }
      );
    };
    panel.addEventListener("animationend", onOut);
  }

  function animateHeroGross(to, animateEnter) {
    const hero = document.getElementById("hero-value");
    if (!hero) return;
    const from = animateEnter ? 0 : lastHeroGross;
    lastHeroGross = to;
    animateNumber(hero, from, to, animateEnter ? 720 : 400);
  }

  function renderSummary(report) {
    const { fix, phases, rates, arrear, increment, payAsOf, asOf, allowances, monthLedger } =
      report;
    const warn = validateBasic(fix.grade, fix.basicOnJune30, fix.fixationMode);
    const a = allowances;

    const payslipLines = (a.lines || [])
      .filter((l) => l.amount > 0 || l.key === "basic")
      .map(
        (l) =>
          `<div class="allow-row"><span>${l.label}</span><strong>${formatBDT(l.amount)}</strong></div>`
      )
      .join("");

    let arrearBlock = "";
    if (arrear && arrear.segments.length) {
      const startLabel = formatMonthLabel(arrear.arrearStart.year, arrear.arrearStart.month);
      const grossArrear = monthLedger ? monthLedger.cumulativeGross : 0;
      arrearBlock = `
        <h3 class="section-title">বকেয়া (${startLabel} – ${formatMonthLabel(parseInt(els.arrearYear.value, 10), parseInt(els.arrearMonth.value, 10))})</h3>
        <div class="stats-grid compact-stats">
          <div class="stat-card"><div class="k">মূল বকেয়া</div><div class="v">${formatBDT(arrear.totalArrear)}</div></div>
          <div class="stat-card accent"><div class="k">গ্রস বকেয়া (আনু.)</div><div class="v">${formatBDT(grossArrear)}</div></div>
        </div>
        <div class="phase-list compact">
          ${arrear.segments
            .map(
              (s, i) => `
            <div class="phase-item">
              <div class="pct">${Math.round(s.rate * 100)}%</div>
              <div class="meta"><h4>${s.phase.title}</h4><p>${s.months} মাস · ${formatBDT(s.monthlyArrear)}/মাস (মূল)</p></div>
              <div class="amt">${formatBDT(s.segmentArrear)}</div>
            </div>`
            )
            .join("")}
        </div>`;
    }

    return `
      <div class="stat-hero">
        <div class="label">মোট গ্রস বেতন (মাসিক)</div>
        <div class="value" id="hero-value">—</div>
        <div class="sub">মূল ${formatBDT(payAsOf)} + ভাতা · ${formatMonthLabel(asOf.year, asOf.month)} · গ্রেড ${fix.grade}</div>
      </div>
      <h3 class="section-title">পে-স্লিপ (আনুমানিক)</h3>
      <div class="disclaimer-box" role="note">${a.note}</div>
      <div class="allow-grid payslip">${payslipLines}
        <div class="allow-row total"><span>মোট গ্রস</span><strong>${formatBDT(a.grossMonthly)}</strong></div>
      </div>
      ${fix.fixationNote ? `<div class="note-box">${fix.fixationNote}</div>` : ""}
      ${increment ? `<div class="info-banner"><strong>ইনক্রিমেন্ট:</strong> ${increment}</div>` : ""}
      <h3 class="section-title">পে ফিক্সেশন (মূল)</h3>
      <div class="stats-grid">
        <div class="stat-card"><div class="k">৩০ জুন ২০২৬</div><div class="v">${formatBDT(fix.basicOnJune30)}</div></div>
        <div class="stat-card"><div class="k">১০০% ফিক্স</div><div class="v">${formatBDT(fix.fixedBasic)}</div></div>
        <div class="stat-card"><div class="k">বৃদ্ধি</div><div class="v">${formatBDT(fix.totalIncrease)}</div></div>
        <div class="stat-card"><div class="k">বর্তমান ধাপ</div><div class="v">${rates.label}</div></div>
      </div>
      ${warn ? `<p class="hint warn">${warn}</p>` : ""}
      <h3 class="section-title">ধাপে ধাপে মূল বেতন</h3>
      <div class="phase-list">${phases
        .map(
          (p, i) => `
        <div class="phase-item">
          <div class="pct">${p.ratePct}%</div>
          <div class="meta"><h4>${p.title}</h4><p>${p.range}</p></div>
          <div class="amt">${formatBDT(p.basic)}</div>
        </div>`
        )
        .join("")}</div>
      ${arrearBlock}
      <div class="formula">
        <strong>ফিক্সেশন:</strong> পার্থক্য ${formatNum(fix.difference)} → ২০২৬ প্রারম্ভিক + পার্থক্য।
        <strong>গ্রস:</strong> মূল + বাড়ি ভাড়া + চিকিৎসা + পোশাক + ধোলাই + অন্যান্য (প্রোফাইল অনুযায়ী)।
      </div>`;
  }

  function renderChart(report) {
    const { chart } = report;
    return `
      <h3 class="section-title">বেতন progression</h3>
      <div class="bar-chart">
        ${chart
          .map(
            (b, i) => `
          <div class="bar-row">
            <div class="bar-label">${b.label}</div>
            <div class="bar-track"><div class="bar-fill" style="width:0" data-w="${b.pct}"></div></div>
            <div class="bar-val">${formatBDT(b.value)}</div>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function renderLedger(report) {
    const { monthLedger } = report;
    if (!monthLedger.rows.length) {
      return `<p class="hint">এই সময়সীমায় লেজার তৈরি হয়নি।</p>`;
    }
    const rows = monthLedger.rows
      .map(
        (r) => `
      <tr>
        <td>${formatMonthLabel(r.year, r.month)}</td>
        <td>${Math.round((report.rates[r.phaseKey] || 0) * 100)}%</td>
        <td>${formatBDT(r.basic)}</td>
        <td>${formatBDT(r.gross)}</td>
        <td>${formatBDT(r.arrear)}</td>
        <td>${formatBDT(r.grossArrear)}</td>
        <td>${formatBDT(r.cumulativeGross)}</td>
      </tr>`
      )
      .join("");
    const cards = monthLedger.rows
      .map(
        (r) => `
      <article class="ledger-card">
        <div class="ledger-card-head">
          <strong>${formatMonthLabel(r.year, r.month)}</strong>
          <span class="ledger-pct">${Math.round((report.rates[r.phaseKey] || 0) * 100)}%</span>
        </div>
        <dl class="ledger-dl">
          <div><dt>মূল</dt><dd>${formatBDT(r.basic)}</dd></div>
          <div><dt>গ্রস</dt><dd>${formatBDT(r.gross)}</dd></div>
          <div><dt>মূল বকেয়া</dt><dd>${formatBDT(r.arrear)}</dd></div>
          <div><dt>গ্রস বকেয়া</dt><dd>${formatBDT(r.grossArrear)}</dd></div>
          <div class="ledger-dl-total"><dt>জমা গ্রস</dt><dd>${formatBDT(r.cumulativeGross)}</dd></div>
        </dl>
      </article>`
      )
      .join("");
    return `
      <div class="ledger-mobile" aria-label="মাসভিত্তিক তালিকা">${cards}</div>
      <div class="table-wrap ledger-desktop">
        <table class="data-table">
          <thead><tr><th>মাস</th><th>ধাপ</th><th>মূল</th><th>গ্রস</th><th>মূল বকেয়া</th><th>গ্রস বকেয়া</th><th>জমা গ্রস</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="hint ledger-summary">মোট ${monthLedger.rows.length} মাস · মূল বকেয়া ${formatBDT(monthLedger.cumulative)} · গ্রস বকেয়া ${formatBDT(monthLedger.cumulativeGross)}</p>`;
  }

  function initMobileUX() {
    const adv = document.querySelector(".advanced-block");
    if (adv && window.matchMedia("(max-width: 639px)").matches) {
      adv.removeAttribute("open");
    }
  }

  function renderCompare(report) {
    const c = report.scaleCompare;
    const oldMarks = c.oldSteps
      .map((s, i) => {
        const on = i === c.oldIndex ? " current" : "";
        return `<span class="step-pill${on}">${formatNum(s)}</span>`;
      })
      .join("");
    const newMarks = c.newSteps
      .map((s, i) => {
        const on = i === c.newIndex ? " current" : "";
        return `<span class="step-pill${on}">${formatNum(s)}</span>`;
      })
      .join("");

    return `
      <h3 class="section-title">২০১৫ ↔ ২০২৬ স্কেল</h3>
      <div class="compare-progress">
        <div><span>২০১৫ ধাপ ${c.oldStepNum}/${c.oldSteps.length}</span><div class="prog"><div class="prog-fill green" style="width:${c.progressOld}%"></div></div></div>
        <div><span>২০২৬ ধাপ ${c.newStepNum}/${c.newSteps.length}</span><div class="prog"><div class="prog-fill red" style="width:${c.progressNew}%"></div></div></div>
      </div>
      <div class="scale-columns">
        <div><h4>২০১৫ (গ্রেড ${report.fix.grade})</h4><div class="step-scroll">${oldMarks}</div></div>
        <div><h4>২০২৬ (অনুরূপ)</h4><div class="step-scroll">${newMarks}</div></div>
      </div>
      <p class="hint">হাইলাইট = আপনার বর্তমান/নির্ধারিত ধাপ</p>`;
  }

  function renderAllowances(report) {
    const a = report.allowances;
    const tierLabel =
      a.areaTier === "dhaka"
        ? "ঢাকা সিটি"
        : a.areaTier === "division"
          ? "সিটি কর্পোরেশন"
          : "অন্য এলাকা";
    const lineRows = (a.lines || [])
      .map(
        (l) =>
          `<div class="allow-row${l.key === "basic" ? "" : ""}"><span>${l.label}</span><strong>${formatBDT(l.amount)}</strong></div>`
      )
      .join("");
    return `
      <h3 class="section-title">ভাতা বিস্তারিত (${formatMonthLabel(report.asOf.year, report.asOf.month)})</h3>
      <p class="hint">${a.note} · ${tierLabel} · HR ${Math.round(a.houseRentRate * 100)}%</p>
      <div class="allow-grid">
        ${lineRows}
        <div class="allow-row total"><span>মোট গ্রস (মাসিক)</span><strong>${formatBDT(a.grossMonthly)}</strong></div>
        <div class="allow-row"><span>পহেলা বৈশাখ (বার্ষিক ÷ ১২)</span><strong>${formatBDT(Math.round(a.pohelaBoishakh / 12))}</strong></div>
        <div class="allow-row"><span>গ্রস + উৎসব (আনু.)</span><strong>${formatBDT(a.grossWithFestivalMonthly || a.grossMonthly)}</strong></div>
      </div>`;
  }

  function renderActiveTab(report) {
    switch (activeTab) {
      case "chart":
        return renderChart(report);
      case "ledger":
        return renderLedger(report);
      case "compare":
        return renderCompare(report);
      case "allowances":
        return renderAllowances(report);
      default:
        return renderSummary(report);
    }
  }

  function afterRenderChart(animateBars) {
    requestAnimationFrame(() => {
      document.querySelectorAll(".bar-fill").forEach((bar) => {
        const w = bar.getAttribute("data-w");
        if (animateBars) bar.style.width = "0%";
        requestAnimationFrame(() => {
          bar.style.width = w + "%";
        });
      });
    });
  }

  function renderReport(report, options) {
    const animateEnter = options?.animateEnter === true;
    const softEnter = options?.softEnter === true;
    lastReport = report;
    els.toolbar.hidden = false;
    els.liveStatus.hidden = false;
    renderKpi(report);
    requestAnimationFrame(moveTabGlider);

    if (softEnter) applyPanelContent(report, "soft");
    else applyPanelContent(report, animateEnter ? "enter" : "update");

    if (!els.resultMeta.dataset.live) {
      els.resultMeta.textContent = "লাইভ হিসাব";
      els.resultMeta.dataset.live = "1";
    }
  }

  function lockFormScroll() {
    const y = window.scrollY;
    window.scrollTo(0, y);
    return y;
  }

  function runCalcAfterReveal(initial) {
    const y = lockFormScroll();
    if (pendingCalcAfterReveal || (els.basic.value && parseInt(els.basic.value, 10) > 0)) {
      pendingCalcAfterReveal = false;
      runCalc({ initial: !!initial });
    } else {
      saveState();
    }
    if (els.resultPanel) {
      els.resultPanel.classList.add("result-panel--content-ready");
    }
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
      moveTabGlider();
    });
  }

  function revealResultsPanel() {
    if (resultsGateOpen || !els.resultPanel) return;
    const scrollY = lockFormScroll();
    resultsGateOpen = true;
    els.resultPanel.classList.remove("result-panel--waiting");
    els.resultPanel.classList.add("result-panel--revealed");
    document.documentElement.classList.add("page-enter-results");
    document.querySelectorAll("#result-tabs .tab").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === activeTab);
    });
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      setTimeout(() => runCalcAfterReveal(true), RESULT_CONTENT_DELAY_MS);
    });
  }

  function runCalc(opts) {
    if (!resultsGateOpen) {
      pendingCalcAfterReveal = true;
      return;
    }
    const f = readForm();
    if (!f.grade || !f.basic || f.basic <= 0) return;
    const report = fullReport(
      f.grade,
      f.basic,
      f.arrearY,
      f.arrearM,
      f.joining,
      f.options
    );
    const initial = opts && opts.initial;
    renderReport(report, {
      animateEnter: !initial && lastRenderedTab !== activeTab,
      softEnter: !!initial,
    });
    lastRenderedTab = activeTab;
    saveState();
    requestAnimationFrame(moveTabGlider);
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, 220);
  }

  function scheduleCalc() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runCalc, 420);
  }

  function onFormChange() {
    scheduleSave();
    scheduleCalc();
  }

  function setTab(tab) {
    if (tab === activeTab) return;
    if (tabAnimating) {
      resetTabAnimClasses(document.getElementById("tab-panel"));
    }
    const prev = activeTab;
    const dir =
      TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(prev) ? 1 : -1;
    activeTab = tab;
    document.querySelectorAll("#result-tabs .tab").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === tab);
    });
    moveTabGlider();
    saveState();
    if (lastReport) {
      transitionTabPanel(lastReport, dir);
      lastRenderedTab = activeTab;
    }
  }

  els.grade.addEventListener("change", () => {
    toggleDesignation();
    refreshSteps();
    onFormChange();
  });

  els.profile.addEventListener("change", () => {
    applyProfileLock();
    onFormChange();
  });

  [els.poshak, els.dholai].forEach((el) => {
    el.addEventListener("change", onFormChange);
    el.addEventListener("input", onFormChange);
  });

  els.stepSelect.addEventListener("change", () => {
    if (els.stepSelect.value) {
      els.basic.value = els.stepSelect.value;
      onFormChange();
    }
  });

  els.basic.addEventListener("input", () => {
    const basic = parseInt(els.basic.value, 10);
    if (basic) {
      const sug = suggestGradeFromBasic(basic);
      if (sug && sug.grade !== parseInt(els.grade.value, 10) && sug.exact) {
        els.stepHint.textContent = `পরামর্শ: গ্রেড ${sug.grade}-এর ধাপ`;
        els.stepHint.classList.add("warn");
      } else refreshSteps();
    }
    onFormChange();
  });

  [
    els.joining,
    els.arrearYear,
    els.arrearMonth,
    els.asofYear,
    els.asofMonth,
    els.areaTier,
    els.children,
    els.ageOver50,
    els.designation,
  ].forEach((el) => {
    el.addEventListener("change", onFormChange);
    el.addEventListener("input", onFormChange);
  });

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    runCalc();
  });

  document.getElementById("btn-reset").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    els.profile.value = "seniorStaffNurse";
    els.grade.value = "10";
    els.grade.disabled = true;
    els.basic.value = "";
    els.joining.value = "";
    els.stepSelect.value = "";
    els.children.value = "0";
    els.ageOver50.checked = false;
    els.designation.value = "";
    els.poshak.value = "550";
    els.dholai.value = "300";
    fillYearMonthSelects(els.arrearYear, els.arrearMonth, 2026, 9);
    fillYearMonthSelects(els.asofYear, els.asofMonth, 2026, 9);
    toggleDesignation();
    refreshSteps();
    els.results.innerHTML = EMPTY_RESULTS;
    resultsReady = false;
    kpiReady = false;
    lastHeroGross = 0;
    lastRenderedTab = null;
    Object.keys(kpiLast).forEach((k) => {
      kpiLast[k] = 0;
    });
    els.toolbar.hidden = true;
    els.kpiStrip.hidden = true;
    els.liveStatus.hidden = true;
    if (els.resultPanel && !resultsGateOpen) {
      els.resultPanel.classList.add("result-panel--waiting");
      els.resultPanel.classList.remove("result-panel--revealed");
    }
    pendingCalcAfterReveal = false;
    els.resultMeta.textContent = "—";
    delete els.resultMeta.dataset.live;
    lastReport = null;
  });

  document.getElementById("btn-copy").addEventListener("click", async () => {
    if (!lastReport) return;
    const text = exportSummaryText(lastReport);
    try {
      await navigator.clipboard.writeText(text);
      els.resultMeta.textContent = "সারাংশ কপি হয়েছে ✓";
    } catch {
      els.resultMeta.textContent = "কপি ব্যর্থ — ম্যানুয়ালি কপি করুন";
    }
  });

  document.getElementById("result-tabs")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn || !btn.dataset.tab) return;
    e.preventDefault();
    setTab(btn.dataset.tab);
  });

  window.addEventListener("resize", () => {
    moveTabGlider();
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.dataset.grade === "10") {
        els.profile.value = "seniorStaffNurse";
        applyProfileLock();
      }
      els.grade.value = chip.dataset.grade;
      els.basic.value = chip.dataset.basic;
      toggleDesignation();
      refreshSteps();
      els.stepSelect.value = chip.dataset.basic;
      runCalc();
    });
  });

  function bootApp() {
    document.documentElement.classList.remove("preload");
    document.documentElement.classList.add("page-enter");
    setTimeout(revealResultsPanel, RESULT_REVEAL_MS);
  }

  fillYearMonthSelects(els.arrearYear, els.arrearMonth, 2026, 9);
  fillYearMonthSelects(els.asofYear, els.asofMonth, 2026, 9);
  document.documentElement.classList.add("preload");
  initGrades();
  initMobileUX();
  loadState();
  requestAnimationFrame(() => requestAnimationFrame(bootApp));
})();
