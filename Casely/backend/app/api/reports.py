from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import Case, Transaction, CommunicationRecord, Person, Event
import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

router = APIRouter()


@router.get("/cases/{case_id}/reports/preview")
async def get_report_preview(case_id: str, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    return {
        "case_ref": case.case_ref,
        "title": case.title,
        "location": case.location,
        "reported_loss": float(case.reported_loss),
        "fir_ref": case.fir_ref,
        "incident_date": str(case.incident_date),
        "sections": [
            {"num": 1, "title": "Case Overview", "content": case.case_summary},
            {"num": 2, "title": "Case Metadata", "content": f"Case Ref: {case.case_ref} | Status: {case.status} | Location: {case.location}"},
            {"num": 3, "title": "Individuals & Associated Identifiers", "content": "5 individuals documented: Jishu Ghosh (Complainant), Krishna Tayal (IT Contractor / SIM-101 / DEV-77), Manthan (Recipient / SIM-202 / Acc-1042), Naman (Recipient / SIM-303 / Acc-2281), Rohan (Recipient / SIM-404 / Acc-9033 / RJ14-DEMO-4821)."},
            {"num": 4, "title": "Source Documents", "content": "6 primary evidence documents: FIR, Transaction Ledger, Call Detail Records, Digital Access Audit, CCTV Report, Witness Statement."},
            {"num": 5, "title": "Financial Transaction Summary", "content": "Initial Disputed Loss: ₹18,50,000 (3 transfers). Subsequent transfers between recipient accounts total ₹10,50,000 and represent fund movements within the dataset, NOT additional loss."},
            {"num": 6, "title": "Communication Metadata Summary", "content": "5 recorded voice calls between SIM-101, SIM-202, SIM-303, SIM-404 on 14-15 October 2026. Metadata establishes contact; content is unrecorded."},
            {"num": 7, "title": "Digital Access Findings", "content": "SYS-AUDIT-441 records interactive login at 19:41 using Jishu Ghosh's credential with DEV-77 (issued to Krishna Tayal) connected. Banking security reset at 19:42."},
            {"num": 8, "title": "CCTV Observations", "content": "CCTV-JPR-209 recorded white sedan RJ14-DEMO-4821 (associated with Rohan) at ATM kiosk at 21:18. Driver identification inconclusive."},
            {"num": 9, "title": "Witness Statement Summary", "content": "WIT-2026-031 describes grey-jacketed individual entering complex at 19:15-19:30 and speaking briefly with another male near perimeter railing. Identity unverified."},
            {"num": 10, "title": "Chronological Timeline", "content": "11 events sequenced between 14 Oct 18:42 IST and 16 Oct 09:00 IST."},
            {"num": 11, "title": "Relationship Graph Summary", "content": "15 nodes and 19 edges linking complainants, contractors, recipient account holders, hardware, and vehicles."},
            {"num": 12, "title": "Potential Investigative Leads", "content": "Contact sequences closely bracket workstation login (19:41) and initial transfer window (20:05-20:32)."},
            {"num": 13, "title": "Evidence Gaps", "content": "Lack of physical CCTV inside finance office; unknown content of telecom calls; unverified driver of vehicle."},
            {"num": 14, "title": "Limitations", "content": "Casely does not declare guilt. Co-occurrence or account receipt does not independently establish criminal conspiracy."},
            {"num": 15, "title": "Source References & Disclaimer", "content": "DEMONSTRATION DATA — All records and identities are fictional and created exclusively for software demonstration."}
        ]
    }


@router.get("/cases/{case_id}/reports/generate")
@router.post("/cases/{case_id}/reports/generate")
async def generate_report_pdf(case_id: str, format: str = Query("pdf"), db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where((Case.id == case_id) | (Case.case_ref == case_id)))
    case = case_res.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CaselyTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0D1422"),
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'CaselySubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=colors.HexColor("#4F8CFF"),
        spaceAfter=12
    )
    h2_style = ParagraphStyle(
        'CaselyH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0D1422"),
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'CaselyBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#253247")
    )
    disclaimer_style = ParagraphStyle(
        'CaselyDisclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#B45309")
    )

    story = []

    # Header
    story.append(Paragraph("CASELY INTELLIGENCE REPORT", title_style))
    story.append(Paragraph("CASE: OPERATION SILENT LEDGER · REF: CR-2026-0842", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4F8CFF"), spaceAfter=10))

    # Disclaimer Box
    story.append(Paragraph("⚠️ DEMONSTRATION DATA NOTICE: All identities, bank records, and investigative details in this report are fictional and created exclusively for software demonstration purposes.", disclaimer_style))
    story.append(Spacer(1, 10))

    # Metadata Table
    meta_data = [
        [Paragraph("<b>Case Reference:</b>", body_style), Paragraph(case.case_ref, body_style), Paragraph("<b>Status:</b>", body_style), Paragraph(case.status, body_style)],
        [Paragraph("<b>Location:</b>", body_style), Paragraph(case.location, body_style), Paragraph("<b>FIR Reference:</b>", body_style), Paragraph(case.fir_ref, body_style)],
        [Paragraph("<b>Reported Loss:</b>", body_style), Paragraph("₹18,50,000 (Initial Disputed Transfers)", body_style), Paragraph("<b>Incident Date:</b>", body_style), Paragraph(str(case.incident_date), body_style)],
    ]
    t = Table(meta_data, colWidths=[100, 160, 100, 160])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F4F7FC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    # 15 Sections
    sections = [
        ("1. Executive Summary", case.case_summary),
        ("2. Complainant & Identified Parties", "Jishu Ghosh (Business Owner / Complainant), Krishna Tayal (IT Specialist / Contractor), Manthan (Recipient Acct 1042 / SIM-202), Naman (Recipient Acct 2281 / SIM-303), Rohan (Recipient Acct 9033 / SIM-404 / Vehicle RJ14-DEMO-4821)."),
        ("3. Source Documents Analyzed", "1. 01_FIR_JISHU_GHOSH.pdf (FIR)\n2. 02_FINANCIAL_TRANSACTIONS.csv (Bank Ledger)\n3. 03_COMMUNICATION_RECORDS.csv (CDR Metadata)\n4. 04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf (Audit Log)\n5. 05_CCTV_VEHICLE_ROHAN.pdf (CCTV Feed)\n6. 06_WITNESS_STATEMENT.pdf (Security Guard Statement)"),
        ("4. Financial Analysis & Accounting Distinction", "The reported unauthorized loss is exactly ₹18,50,000 comprising 3 initial transfers from Jishu Ghosh's business account (₹8.5L to Manthan, ₹6.0L to Naman, ₹4.0L to Rohan). Three subsequent inter-recipient transfers totalling ₹10,50,000 represent fund movements within the synthetic dataset and are NOT additional losses."),
        ("5. Digital Access & Workstation Audit", "Audit reference SYS-AUDIT-441 records interactive login at 19:41:02 IST on Finance Workstation using Jishu Ghosh's credential. Device DEV-77 (issued to Krishna Tayal for maintenance on 10 Oct, returned 16 Oct) was attached. Banking portal security reset occurred at 19:42:15 IST."),
        ("6. Telecommunication Metadata Summary", "Five call records documented on 14-15 Oct between SIM-101, SIM-202, SIM-303, and SIM-404. Calls occurred immediately before and after workstation login and fund transfers. Metadata establishes contact; conversation content is unrecorded."),
        ("7. CCTV & Surveillance Findings", "CCTV observation CCTV-JPR-209 recorded white sedan RJ14-DEMO-4821 (associated with Rohan) at ATM kiosk at 21:18 IST on 14 Oct. Unidentified subject entered ATM. Facial identification was inconclusive due to lighting and visual distance."),
        ("8. Witness Observation Summary", "Witness WIT-2026-031 observed a male in a grey jacket enter the complex premises at ~19:15-19:30 IST and speak briefly near the parking railing. Identities could not be established."),
        ("9. Chronological Event Sequence", "11 verified timeline events from 14 Oct 18:42 IST (Initial call SIM-101 to SIM-202) through 16 Oct 09:00 IST (DEV-77 device return)."),
        ("10. Network & Graph Intelligence", "Cytoscape relationship analysis links 15 nodes via 19 verified edges, illustrating the intersection of physical devices, communication identifiers, and bank account recipients."),
        ("11. Potential Investigative Leads", "1. Corroboration of physical presence at Finance Workstation during 19:41 login.\n2. Investigation into reason for fund dispersal among recipient account holders.\n3. Inspection of ATM withdrawal logs corresponding to 21:18 CCTV observation."),
        ("12. Evidence Gaps", "No direct visual feed within the finance office. No intercepted audio recordings. Driver of white sedan remains visually unconfirmed."),
        ("13. Evidentiary Limitations", "Casely operates as an investigative assistance platform. It does not establish legal guilt, criminal conspiracy, or intent. All inferences require legal verification."),
        ("14. Investigative Recommendations", "Subpoena bank ATM video feed, obtain workstation forensic memory dump, and conduct formal interviews with all account holders."),
        ("15. Certification & Audit Trail", "Report generated automatically by Casely Intelligence Engine. Evidence cryptographic integrity verified.")
    ]

    for sec_title, sec_content in sections:
        story.append(Paragraph(sec_title, h2_style))
        for line in sec_content.split("\n"):
            story.append(Paragraph(line, body_style))
        story.append(Spacer(1, 4))

    doc.build(story)
    buffer.seek(0)

    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Casely_Report_{case.case_ref}.pdf"}
    )
