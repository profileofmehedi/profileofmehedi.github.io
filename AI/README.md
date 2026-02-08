# Asper AI Banking & Credit Scoring API Reference

This documentation provides a comprehensive guide to the Asper AI Toolset. These 6 APIs simulate advanced FinTech capabilities, using logic-driven AI to power credit decisions, fraud detection, financial forecasting, and customer insights.

---

## 📋 Table of Contents
1.  [Getting Started](#getting-started)
2.  [Credit Scoring API](#1-credit-scoring-api-v2)
3.  [Banking Fraud Analysis API](#2-banking-fraud-analysis-api)
4.  [Smart Cash Flow Forecast API](#3-smart-cash-flow-forecast-api)
5.  [Expense Categorization (NLP) API](#4-expense-categorization-nlp-api)
6.  [KYC Document Verification API](#5-kyc-document-verification-api)
7.  [Customer Churn Prediction API](#6-customer-churn-prediction-api)

---

## <a name="getting-started"></a>🚀 Getting Started

### Installation
1.  **Prerequisites:** Python 3.8+ and pip.
2.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Run the Server:**
    ```bash
    python app.py
    ```
    *Server runs on:* `http://localhost:5001`

---

## <a name="1-credit-scoring-api-v2"></a>1. Credit Scoring API (V2)
**Purpose:** Evaluates a user's creditworthiness using a weighted scoring model (Payment History, Utilization, Credit Age). Returns a score (300-850), risk category, and specific improvement recommendations.

*   **Endpoint:** `POST /api/v1/credit/predict`

### Request Body
| Field | Type | Description |
| :--- | :--- | :--- |
| `monthly_income` | `float` | Monthly net income. |
| `total_credit_limit` | `float` | Total limit across all credit cards. |
| `current_credit_balance` | `float` | Total amount currently owed. |
| `oldest_account_age_years` | `int` | Age of oldest credit line in years. |
| `late_payments_last_6m` | `int` | Number of late payments in past 6 months. |
| `recent_inquiries_last_3m` | `int` | Hard credit checks in past 3 months. |

### Example Request
```json
{
    "monthly_income": 5000,
    "total_credit_limit": 10000,
    "current_credit_balance": 2500,
    "oldest_account_age_years": 4,
    "late_payments_last_6m": 0,
    "recent_inquiries_last_3m": 1
}
```

### Example Response
```json
{
    "status": "success",
    "score_details": {
        "value": 720,
        "rating": "Good",
        "risk_level": "Medium",
        "max_possible": 850
    },
    "factors": {
        "positive": ["Perfect payment history", "Good credit utilization (<30%)"],
        "negative": []
    },
    "decision": {
        "approval_status": "Approved",
        "recommendation": "Good standing. Avoid opening new accounts to improve further."
    }
}
```

---

## <a name="2-banking-fraud-analysis-api"></a>2. Banking Fraud Analysis API
**Purpose:** Detects fraudulent transactions using multi-factor analysis: Amount thresholds, Merchant Risk, "Impossible Travel" (Geography), and Velocity (spam/bot checks).

*   **Endpoint:** `POST /api/v1/banking/analyze`

### Request Body
| Field | Type | Description |
| :--- | :--- | :--- |
| `transaction_amount` | `float` | Value of the transaction. |
| `merchant_category` | `string` | e.g., 'Groceries', 'Gambling', 'Electronics'. |
| `location` | `string` | City/Country of transaction. |
| `user_home_location` | `string` | User's registered home city. |
| `user_avg_transaction_val` | `float` | User's typical spending average. |
| `tx_count_last_hour` | `int` | Number of transactions in the last hour. |

### Example Request (High Risk)
```json
{
    "transaction_amount": 5000,
    "merchant_category": "Electronics",
    "location": "London",
    "user_home_location": "New York",
    "user_avg_transaction_val": 200,
    "tx_count_last_hour": 2
}
```

### Example Response
```json
{
    "status": "success",
    "fraud_analysis": {
        "risk_score": 70,
        "risk_level": "High",
        "status": "Flagged",
        "recommended_action": "Hold for Verification (SMS/Email)"
    },
    "details": {
        "flags_raised": [
            "High-risk merchant category: Electronics",
            "Huge deviation from spending habits",
            "Transaction away from home (London)"
        ]
    }
}
```

---

## <a name="3-smart-cash-flow-forecast-api"></a>3. Smart Cash Flow Forecast API
**Purpose:** Predicts end-of-month balance based on income, expenses, and upcoming bills. Warns users if they are at risk of overdraft.

*   **Endpoint:** `POST /api/v1/banking/forecast`

### Request Body
| Field | Type | Description |
| :--- | :--- | :--- |
| `current_balance` | `float` | Current account balance. |
| `avg_monthly_income` | `float` | Expected income remaining. |
| `avg_monthly_expenses` | `float` | Typical living expenses. |
| `upcoming_bills` | `list` | List of objects: `{"name": str, "amount": float}`. |

### Example Request
```json
{
    "current_balance": 1200,
    "avg_monthly_income": 3000,
    "avg_monthly_expenses": 3500,
    "upcoming_bills": [
        {"name": "Rent", "amount": 1000},
        {"name": "Car Loan", "amount": 400}
    ]
}
```

### Example Response
```json
{
    "status": "success",
    "forecast": {
        "current_balance": 1200,
        "projected_balance_eom": -700,
        "financial_health_status": "Critical",
        "alert": "Warning: You are projected to be overdraft by $700 by month-end."
    }
}
```

---

## <a name="4-expense-categorization-nlp-api"></a>4. Expense Categorization (NLP) API
**Purpose:** Cleans messy transaction strings (e.g., "UBR* Pending 242") into clean names ("Uber") and categories ("Transport"). Also detects recurring subscriptions.

*   **Endpoint:** `POST /api/v1/banking/categorize`

### Request Body
| Field | Type | Description |
| :--- | :--- | :--- |
| `transaction_description` | `string` | Raw bank statement text. |
| `amount` | `float` | Transaction amount. |

### Example Request
```json
{
    "transaction_description": "PAYPAL *NTFLX.COM 888-222 CA",
    "amount": 15.99
}
```

### Example Response
```json
{
    "status": "success",
    "result": {
        "raw_text": "PAYPAL *NTFLX.COM 888-222 CA",
        "category": "Entertainment",
        "merchant_name_clean": "Netflix",
        "is_potential_subscription": true
    }
}
```

---

## <a name="5-kyc-document-verification-api"></a>5. KYC Document Verification API
**Purpose:** Simulates Optical Character Recognition (OCR) to verify identity documents. It checks for tampering and matches names.

*   **Endpoint:** `POST /api/v1/kyc/verify-document`

### Request Body
| Field | Type | Description |
| :--- | :--- | :--- |
| `document_type` | `string` | `ID_CARD`, `PASSPORT`, or `FAKE_ID` (to test failure). |
| `user_provided_name` | `string` | Name user typed in form. |
| `image_data` | `string` | Base64 string of the image. |

### Example Request
```json
{
    "document_type": "ID_CARD",
    "user_provided_name": "John Doe",
    "image_data": "base64_string..."
}
```

### Example Response
```json
{
    "status": "success",
    "verification": {
        "status": "Verified",
        "ocr_extracted_name": "john doe",
        "confidence_score": 0.98,
        "tampering_detected": false
    }
}
```

---

## <a name="6-customer-churn-prediction-api"></a>6. Customer Churn Prediction API
**Purpose:** Analyzes user behavior (login frequency, complaints, balance) to predict if they are likely to leave the bank. Suggests retention actions.

*   **Endpoint:** `POST /api/v1/crm/churn-risk`

### Request Body
| Field | Type | Description |
| :--- | :--- | :--- |
| `days_since_last_login` | `int` | Days inactive. |
| `active_products` | `int` | Count of accounts held (Checking, Savings, etc). |
| `complaints_last_6m` | `int` | Number of support tickets filed. |
| `balance_trend` | `string` | `stable`, `increasing`, or `decreasing`. |

### Example Request (High Risk)
```json
{
    "days_since_last_login": 45,
    "active_products": 1,
    "complaints_last_6m": 1,
    "balance_trend": "decreasing"
}
```

### Example Response
```json
{
    "status": "success",
    "churn_prediction": {
        "risk_score": 85,
        "probability": "Critical",
        "primary_risk_factors": [
            "Low login activity (>30 days)", 
            "Single product user", 
            "Significant balance outflow"
        ],
        "recommended_marketing_action": "Immediate Retention Offer"
    }
}
```
