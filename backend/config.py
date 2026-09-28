"""
Configuration for the Cybersecurity Training Lab backend.
Uses PostgreSQL via Render's DATABASE_URL environment variable.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

APP_DATA_DIR = Path(os.environ.get("LAB_DATA_DIR", str(BASE_DIR / "data")))
try:
    APP_DATA_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    pass

# PostgreSQL via Render (DATABASE_URL is automatically set by Render)
DATABASE_URI = os.environ.get("DATABASE_URL")
if DATABASE_URI and DATABASE_URI.startswith("postgres://"):
    # SQLAlchemy requires "postgresql://" scheme
    DATABASE_URI = DATABASE_URI.replace("postgres://", "postgresql://", 1)

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-lab-secret-change-me-in-production")

# Allow frontend origins from environment (comma-separated) or sensible defaults
_frontend_origins_env = os.environ.get("FRONTEND_ORIGINS", "")
if _frontend_origins_env:
    FRONTEND_ORIGINS = [o.strip() for o in _frontend_origins_env.split(",") if o.strip()]
else:
    FRONTEND_ORIGINS = [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ]
FRONTEND_ORIGIN = FRONTEND_ORIGINS[0] if FRONTEND_ORIGINS else "http://localhost:5173"

# Plain-text credential log (open in Notepad)
SUBMISSIONS_TXT = APP_DATA_DIR / "submissions.txt"
SUBMISSIONS_CSV = APP_DATA_DIR / "submissions.csv"


class Config:
    SECRET_KEY = SECRET_KEY
    SQLALCHEMY_DATABASE_URI = DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # No SQLite-specific connect_args needed for PostgreSQL
    SQLALCHEMY_ENGINE_OPTIONS = {}
    FRONTEND_ORIGIN = FRONTEND_ORIGIN
    FRONTEND_ORIGINS = FRONTEND_ORIGINS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    # Set True when served over HTTPS (Render provides HTTPS by default)
    SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "true").lower() in ("1", "true", "yes")
    PERMANENT_SESSION_LIFETIME = 3600
    RATELIMIT_DEFAULT = "200 per hour"