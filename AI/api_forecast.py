from flask import Blueprint, request, jsonify

forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('/api/v1/banking/forecast', methods=['POST'])
def forecast_cash_flow():
    """
    Predicts end-of-month balance and warns of potential shortfalls.
    """
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No input data"}), 400

    current_balance = data.get('current_balance', 0)
    avg_monthly_income = data.get('avg_monthly_income', 0)
    avg_monthly_expenses = data.get('avg_monthly_expenses', 0)
    upcoming_bills = data.get('upcoming_bills', []) # List of {name, amount, due_date_days_away}

    # 1. Calculate Projected Balance
    total_upcoming_bills = sum(bill['amount'] for bill in upcoming_bills)
    projected_balance = current_balance + avg_monthly_income - avg_monthly_expenses - total_upcoming_bills

    # 2. Risk Analysis
    status = "Healthy"
    warning = None
    
    if projected_balance < 0:
        status = "Critical"
        warning = f"Warning: You are projected to be overdraft by ${abs(projected_balance)} by month-end."
    elif projected_balance < 500:
        status = "Low Warning"
        warning = "Your balance is running low. Consider reducing discretionary spending."

    return jsonify({
        "status": "success",
        "forecast": {
            "current_balance": current_balance,
            "projected_balance_eom": projected_balance,
            "financial_health_status": status,
            "alert": warning
        }
    })
