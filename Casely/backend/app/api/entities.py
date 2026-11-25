from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import Entity, Case, Person
from app.schemas import EntityResponse, PersonResponse

router = APIRouter()


@router.get("/cases/{case_id}/entities", response_model=list[EntityResponse])
async def list_entities(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()

    query = select(Entity)
    if case:
        query = query.where(Entity.case_id == case.id)
    
    entities = (await db.execute(query.order_by(Entity.entity_type.asc(), Entity.entity_name.asc()))).scalars().all()
    return entities


@router.get("/cases/{case_id}/persons", response_model=list[PersonResponse])
async def list_persons(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()

    query = select(Person)
    if case:
        query = query.where(Person.case_id == case.id)
    
    persons = (await db.execute(query.order_by(Person.name.asc()))).scalars().all()
    return persons


@router.get("/entities/{entity_id}", response_model=EntityResponse)
async def get_entity(entity_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Entity).where((Entity.id == entity_id) | (Entity.entity_id == entity_id) | (Entity.entity_name == entity_id)))
    ent = res.scalar_one_or_none()
    if not ent:
        raise HTTPException(status_code=404, detail="Entity not found")
    return ent
