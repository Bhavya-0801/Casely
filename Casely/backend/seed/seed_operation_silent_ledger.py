import os
import sys
import json
import asyncio
from datetime import datetime, date

# Ensure backend directory is in python path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import engine, Base, AsyncSessionLocal
from app.models import (
    Case, Person, Document, Transaction, CommunicationRecord,
    Event, Entity, Relationship, AuditLog
)


async def seed():
    print("=" * 60)
    print("CASELY — SEEDING OPERATION SILENT LEDGER (CR-2026-0842)")
    print("=" * 60)

    # 1. Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("✓ Database tables initialized.")

    async with AsyncSessionLocal() as session:
        # 2. Case Record
        case = Case(
            case_ref="CR-2026-0842",
            title="OPERATION SILENT LEDGER",
            status="Active",
            category="Reported Unauthorized Financial Transactions",
            location="Jaipur, Rajasthan, India",
            reported_loss=1850000.00,
            incident_date=date(2026, 10, 14),
            fir_ref="FIR-JPR-2026-118",
            case_summary=(
                "On 14 October 2026, Jishu Ghosh reported unauthorized financial transactions "
                "totalling Rs 18,50,000 from his business account. This investigation involves "
                "digital access audit logs, communication metadata, fund movements across recipient "
                "accounts, CCTV observation, and witness statement. All identities are fictional."
            )
        )
        session.add(case)
        await session.flush()
        case_id = case.id
        print(f"✓ Case seeded with ID: {case_id}")

        # 3. Persons (Exactly 5 fictional individuals: Jishu Ghosh, Krishna Tayal, Manthan, Naman, Rohan)
        persons_data = [
            {"name": "Jishu Ghosh", "role": "Business Owner / Complainant", "notes": "Reported unauthorized debit transactions from business account"},
            {"name": "Krishna Tayal", "role": "IT Contractor / Person of Interest", "notes": "External IT contractor; assigned DEV-77 on 10 Oct; associated with SIM-101"},
            {"name": "Manthan", "role": "Recipient Account Holder", "notes": "Account suffix 1042; associated with SIM-202; received initial Rs 8.5L"},
            {"name": "Naman", "role": "Recipient Account Holder", "notes": "Account suffix 2281; associated with SIM-303; received initial Rs 6.0L"},
            {"name": "Rohan", "role": "Recipient Account Holder", "notes": "Account suffix 9033; associated with SIM-404; vehicle registry RJ14-DEMO-4821; received initial Rs 4.0L"}
        ]
        for p in persons_data:
            session.add(Person(case_id=case_id, name=p["name"], case_role=p["role"], notes=p["notes"]))
        print("✓ 5 Persons seeded.")

        # 4. Documents (6 source documents)
        docs_data = [
            {"filename": "01_FIR_JISHU_GHOSH.pdf", "category": "FIR / Police Report", "ref": "FIR-JPR-2026-118", "date": date(2026, 10, 15)},
            {"filename": "02_FINANCIAL_TRANSACTIONS.csv", "category": "Banking / Financial Records", "ref": "BNK-TXN-2026-881", "date": date(2026, 10, 15)},
            {"filename": "03_COMMUNICATION_RECORDS.csv", "category": "Call Detail Records (CDR)", "ref": "TEL-CDR-2026-104", "date": date(2026, 10, 15)},
            {"filename": "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", "category": "Digital Access Audit Log", "ref": "SYS-AUDIT-441", "date": date(2026, 10, 15)},
            {"filename": "05_CCTV_VEHICLE_ROHAN.pdf", "category": "CCTV Surveillance Report", "ref": "CCTV-JPR-209", "date": date(2026, 10, 15)},
            {"filename": "06_WITNESS_STATEMENT.pdf", "category": "Witness Statement", "ref": "WIT-2026-031", "date": date(2026, 10, 15)}
        ]
        for d in docs_data:
            session.add(Document(case_id=case_id, filename=d["filename"], category=d["category"], doc_ref=d["ref"], upload_date=d["date"]))
        print("✓ 6 Documents seeded.")

        # 5. Financial Transactions (Strictly 6 transactions, loss = Rs 18,50,000)
        transactions_data = [
            {"sender": "Jishu Ghosh", "sender_suffix": None, "receiver": "Manthan", "receiver_suffix": "1042", "amount": 850000.00, "type": "initial", "date": date(2026, 10, 14)},
            {"sender": "Jishu Ghosh", "sender_suffix": None, "receiver": "Naman", "receiver_suffix": "2281", "amount": 600000.00, "type": "initial", "date": date(2026, 10, 14)},
            {"sender": "Jishu Ghosh", "sender_suffix": None, "receiver": "Rohan", "receiver_suffix": "9033", "amount": 400000.00, "type": "initial", "date": date(2026, 10, 14)},
            {"sender": "Manthan", "sender_suffix": "1042", "receiver": "Naman", "receiver_suffix": "2281", "amount": 500000.00, "type": "subsequent", "date": date(2026, 10, 14)},
            {"sender": "Manthan", "sender_suffix": "1042", "receiver": "Rohan", "receiver_suffix": "9033", "amount": 200000.00, "type": "subsequent", "date": date(2026, 10, 14)},
            {"sender": "Naman", "sender_suffix": "2281", "receiver": "Rohan", "receiver_suffix": "9033", "amount": 350000.00, "type": "subsequent", "date": date(2026, 10, 15)}
        ]

        # Verification assertion:
        initial_loss = sum(t["amount"] for t in transactions_data if t["type"] == "initial")
        assert initial_loss == 1850000.00, f"Error: Initial total must be 1850000, got {initial_loss}"
        
        for t in transactions_data:
            session.add(Transaction(
                case_id=case_id,
                sender=t["sender"],
                sender_account_suffix=t["sender_suffix"],
                receiver=t["receiver"],
                receiver_account_suffix=t["receiver_suffix"],
                amount=t["amount"],
                transfer_type=t["type"],
                transaction_date=t["date"]
            ))
        print("✓ 6 Financial transactions verified & seeded (Initial Loss: ₹18,50,000).")

        # 6. Communication Records (5 Call Detail Records)
        comm_data = [
            {"caller": "SIM-101", "receiver": "SIM-202", "date": date(2026, 10, 14), "time": "18:42", "duration": 186},
            {"caller": "SIM-202", "receiver": "SIM-303", "date": date(2026, 10, 14), "time": "19:16", "duration": 94},
            {"caller": "SIM-101", "receiver": "SIM-202", "date": date(2026, 10, 14), "time": "19:38", "duration": 72},
            {"caller": "SIM-303", "receiver": "SIM-404", "date": date(2026, 10, 14), "time": "20:48", "duration": 210},
            {"caller": "SIM-202", "receiver": "SIM-404", "date": date(2026, 10, 15), "time": "08:52", "duration": 145}
        ]
        for c in comm_data:
            session.add(CommunicationRecord(
                case_id=case_id,
                caller_sim=c["caller"],
                receiver_sim=c["receiver"],
                call_date=c["date"],
                call_time=c["time"],
                duration_seconds=c["duration"]
            ))
        print("✓ 5 Communication records seeded.")

        # 7. Timeline Events (11 verified chronological events)
        events_data = [
            {"time": datetime(2026, 10, 14, 18, 42), "category": "Communication", "desc": "Contact recorded: SIM-101 (Krishna Tayal) to SIM-202 (Manthan), duration 186s.", "entities": ["Krishna Tayal", "Manthan", "SIM-101", "SIM-202"], "doc": "03_COMMUNICATION_RECORDS.csv"},
            {"time": datetime(2026, 10, 14, 19, 16), "category": "Communication", "desc": "Contact recorded: SIM-202 (Manthan) to SIM-303 (Naman), duration 94s.", "entities": ["Manthan", "Naman", "SIM-202", "SIM-303"], "doc": "03_COMMUNICATION_RECORDS.csv"},
            {"time": datetime(2026, 10, 14, 19, 38), "category": "Communication", "desc": "Contact recorded: SIM-101 (Krishna Tayal) to SIM-202 (Manthan), duration 72s.", "entities": ["Krishna Tayal", "Manthan", "SIM-101", "SIM-202"], "doc": "03_COMMUNICATION_RECORDS.csv"},
            {"time": datetime(2026, 10, 14, 19, 41), "category": "Digital Access", "desc": "Login recorded on Finance Workstation using credential assigned to Jishu Ghosh. DEV-77 attached.", "entities": ["Jishu Ghosh", "Krishna Tayal", "DEV-77"], "doc": "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf"},
            {"time": datetime(2026, 10, 14, 19, 42), "category": "Digital Access", "desc": "Banking security credential reset recorded on Finance Workstation.", "entities": ["Jishu Ghosh", "DEV-77"], "doc": "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf"},
            {"time": datetime(2026, 10, 14, 20, 5), "category": "Financial", "desc": "Unauthorized transfer window: ₹8.5L to Manthan, ₹6.0L to Naman, ₹4.0L to Rohan (Total ₹18.5L).", "entities": ["Jishu Ghosh", "Manthan", "Naman", "Rohan"], "doc": "02_FINANCIAL_TRANSACTIONS.csv"},
            {"time": datetime(2026, 10, 14, 20, 48), "category": "Communication", "desc": "Contact recorded: SIM-303 (Naman) to SIM-404 (Rohan), duration 210s.", "entities": ["Naman", "Rohan", "SIM-303", "SIM-404"], "doc": "03_COMMUNICATION_RECORDS.csv"},
            {"time": datetime(2026, 10, 14, 21, 18), "category": "CCTV", "desc": "CCTV observation of white sedan RJ14-DEMO-4821 (registered to Rohan) at ATM kiosk.", "entities": ["Rohan", "RJ14-DEMO-4821"], "doc": "05_CCTV_VEHICLE_ROHAN.pdf"},
            {"time": datetime(2026, 10, 15, 8, 52), "category": "Communication", "desc": "Contact recorded: SIM-202 (Manthan) to SIM-404 (Rohan), duration 145s.", "entities": ["Manthan", "Rohan", "SIM-202", "SIM-404"], "doc": "03_COMMUNICATION_RECORDS.csv"},
            {"time": datetime(2026, 10, 15, 10, 0), "category": "Legal / FIR", "desc": "FIR-JPR-2026-118 registered by Jishu Ghosh for reported loss of ₹18,50,000.", "entities": ["Jishu Ghosh"], "doc": "01_FIR_JISHU_GHOSH.pdf"},
            {"time": datetime(2026, 10, 16, 9, 0), "category": "Hardware", "desc": "Device return register records return of DEV-77 by Krishna Tayal.", "entities": ["Krishna Tayal", "DEV-77"], "doc": "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf"}
        ]
        for ev in events_data:
            session.add(Event(
                case_id=case_id,
                event_time=ev["time"],
                category=ev["category"],
                description=ev["desc"],
                related_entity_names=ev["entities"],
                source_document_ref=ev["doc"],
                evidence_classification="Documented"
            ))
        print("✓ 11 Timeline events seeded.")

        # 8. Entities (Categorized for Entity Explorer & Cytoscape graph)
        entities_list = [
            ("E-01", "Jishu Ghosh", "Person", "01_FIR_JISHU_GHOSH.pdf", "Complainant & business owner", "Documented"),
            ("E-02", "Krishna Tayal", "Person", "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", "IT maintenance contractor", "Documented"),
            ("E-03", "Manthan", "Person", "02_FINANCIAL_TRANSACTIONS.csv", "Recipient account holder (suffix 1042)", "Documented"),
            ("E-04", "Naman", "Person", "02_FINANCIAL_TRANSACTIONS.csv", "Recipient account holder (suffix 2281)", "Documented"),
            ("E-05", "Rohan", "Person", "02_FINANCIAL_TRANSACTIONS.csv", "Recipient account holder (suffix 9033)", "Documented"),
            ("E-06", "SIM-101", "SIM", "03_COMMUNICATION_RECORDS.csv", "Associated with Krishna Tayal", "Documented"),
            ("E-07", "SIM-202", "SIM", "03_COMMUNICATION_RECORDS.csv", "Associated with Manthan", "Documented"),
            ("E-08", "SIM-303", "SIM", "03_COMMUNICATION_RECORDS.csv", "Associated with Naman", "Documented"),
            ("E-09", "SIM-404", "SIM", "03_COMMUNICATION_RECORDS.csv", "Associated with Rohan", "Documented"),
            ("E-10", "Acc-1042", "Account", "02_FINANCIAL_TRANSACTIONS.csv", "Synthetic account held by Manthan", "Documented"),
            ("E-11", "Acc-2281", "Account", "02_FINANCIAL_TRANSACTIONS.csv", "Synthetic account held by Naman", "Documented"),
            ("E-12", "Acc-9033", "Account", "02_FINANCIAL_TRANSACTIONS.csv", "Synthetic account held by Rohan", "Documented"),
            ("E-13", "DEV-77", "Device", "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", "Hardware adapter issued to Krishna Tayal", "Documented"),
            ("E-14", "RJ14-DEMO-4821", "Vehicle", "05_CCTV_VEHICLE_ROHAN.pdf", "White sedan recorded on CCTV, associated with Rohan", "Documented"),
            ("E-15", "Finance Workstation", "Location", "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", "Physical machine logged in at 19:41", "Documented")
        ]
        for eid, name, etype, doc, text, status in entities_list:
            session.add(Entity(
                case_id=case_id,
                entity_id=eid,
                entity_name=name,
                entity_type=etype,
                source_document=doc,
                source_reference=doc,
                supporting_text=text,
                confidence=1.0,
                verification_status=status
            ))
        print("✓ 15 Entities seeded.")

        # 9. Relationships (Strict evidence classification)
        relationships_list = [
            ("Jishu Ghosh", "Disputed Initial Transfer (₹8,50,000)", "Manthan", "02_FINANCIAL_TRANSACTIONS.csv", "TXN-001 on 14 Oct", "Documented", "Account records indicate transfer execution; does not prove authorization"),
            ("Jishu Ghosh", "Disputed Initial Transfer (₹6,00,000)", "Naman", "02_FINANCIAL_TRANSACTIONS.csv", "TXN-002 on 14 Oct", "Documented", "Account records indicate transfer execution; does not prove authorization"),
            ("Jishu Ghosh", "Disputed Initial Transfer (₹4,00,000)", "Rohan", "02_FINANCIAL_TRANSACTIONS.csv", "TXN-003 on 14 Oct", "Documented", "Account records indicate transfer execution; does not prove authorization"),
            ("Manthan", "Subsequent Transfer (₹5,00,000)", "Naman", "02_FINANCIAL_TRANSACTIONS.csv", "TXN-004 on 14 Oct", "Documented", "Internal fund movement; not an additional loss"),
            ("Manthan", "Subsequent Transfer (₹2,00,000)", "Rohan", "02_FINANCIAL_TRANSACTIONS.csv", "TXN-005 on 14 Oct", "Documented", "Internal fund movement; not an additional loss"),
            ("Naman", "Subsequent Transfer (₹3,50,000)", "Rohan", "02_FINANCIAL_TRANSACTIONS.csv", "TXN-006 on 15 Oct", "Documented", "Internal fund movement; not an additional loss"),
            ("Krishna Tayal", "Associated Identifier", "SIM-101", "03_COMMUNICATION_RECORDS.csv", "Telecom subscriber registry match", "Documented", "Subscriber registration; does not prove identity of caller"),
            ("Manthan", "Associated Identifier", "SIM-202", "03_COMMUNICATION_RECORDS.csv", "Telecom subscriber registry match", "Documented", "Subscriber registration; does not prove identity of caller"),
            ("Naman", "Associated Identifier", "SIM-303", "03_COMMUNICATION_RECORDS.csv", "Telecom subscriber registry match", "Documented", "Subscriber registration; does not prove identity of caller"),
            ("Rohan", "Associated Identifier", "SIM-404", "03_COMMUNICATION_RECORDS.csv", "Telecom subscriber registry match", "Documented", "Subscriber registration; does not prove identity of caller"),
            ("DEV-77", "Device Issue Register (10 Oct)", "Krishna Tayal", "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", "Issued for scheduled network maintenance", "Documented", "Device was issued to contractor; does not prove who operated it during login"),
            ("Rohan", "Vehicle Registry Association", "RJ14-DEMO-4821", "05_CCTV_VEHICLE_ROHAN.pdf", "Partial registration match in synthetic database", "Documented", "Registry association only; does not establish driver identity"),
            ("SIM-101", "Voice Call Contact (186s)", "SIM-202", "03_COMMUNICATION_RECORDS.csv", "14 Oct 18:42 IST", "Documented", "Metadata establishes contact only; content/purpose unknown"),
            ("SIM-202", "Voice Call Contact (94s)", "SIM-303", "03_COMMUNICATION_RECORDS.csv", "14 Oct 19:16 IST", "Documented", "Metadata establishes contact only; content/purpose unknown"),
            ("SIM-101", "Voice Call Contact (72s)", "SIM-202", "03_COMMUNICATION_RECORDS.csv", "14 Oct 19:38 IST", "Documented", "Metadata establishes contact only; content/purpose unknown"),
            ("SIM-303", "Voice Call Contact (210s)", "SIM-404", "03_COMMUNICATION_RECORDS.csv", "14 Oct 20:48 IST", "Documented", "Metadata establishes contact only; content/purpose unknown"),
            ("SIM-202", "Voice Call Contact (145s)", "SIM-404", "03_COMMUNICATION_RECORDS.csv", "15 Oct 08:52 IST", "Documented", "Metadata establishes contact only; content/purpose unknown"),
            ("Krishna Tayal", "Possible Operational Opportunity", "Finance Workstation", "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", "DEV-77 connected at 19:41 login", "Inferred", "Physical presence not independently established; credential used belonged to Jishu Ghosh"),
            ("Rohan", "Possible Presence at ATM", "RJ14-DEMO-4821", "05_CCTV_VEHICLE_ROHAN.pdf", "Vehicle observed at ATM kiosk 21:18", "Inferred", "Visual clarity insufficient; driver identity unverified")
        ]
        for src, rel, tgt, doc, text, cls, lim in relationships_list:
            session.add(Relationship(
                case_id=case_id,
                source_entity=src,
                relationship_type=rel,
                target_entity=tgt,
                source_document=doc,
                supporting_text=text,
                classification=cls,
                confidence=0.95 if cls == "Documented" else 0.65,
                limitations=lim
            ))
        print("✓ 19 Relationships seeded.")

        # 10. Initial Audit Logs
        session.add(AuditLog(action="CASE_INITIALIZED", resource_type="Case", resource_id=case_id, details="Operation Silent Ledger initialized."))
        session.add(AuditLog(action="EVIDENCE_INGESTED", resource_type="Document", resource_id="ALL", details="6 Seed documents ingested and indexed."))

        await session.commit()
    print("=" * 60)
    print("ALL SEED DATA INSERTED AND COMMITTED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(seed())
