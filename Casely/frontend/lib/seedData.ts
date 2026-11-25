// Seed dataset for Casely — Operation Silent Ledger (CR-2026-0842)

export interface CaseData {
  case_ref: string;
  title: string;
  status: string;
  category: string;
  location: string;
  reported_loss: number;
  incident_date: string;
  fir_ref: string;
  case_summary: string;
}

export interface PersonData {
  name: string;
  case_role: string;
  notes: string;
  associated_ids: string[];
}

export interface TransactionData {
  id: string;
  date: string;
  sender: string;
  sender_account_suffix?: string;
  receiver: string;
  receiver_account_suffix?: string;
  amount: number;
  transfer_type: "initial" | "subsequent";
  notes: string;
}

export interface CommunicationData {
  id: string;
  date: string;
  time: string;
  caller_sim: string;
  caller_person: string;
  receiver_sim: string;
  receiver_person: string;
  duration_seconds: number;
}

export interface EventData {
  id: string;
  event_time: string;
  category: string;
  description: string;
  related_entity_names: string[];
  source_document_ref: string;
  evidence_classification: string;
}

export interface DocumentData {
  id: string;
  filename: string;
  category: string;
  doc_ref: string;
  upload_date: string;
  processing_status: string;
  summary: string;
}

export const SEED_CASE: CaseData = {
  case_ref: "CR-2026-0842",
  title: "OPERATION SILENT LEDGER",
  status: "Active",
  category: "Reported Unauthorized Financial Transactions",
  location: "Jaipur, Rajasthan, India",
  reported_loss: 1850000,
  incident_date: "2026-10-14",
  fir_ref: "FIR-JPR-2026-118",
  case_summary: "On 14 October 2026, Jishu Ghosh reported unauthorized financial transactions totalling ₹18,50,000 from his business account. This investigation involves digital access audit logs, communication metadata, fund movements across recipient accounts, CCTV observation, and witness statement. All identities are fictional."
};

export const SEED_PERSONS: PersonData[] = [
  {
    name: "Jishu Ghosh",
    case_role: "Business Owner / Complainant",
    notes: "Reported unauthorized debit transactions from business account",
    associated_ids: ["Cred-JGhosh", "WORKSTATION-FIN-02"]
  },
  {
    name: "Krishna Tayal",
    case_role: "IT Contractor / Person of Interest",
    notes: "External IT contractor; assigned DEV-77 on 10 Oct; associated with SIM-101",
    associated_ids: ["SIM-101", "DEV-77"]
  },
  {
    name: "Manthan",
    case_role: "Recipient Account Holder",
    notes: "Account suffix 1042; associated with SIM-202; received initial ₹8.5L",
    associated_ids: ["Acc-1042", "SIM-202"]
  },
  {
    name: "Naman",
    case_role: "Recipient Account Holder",
    notes: "Account suffix 2281; associated with SIM-303; received initial ₹6.0L",
    associated_ids: ["Acc-2281", "SIM-303"]
  },
  {
    name: "Rohan",
    case_role: "Recipient Account Holder",
    notes: "Account suffix 9033; associated with SIM-404; vehicle registry RJ14-DEMO-4821; received initial ₹4.0L",
    associated_ids: ["Acc-9033", "SIM-404", "RJ14-DEMO-4821"]
  }
];

export const SEED_TRANSACTIONS: TransactionData[] = [
  { id: "TXN-001", date: "2026-10-14", sender: "Jishu Ghosh", receiver: "Manthan", receiver_account_suffix: "1042", amount: 850000, transfer_type: "initial", notes: "Reported unauthorized transfer" },
  { id: "TXN-002", date: "2026-10-14", sender: "Jishu Ghosh", receiver: "Naman", receiver_account_suffix: "2281", amount: 600000, transfer_type: "initial", notes: "Reported unauthorized transfer" },
  { id: "TXN-003", date: "2026-10-14", sender: "Jishu Ghosh", receiver: "Rohan", receiver_account_suffix: "9033", amount: 400000, transfer_type: "initial", notes: "Reported unauthorized transfer" },
  { id: "TXN-004", date: "2026-10-14", sender: "Manthan", sender_account_suffix: "1042", receiver: "Naman", receiver_account_suffix: "2281", amount: 500000, transfer_type: "subsequent", notes: "Internal fund movement (not additional loss)" },
  { id: "TXN-005", date: "2026-10-14", sender: "Manthan", sender_account_suffix: "1042", receiver: "Rohan", receiver_account_suffix: "9033", amount: 200000, transfer_type: "subsequent", notes: "Internal fund movement (not additional loss)" },
  { id: "TXN-006", date: "2026-10-15", sender: "Naman", sender_account_suffix: "2281", receiver: "Rohan", receiver_account_suffix: "9033", amount: 350000, transfer_type: "subsequent", notes: "Internal fund movement (not additional loss)" }
];

export const SEED_COMMUNICATIONS: CommunicationData[] = [
  { id: "CALL-001", date: "2026-10-14", time: "18:42", caller_sim: "SIM-101", caller_person: "Krishna Tayal", receiver_sim: "SIM-202", receiver_person: "Manthan", duration_seconds: 186 },
  { id: "CALL-002", date: "2026-10-14", time: "19:16", caller_sim: "SIM-202", caller_person: "Manthan", receiver_sim: "SIM-303", receiver_person: "Naman", duration_seconds: 94 },
  { id: "CALL-003", date: "2026-10-14", time: "19:38", caller_sim: "SIM-101", caller_person: "Krishna Tayal", receiver_sim: "SIM-202", receiver_person: "Manthan", duration_seconds: 72 },
  { id: "CALL-004", date: "2026-10-14", time: "20:48", caller_sim: "SIM-303", caller_person: "Naman", receiver_sim: "SIM-404", receiver_person: "Rohan", duration_seconds: 210 },
  { id: "CALL-005", date: "2026-10-15", time: "08:52", caller_sim: "SIM-202", caller_person: "Manthan", receiver_sim: "SIM-404", receiver_person: "Rohan", duration_seconds: 145 }
];

export const SEED_DOCUMENTS: DocumentData[] = [
  { id: "DOC-01", filename: "01_FIR_JISHU_GHOSH.pdf", category: "FIR / Police Report", doc_ref: "FIR-JPR-2026-118", upload_date: "2026-10-15", processing_status: "Processed", summary: "First Information Report filed by Jishu Ghosh reporting ₹18,50,000 in unauthorized debits on 14 October 2026." },
  { id: "DOC-02", filename: "02_FINANCIAL_TRANSACTIONS.csv", category: "Banking / Financial Records", doc_ref: "BNK-TXN-2026-881", upload_date: "2026-10-15", processing_status: "Processed", summary: "Bank audit records confirming initial transfers of ₹8.5L, ₹6.0L, ₹4.0L and subsequent recipient transfers." },
  { id: "DOC-03", filename: "03_COMMUNICATION_RECORDS.csv", category: "Call Detail Records (CDR)", doc_ref: "TEL-CDR-2026-104", upload_date: "2026-10-15", processing_status: "Processed", summary: "CDR logs indicating voice calls between SIM-101, SIM-202, SIM-303, and SIM-404 on 14-15 October." },
  { id: "DOC-04", filename: "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", category: "Digital Access Audit Log", doc_ref: "SYS-AUDIT-441", upload_date: "2026-10-15", processing_status: "Processed", summary: "Workstation login at 19:41 using Jishu Ghosh's credential with device DEV-77 (issued to Krishna Tayal) attached." },
  { id: "DOC-05", filename: "05_CCTV_VEHICLE_ROHAN.pdf", category: "CCTV Surveillance Report", doc_ref: "CCTV-JPR-209", upload_date: "2026-10-15", processing_status: "Processed", summary: "White sedan RJ14-DEMO-4821 (associated with Rohan) recorded at ATM kiosk at 21:18. Driver identification inconclusive." },
  { id: "DOC-06", filename: "06_WITNESS_STATEMENT.pdf", category: "Witness Statement", doc_ref: "WIT-2026-031", upload_date: "2026-10-15", processing_status: "Processed", summary: "Security guard statement describing a male in a grey jacket on premises at 19:15-19:30 speaking with another individual." }
];

export const SEED_EVENTS: EventData[] = [
  { id: "EV-01", event_time: "2026-10-14T18:42:00", category: "Communication", description: "SIM-101 (Krishna Tayal) calls SIM-202 (Manthan) for 186 seconds.", related_entity_names: ["Krishna Tayal", "Manthan", "SIM-101", "SIM-202"], source_document_ref: "03_COMMUNICATION_RECORDS.csv", evidence_classification: "Documented" },
  { id: "EV-02", event_time: "2026-10-14T19:16:00", category: "Communication", description: "SIM-202 (Manthan) calls SIM-303 (Naman) for 94 seconds.", related_entity_names: ["Manthan", "Naman", "SIM-202", "SIM-303"], source_document_ref: "03_COMMUNICATION_RECORDS.csv", evidence_classification: "Documented" },
  { id: "EV-03", event_time: "2026-10-14T19:38:00", category: "Communication", description: "SIM-101 (Krishna Tayal) calls SIM-202 (Manthan) for 72 seconds.", related_entity_names: ["Krishna Tayal", "Manthan", "SIM-101", "SIM-202"], source_document_ref: "03_COMMUNICATION_RECORDS.csv", evidence_classification: "Documented" },
  { id: "EV-04", event_time: "2026-10-14T19:41:00", category: "Digital Access", description: "Finance Workstation login using Jishu Ghosh's credential. Device DEV-77 connected.", related_entity_names: ["Jishu Ghosh", "Krishna Tayal", "DEV-77"], source_document_ref: "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", evidence_classification: "Documented" },
  { id: "EV-05", event_time: "2026-10-14T19:42:00", category: "Digital Access", description: "Banking security credential reset executed on Finance Workstation.", related_entity_names: ["Jishu Ghosh", "DEV-77"], source_document_ref: "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", evidence_classification: "Documented" },
  { id: "EV-06", event_time: "2026-10-14T20:05:00", category: "Financial", description: "Unauthorized transfer window: ₹8.5L (Manthan), ₹6.0L (Naman), ₹4.0L (Rohan) from Jishu Ghosh account.", related_entity_names: ["Jishu Ghosh", "Manthan", "Naman", "Rohan"], source_document_ref: "02_FINANCIAL_TRANSACTIONS.csv", evidence_classification: "Documented" },
  { id: "EV-07", event_time: "2026-10-14T20:48:00", category: "Communication", description: "SIM-303 (Naman) calls SIM-404 (Rohan) for 210 seconds.", related_entity_names: ["Naman", "Rohan", "SIM-303", "SIM-404"], source_document_ref: "03_COMMUNICATION_RECORDS.csv", evidence_classification: "Documented" },
  { id: "EV-08", event_time: "2026-10-14T21:18:00", category: "CCTV", description: "CCTV observation of white sedan RJ14-DEMO-4821 (associated with Rohan) at ATM kiosk.", related_entity_names: ["Rohan", "RJ14-DEMO-4821"], source_document_ref: "05_CCTV_VEHICLE_ROHAN.pdf", evidence_classification: "Documented" },
  { id: "EV-09", event_time: "2026-10-15T08:52:00", category: "Communication", description: "SIM-202 (Manthan) calls SIM-404 (Rohan) for 145 seconds.", related_entity_names: ["Manthan", "Rohan", "SIM-202", "SIM-404"], source_document_ref: "03_COMMUNICATION_RECORDS.csv", evidence_classification: "Documented" },
  { id: "EV-10", event_time: "2026-10-15T10:00:00", category: "Legal / FIR", description: "FIR-JPR-2026-118 registered by Jishu Ghosh for reported loss of ₹18,50,000.", related_entity_names: ["Jishu Ghosh"], source_document_ref: "01_FIR_JISHU_GHOSH.pdf", evidence_classification: "Documented" },
  { id: "EV-11", event_time: "2026-10-16T09:00:00", category: "Hardware", description: "Device return register records return of DEV-77 by Krishna Tayal.", related_entity_names: ["Krishna Tayal", "DEV-77"], source_document_ref: "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", evidence_classification: "Documented" }
];
