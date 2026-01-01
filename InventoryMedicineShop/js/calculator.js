// ===== CALCULATOR WIDGET =====
// Separate calculator script for MediShop application

let calcBuffer = "";
let calcCurrentValue = "0";
let calcPreviousValue = "";
let calcOperator = null;

// Dragging variables
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

function calcKey(key) {
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    if (calcCurrentValue !== "0") {
      calcPreviousValue = calcCurrentValue;
      calcOperator = key;
      calcCurrentValue = "0";
    }
  } else {
    if (calcCurrentValue === "0") {
      calcCurrentValue = key;
    } else {
      calcCurrentValue += key;
    }
  }
  updateCalcDisplay();
}

function calculateResult() {
  if (calcOperator && calcPreviousValue !== "") {
    let result;
    const prev = parseFloat(calcPreviousValue);
    const current = parseFloat(calcCurrentValue);

    switch (calcOperator) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = prev / current;
        break;
      default:
        result = current;
    }

    calcCurrentValue = result.toString();
    calcPreviousValue = "";
    calcOperator = null;
    updateCalcDisplay();
  }
}

function clearCalc() {
  calcCurrentValue = "0";
  calcPreviousValue = "";
  calcOperator = null;
  updateCalcDisplay();
}

function backspaceCalc() {
  if (calcCurrentValue.length > 1) {
    calcCurrentValue = calcCurrentValue.slice(0, -1);
  } else {
    calcCurrentValue = "0";
  }
  updateCalcDisplay();
}

function updateCalcDisplay() {
  $("#calcDisplay").text(calcCurrentValue);
}

// Initialize calculator on document ready
function initializeCalculator() {
  // Calculator toggle - bind click handler
  if ($("#calcToggle").length > 0) {
    $("#calcToggle")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const modal = $("#calcModal");
        modal.toggleClass("show");
      });

    // Close button handler
    if ($("#calcCloseBtn").length > 0) {
      $("#calcCloseBtn")
        .off("click")
        .on("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          $("#calcModal").removeClass("show");
        });
    }

    // Drag functionality
    const modal = $("#calcModal");
    const header = $("#calcHeader");

    if (header.length > 0) {
      header.off("mousedown").on("mousedown", function (e) {
        if ($(e.target).closest(".calc-close-btn").length > 0) {
          return; // Don't drag if close button is clicked
        }

        isDragging = true;
        const rect = modal[0].getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        header.css("cursor", "grabbing");
        e.preventDefault();
      });

      $(document)
        .off("mousemove.calculator")
        .on("mousemove.calculator", function (e) {
          if (isDragging && modal.hasClass("show")) {
            const newX = e.clientX - dragOffsetX - window.innerWidth / 2;
            const newY = e.clientY - dragOffsetY - window.innerHeight / 2;

            modal.css({
              transform: `translate(calc(-50% + ${newX}px), calc(-50% + ${newY}px))`,
            });
          }
        });

      $(document)
        .off("mouseup.calculator")
        .on("mouseup.calculator", function () {
          if (isDragging) {
            isDragging = false;
            header.css("cursor", "move");
          }
        });
    }

    // Add keyboard shortcuts for calculator
    $(document)
      .off("keydown.calculator")
      .on("keydown.calculator", function (e) {
        // Calculator shortcut Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.key === "C") {
          e.preventDefault();
          $("#calcToggle").click();
        }

        // Number keys for calculator when modal is open
        if ($("#calcModal").hasClass("show")) {
          if (e.key >= "0" && e.key <= "9") {
            calcKey(e.key);
          } else if (
            e.key === "+" ||
            e.key === "-" ||
            e.key === "*" ||
            e.key === "/"
          ) {
            calcKey(e.key);
          } else if (e.key === "Enter") {
            calculateResult();
          } else if (e.key === "Escape") {
            $("#calcModal").removeClass("show");
          } else if (e.key === "Backspace") {
            backspaceCalc();
          }
        }
      });

    console.log("✅ Calculator initialized and ready");
  }
}

// Initialize calculator when DOM is ready
$(document).ready(function () {
  initializeCalculator();
});
