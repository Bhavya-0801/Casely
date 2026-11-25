from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import Relationship, Case
from app.schemas import RelationshipResponse

router = APIRouter()


@router.get("/cases/{case_id}/relationships", response_model=list[RelationshipResponse])
async def list_relationships(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()

    query = select(Relationship)
    if case:
        query = query.where(Relationship.case_id == case.id)

    relationships = (await db.execute(query)).scalars().all()
    return relationships
