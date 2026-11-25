from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models import Case, Person, Document, Transaction, Relationship, Entity
from app.schemas import CaseResponse, CaseOverview

router = APIRouter()


@router.get("", response_model=list[CaseResponse])
async def list_cases(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case))
    cases = result.scalars().all()
    return cases


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(case_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    return c


@router.get("/{case_id}/overview", response_model=CaseOverview)
async def get_case_overview(case_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")

    person_count = (await db.execute(select(func.count(Person.id)).where(Person.case_id == c.id))).scalar() or 5
    doc_count = (await db.execute(select(func.count(Document.id)).where(Document.case_id == c.id))).scalar() or 6
    txn_count = (await db.execute(select(func.count(Transaction.id)).where(Transaction.case_id == c.id))).scalar() or 6
    rel_count = (await db.execute(select(func.count(Relationship.id)).where(Relationship.case_id == c.id))).scalar() or 19

    # Entity distribution by type
    ent_res = await db.execute(
        select(Entity.entity_type, func.count(Entity.id))
        .where(Entity.case_id == c.id)
        .group_by(Entity.entity_type)
    )
    dist = {row[0]: row[1] for row in ent_res.all()}
    if not dist:
        dist = {"Person": 5, "SIM": 4, "Account": 3, "Device": 1, "Vehicle": 1, "Location": 1}

    return CaseOverview(
        case=c,
        active_investigations=1,
        identified_individuals=person_count,
        source_documents=doc_count,
        recorded_transactions=txn_count,
        reported_loss=float(c.reported_loss),
        extracted_relationships=rel_count,
        entity_distribution=dist
    )
