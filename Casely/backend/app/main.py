from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import (
    cases, transactions, communications, timeline,
    network, documents, entities, relationships, reports,
    audit, auth, ai
)
from app.core.config import settings

app = FastAPI(
    title="Casely API",
    description="AI-Powered Crime Network Intelligence Platform — Every Case Has a Network.",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for demonstration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(cases.router, prefix="/api/cases", tags=["cases"])
app.include_router(transactions.router, prefix="/api", tags=["transactions"])
app.include_router(communications.router, prefix="/api", tags=["communications"])
app.include_router(timeline.router, prefix="/api", tags=["timeline"])
app.include_router(network.router, prefix="/api", tags=["network"])
app.include_router(documents.router, prefix="/api", tags=["documents"])
app.include_router(entities.router, prefix="/api", tags=["entities"])
app.include_router(relationships.router, prefix="/api", tags=["relationships"])
app.include_router(reports.router, prefix="/api", tags=["reports"])
app.include_router(audit.router, prefix="/api", tags=["audit"])
app.include_router(ai.router, prefix="/api", tags=["ai"])


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "platform": "Casely",
        "tagline": "Every Case Has a Network.",
        "case_loaded": "CR-2026-0842 (OPERATION SILENT LEDGER)",
        "mode": "Demonstration"
    }
