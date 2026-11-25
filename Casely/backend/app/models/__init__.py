import uuid
from datetime import datetime, date
from sqlalchemy import String, Text, Numeric, Date, DateTime, JSON, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_ref: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(50), default="Active")
    category: Mapped[str] = mapped_column(String(100))
    location: Mapped[str] = mapped_column(String(100))
    reported_loss: Mapped[float] = mapped_column(Numeric(15, 2), default=1850000.00)
    incident_date: Mapped[date] = mapped_column(Date)
    fir_ref: Mapped[str] = mapped_column(String(100))
    case_summary: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Person(Base):
    __tablename__ = "persons"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    case_role: Mapped[str] = mapped_column(String(100))
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    filename: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100))
    doc_ref: Mapped[str] = mapped_column(String(100))
    processing_status: Mapped[str] = mapped_column(String(50), default="Processed")
    upload_date: Mapped[date] = mapped_column(Date, default=date.today)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    sender: Mapped[str] = mapped_column(String(100))
    sender_account_suffix: Mapped[str] = mapped_column(String(20), nullable=True)
    receiver: Mapped[str] = mapped_column(String(100))
    receiver_account_suffix: Mapped[str] = mapped_column(String(20), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(15, 2))
    transfer_type: Mapped[str] = mapped_column(String(50))  # initial or subsequent
    transaction_date: Mapped[date] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CommunicationRecord(Base):
    __tablename__ = "communication_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    caller_sim: Mapped[str] = mapped_column(String(50))
    receiver_sim: Mapped[str] = mapped_column(String(50))
    call_date: Mapped[date] = mapped_column(Date)
    call_time: Mapped[str] = mapped_column(String(20))
    duration_seconds: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Event(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    event_time: Mapped[datetime] = mapped_column(DateTime)
    category: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    related_entity_names: Mapped[list] = mapped_column(JSON)
    source_document_ref: Mapped[str] = mapped_column(String(100))
    evidence_classification: Mapped[str] = mapped_column(String(50), default="Documented")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Entity(Base):
    __tablename__ = "entities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    entity_id: Mapped[str] = mapped_column(String(50))
    entity_name: Mapped[str] = mapped_column(String(100))
    entity_type: Mapped[str] = mapped_column(String(50))  # Person, Account, SIM, Device, Vehicle, Location
    source_document: Mapped[str] = mapped_column(String(100))
    source_reference: Mapped[str] = mapped_column(String(100))
    supporting_text: Mapped[str] = mapped_column(Text)
    confidence: Mapped[float] = mapped_column(Numeric(3, 2), default=1.0)
    verification_status: Mapped[str] = mapped_column(String(50), default="Documented")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Relationship(Base):
    __tablename__ = "relationships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    source_entity: Mapped[str] = mapped_column(String(100))
    relationship_type: Mapped[str] = mapped_column(String(100))
    target_entity: Mapped[str] = mapped_column(String(100))
    source_document: Mapped[str] = mapped_column(String(100))
    supporting_text: Mapped[str] = mapped_column(Text)
    classification: Mapped[str] = mapped_column(String(50))  # Documented, Inferred, Unverified
    confidence: Mapped[float] = mapped_column(Numeric(3, 2), default=1.0)
    limitations: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    action: Mapped[str] = mapped_column(String(100))
    resource_type: Mapped[str] = mapped_column(String(50))
    resource_id: Mapped[str] = mapped_column(String(100), nullable=True)
    user_id: Mapped[str] = mapped_column(String(50), default="demo-investigator")
    details: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
