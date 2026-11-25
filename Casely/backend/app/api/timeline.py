from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import Event, Case
from app.schemas import EventResponse

router = APIRouter()


@router.get("/cases/{case_id}/timeline", response_model=list[EventResponse])
async def get_timeline(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()

    query = select(Event)
    if case:
        query = query.where(Event.case_id == case.id)

    result = await db.execute(query.order_by(Event.event_time.asc()))
    events = result.scalars().all()
    return events
