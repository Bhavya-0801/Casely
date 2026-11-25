from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import Transaction, Case
from app.schemas import FinancialSummary, TransactionResponse

router = APIRouter()


@router.get("/cases/{case_id}/transactions", response_model=FinancialSummary)
async def get_case_transactions(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()
    
    query = select(Transaction)
    if case:
        query = query.where(Transaction.case_id == case.id)
    
    result = await db.execute(query.order_by(Transaction.transaction_date.asc()))
    txns = result.scalars().all()

    initial_txns = [t for t in txns if t.transfer_type == "initial"]
    subsequent_txns = [t for t in txns if t.transfer_type == "subsequent"]

    initial_total = sum(float(t.amount) for t in initial_txns)
    subsequent_total = sum(float(t.amount) for t in subsequent_txns)

    return FinancialSummary(
        reported_loss=initial_total,  # Exactly ₹18,50,000
        initial_transfers_count=len(initial_txns),
        initial_transfers_total=initial_total,
        subsequent_transfers_count=len(subsequent_txns),
        subsequent_transfers_total=subsequent_total,
        total_transactions=len(txns),
        transactions=txns
    )
