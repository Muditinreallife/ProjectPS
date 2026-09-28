"""
Cybersecurity Training Lab — Flask backend.
Supports local development and production on Render.
Run locally:  python app.py
Production:   gunicorn app:app  (Render sets PORT automatically)
"""
import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config import Config, FRONTEND_ORIGINS
from models import db
from routes.api import api_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS — origins come from Config / FRONTEND_ORIGINS (env-driven)
    allowed = list(FRONTEND_ORIGINS)
    CORS(
        app,
        origins=allowed,
        supports_credentials=True,
        allow_headers=["Content-Type"],
        methods=["GET", "POST", "OPTIONS"],
    )

    db.init_app(app)

    Limiter(
        get_remote_address,
        app=app,
        default_limits=[getattr(Config, "RATELIMIT_DEFAULT", "200 per hour")],
        storage_uri="memory://",
    )

    app.register_blueprint(api_bp, url_prefix="/api")

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({"error": "Rate limit exceeded. Please wait and try again."}), 429

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found."}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error."}), 500

    @app.route("/")
    def root():
        db_uri = app.config.get("SQLALCHEMY_DATABASE_URI") or ""
        if db_uri.startswith("postgresql"):
            db_label = "postgresql"
        elif db_uri.startswith("sqlite"):
            db_label = "sqlite"
        else:
            db_label = "unknown"

        mode = "production" if os.environ.get("RENDER") or os.environ.get("DATABASE_URL") else "local"

        return jsonify(
            {
                "service": "Cybersecurity Training Lab API",
                "health": "/api/health",
                "database": db_label,
                "mode": mode,
            }
        )

    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f"[lab] Database init warning: {e}")

    return app


app = create_app()


if __name__ == "__main__":
    # Render (and most PaaS) inject PORT; bind to 0.0.0.0 so the service is reachable
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "5000"))
    debug = os.environ.get("FLASK_DEBUG", "0").lower() in ("1", "true", "yes")

    print("=" * 60)
    print("  Cybersecurity Training Lab — Backend")
    print(f"  http://{host}:{port}")
    print(f"  Database URI present: {bool(app.config.get('SQLALCHEMY_DATABASE_URI'))}")
    print(f"  CORS origins: {FRONTEND_ORIGINS}")
    print(f"  Debug: {debug}")
    print("=" * 60)
    app.run(host=host, port=port, debug=debug, use_reloader=False)