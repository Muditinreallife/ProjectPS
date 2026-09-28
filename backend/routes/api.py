"""
Flask API routes for the cybersecurity training lab (local).
"""

from datetime import datetime, timezone
import re
from flask import (
    Blueprint,
    request,
    jsonify,
    current_app,
)
from sqlalchemy import text

from models import db
from services import lab_service

api_bp = Blueprint("api", __name__)


def get_json_or_error():
    """Validates that the incoming request contains a valid JSON object."""
    if not request.is_json:
        return None, (
            jsonify({"error": "Content-Type must be application/json."}),
            415,
        )

    data = request.get_json(silent=True)

    if data is None:
        return None, (
            jsonify({"error": "Invalid or missing JSON body."}),
            400,
        )

    if not isinstance(data, dict):
        return None, (
            jsonify({"error": "JSON body must be an object."}),
            400,
        )

    return data, None


@api_bp.route("/health", methods=["GET"])
def health():
    db_ok = False
    db_error = None

    try:
        db.session.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db.session.rollback()
        db_error = "Database connection failed."

    return jsonify({
        "status": "ok" if db_ok else "degraded",
        "backend": "running",
        "database_connected": db_ok,
        "database_error": db_error,
        "message": "Cybersecurity Training Lab API (local)",
    }), 200


@api_bp.route("/lab/start", methods=["POST"])
def lab_start():
    data, err = get_json_or_error()
    if err:
        return err

    participant_id = data.get("synthetic_participant_id")

    # Validate participant ID
    if not isinstance(participant_id, str):
        return jsonify({
            "error": "synthetic_participant_id must be a string."
        }), 400

    participant_id = participant_id.strip()

    if not participant_id or len(participant_id) > 64:
        return jsonify({
            "error": "synthetic_participant_id is required (1-64 characters)."
        }), 400

    if not re.match(r"^[a-zA-Z0-9_-]+$", participant_id):
        return jsonify({
            "error": "synthetic_participant_id contains invalid characters. Use alphanumeric, hyphens, or underscores."
        }), 400

    try:
        training_session = lab_service.create_session(participant_id)

        return jsonify({
            "success": True,
            "session_id": training_session.id,
            "synthetic_participant_id": training_session.synthetic_participant_id,
            "status": training_session.status,
        }), 201

    except Exception:
        db.session.rollback()
        current_app.logger.exception("Failed to create training session")
        return jsonify({"error": "Could not create training session."}), 500


@api_bp.route("/lab/submit", methods=["POST"])
def lab_submit():
    """
    Record completion of a synthetic cybersecurity training exercise.
    Saves submitted username/password to local text files under backend/data/.
    """
    data, err = get_json_or_error()
    if err:
        return err

    # 1. Validate session_id
    raw_session_id = data.get("session_id")
    if isinstance(raw_session_id, bool) or not (
        isinstance(raw_session_id, int)
        or (isinstance(raw_session_id, str) and raw_session_id.isdigit())
    ):
        return jsonify({"error": "A valid numeric session_id is required."}), 400

    session_id = int(raw_session_id)
    if session_id <= 0:
        return jsonify({"error": "session_id must be a positive integer."}), 400

    # 2. Extract and validate training data (username & password extraction preserved)
    raw_username = data.get("username")
    raw_password = data.get("password")

    if raw_username is None or raw_password is None:
        return jsonify({
            "error": "Both 'username' and 'password' fields are required."
        }), 400

    if not isinstance(raw_username, str) or not isinstance(raw_password, str):
        return jsonify({
            "error": "'username' and 'password' must be strings."
        }), 400

    username = raw_username.strip()
    password = raw_password

    if not username:
        return jsonify({"error": "Username cannot be empty."}), 400

    if len(username) > 256:
        return jsonify({"error": "Username exceeds maximum length (256 characters)."}), 400

    if len(password) > 256:
        return jsonify({"error": "Password exceeds maximum length (256 characters)."}), 400

    try:
        # 3. Enforce session rules
        training_session = lab_service.get_session(session_id)

        if not training_session:
            return jsonify({
                "error": "Training session not found."
            }), 404

        # Check expiration if configured on the session model
        if hasattr(training_session, "is_expired") and callable(training_session.is_expired):
            if training_session.is_expired():
                return jsonify({"error": "Training session has expired."}), 410
        elif hasattr(training_session, "expires_at") and training_session.expires_at:
            now = datetime.now(timezone.utc)
            expires_at = training_session.expires_at
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if now > expires_at:
                return jsonify({"error": "Training session has expired."}), 410

        # Prevent duplicate submissions / enforce active status
        if training_session.status == "completed":
            return jsonify({
                "error": "Training session has already been completed."
            }), 409

        if training_session.status != "active":
            return jsonify({
                "error": f"Training session is not active (current status: '{training_session.status}')."
            }), 400

        # 4. Record event with extracted credentials
        event = lab_service.record_event(
            session_id,
            "training_completed",
            "success",
            submitted_username=username,
            submitted_password=password,
        )

        # Transition session to completed state to prevent replay
        if hasattr(lab_service, "complete_session"):
            lab_service.complete_session(session_id)
        elif hasattr(training_session, "status"):
            training_session.status = "completed"
            db.session.add(training_session)
            db.session.commit()

        return jsonify({
            "success": True,
            "result": "success",
            "message": "Training exercise completed.",
            "event_id": event.id if event else None,
            "session_id": session_id,
            "synthetic_participant_id": training_session.synthetic_participant_id,
        }), 200

    except Exception:
        db.session.rollback()
        current_app.logger.exception("Failed to record training completion")
        return jsonify({"error": "Could not record training event."}), 500