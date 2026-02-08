from flask import Blueprint, request, jsonify

churn_bp = Blueprint('churn', __name__)

@churn_bp.route('/api/v1/crm/churn-risk', methods=['POST'])
def predict_churn():
    """
    Predicts if a customer is likely to close their account (Churn).
    """
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No input data"}), 400

    # Input Factors
    days_since_last_login = data.get('days_since_last_login', 0)
    active_products = data.get('active_products', 1) # e.g., 1 (Checking), 2 (Checking+Savings)
    complaints_logged = data.get('complaints_last_6m', 0)
    balance_trend = data.get('balance_trend', 'stable') # stable, increasing, decreasing

    # Scoring Logic
    risk_score = 0 # 0-100
    reasons = []

    # Factor 1: Engagement
    if days_since_last_login > 30:
        risk_score += 40
        reasons.append("Low login activity (>30 days)")
    elif days_since_last_login > 14:
        risk_score += 15
        
    # Factor 2: Product Stickiness
    if active_products == 1:
        risk_score += 20
        reasons.append("Single product user (easier to switch banks)")
    
    # Factor 3: Satisfaction
    if complaints_logged > 0:
        risk_score += (complaints_logged * 20)
        reasons.append("Recent customer service complaints")

    # Factor 4: Financial Movement
    if balance_trend == 'decreasing':
        risk_score += 25
        reasons.append("Significant balance outflow detected")

    risk_score = min(100, risk_score)
    
    churn_probability = "Low"
    action = "None"

    if risk_score > 75:
        churn_probability = "Critical"
        action = "Immediate Retention Offer (Bonus Interest/Cashback)"
    elif risk_score > 50:
        churn_probability = "High"
        action = "Send Satisfaction Survey"

    return jsonify({
        "status": "success",
        "churn_prediction": {
            "risk_score": risk_score,
            "probability": churn_probability,
            "primary_risk_factors": reasons,
            "recommended_marketing_action": action
        }
    })
