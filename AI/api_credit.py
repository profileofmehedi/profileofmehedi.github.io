from flask import Blueprint, request, jsonify

credit_bp = Blueprint('credit', __name__)

def validate_credit_inputs(data):
    """
    Validates input data for credit scoring.
    Returns: (is_valid, error_message)
    """
    required_fields = [
        'monthly_income', 
        'total_credit_limit', 
        'current_credit_balance', 
        'oldest_account_age_years', 
        'late_payments_last_6m',
        'recent_inquiries_last_3m'
    ]
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
        if not isinstance(data[field], (int, float)):
            return False, f"Field '{field}' must be a number."
        if data[field] < 0:
            return False, f"Field '{field}' cannot be negative."

    if data['total_credit_limit'] == 0 and data['current_credit_balance'] > 0:
        return False, "Cannot have credit balance with 0 credit limit."

    return True, None

@credit_bp.route('/api/v1/credit/predict', methods=['POST'])
def predict_credit_score():
    """
    Advanced Credit Scoring Model V2
    """
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No input data provided"}), 400

    # 1. Validation
    is_valid, error_msg = validate_credit_inputs(data)
    if not is_valid:
        return jsonify({"status": "error", "message": error_msg}), 400

    # Extract Data
    income = data['monthly_income']
    limit = data['total_credit_limit']
    balance = data['current_credit_balance']
    age_years = data['oldest_account_age_years']
    late_payments = data['late_payments_last_6m']
    inquiries = data['recent_inquiries_last_3m']

    # 2. Scoring Logic (Base Score 300)
    score = 300
    reasons = []
    positive_factors = []

    # -- A. Payment History (Max +195 pts) --
    if late_payments == 0:
        score += 195
        positive_factors.append("Perfect payment history in last 6 months")
    elif late_payments == 1:
        score += 110
        reasons.append("Recent late payment detected")
    elif late_payments <= 3:
        score += 60
        reasons.append("Multiple late payments heavily impacted score")
    else:
        reasons.append("Serious delinquency: 4+ late payments")

    # -- B. Utilization Ratio (Max +165 pts) --
    if limit > 0:
        utilization = (balance / limit) * 100
    else:
        utilization = 100 if balance > 0 else 0

    if utilization < 10:
        score += 165
        positive_factors.append("Excellent low credit utilization")
    elif utilization < 30:
        score += 140
        positive_factors.append("Good credit utilization (<30%)")
    elif utilization < 50:
        score += 90
        reasons.append("Credit utilization is getting high (>30%)")
    elif utilization < 75:
        score += 40
        reasons.append("High credit utilization (>50%) poses risk")
    else:
        reasons.append("Critical credit utilization (>75%)")

    # -- C. Credit Age (Max +85 pts) --
    if age_years > 10:
        score += 85
        positive_factors.append("Long established credit history")
    elif age_years > 5:
        score += 65
    elif age_years > 2:
        score += 40
    else:
        score += 15
        reasons.append("Short credit history length")

    # -- D. New Credit / Inquiries (Max +55 pts) --
    if inquiries == 0:
        score += 55
    elif inquiries == 1:
        score += 45
    elif inquiries <= 3:
        score += 25
        reasons.append("Recent hard inquiries detected")
    else:
        reasons.append("Too many recent credit applications")

    # -- E. Income / Stability (Max +50 pts) --
    if income > 8000:
        score += 50
    elif income > 4000:
        score += 35
    elif income > 2000:
        score += 20
    else:
        reasons.append("Income level limits max potential score")

    # Clamp Score
    final_score = int(max(300, min(850, score)))

    # 3. Categorization & Recommendations
    risk_category = "Low"
    approval_status = "Approved"
    
    if final_score >= 800:
        rating = "Exceptional"
        action_plan = "You qualify for our lowest interest rates and premium 'Asper Gold' cards."
    elif final_score >= 740:
        rating = "Very Good"
        action_plan = "You are in a great position. Keep utilization low to reach 'Exceptional'."
    elif final_score >= 670:
        rating = "Good"
        risk_category = "Medium"
        action_plan = "Good standing. Avoid opening new accounts to improve further."
    elif final_score >= 580:
        rating = "Fair"
        risk_category = "High"
        approval_status = "Conditional Review"
        action_plan = "Pay down balances to below 30% utilization to boost your score quickly."
    else:
        rating = "Poor"
        risk_category = "Critical"
        approval_status = "Rejected"
        action_plan = "Focus on paying bills on time. Avoid any new credit applications."

    return jsonify({
        "status": "success",
        "score_details": {
            "value": final_score,
            "rating": rating,
            "risk_level": risk_category,
            "max_possible": 850
        },
        "factors": {
            "positive": positive_factors,
            "negative": reasons
        },
        "decision": {
            "approval_status": approval_status,
            "recommendation": action_plan
        }
    })
