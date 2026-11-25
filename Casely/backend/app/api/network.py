from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import Entity, Relationship, Case

router = APIRouter()


@router.get("/cases/{case_id}/network")
async def get_network_graph(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()

    # Get all entities
    eq = select(Entity)
    if case:
        eq = eq.where(Entity.case_id == case.id)
    entities = (await db.execute(eq)).scalars().all()

    # Get all relationships
    rq = select(Relationship)
    if case:
        rq = rq.where(Relationship.case_id == case.id)
    relationships = (await db.execute(rq)).scalars().all()

    nodes = []
    node_id_map = {}

    for e in entities:
        nid = e.entity_name.lower().replace(" ", "_").replace("-", "_")
        node_id_map[e.entity_name] = nid
        nodes.append({
            "data": {
                "id": nid,
                "label": e.entity_name,
                "type": e.entity_type.lower(),
                "category": e.entity_type,
                "supporting_text": e.supporting_text,
                "verification_status": e.verification_status,
                "document": e.source_document
            }
        })

    edges = []
    for idx, r in enumerate(relationships):
        src_id = node_id_map.get(r.source_entity, r.source_entity.lower().replace(" ", "_").replace("-", "_"))
        tgt_id = node_id_map.get(r.target_entity, r.target_entity.lower().replace(" ", "_").replace("-", "_"))
        
        # Determine edge style category
        edge_type = "association"
        if "Transfer" in r.relationship_type:
            edge_type = "financial" if "Initial" in r.relationship_type else "financial_subsequent"
        elif "Call" in r.relationship_type or "SIM" in r.source_entity:
            edge_type = "communication"
        elif "Device" in r.relationship_type:
            edge_type = "device"
        elif "Vehicle" in r.relationship_type:
            edge_type = "vehicle"

        edges.append({
            "data": {
                "id": f"edge_{idx+1}",
                "source": src_id,
                "target": tgt_id,
                "label": r.relationship_type,
                "type": edge_type,
                "classification": r.classification,
                "confidence": float(r.confidence),
                "supporting_text": r.supporting_text,
                "limitations": r.limitations,
                "source_document": r.source_document
            }
        })

    return {
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "case_ref": "CR-2026-0842"
        }
    }
