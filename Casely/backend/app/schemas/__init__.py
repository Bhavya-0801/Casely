from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime, date


class CaseResponse(BaseModel):
    id: str
    case_ref: str
    title: str
    status: str
    category: str
    location: str
    reported_loss: float
    incident_date: date
    fir_ref: str
    case_summary: str

    class Config:
        from_attributes = True


class CaseOverview(BaseModel):
    case: CaseResponse
    active_investigations: int = 1
    identified_individuals: int = 5
    source_documents: int = 6
    recorded_transactions: int = 6
    reported_loss: float = 1850000.00
    extracted_relationships: int = 20
    entity_distribution: Dict[str, int]


class PersonResponse(BaseModel):
    id: str
    name: str
    case_role: str
    notes: Optional[str] = None
    associated_identifiers: Optional[List[str]] = None

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    id: str
    sender: str
    sender_account_suffix: Optional[str] = None
    receiver: str
    receiver_account_suffix: Optional[str] = None
    amount: float
    transfer_type: str
    transaction_date: date

    class Config:
        from_attributes = True


class FinancialSummary(BaseModel):
    reported_loss: float = 1850000.00
    initial_transfers_count: int = 3
    initial_transfers_total: float = 1850000.00
    subsequent_transfers_count: int = 3
    subsequent_transfers_total: float = 1050000.00
    total_transactions: int = 6
    accounting_note: str = (
        "The initial disputed transfers from Jishu Ghosh total ₹18,50,000. "
        "The subsequent transfers between recipient accounts represent fund movements within the "
        "dataset and must not be added to the reported loss."
    )
    transactions: List[TransactionResponse]


class CommunicationResponse(BaseModel):
    id: str
    caller_sim: str
    caller_person: Optional[str] = None
    receiver_sim: str
    receiver_person: Optional[str] = None
    call_date: date
    call_time: str
    duration_seconds: int

    class Config:
        from_attributes = True


class EventResponse(BaseModel):
    id: str
    event_time: datetime
    category: str
    description: str
    related_entity_names: List[str]
    source_document_ref: str
    evidence_classification: str

    class Config:
        from_attributes = True


class EntityResponse(BaseModel):
    id: str
    entity_id: str
    entity_name: str
    entity_type: str
    source_document: str
    source_reference: str
    supporting_text: str
    confidence: float
    verification_status: str

    class Config:
        from_attributes = True


class RelationshipResponse(BaseModel):
    id: str
    source_entity: str
    relationship_type: str
    target_entity: str
    source_document: str
    supporting_text: str
    classification: str
    confidence: float
    limitations: Optional[str] = None

    class Config:
        from_attributes = True


class DocumentResponse(BaseModel):
    id: str
    filename: str
    category: str
    doc_ref: str
    processing_status: str
    upload_date: date

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    question: str
    case_id: Optional[str] = "CR-2026-0842"


class Citation(BaseModel):
    document_name: str
    reference: str
    supporting_excerpt: str


class ChatResponse(BaseModel):
    answer: str
    documented_facts: List[str]
    possible_inferences: List[str]
    evidence_references: List[Citation]
    limitations: str
    is_demo_mode: bool = True
