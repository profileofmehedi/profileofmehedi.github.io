(function (global) {
  const {
    fixPay,
    phasedBasic,
    phaseRates,
    PHASES,
    SCALES_2015,
    SCALES_2026,
    isOnScale,
    PRESCRIBED_2026,
  } = global.PayScaleData;

  const SCALE_EFFECTIVE = { year: 2026, month: 7, day: 1 };
  const JUNE_30_2026 = { year: 2026, month: 6, day: 30 };

  function monthIndex(year, month) {
    return year * 12 + (month - 1);
  }

  function parseJoiningDate(iso) {
    if (!iso || !String(iso).trim()) return null;
    const d = new Date(iso + "T12:00:00");
    if (Number.isNaN(d.getTime())) return null;
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  function compareDate(a, b) {
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  }

  function findStepAtOrAbove(steps, target) {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i] >= target) return steps[i];
    }
    return steps[steps.length - 1];
  }

  /**
   * Running staff (joined on/before 30 Jun 2026): standard fixation.
   * Joined on/after 1 Jul 2026: first appointment on 2026 scale entry (or matching step).
   */
  function resolveFixation(grade, basicOnJune30, joiningDateIso) {
    const join = parseJoiningDate(joiningDateIso);
    const basic = Math.round(basicOnJune30);
    const standard = fixPay(grade, basic);

    if (!join || compareDate(join, JUNE_30_2026) <= 0) {
      return {
        ...standard,
        join,
        fixationMode: "running",
        fixationNote:
          "চলমান কর্মচারী — ৩০ জুন ২০২৬-এর মূল বেতন অনুযায়ী পে ফিক্সেশন।",
      };
    }

    const newSteps = SCALES_2026[grade];
    const newMin = newSteps[0];
    let fixed = newMin;
    if (isOnScale(newSteps, basic)) {
      fixed = basic;
    } else if (basic > newMin) {
      fixed = findStepAtOrAbove(newSteps, basic);
    }

    return {
      grade,
      newGrade: grade,
      basicOnJune30: basic,
      oldMin: SCALES_2015[grade][0],
      newMin,
      difference: Math.max(0, basic - newMin),
      fixedBasic: fixed,
      totalIncrease: fixed - basic,
      onOldScale: isOnScale(SCALES_2015[grade], basic),
      join,
      fixationMode: "newJoiner2026",
      fixationNote:
        "১ জুলাই ২০২৬-এর পর যোগদান — ২০২৬ স্কেলের প্রারম্ভিক/উপযুক্ত ধাপে নির্ধারণ (পুরাতন স্কেল পার্থক্য পদ্ধতি নয়)।",
    };
  }

  function arrearStartFromJoining(join) {
    const july = { year: 2026, month: 7 };
    if (!join) return july;
    if (compareDate(join, SCALE_EFFECTIVE) < 0) return july;
    return { year: join.year, month: join.month };
  }

  function incrementHint(join) {
    if (!join) return null;
    const july2026 = new Date(2026, 6, 1);
    const july2027 = new Date(2027, 6, 1);
    const jd = new Date(join.year, join.month - 1, join.day);
    if (jd >= july2027) {
      return "প্রথম বার্ষিক ইনক্রিমেন্ট: ৬ মাস পূর্ণ হলে পরবর্তী ১ জুলাই (গেজেট অনুযায়ী)।";
    }
    if (jd >= july2026) {
      return "১ জুলাই ২০২৬-এর পর যোগদান — সাধারণত ৬ মাস চাকরি পূর্ণ হলে পরবর্তী ১ জুলাই থেকে ইনক্রিমেন্টের যোগ্য।";
    }
    return "চলমান কর্মচারী — বার্ষিক ইনক্রিমেন্ট ১ জুলাই (গেজেট অনুযায়ী)।";
  }

  function phaseKeyForMonth(year, month) {
    const idx = monthIndex(year, month);
    if (idx < monthIndex(2026, 7)) return null;
    if (idx <= monthIndex(2026, 12)) return "phase1";
    if (idx <= monthIndex(2027, 6)) return "phase2";
    return "phase3";
  }

  function countMonthsInclusive(fromY, fromM, toY, toM) {
    return monthIndex(toY, toM) - monthIndex(fromY, fromM) + 1;
  }

  function arrearBreakdown(basicOnJune30, grade, toYear, toMonth, joiningDateIso) {
    const fix = resolveFixation(grade, basicOnJune30, joiningDateIso);
    const oldBasic = fix.basicOnJune30;
    const fixed = fix.fixedBasic;
    const start = arrearStartFromJoining(fix.join);
    const startIdx = monthIndex(start.year, start.month);
    const endIdx = monthIndex(toYear, toMonth);
    if (endIdx < startIdx) {
      return {
        fix,
        segments: [],
        totalArrear: 0,
        totalMonths: 0,
        arrearStart: start,
      };
    }

    const segments = [];
    let totalArrear = 0;
    let y = start.year;
    let m = start.month;

    while (monthIndex(y, m) <= endIdx) {
      const pk = phaseKeyForMonth(y, m);
      const pay = phasedBasic(oldBasic, fixed, grade, pk);
      const monthlyArrear = pay - oldBasic;

      const segEnd = { year: y, month: m };
      let cy = y;
      let cm = m;
      while (monthIndex(cy, cm) <= endIdx && phaseKeyForMonth(cy, cm) === pk) {
        segEnd.year = cy;
        segEnd.month = cm;
        cm++;
        if (cm > 12) {
          cm = 1;
          cy++;
        }
      }

      const months = countMonthsInclusive(y, m, segEnd.year, segEnd.month);
      const segmentArrear = monthlyArrear * months;
      totalArrear += segmentArrear;

      segments.push({
        phaseKey: pk,
        phase: PHASES.find((p) => p.key === pk),
        from: { year: y, month: m },
        to: { year: segEnd.year, month: segEnd.month },
        months,
        monthlyPay: pay,
        monthlyArrear,
        segmentArrear,
        rate: phaseRates(grade)[pk],
      });

      y = segEnd.year;
      m = segEnd.month + 1;
      if (m > 12) {
        m = 1;
        y++;
      }
    }

    const totalMonths = countMonthsInclusive(start.year, start.month, toYear, toMonth);

    return {
      fix,
      segments,
      totalArrear,
      totalMonths,
      assumedOldPaid: oldBasic,
      arrearStart: start,
    };
  }

  function fullReport(grade, basicOnJune30, arrearToYear, arrearToMonth, joiningDateIso, options) {
    const opts = options || {};
    const fix = resolveFixation(grade, basicOnJune30, joiningDateIso);

    if (grade === 1 && opts.designation) {
      const map = {
        default: PRESCRIBED_2026.grade1Default,
        seniorSecretary: PRESCRIBED_2026.seniorSecretary,
        cabinetSecretary: PRESCRIBED_2026.cabinetSecretary,
      };
      if (map[opts.designation]) {
        fix.fixedBasic = map[opts.designation];
        fix.totalIncrease = fix.fixedBasic - fix.basicOnJune30;
        fix.fixationNote +=
          " (নির্ধারিত পদ: " + opts.designation + " — ২০২৬ গেজেট অনুযায়ী)";
      }
    }

    const rates = phaseRates(grade);
    const phases = PHASES.map((p) => ({
      ...p,
      rate: rates[p.key],
      ratePct: Math.round(rates[p.key] * 100),
      basic: phasedBasic(fix.basicOnJune30, fix.fixedBasic, grade, p.key),
    }));

    const asOf = opts.asOfYear && opts.asOfMonth
      ? { year: opts.asOfYear, month: opts.asOfMonth }
      : { year: arrearToYear || 2026, month: arrearToMonth || 9 };

    const arrear =
      arrearToYear && arrearToMonth
        ? arrearBreakdown(
            basicOnJune30,
            grade,
            arrearToYear,
            arrearToMonth,
            joiningDateIso
          )
        : null;

    const increment = incrementHint(fix.join);
    const monthLedger = buildMonthLedger(
      fix,
      grade,
      arrearToYear || 2026,
      arrearToMonth || 9,
      joiningDateIso,
      opts
    );
    const scaleCompare = buildScaleComparison(grade, fix.basicOnJune30, fix.fixedBasic);
    const allowances = estimateAllowances(fix, grade, asOf, opts);
    const chart = buildSalaryChart(fix, grade, phases);
    const payAsOf = basicForMonth(
      fix.basicOnJune30,
      fix.fixedBasic,
      grade,
      asOf.year,
      asOf.month
    );

    return {
      fix,
      phases,
      rates,
      arrear,
      increment,
      monthLedger,
      scaleCompare,
      allowances,
      chart,
      payAsOf,
      asOf,
    };
  }

  function basicForMonth(oldBasic, fixedBasic, grade, year, month) {
    const pk = phaseKeyForMonth(year, month);
    if (!pk) return oldBasic;
    return phasedBasic(oldBasic, fixedBasic, grade, pk);
  }

  function buildMonthLedger(fix, grade, toYear, toMonth, joiningDateIso, opts) {
    const start = arrearStartFromJoining(fix.join);
    const endIdx = monthIndex(toYear, toMonth);
    const startIdx = monthIndex(start.year, start.month);
    const rows = [];
    let cumulative = 0;
    let cumulativeGross = 0;
    const pkgOpts = opts || {};
    const baselinePkg = estimateAllowances(
      { ...fix, basicOnJune30: fix.basicOnJune30 },
      grade,
      { year: 2026, month: 6 },
      pkgOpts
    );
    const baselineGross = baselinePkg.grossMonthly;

    if (endIdx < startIdx) {
      return { rows, cumulative: 0, cumulativeGross: 0, start, baselineGross };
    }

    let y = start.year;
    let m = start.month;
    while (monthIndex(y, m) <= endIdx) {
      const pk = phaseKeyForMonth(y, m);
      const pay = phasedBasic(fix.basicOnJune30, fix.fixedBasic, grade, pk);
      const arrear = pay - fix.basicOnJune30;
      cumulative += arrear;
      const pkg = estimateAllowances(fix, grade, { year: y, month: m }, pkgOpts);
      const grossArrear = pkg.grossMonthly - baselineGross;
      cumulativeGross += grossArrear;
      rows.push({
        year: y,
        month: m,
        phaseKey: pk,
        basic: pay,
        arrear,
        cumulative,
        allowances: pkg.coreAllowances,
        gross: pkg.grossMonthly,
        grossArrear,
        cumulativeGross,
      });
      m++;
      if (m > 12) {
        m = 1;
        y++;
      }
    }
    return { rows, cumulative, cumulativeGross, start, baselineGross };
  }

  function buildScaleComparison(grade, basic2015, fixed2026) {
    const oldSteps = SCALES_2015[grade];
    const newSteps = SCALES_2026[grade];
    let oldIndex = oldSteps.indexOf(basic2015);
    if (oldIndex < 0) {
      oldIndex = oldSteps.findIndex((s) => s >= basic2015);
      if (oldIndex < 0) oldIndex = oldSteps.length - 1;
    }
    let newIndex = newSteps.indexOf(fixed2026);
    if (newIndex < 0) newIndex = newSteps.findIndex((s) => s >= fixed2026);

    const pctOld =
      oldSteps.length > 1
        ? Math.round((oldIndex / (oldSteps.length - 1)) * 100)
        : 100;
    const pctNew =
      newSteps.length > 1
        ? Math.round((newIndex / (newSteps.length - 1)) * 100)
        : 100;

    return {
      oldSteps,
      newSteps,
      oldIndex,
      newIndex,
      oldStepNum: oldIndex + 1,
      newStepNum: newIndex + 1,
      progressOld: pctOld,
      progressNew: pctNew,
    };
  }

  function houseRentRate(grade, areaTier) {
    if (global.PayAllowances) {
      return global.PayAllowances.houseRentRate(grade, areaTier);
    }
    const g = Math.max(1, Math.min(20, grade));
    const t = (g - 1) / 19;
    if (areaTier === "dhaka") return 0.4 + t * 0.2;
    if (areaTier === "division") return 0.3 + t * 0.2;
    return 0.25 + t * 0.2;
  }

  function estimateAllowances(fix, grade, asOf, opts) {
    const basic = basicForMonth(
      fix.basicOnJune30,
      fix.fixedBasic,
      grade,
      asOf.year,
      asOf.month
    );
    const o = {
      ...opts,
      profile: opts.profile || "civil",
      houseRentBasic: fix.basicOnJune30,
    };
    if (global.PayAllowances) {
      return global.PayAllowances.computePayPackage(basic, grade, o);
    }
    const area = o.areaTier || "dhaka";
    const hrRate = houseRentRate(grade, area);
    const houseRent = Math.round(fix.basicOnJune30 * hrRate);
    const medical = o.ageOver50 ? 4000 : 3000;
    return {
      basic,
      houseRent,
      houseRentRate: hrRate,
      medical,
      dholai: 300,
      poshak: 0,
      grossMonthly: basic + houseRent + medical + 300,
      lines: [],
      note: "",
    };
  }

  function buildSalaryChart(fix, grade, phases) {
    const oldB = fix.basicOnJune30;
    const max = Math.max(fix.fixedBasic, oldB, ...phases.map((p) => p.basic));
    return [
      { label: "৩০ জুন ২০২৬", value: oldB, pct: (oldB / max) * 100 },
      ...phases.map((p) => ({
        label: p.title,
        value: p.basic,
        pct: (p.basic / max) * 100,
      })),
      { label: "১০০% লক্ষ্য", value: fix.fixedBasic, pct: (fix.fixedBasic / max) * 100 },
    ];
  }

  function suggestGradeFromBasic(basic) {
    const b = Math.round(basic);
    for (let g = 20; g >= 1; g--) {
      const steps = SCALES_2015[g];
      if (b >= steps[0] && b <= steps[steps.length - 1]) {
        if (steps.includes(b)) return { grade: g, exact: true };
        return { grade: g, exact: false };
      }
    }
    return null;
  }

  function exportSummaryText(report) {
    const { fix, phases, arrear, payAsOf, asOf, allowances } = report;
    let t = "Pay Scale 2026 — Summary\n";
    t += "========================\n";
    if (allowances.profile === "seniorStaffNurse") {
      t += "Profile: Senior Staff Nurse (Grade 10)\n";
    }
    t += `Grade: ${fix.grade}\n`;
    t += `Basic 30-Jun-2026: ${fix.basicOnJune30}\n`;
    t += `Fixed basic (100%): ${fix.fixedBasic}\n`;
    phases.forEach((p) => {
      t += `${p.title}: ${p.basic} (${p.ratePct}%)\n`;
    });
    if (allowances) {
      t += `\n--- Monthly package (${asOf.month}/${asOf.year}) ---\n`;
      allowances.lines.forEach((l) => {
        t += `${l.label}: ${l.amount}\n`;
      });
      t += `Gross (approx): ${allowances.grossMonthly}\n`;
    }
    if (arrear) t += `\nBasic arrear (est.): ${arrear.totalArrear}\n`;
    if (report.monthLedger) {
      t += `Gross arrear (est.): ${report.monthLedger.cumulativeGross}\n`;
    }
    t += `Basic as of ${asOf.month}/${asOf.year}: ${payAsOf}\n`;
    return t;
  }

  global.PayScaleCalc = {
    fullReport,
    arrearBreakdown,
    resolveFixation,
    phaseKeyForMonth,
    suggestGradeFromBasic,
    parseJoiningDate,
    arrearStartFromJoining,
    basicForMonth,
    buildMonthLedger,
    estimateAllowances,
    exportSummaryText,
  };
})(typeof window !== "undefined" ? window : globalThis);
