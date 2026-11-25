from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas import ChatRequest, ChatResponse, Citation
from app.models import AuditLog
import re

router = APIRouter()

# Grounded Answers for Suggested Questions in Operation Silent Ledger
DEMO_KNOWLEDGE_BASE = {
    "summarize": {
        "answer": "Operation Silent Ledger (CR-2026-0842) concerns reported unauthorized financial transfers totalling ₹18,50,000 from the business account of Jishu Ghosh on 14 October 2026. Evidence includes digital access logs, call records, subsequent fund movements, CCTV observation of a white sedan, and a security guard witness statement.",
        "documented_facts": [
            "Jishu Ghosh reported ₹18,50,000 debited in 3 transfers on 14 Oct 2026 between 20:05 and 20:32.",
            "Recipients were Manthan (₹8.5L), Naman (₹6.0L), and Rohan (₹4.0L).",
            "Workstation login occurred at 19:41 using Jishu Ghosh's credential with device DEV-77 attached.",
            "DEV-77 had been issued to IT contractor Krishna Tayal on 10 Oct and returned 16 Oct.",
            "Subsequent fund movements between recipient accounts redistributed ₹10,50,000."
        ],
        "possible_inferences": [
            "Workstation credential compromise may have occurred prior to or during the 19:41 login.",
            "Communication between SIM-101, SIM-202, SIM-303, and SIM-404 suggests coordinated timing with the transfers."
        ],
        "evidence_references": [
            Citation(document_name="01_FIR_JISHU_GHOSH.pdf", reference="FIR-JPR-2026-118", supporting_excerpt="Complaint of unauthorized financial transfers totalling ₹18,50,000 on 14 October 2026."),
            Citation(document_name="02_FINANCIAL_TRANSACTIONS.csv", reference="Row 1-3", supporting_excerpt="Outgoing transfers of ₹8.5L, ₹6.0L, ₹4.0L executed between 20:05 and 20:32."),
            Citation(document_name="04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", reference="SYS-AUDIT-441", supporting_excerpt="Interactive login at 19:41 using Jishu Ghosh credential; DEV-77 attached.")
        ],
        "limitations": "Logs document credential usage and device issuance, not physical operator identity. Communication metadata proves contact, not content."
    },
    "rohan": {
        "answer": "Rohan is involved in three recorded financial transactions: one initial transfer from Jishu Ghosh and two subsequent transfers from other recipient accounts, receiving a cumulative total of ₹9,50,000.",
        "documented_facts": [
            "14 Oct 2026 (Initial): Received ₹4,00,000 from Jishu Ghosh (Acc suffix 9033).",
            "14 Oct 2026 (Subsequent): Received ₹2,00,000 from Manthan (Acc suffix 1042).",
            "15 Oct 2026 (Subsequent): Received ₹3,50,000 from Naman (Acc suffix 2281).",
            "Rohan is associated with synthetic account suffix 9033, SIM-404, and vehicle registration RJ14-DEMO-4821."
        ],
        "possible_inferences": [
            "The fund movement suggests consolidation of disputed money into Rohan's account."
        ],
        "evidence_references": [
            Citation(document_name="02_FINANCIAL_TRANSACTIONS.csv", reference="TXN-003, TXN-005, TXN-006", supporting_excerpt="Transfers of ₹4,00,000, ₹2,00,000, and ₹3,50,000 credited to account suffix 9033."),
            Citation(document_name="05_CCTV_VEHICLE_ROHAN.pdf", reference="CCTV-JPR-209", supporting_excerpt="White sedan RJ14-DEMO-4821 recorded at ATM kiosk at 21:18 on 14 Oct.")
        ],
        "limitations": "Account ownership does not prove awareness of fraud origin. CCTV face clarity was insufficient to confirm Rohan was driving."
    },
    "krishna": {
        "answer": "Krishna Tayal is connected to device DEV-77 via the formal hardware issue register for maintenance duties.",
        "documented_facts": [
            "Device DEV-77 was officially issued to Krishna Tayal on 10 October 2026 for scheduled network optimization.",
            "DEV-77 was returned to the hardware register on 16 October 2026.",
            "DEV-77 was physically attached to the Finance Workstation during the 19:41 login on 14 October 2026."
        ],
        "possible_inferences": [
            "Krishna Tayal had custody of DEV-77 on the date of the unauthorized access."
        ],
        "evidence_references": [
            Citation(document_name="04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", reference="SYS-AUDIT-441, Section 3", supporting_excerpt="Device issue register records DEV-77 issued to Krishna Tayal on 10 October 2026, returned 16 October 2026.")
        ],
        "limitations": "Device custody does not independently establish that Krishna Tayal was the physical operator of the workstation at 19:41."
    },
    "communication": {
        "answer": "Communication metadata records two direct contacts between SIM-101 (Krishna Tayal) and SIM-202 (Manthan) on the evening of 14 October 2026.",
        "documented_facts": [
            "14 Oct 2026, 18:42 IST: SIM-101 called SIM-202 (duration: 186 seconds).",
            "14 Oct 2026, 19:38 IST: SIM-101 called SIM-202 (duration: 72 seconds) — occurring 3 minutes before workstation login."
        ],
        "possible_inferences": [
            "Timing of the 19:38 call suggests temporal correlation with the 19:41 workstation login."
        ],
        "evidence_references": [
            Citation(document_name="03_COMMUNICATION_RECORDS.csv", reference="CALL-001, CALL-003", supporting_excerpt="18:42 (186s) and 19:38 (72s) calls between SIM-101 and SIM-202.")
        ],
        "limitations": "Call detail records establish contact between subscriber SIMs only. Voice content, topic, and participant intent are unrecorded."
    },
    "timeline": {
        "answer": "On 14 October 2026, eight key events occurred spanning communications, digital access, fund transfers, and surveillance.",
        "documented_facts": [
            "18:42 — SIM-101 (Krishna) called SIM-202 (Manthan) for 186s.",
            "19:16 — SIM-202 (Manthan) called SIM-303 (Naman) for 94s.",
            "19:38 — SIM-101 called SIM-202 for 72s.",
            "19:41 — Finance Workstation login using Jishu Ghosh credential; DEV-77 attached.",
            "19:42 — Banking portal credential reset.",
            "20:05-20:32 — Disputed transfers executed: ₹8.5L (Manthan), ₹6.0L (Naman), ₹4.0L (Rohan).",
            "20:48 — SIM-303 (Naman) called SIM-404 (Rohan) for 210s.",
            "21:18 — CCTV recorded white sedan RJ14-DEMO-4821 (Rohan) at ATM kiosk."
        ],
        "possible_inferences": [
            "The sequence exhibits chronological clustering preceding and following the financial transfers."
        ],
        "evidence_references": [
            Citation(document_name="03_COMMUNICATION_RECORDS.csv", reference="All rows", supporting_excerpt="Telecommunication timestamps for 14 Oct."),
            Citation(document_name="04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", reference="SYS-AUDIT-441", supporting_excerpt="Login and credential reset recorded at 19:41 and 19:42."),
            Citation(document_name="02_FINANCIAL_TRANSACTIONS.csv", reference="TXN-001 to 003", supporting_excerpt="Transfer execution timestamps.")
        ],
        "limitations": "Correlation of timestamps does not constitute legal proof of coordinated conspiracy."
    },
    "documented": {
        "answer": "Directly documented relationships are those verified by explicit records: banking ledgers, telecom call logs, hardware registers, and vehicle registrations.",
        "documented_facts": [
            "Financial transfers from Jishu Ghosh to Manthan, Naman, and Rohan.",
            "Subsequent financial transfers: Manthan → Naman, Manthan → Rohan, Naman → Rohan.",
            "SIM assignments: Krishna Tayal (SIM-101), Manthan (SIM-202), Naman (SIM-303), Rohan (SIM-404).",
            "Hardware assignment: DEV-77 issued to Krishna Tayal on 10 Oct 2026.",
            "Vehicle registry association: RJ14-DEMO-4821 linked to Rohan."
        ],
        "possible_inferences": [
            "Any relationship asserting that these parties acted as a criminal syndicate is an unverified inference."
        ],
        "evidence_references": [
            Citation(document_name="02_FINANCIAL_TRANSACTIONS.csv", reference="Complete dataset", supporting_excerpt="Documented bank ledger entries."),
            Citation(document_name="03_COMMUNICATION_RECORDS.csv", reference="Complete dataset", supporting_excerpt="Documented CDR entries.")
        ],
        "limitations": "Every documented relationship reflects administrative or technical recording; none establishes criminal mens rea."
    },
    "gaps": {
        "answer": "The primary investigative gaps include lack of internal office video, unrecorded voice call content, unconfirmed workstation physical operator, and inconclusive ATM surveillance.",
        "documented_facts": [
            "No CCTV camera covers the interior of the Finance Workstation room.",
            "Voice call contents for all five CDR records are unknown.",
            "CCTV-JPR-209 visual clarity was insufficient for positive facial identification at the ATM.",
            "Witness WIT-2026-031 could not identify the individuals seen near the parking area."
        ],
        "possible_inferences": [
            "Physical access may have been gained by someone other than the credential holder."
        ],
        "evidence_references": [
            Citation(document_name="04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", reference="Section 4", supporting_excerpt="Logs do not independently establish physical operator identity."),
            Citation(document_name="05_CCTV_VEHICLE_ROHAN.pdf", reference="Section 3", supporting_excerpt="Facial recognition inconclusive due to night illumination."),
            Citation(document_name="06_WITNESS_STATEMENT.pdf", reference="WIT-2026-031", supporting_excerpt="Witness could not identify individuals.")
        ],
        "limitations": "These evidentiary gaps prevent conclusive establishment of guilt or physical identity."
    },
    "patterns": {
        "answer": "Without making assumptions regarding guilt, three notable structural patterns emerge from the evidence.",
        "documented_facts": [
            "Pattern 1 (Temporal Clustered Communication): Calls between SIMs occurred immediately prior to workstation access (19:38) and shortly after fund transfers (20:48).",
            "Pattern 2 (Fund Redistribution): Disputed funds from Jishu Ghosh were initially split across three accounts and subsequently funneled towards Rohan's account (total ₹9.5L received).",
            "Pattern 3 (Physical Proximity): Device DEV-77, issued to Krishna Tayal, was physically connected to the machine logged in at 19:41."
        ],
        "possible_inferences": [
            "The pattern is consistent with an orchestrated dispersal of funds, but requires further corroboration."
        ],
        "evidence_references": [
            Citation(document_name="02_FINANCIAL_TRANSACTIONS.csv", reference="All TXNs", supporting_excerpt="Transaction amounts and recipient sequences."),
            Citation(document_name="03_COMMUNICATION_RECORDS.csv", reference="CDR Log", supporting_excerpt="Call timings relative to incident window.")
        ],
        "limitations": "Patterns represent statistical and temporal correlations; they must not be conflated with established facts or proof of guilt."
    }
}


@router.post("/cases/{case_id}/ai/chat", response_model=ChatResponse)
async def chat(case_id: str, req: ChatRequest, db: AsyncSession = Depends(get_db)):
    q = req.question.lower()
    
    # Audit log entry
    db.add(AuditLog(
        action="AI_QUERY",
        resource_type="Case",
        resource_id=case_id,
        details=f"Question: {req.question[:100]}"
    ))
    await db.commit()

    # Match question to knowledge base
    key = "summarize"
    if "rohan" in q:
        key = "rohan"
    elif "krishna" in q or "dev-77" in q or "device" in q:
        key = "krishna"
    elif "communication" in q or "call" in q or "sim" in q:
        key = "communication"
    elif "timeline" in q or "14 october" in q or "october" in q:
        key = "timeline"
    elif "documented" in q or "relationship" in q:
        key = "documented"
    elif "gap" in q or "missing" in q:
        key = "gaps"
    elif "pattern" in q or "unusual" in q:
        key = "patterns"

    data = DEMO_KNOWLEDGE_BASE[key]
    return ChatResponse(
        answer=data["answer"],
        documented_facts=data["documented_facts"],
        possible_inferences=data["possible_inferences"],
        evidence_references=data["evidence_references"],
        limitations=data["limitations"],
        is_demo_mode=True
    )


@router.get("/prompt-lab/templates")
async def get_prompt_templates():
    return [
        {
            "id": 1,
            "name": "Entity Extraction Prompt",
            "purpose": "Extracts people, accounts, devices, SIMs, locations, and vehicles with strict evidence grounding.",
            "system_instruction": "You are an investigative document analysis assistant. Analyze the supplied document and extract all explicitly mentioned entities.\nRules:\n1. Do not invent entities.\n2. Preserve exact identifiers.\n3. Return confidence and verification status.",
            "output_format": "JSON array of Entity objects with confidence scores."
        },
        {
            "id": 2,
            "name": "Relationship Extraction Prompt",
            "purpose": "Identifies connections between entities and classifies them as Documented, Inferred, or Unverified.",
            "system_instruction": "You are an evidence-grounded relationship extraction system. Identify relationships explicitly supported by the source.\nRules:\n1. Do not assume communication proves coordination.\n2. Do not assume account ownership proves fraud knowledge.\n3. State limitations explicitly.",
            "output_format": "JSON array of Relationship objects with classification and limitations."
        },
        {
            "id": 3,
            "name": "Document Summarization Prompt",
            "purpose": "Produces concise factual summaries of police reports, CDR records, and digital audit logs.",
            "system_instruction": "Summarize the investigative record strictly distinguishing documented fact from speculative interpretation.",
            "output_format": "Structured summary with Key Events, Entities, and Limitations."
        },
        {
            "id": 4,
            "name": "Cross-Document Analysis Prompt",
            "purpose": "Identifies intersections across multiple distinct document categories without declaring criminal conspiracy.",
            "system_instruction": "Identify entities and timestamps shared across the provided document set. Highlight temporal correlations.",
            "output_format": "JSON array of CrossDocumentConnection objects."
        },
        {
            "id": 5,
            "name": "Investigation Report Generation Prompt",
            "purpose": "Generates a comprehensive 15-section investigative intelligence report with full audit trail.",
            "system_instruction": "Compile full case data into a 15-section report. Include mandatory demonstration disclaimer and neutral tone.",
            "output_format": "15-section Markdown or structured JSON document."
        }
    ]
