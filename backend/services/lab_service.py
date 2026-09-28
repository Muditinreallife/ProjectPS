"""
Business logic for cybersecurity training sessions and events.
Persists sessions and event data (including submitted credentials) directly to PostgreSQL.
"""

from models import db, TrainingSession, TrainingEvent


def create_session(
    synthetic_participant_id: str,
) -> TrainingSession:
    training_session = TrainingSession(
        synthetic_participant_id=synthetic_participant_id.strip()[:64],
        status="active",
    )

    db.session.add(training_session)
    db.session.commit()

    return training_session


def get_session(
    session_id: int,
) -> TrainingSession | None:
    return db.session.get(TrainingSession, session_id)


def record_event(
    session_id: int,
    event_type: str,
    simulation_result: str,
    submitted_username: str | None = None,
    submitted_password: str | None = None,
) -> TrainingEvent | None:
    training_session = get_session(session_id)

    if not training_session:
        return None

    event = TrainingEvent(
        session_id=session_id,
        event_type=event_type[:64],
        simulation_result=simulation_result[:32],
        submitted_username=(submitted_username[:256] if submitted_username else None),
        submitted_password=(submitted_password[:256] if submitted_password else None),
    )

    db.session.add(event)

    if (
        simulation_result == "success"
        and event_type == "training_completed"
    ):
        training_session.status = "completed"

    db.session.commit()

    return event