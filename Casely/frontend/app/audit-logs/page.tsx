"use client";

import { Shield, Clock, User, CheckCircle2 } from "lucide-react";

export default function AuditLogsPage() {
  const sampleLogs = [
    { timestamp: "2026-10-15 10:45:12", user: "investigator-demo", action: "REPORT_GENERATED", resource: "Report: CR-2026-0842 (PDF)", status: "Success" },
    { timestamp: "2026-10-15 10:42:05", user: "investigator-demo", action: "AI_RAG_QUERY", resource: "Assistant: 'Show all financial transactions involving Rohan'", status: "Success" },
    { timestamp: "2026-10-15 10:38:19", user: "investigator-demo", action: "GRAPH_INSPECTION", resource: "Node: DEV-77 (Issued to Krishna Tayal)", status: "Success" },
    { timestamp: "2026-10-15 10:30:44", user: "investigator-demo", action: "DOCUMENT_VIEWED", resource: "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf", status: "Success" },
    { timestamp: "2026-10-15 10:15:00", user: "system-agent", action: "EVIDENCE_INGESTED", resource: "6 Source Documents Processed & Embedded", status: "Success" },
    { timestamp: "2026-10-15 10:00:00", user: "system-agent", action: "CASE_INITIALIZED", resource: "Operation Silent Ledger (CR-2026-0842)", status: "Success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#8EAB85]/20 text-[#8EAB85] border border-[#8EAB85]/30">
            Compliance & Security
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Audit Logs & Security Trail</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Immutable chain-of-custody logging of all evidence access, AI queries, and report generation events.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#050805] text-[#9BB095] uppercase text-[10px] border-b border-[#1A2619]">
            <tr>
              <th className="p-3">Timestamp (IST)</th>
              <th className="p-3">Investigator / Agent</th>
              <th className="p-3">Action Event</th>
              <th className="p-3">Resource Target</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2619]/50">
            {sampleLogs.map((log, i) => (
              <tr key={i} className="hover:bg-[#121A11]">
                <td className="p-3 font-mono text-[#8EAB85]">{log.timestamp}</td>
                <td className="p-3 text-[#F4F7F2] font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#9BB095]" /> {log.user}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#0A0F09] text-[#6D8F63] border border-[#1A2619]">
                    {log.action}
                  </span>
                </td>
                <td className="p-3 text-gray-300 font-mono text-[11px]">{log.resource}</td>
                <td className="p-3 text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
