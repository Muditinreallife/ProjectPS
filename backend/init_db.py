"""
Initialize or migrate the PostgreSQL schema. No SQLite file is used.
 
Safe to re-run:
  - If a Flask-Migrate `migrations/` folder exists, runs `upgrade` (applies pending migrations).
  - Otherwise falls back to `db.create_all()` (creates missing tables, never drops data).
 
Requires DATABASE_URL, e.g.:
  export DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
 
  python init_db.py
"""
import os
import sys
from pathlib import Path
 
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))
 
try:  # optional: load backend/.env if python-dotenv is installed
    from dotenv import load_dotenv
 
    load_dotenv(BACKEND_DIR / ".env")
except ImportError:
    pass
 
 
def get_database_url() -> str:
    url = os.environ.get("DATABASE_URL", "").strip()
    if not url:
        sys.exit("ERROR: DATABASE_URL is not set (expected a PostgreSQL URL).")
    # Heroku/Render-style URLs use the "postgres://" scheme, which SQLAlchemy 1.4+ rejects.
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if not url.startswith("postgresql"):
        sys.exit("ERROR: DATABASE_URL must be a PostgreSQL URL, got: "
                 f"{url.split(':', 1)[0]}://...")
    return url
 
 
# Must be set before create_app() so the app config picks it up.
os.environ["DATABASE_URL"] = get_database_url()
 
from sqlalchemy import inspect, text  # noqa: E402
 
from app import create_app  # noqa: E402
from models import db  # noqa: E402
 
 
def main():
    app = create_app()
    # Guarantee the app is really pointed at Postgres, even if its config has a SQLite default.
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
 
    with app.app_context():
        engine = db.engine
        if engine.dialect.name != "postgresql":
            sys.exit(f"ERROR: engine dialect is '{engine.dialect.name}', expected 'postgresql'.")
 
        with engine.connect() as conn:
            version = conn.execute(text("SHOW server_version")).scalar()
        print(f"Engine: PostgreSQL {version}")
 
        migrations_dir = BACKEND_DIR / "migrations"
        if migrations_dir.is_dir():
            from flask_migrate import upgrade
 
            print("Applying migrations...")
            upgrade(directory=str(migrations_dir))
        else:
            print("No migrations/ folder found; running create_all()...")
            db.create_all()
 
        tables = sorted(inspect(engine).get_table_names())
        print(f"Tables ({len(tables)}): {', '.join(tables) or '(none)'}")
        print("Database ready (existing data preserved).")
        print("Done.")
 
 
if __name__ == "__main__":
    main()
 
