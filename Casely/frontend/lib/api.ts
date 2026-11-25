import {
  SEED_CASE, SEED_PERSONS, SEED_TRANSACTIONS,
  SEED_COMMUNICATIONS, SEED_DOCUMENTS, SEED_EVENTS,
  CaseData, PersonData, TransactionData, CommunicationData, DocumentData, EventData
} from "./seedData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchOverview() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/CR-2026-0842/overview`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    // Fall back to seed data
  }
  return {
    case: SEED_CASE,
    active_investigations: 1,
    identified_individuals: 5,
    source_documents: 6,
    recorded_transactions: 6,
    reported_loss: 1850000,
    extracted_relationships: 19,
    entity_distribution: { Person: 5, SIM: 4, Account: 3, Device: 1, Vehicle: 1, Location: 1 }
  };
}

export async function fetchTransactions() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/CR-2026-0842/transactions`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    // Fall back to seed data
  }
  const initial = SEED_TRANSACTIONS.filter(t => t.transfer_type === "initial");
  const subsequent = SEED_TRANSACTIONS.filter(t => t.transfer_type === "subsequent");
  return {
    reported_loss: 1850000,
    initial_transfers_count: initial.length,
    initial_transfers_total: initial.reduce((sum, t) => sum + t.amount, 0),
    subsequent_transfers_count: subsequent.length,
    subsequent_transfers_total: subsequent.reduce((sum, t) => sum + t.amount, 0),
    total_transactions: SEED_TRANSACTIONS.length,
    transactions: SEED_TRANSACTIONS,
    accounting_note: "The initial disputed transfers from Jishu Ghosh total ₹18,50,000. Subsequent inter-recipient transfers represent movement of funds within the dataset and are NOT additional losses."
  };
}

export async function fetchCommunications() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/CR-2026-0842/communications`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    // Fall back
  }
  return SEED_COMMUNICATIONS;
}

export async function fetchTimeline() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/CR-2026-0842/timeline`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    // Fall back
  }
  return SEED_EVENTS;
}

export async function fetchDocuments() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/CR-2026-0842/documents`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    // Fall back
  }
  return SEED_DOCUMENTS;
}

export async function fetchPersons() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/CR-2026-0842/persons`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    // Fall back
  }
  return SEED_PERSONS;
}

export async function fetchNetwork() {
  try {
    const res = await fetch(`${API_BASE}/api/cases/CR-2026-0842/network`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    // Fall back
  }
  // Cytoscape structure
  return {
    nodes: [
      { data: { id: "jishu", label: "Jishu Ghosh", type: "person", role: "Complainant" } },
      { data: { id: "krishna", label: "Krishna Tayal", type: "person", role: "IT Contractor" } },
      { data: { id: "manthan", label: "Manthan", type: "person", role: "Recipient Acct 1042" } },
      { data: { id: "naman", label: "Naman", type: "person", role: "Recipient Acct 2281" } },
      { data: { id: "rohan", label: "Rohan", type: "person", role: "Recipient Acct 9033" } },
      { data: { id: "sim101", label: "SIM-101", type: "sim" } },
      { data: { id: "sim202", label: "SIM-202", type: "sim" } },
      { data: { id: "sim303", label: "SIM-303", type: "sim" } },
      { data: { id: "sim404", label: "SIM-404", type: "sim" } },
      { data: { id: "dev77", label: "DEV-77", type: "device" } },
      { data: { id: "rj14", label: "RJ14-DEMO-4821", type: "vehicle" } },
      { data: { id: "acc1042", label: "Acc-1042", type: "account" } },
      { data: { id: "acc2281", label: "Acc-2281", type: "account" } },
      { data: { id: "acc9033", label: "Acc-9033", type: "account" } },
      { data: { id: "fw02", label: "Finance Workstation", type: "location" } }
    ],
    edges: [
      { data: { id: "e1", source: "jishu", target: "acc1042", label: "Initial Transfer ₹8.5L", type: "financial", classification: "Documented" } },
      { data: { id: "e2", source: "jishu", target: "acc2281", label: "Initial Transfer ₹6.0L", type: "financial", classification: "Documented" } },
      { data: { id: "e3", source: "jishu", target: "acc9033", label: "Initial Transfer ₹4.0L", type: "financial", classification: "Documented" } },
      { data: { id: "e4", source: "acc1042", target: "acc2281", label: "Subsequent Transfer ₹5.0L", type: "financial_subsequent", classification: "Documented" } },
      { data: { id: "e5", source: "acc1042", target: "acc9033", label: "Subsequent Transfer ₹2.0L", type: "financial_subsequent", classification: "Documented" } },
      { data: { id: "e6", source: "acc2281", target: "acc9033", label: "Subsequent Transfer ₹3.5L", type: "financial_subsequent", classification: "Documented" } },
      { data: { id: "e7", source: "manthan", target: "acc1042", label: "Account Holder", type: "association", classification: "Documented" } },
      { data: { id: "e8", source: "naman", target: "acc2281", label: "Account Holder", type: "association", classification: "Documented" } },
      { data: { id: "e9", source: "rohan", target: "acc9033", label: "Account Holder", type: "association", classification: "Documented" } },
      { data: { id: "e10", source: "krishna", target: "sim101", label: "Associated SIM", type: "association", classification: "Documented" } },
      { data: { id: "e11", source: "manthan", target: "sim202", label: "Associated SIM", type: "association", classification: "Documented" } },
      { data: { id: "e12", source: "naman", target: "sim303", label: "Associated SIM", type: "association", classification: "Documented" } },
      { data: { id: "e13", source: "rohan", target: "sim404", label: "Associated SIM", type: "association", classification: "Documented" } },
      { data: { id: "e14", source: "dev77", target: "krishna", label: "Hardware Issue (10 Oct)", type: "device", classification: "Documented" } },
      { data: { id: "e15", source: "rohan", target: "rj14", label: "Vehicle Registry", type: "vehicle", classification: "Documented" } },
      { data: { id: "e16", source: "sim101", target: "sim202", label: "Call 18:42 (186s)", type: "communication", classification: "Documented" } },
      { data: { id: "e17", source: "sim202", target: "sim303", label: "Call 19:16 (94s)", type: "communication", classification: "Documented" } },
      { data: { id: "e18", source: "sim101", target: "sim202", label: "Call 19:38 (72s)", type: "communication", classification: "Documented" } },
      { data: { id: "e19", source: "sim303", target: "sim404", label: "Call 20:48 (210s)", type: "communication", classification: "Documented" } },
      { data: { id: "e20", source: "sim202", target: "sim404", label: "Call 08:52 (145s)", type: "communication", classification: "Documented" } },
      { data: { id: "e21", source: "krishna", target: "fw02", label: "DEV-77 attached at 19:41 login", type: "association", classification: "Inferred" } }
    ]
  };
}

export async function askAssistant(question: string) {
  try {
    const res = await fetch(`${API_BASE}/api/cases/CR-2026-0842/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    if (res.ok) return await res.json();
  } catch {
    // Fall back
  }
  return {
    answer: "Operation Silent Ledger (CR-2026-0842) concerns reported unauthorized financial transfers totalling ₹18,50,000 from the business account of Jishu Ghosh on 14 October 2026. Evidence includes digital access logs, call records, subsequent fund movements, CCTV observation of a white sedan, and a security guard witness statement.",
    documented_facts: [
      "Jishu Ghosh reported ₹18,50,000 debited in 3 transfers on 14 Oct 2026 between 20:05 and 20:32.",
      "Recipients were Manthan (₹8.5L), Naman (₹6.0L), and Rohan (₹4.0L).",
      "Workstation login occurred at 19:41 using Jishu Ghosh's credential with device DEV-77 attached.",
      "DEV-77 had been issued to IT contractor Krishna Tayal on 10 Oct and returned 16 Oct.",
      "Subsequent fund movements between recipient accounts redistributed ₹10,50,000."
    ],
    possible_inferences: [
      "Workstation credential compromise may have occurred prior to or during the 19:41 login.",
      "Communication between SIM-101, SIM-202, SIM-303, and SIM-404 suggests coordinated timing with the transfers."
    ],
    evidence_references: [
      { document_name: "01_FIR_JISHU_GHOSH.pdf", reference: "FIR-JPR-2026-118", supporting_excerpt: "Complaint of unauthorized financial transfers totalling ₹18,50,000 on 14 October 2026." },
      { document_name: "02_FINANCIAL_TRANSACTIONS.csv", reference: "Row 1-3", supporting_excerpt: "Outgoing transfers of ₹8.5L, ₹6.0L, ₹4.0L executed between 20:05 and 20:32." }
    ],
    limitations: "Logs document credential usage and device issuance, not physical operator identity. Communication metadata proves contact, not content.",
    is_demo_mode: true
  };
}
