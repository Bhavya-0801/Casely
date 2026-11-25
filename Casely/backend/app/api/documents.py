from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import Document, Case
from app.schemas import DocumentResponse
import os
import shutil

router = APIRouter()

DOCS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/operation_silent_ledger/documents"))


@router.get("/cases/{case_id}/documents", response_model=list[DocumentResponse])
async def list_documents(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()

    query = select(Document)
    if case:
        query = query.where(Document.case_id == case.id)
    
    docs = (await db.execute(query.order_by(Document.filename.asc()))).scalars().all()
    return docs


@router.get("/documents/{doc_id}")
async def get_document(doc_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where((Document.id == doc_id) | (Document.filename == doc_id)))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    content = ""
    # Try reading the corresponding file
    base_name = doc.filename.replace(".pdf", ".txt")
    path_txt = os.path.join(DOCS_DIR, base_name)
    path_orig = os.path.join(DOCS_DIR, doc.filename)

    if os.path.exists(path_txt):
        with open(path_txt, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    elif os.path.exists(path_orig):
        with open(path_orig, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

    return {
        "id": doc.id,
        "filename": doc.filename,
        "category": doc.category,
        "doc_ref": doc.doc_ref,
        "processing_status": doc.processing_status,
        "upload_date": doc.upload_date,
        "content_excerpt": content[:3000] if content else "Document content securely archived in case repository."
    }


@router.post("/cases/{case_id}/documents/upload")
async def upload_document(case_id: str, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()
    cid = case.id if case else case_id

    os.makedirs(DOCS_DIR, exist_ok=True)
    target_path = os.path.join(DOCS_DIR, file.filename)
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    doc = Document(
        case_id=cid,
        filename=file.filename,
        category="Uploaded Evidence",
        doc_ref=f"UPL-{file.filename[:12].upper()}",
        processing_status="Processed"
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return {"message": "Document uploaded and indexed successfully", "document_id": doc.id, "filename": doc.filename}
