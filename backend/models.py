"""
SQLAlchemy models for the cybersecurity training lab.
Training sessions and form submissions for the lab exercise.
Compatible with PostgreSQL (and SQLite for local use).
"""
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def utcnow():
    return datetime.now(timezone.utc)


class TrainingSession(db.Model):
    __tablename__ = "training_sessions"

    id = db.Column(db.Integer, primary_key=True)
    synthetic_participant_id = db.Column(
        db.String(64), nullable=False, index=True
    )
    # timezone=True is preferred for PostgreSQL; works with SQLite as well
    created_at = db.Column(
        db.DateTime(timezone=True), default=utcnow, nullable=False
    )
    status = db.Column(
        db.String(32), default="active", nullable=False
    )

    events = db.relationship(
        "TrainingEvent",
        back_populates="session",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "synthetic_participant_id": self.synthetic_participant_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "status": self.status,
        }


class TrainingEvent(db.Model):
    __tablename__ = "training_events"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(
        db.Integer,
        db.ForeignKey("training_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    event_type = db.Column(db.String(64), nullable=False)
    timestamp = db.Column(
        db.DateTime(timezone=True), default=utcnow, nullable=False
    )
    simulation_result = db.Column(db.String(32), nullable=False)
    submitted_username = db.Column(db.String(256), nullable=True)
    # Intentionally retained for the training exercise (credentials capture simulation)
    submitted_password = db.Column(db.String(256), nullable=True)

    session = db.relationship("TrainingSession", back_populates="events")

    def to_dict(self):
        participant = (
            self.session.synthetic_participant_id if self.session else None
        )
        return {
            "id": self.id,
            "session_id": self.session_id,
            "synthetic_participant_id": participant,
            "event_type": self.event_type,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "simulation_result": self.simulation_result,
            "submitted_username": self.submitted_username,
            "submitted_password": self.submitted_password,
        }