from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import CommunicationRecord, Case
from app.schemas import CommunicationResponse

router = APIRouter()

SIM_PERSON_MAP = {
    "SIM-101": "Krishna Tayal",
    "SIM-202": "Manthan",
    "SIM-303": "Naman",
    "SIM-404": "Rohan"
}


@router.get("/cases/{case_id}/communications", response_model=list[CommunicationResponse])
async def get_communications(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()

    query = select(CommunicationRecord)
    if case:
        query = query.where(CommunicationRecord.case_id == case.id)

    result = await db.execute(query.order_by(CommunicationRecord.call_date.asc(), CommunicationRecord.call_time.asc()))
    records = result.scalars().all()

    response = []
    for r in records:
        response.append(CommunicationResponse(
            id=r.id,
            caller_sim=r.caller_sim,
            caller_person=SIM_PERSON_MAP.get(r.caller_sim),
            receiver_sim=r.receiver_sim,
            receiver_person=SIM_PERSON_MAP.get(r.receiver_sim),
            call_date=r.call_date,
            call_time=r.call_time,
            duration_seconds=r.duration_seconds
        ))
    return response
