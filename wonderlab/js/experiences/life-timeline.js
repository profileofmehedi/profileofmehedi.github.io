/**
 * Experience 4: Your Life in Weeks (জীবনের সময়রেখা)
 * Interactive visual timeline grid showing weeks lived vs hypothetical weeks.
 */

const LifeTimelineExperience = (function () {
  let dob = new Date(1998, 0, 1);
  let expectedYears = 80;

  /**
   * Calculate detailed age breakdown
   */
  const calculateAgeDetails = (birthDate, assumptionYears) => {
    const now = new Date();
    const diffTime = Math.max(0, now - birthDate);
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    // Approximate years, months, days
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalAssumedWeeks = assumptionYears * 52;
    const percentLived = Math.min(100, (totalWeeks / totalAssumedWeeks) * 100);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalAssumedWeeks,
      percentLived: percentLived.toFixed(1)
    };
  };

  /**
   * Render life grid using HTML5 Canvas for top performance
   */
  const renderCanvasGrid = (canvas, totalWeeksLived, totalAssumedWeeks) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const cols = 52; // 52 weeks per year
    const rows = Math.ceil(totalAssumedWeeks / cols);

    const padX = 12;
    const padY = 12;
    const availableW = width - padX * 2;
    const availableH = height - padY * 2;

    const dotSize = Math.max(2, Math.min(availableW / cols, availableH / rows) * 0.7);
    const gapX = availableW / cols;
    const gapY = availableH / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const weekIndex = r * cols + c;
        if (weekIndex >= totalAssumedWeeks) break;

        const x = padX + c * gapX + gapX / 2;
        const y = padY + r * gapY + gapY / 2;

        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);

        if (weekIndex < totalWeeksLived) {
          // Lived weeks - vibrant violet to amber gradient
          ctx.fillStyle = '#f59e0b';
        } else if (weekIndex === totalWeeksLived) {
          // Current active week - bright cyan glow
          ctx.fillStyle = '#06b6d4';
        } else {
          // Future hypothetical weeks - subtle
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        }
        ctx.fill();
      }
    }
  };

  const updateUI = () => {
    const details = calculateAgeDetails(dob, expectedYears);

    // Update stats
    $('#lt-stat-years').text(Utils.toBengaliNumerals(details.years));
    $('#lt-stat-months').text(Utils.toBengaliNumerals(details.months));
    $('#lt-stat-days').text(Utils.toBengaliNumerals(details.days));
    $('#lt-stat-weeks-lived').text(Utils.toBengaliNumerals(details.totalWeeks));
    $('#lt-stat-percent').text(`${Utils.toBengaliNumerals(details.percentLived)}%`);

    // Update canvas
    const canvas = document.getElementById('life-canvas');
    if (canvas) {
      // Set high-res canvas buffer
      const rect = canvas.getBoundingClientRect();
      canvas.width = (rect.width || 500) * 2;
      canvas.height = 300 * 2;
      renderCanvasGrid(canvas, details.totalWeeks, details.totalAssumedWeeks);
    }

    // Update Poster reflection card
    const card = document.getElementById('life-timeline-art-card');
    if (card) {
      card.querySelector('.lt-card-age').textContent = `${Utils.toBengaliNumerals(details.years)} বছর ${Utils.toBengaliNumerals(details.months)} মাস`;
      card.querySelector('.lt-card-weeks').textContent = `${Utils.toBengaliNumerals(details.totalWeeks)} সপ্তাহ অতিবাহিত`;
    }
  };

  return {
    init: function () {
      const $form = $('#life-timeline-form');
      if (!$form.length) return;

      // Handle DOB input
      $('#lt-dob-input').on('change', function () {
        const val = $(this).val();
        if (val) {
          dob = new Date(val);
          updateUI();
        }
      });

      // Handle Horizon Assumption
      $('#lt-horizon-select').on('change', function () {
        expectedYears = parseInt($(this).val(), 10) || 80;
        updateUI();
      });

      // Download Button
      $('#lt-download-btn').on('click', async function () {
        const card = document.getElementById('life-timeline-art-card');
        await ImageExporter.exportElementToPNG(card, {
          filename: `life-timeline-${dob.getFullYear()}.png`
        });
      });

      // Share Button
      $('#lt-share-btn').on('click', function () {
        const card = document.getElementById('life-timeline-art-card');
        ImageExporter.openResultModal({
          title: 'আমার জীবনের সময়রেখা (Life in Weeks)',
          element: card,
          filename: `life-timeline-${dob.getFullYear()}.png`,
          shareText: 'WonderLab-এ আমার জীবনের সময়রেখা ভিজ্যুয়ালাইজ করলাম। সময় অমূল্য উপহার!'
        });
      });

      window.addEventListener('resize', Utils.debounce(updateUI, 250));
      updateUI();
    },

    update: updateUI
  };
})();

window.LifeTimelineExperience = LifeTimelineExperience;
