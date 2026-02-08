from flask import Blueprint, request, jsonify

kyc_bp = Blueprint('kyc', __name__)

@kyc_bp.route('/api/v1/kyc/verify-document', methods=['POST'])
def verify_document():
    """
    Simulates OCR document verification and tampering checks.
    """
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No input data"}), 400

    doc_type = data.get('document_type', 'ID_CARD') # ID_CARD, PASSPORT
    image_base64 = data.get('image_data', '') # In real app, this would be processed
    provided_name = data.get('user_provided_name', '').lower()
    
    # Mock OCR Extraction Logic
    # We simulate "extracting" a name based on the length of the fake image string
    # or just checking if 'image_data' is present.
    
    if len(image_base64) < 10:
        return jsonify({"status": "error", "message": "Invalid or empty image data"}), 400

    # Mock Decision Logic
    extracted_name = provided_name # Assume OCR matches for happy path
    confidence_score = 0.98
    is_tampered = False
    
    # Simulate a "Tampered" doc if the type is explicitly "FAKE_ID"
    if doc_type == "FAKE_ID":
        is_tampered = True
        confidence_score = 0.12
        extracted_name = "UNKNOWN"

    verification_status = "Verified"
    if is_tampered or confidence_score < 0.8:
        verification_status = "Rejected"
    
    return jsonify({
        "status": "success",
        "verification": {
            "status": verification_status,
            "ocr_extracted_name": extracted_name,
            "confidence_score": confidence_score,
            "tampering_detected": is_tampered
        }
    })
