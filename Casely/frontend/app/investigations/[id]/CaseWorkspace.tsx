"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText, Users, DollarSign, PhoneCall, Cpu, Video,
  Clock, Network, Brain, FileBarChart, Info, AlertTriangle, ShieldCheck
} from "lucide-react";
import {
  SEED_CASE, SEED_PERSONS, SEED_TRANSACTIONS,
  SEED_COMMUNICATIONS, SEED_DOCUMENTS, SEED_EVENTS
} from "@/lib/seedData";

export default function CaseWorkspace() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "people", label: "People (5)", icon: Users },
    { id: "documents", label: "Documents (6)", icon: FileText },
    { id: "financial", label: "Financial Records", icon: DollarSign },
    { id: "communication", label: "Communications", icon: PhoneCall },
    { id: "digital", label: "Digital Evidence", icon: Cpu },
    { id: "cctv", label: "CCTV Observations", icon: Video },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "network", label: "Network Graph", icon: Network },
    { id: "ai", label: "AI Analysis", icon: Brain },
    { id: "reports", label: "Reports", icon: FileBarChart },
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE CASE
              </span>
              <span className="text-xs font-mono text-[#8EAB85]">{SEED_CASE.case_ref}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#F4F7F2] mt-1.5">{SEED_CASE.title}</h1>
            <p className="text-xs text-[#9BB095] mt-0.5">{SEED_CASE.category} · {SEED_CASE.location}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-[#9BB095] block">Reported Loss</span>
              <span className="text-xl font-bold font-mono text-[#EF5350]">₹18,50,000</span>
            </div>
            <Link
              href="/reports"
              className="px-4 py-2 rounded-lg bg-[#6D8F63] hover:bg-[#597850] text-white text-xs font-semibold shadow"
            >
              Export Report
            </Link>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1 mt-6 pt-4 border-t border-[#1A2619]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#6D8F63] text-white shadow-md shadow-[#6D8F63]/20 font-semibold"
                    : "text-[#9BB095] hover:text-[#F4F7F2] hover:bg-[#121A11]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        {/* 1. Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#F4F7F2]">Case Narrative & Summary</h3>
            <p className="text-xs text-[#9BB095] leading-relaxed">{SEED_CASE.case_summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#1A2619]">
              <div className="p-4 rounded-lg bg-[#050805] border border-[#1A2619]">
                <h4 className="text-xs font-semibold text-[#6D8F63]">Incident Specifics</h4>
                <div className="mt-2 text-xs space-y-1 text-[#9BB095]">
                  <div>Date: <span className="text-[#F4F7F2]">{SEED_CASE.incident_date}</span></div>
                  <div>FIR Ref: <span className="text-[#F4F7F2]">{SEED_CASE.fir_ref}</span></div>
                  <div>Station: <span className="text-[#F4F7F2]">Cyber Crime Police Station, Jaipur</span></div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#050805] border border-[#1A2619]">
                <h4 className="text-xs font-semibold text-[#8EAB85]">Target System</h4>
                <div className="mt-2 text-xs space-y-1 text-[#9BB095]">
                  <div>Workstation: <span className="text-[#F4F7F2]">WORKSTATION-FIN-02</span></div>
                  <div>Audit Reference: <span className="text-[#F4F7F2]">SYS-AUDIT-441</span></div>
                  <div>Attached Hardware: <span className="text-[#F4F7F2]">DEV-77 (Issued to Krishna Tayal)</span></div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#050805] border border-[#1A2619]">
                <h4 className="text-xs font-semibold text-[#F5B942]">Financial Distribution</h4>
                <div className="mt-2 text-xs space-y-1 text-[#9BB095]">
                  <div>Initial Debits: <span className="text-[#EF5350] font-bold">₹18,50,000 (3 transfers)</span></div>
                  <div>Recipient Accounts: <span className="text-[#F4F7F2]">Manthan, Naman, Rohan</span></div>
                  <div>Subsequent Movement: <span className="text-[#7CA171]">₹10,50,000 (3 transfers)</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. People Tab */}
        {activeTab === "people" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#F4F7F2]">Five Identified Individuals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SEED_PERSONS.map((p, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#050805] border border-[#1A2619]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#F4F7F2]">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#121A11] text-[#6D8F63] font-medium border border-[#1A2619]">
                      {p.case_role.split("/")[0]}
                    </span>
                  </div>
                  <p className="text-xs text-[#9BB095] mt-2">{p.notes}</p>
                  <div className="mt-3 pt-2 border-t border-[#1A2619] flex flex-wrap gap-1">
                    {p.associated_ids.map((id, i) => (
                      <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A0F09] text-[#8EAB85] border border-[#1A2619]">
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Documents Tab */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#F4F7F2]">Six Case Evidence Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SEED_DOCUMENTS.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#050805] border border-[#1A2619] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#6D8F63]">{doc.filename}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {doc.processing_status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8EAB85] mt-1">{doc.category} · Ref: {doc.doc_ref}</div>
                    <p className="text-xs text-[#9BB095] mt-2">{doc.summary}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#1A2619] flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Date: {doc.upload_date}</span>
                    <Link href="/documents" className="text-[#6D8F63] hover:underline font-medium">View Content →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Financial Records Tab */}
        {activeTab === "financial" && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#2A1E0B] border border-[#F5B942]/30 text-xs text-[#F5B942]">
              <strong>Accounting Rule:</strong> Initial disputed loss is ₹18,50,000. The 3 subsequent transfers (₹10,50,000) represent internal movement between recipient accounts and are NOT added to the reported loss.
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#050805] text-[#9BB095] uppercase text-[10px] border-b border-[#1A2619]">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Sender</th>
                  <th className="p-2.5">Receiver</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2619]/50">
                {SEED_TRANSACTIONS.map((t, idx) => (
                  <tr key={idx} className="hover:bg-[#121A11]">
                    <td className="p-2.5 font-mono text-[#8EAB85]">{t.id}</td>
                    <td className="p-2.5 text-[#9BB095]">{t.date}</td>
                    <td className="p-2.5 font-medium text-[#F4F7F2]">{t.sender}</td>
                    <td className="p-2.5 font-medium text-[#F4F7F2]">{t.receiver} {t.receiver_account_suffix && `(Acc-${t.receiver_account_suffix})`}</td>
                    <td className="p-2.5 font-mono font-bold text-[#F4F7F2]">₹{t.amount.toLocaleString("en-IN")}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${t.transfer_type === "initial" ? "bg-[#6D8F63]/20 text-[#6D8F63] border border-[#6D8F63]/30" : "bg-[#7CA171]/20 text-[#7CA171] border border-[#7CA171]/30"}`}>
                        {t.transfer_type === "initial" ? "Initial Disputed" : "Subsequent Internal"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Communication Records Tab */}
        {activeTab === "communication" && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619] text-xs text-[#9BB095]">
              Notice: Call Detail Records (CDR) establish subscriber contact and duration only. Voice content is unrecorded.
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#050805] text-[#9BB095] uppercase text-[10px] border-b border-[#1A2619]">
                <tr>
                  <th className="p-2.5">Record</th>
                  <th className="p-2.5">Date & Time</th>
                  <th className="p-2.5">Caller SIM & Person</th>
                  <th className="p-2.5">Receiver SIM & Person</th>
                  <th className="p-2.5">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2619]/50">
                {SEED_COMMUNICATIONS.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#121A11]">
                    <td className="p-2.5 font-mono text-[#8EAB85]">{c.id}</td>
                    <td className="p-2.5 text-[#9BB095]">{c.date} at {c.time} IST</td>
                    <td className="p-2.5 text-[#F4F7F2]">
                      <span className="font-mono text-[#8EAB85]">{c.caller_sim}</span> ({c.caller_person})
                    </td>
                    <td className="p-2.5 text-[#F4F7F2]">
                      <span className="font-mono text-[#8EAB85]">{c.receiver_sim}</span> ({c.receiver_person})
                    </td>
                    <td className="p-2.5 font-mono text-[#F4F7F2]">{c.duration_seconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. Digital Evidence Tab */}
        {activeTab === "digital" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#F4F7F2]">Digital Access Audit: SYS-AUDIT-441</h3>
            <div className="p-4 rounded-lg bg-[#050805] border border-[#1A2619] space-y-2 text-xs">
              <div><strong>Target Machine:</strong> WORKSTATION-FIN-02 (Finance Workstation)</div>
              <div><strong>Recorded Login:</strong> 14 October 2026 at 19:41:02 IST</div>
              <div><strong>Credential Used:</strong> Assigned to Jishu Ghosh</div>
              <div><strong>Attached Hardware:</strong> DEV-77 (External Diagnostic Adapter)</div>
              <div><strong>Device Register:</strong> Issued to Krishna Tayal on 10 Oct 2026; returned 16 Oct 2026</div>
              <div><strong>Banking Portal Security Reset:</strong> 19:42:15 IST</div>
              <div className="p-3 mt-3 rounded bg-[#0A0F09] border border-[#1A2619] text-amber-300/90">
                <strong>Limitation Note:</strong> Logs establish credential entry and hardware attachment. They do not independently confirm who physically operated the keyboard.
              </div>
            </div>
          </div>
        )}

        {/* 7. CCTV Tab */}
        {activeTab === "cctv" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#F4F7F2]">CCTV Surveillance Observation: CCTV-JPR-209</h3>
            <div className="p-4 rounded-lg bg-[#050805] border border-[#1A2619] space-y-2 text-xs">
              <div><strong>Location:</strong> JLN Marg / Malviya Nagar ATM Kiosk junction</div>
              <div><strong>Recorded Time:</strong> 14 October 2026 at 21:18:22 IST</div>
              <div><strong>Vehicle Observed:</strong> White sedan bearing partial registration RJ14-DEMO-4821</div>
              <div><strong>Synthetic Registry Match:</strong> RJ14-DEMO-4821 is registered to Rohan</div>
              <div><strong>Observation:</strong> Subject exited vehicle and entered ATM enclosure</div>
              <div className="p-3 mt-3 rounded bg-[#0A0F09] border border-[#1A2619] text-amber-300/90">
                <strong>Limitation Note:</strong> Facial clarity was insufficient to identify driver. Observation does not prove Rohan was present or that the ATM visit was connected to the fraud.
              </div>
            </div>
          </div>
        )}

        {/* 8. Timeline Tab */}
        {activeTab === "timeline" && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#F4F7F2]">Chronological Events (11 Seeded Records)</h3>
            <div className="space-y-2">
              {SEED_EVENTS.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#050805] border border-[#1A2619] text-xs">
                  <div className="text-[10px] font-mono text-[#8EAB85] px-2 py-1 bg-[#0A0F09] rounded border border-[#1A2619] flex-shrink-0">
                    {ev.event_time.replace("T", " ")}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1A2619] text-[#9BB095] mr-2">
                      {ev.category}
                    </span>
                    <span className="text-[#F4F7F2]">{ev.description}</span>
                    <span className="text-gray-500 text-[10px] block mt-1">Ref: {ev.source_document_ref}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Network Tab */}
        {activeTab === "network" && (
          <div className="text-center py-8 space-y-3">
            <Network className="w-12 h-12 text-[#6D8F63] mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-[#F4F7F2]">Interactive Relationship Network</h3>
            <p className="text-xs text-[#9BB095] max-w-md mx-auto">
              Explore the full 15-node, 19-edge Cytoscape graph connecting people, accounts, hardware, SIMs, and vehicles.
            </p>
            <Link
              href="/network-analysis"
              className="inline-block px-5 py-2.5 rounded-lg bg-[#6D8F63] hover:bg-[#597850] text-white text-xs font-semibold shadow"
            >
              Open Full Interactive Graph →
            </Link>
          </div>
        )}

        {/* 10. AI Analysis Tab */}
        {activeTab === "ai" && (
          <div className="text-center py-8 space-y-3">
            <Brain className="w-12 h-12 text-[#8EAB85] mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-[#F4F7F2]">Evidence-Grounded AI Investigation Assistant</h3>
            <p className="text-xs text-[#9BB095] max-w-md mx-auto">
              Ask natural language questions regarding Operation Silent Ledger. Every answer distinguishes documented facts from inferences with source document citations.
            </p>
            <Link
              href="/assistant"
              className="inline-block px-5 py-2.5 rounded-lg bg-[#8EAB85] hover:bg-[#28AEC1] text-[#000000] text-xs font-semibold shadow"
            >
              Launch AI Assistant →
            </Link>
          </div>
        )}

        {/* 11. Reports Tab */}
        {activeTab === "reports" && (
          <div className="text-center py-8 space-y-3">
            <FileBarChart className="w-12 h-12 text-[#7CA171] mx-auto" />
            <h3 className="text-lg font-bold text-[#F4F7F2]">Investigation Intelligence Report</h3>
            <p className="text-xs text-[#9BB095] max-w-md mx-auto">
              Review and export the 15-section comprehensive report for Operation Silent Ledger with full evidence citations.
            </p>
            <Link
              href="/reports"
              className="inline-block px-5 py-2.5 rounded-lg bg-[#7CA171] hover:bg-[#7868E6] text-white text-xs font-semibold shadow"
            >
              View & Download PDF Report →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
