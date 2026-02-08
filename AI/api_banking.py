from flask import Blueprint, request, jsonify

banking_bp = Blueprint('banking', __name__)

@banking_bp.route('/api/v1/banking/analyze', methods=['POST'])
def analyze_banking_data():
    """
    Advanced Banking Fraud Analysis V2
    """
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No input data provided"}), 400

    # -- Extract & Validate --
    amount = data.get('transaction_amount', 0)
    merchant = data.get('merchant_category', 'Retail')
    location = data.get('location', 'Unknown')
    user_home = data.get('user_home_location', 'New York')
    user_avg_spend = data.get('user_avg_transaction_val', 100)
    tx_count = data.get('tx_count_last_hour', 1) 
    
    risk_score = 0
    flags = []

    # 1. Amount Analysis
    if amount > 10000:
        risk_score += 40
        flags.append("Amount exceeds regulatory threshold ($10k)")
    elif amount > 3000:
        risk_score += 15

    # 2. Merchant Category Risk
    high_risk_merchants = ['Gambling', 'Crypto', 'Jewelry', 'Electronics']
    if merchant in high_risk_merchants:
        risk_score += 30
        flags.append(f"High-risk merchant category: {merchant}")

    # 3. Anomaly Detection
    if amount > (user_avg_spend * 10):
        risk_score += 50
        flags.append(f"Huge deviation from spending habits ({amount} vs avg {user_avg_spend})")
    elif amount > (user_avg_spend * 5):
        risk_score += 25
        flags.append("Unusual spending spike")

    # 4. Geographic Check
    if location != user_home:
        if location in ["Restricted", "North Korea", "High Risk Zone"]:
            risk_score += 100
            flags.append(f"Blocked location: {location}")
        elif location != "Online":
             risk_score += 15
             flags.append(f"Transaction away from home ({location})")

    # 5. Velocity Check
    if tx_count > 10:
        risk_score += 60
        flags.append("High transaction velocity (potential bot/stolen card)")
    elif tx_count > 5:
        risk_score += 20
        flags.append("Multiple rapid transactions detected")

    # -- Final Decision Logic --
    risk_score = min(100, risk_score)
    status = "Approved"
    action = "Process"
    
    if risk_score >= 80:
        status = "Blocked"
        action = "Decline & Freeze Card"
    elif risk_score >= 50:
        status = "Flagged"
        action = "Hold for Verification (SMS/Email)"
    
    return jsonify({
        "status": "success",
        "fraud_analysis": {
            "risk_score": risk_score,
            "risk_level": "Critical" if risk_score >= 80 else ("High" if risk_score >= 50 else "Low"),
            "status": status,
            "recommended_action": action
        },
        "details": {
            "flags_raised": flags,
            "merchant_risk": "High" if merchant in high_risk_merchants else "Normal"
        }
    })
