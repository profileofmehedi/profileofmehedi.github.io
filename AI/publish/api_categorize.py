from flask import Blueprint, request, jsonify

categorize_bp = Blueprint('categorize', __name__)

@categorize_bp.route('/api/v1/banking/categorize', methods=['POST'])
def categorize_transaction():
    """
    Cleans messy transaction strings and detects subscriptions.
    """
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No input data"}), 400

    raw_text = data.get('transaction_description', '').upper()
    amount = data.get('amount', 0)
    
    # Mock NLP Logic (Keyword matching for demo)
    category = "General"
    clean_name = raw_text

    # Rules for categorization
    keywords = {
        'UBR': ('Transport', 'Uber'),
        'LYFT': ('Transport', 'Lyft'),
        'NTFLX': ('Entertainment', 'Netflix'),
        'SPOTIFY': ('Entertainment', 'Spotify'),
        'AMZN': ('Shopping', 'Amazon'),
        'WMT': ('Groceries', 'Walmart'),
        'MCD': ('Food', 'McDonalds'),
        'SBUX': ('Food', 'Starbucks')
    }

    is_subscription = False
    
    for key, (cat, readable) in keywords.items():
        if key in raw_text:
            category = cat
            clean_name = readable
            # Simple heuristic for subscription: Entertainment + consistent small amount
            if cat == 'Entertainment' or clean_name in ['Amazon Prime', 'Gym']:
                is_subscription = True
            break

    return jsonify({
        "status": "success",
        "result": {
            "raw_text": raw_text,
            "category": category,
            "merchant_name_clean": clean_name,
            "is_potential_subscription": is_subscription
        }
    })
