"use client";

import { useState } from "react";
import { FileBarChart, Download, Printer, ShieldCheck, AlertTriangle, FileCode } from "lucide-react";
import { SEED_CASE } from "@/lib/seedData";

export default function ReportsPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await fetch("http://localhost:8000/api/cases/CR-2026-0842/reports/generate?format=pdf");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Casely_Intelligence_Report_CR-2026-0842.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        window.print();
      }
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const sections = [
    { num: 1, title: "Case Overview", content: SEED_CASE.case_summary },
    { num: 2, title: "Case Metadata", content: `Case Reference: ${SEED_CASE.case_ref} | Status: ${SEED_CASE.status} | Location: ${SEED_CASE.location} | Incident Date: ${SEED_CASE.incident_date} | FIR Reference: ${SEED_CASE.fir_ref}` },
    { num: 3, title: "Individuals & Associated Entities", content: "1. Jishu Ghosh (Complainant / Business Owner)\n2. Krishna Tayal (IT Specialist / Contractor; linked to SIM-101 and DEV-77)\n3. Manthan (Recipient Account Suffix 1042; SIM-202)\n4. Naman (Recipient Account Suffix 2281; SIM-303)\n5. Rohan (Recipient Account Suffix 9033; SIM-404; Partial Vehicle Reg RJ14-DEMO-4821)" },
    { num: 4, title: "Source Documents Analyzed", content: "1. 01_FIR_JISHU_GHOSH.pdf\n2. 02_FINANCIAL_TRANSACTIONS.csv\n3. 03_COMMUNICATION_RECORDS.csv\n4. 04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf\n5. 05_CCTV_VEHICLE_ROHAN.pdf\n6. 06_WITNESS_STATEMENT.pdf" },
    { num: 5, title: "Financial Transaction Summary", content: "Initial Disputed Loss: ₹18,50,000 debited in 3 transfers from Jishu Ghosh (₹8.5L to Manthan, ₹6.0L to Naman, ₹4.0L to Rohan). Subsequent transfers between recipient accounts total ₹10,50,000 and represent fund movements within the dataset, NOT additional loss." },
    { num: 6, title: "Communication Metadata Summary", content: "Five call records documented on 14-15 Oct between SIM-101, SIM-202, SIM-303, and SIM-404. Calls occurred immediately before and after workstation login and fund transfers. Metadata establishes contact; conversation content is unrecorded." },
    { num: 7, title: "Digital Access Findings", content: "Audit reference SYS-AUDIT-441 records interactive login at 19:41:02 IST on Finance Workstation using Jishu Ghosh's credential. Device DEV-77 (issued to Krishna Tayal for maintenance on 10 Oct, returned 16 Oct) was attached. Banking portal security reset occurred at 19:42:15 IST." },
    { num: 8, title: "CCTV Observations", content: "CCTV observation CCTV-JPR-209 recorded white sedan RJ14-DEMO-4821 (associated with Rohan) at ATM kiosk at 21:18 IST on 14 Oct. Unidentified subject entered ATM. Facial identification was inconclusive due to lighting and visual distance." },
    { num: 9, title: "Witness Statement Summary", content: "Witness WIT-2026-031 observed a male in a grey jacket enter the complex premises at ~19:15-19:30 IST and speak briefly near the parking railing. Identities could not be established." },
    { num: 10, title: "Chronological Event Sequence", content: "11 verified timeline events from 14 Oct 18:42 IST (Initial call SIM-101 to SIM-202) through 16 Oct 09:00 IST (DEV-77 device return)." },
    { num: 11, title: "Relationship Graph Summary", content: "Cytoscape relationship analysis links 15 nodes via 19 verified edges, illustrating the intersection of physical devices, communication identifiers, and bank account recipients." },
    { num: 12, title: "Potential Investigative Leads", content: "1. Corroboration of physical presence at Finance Workstation during 19:41 login.\n2. Investigation into reason for fund dispersal among recipient account holders.\n3. Inspection of ATM withdrawal logs corresponding to 21:18 CCTV observation." },
    { num: 13, title: "Evidence Gaps", content: "No direct visual feed within the finance office. No intercepted audio recordings. Driver of white sedan remains visually unconfirmed." },
    { num: 14, title: "Evidentiary Limitations", content: "Casely operates as an investigative assistance platform. It does not establish legal guilt, criminal conspiracy, or intent. All inferences require legal verification." },
    { num: 15, title: "Certification & Audit Trail", content: "Report generated automatically by Casely Intelligence Engine. Evidence cryptographic integrity verified. All records are synthetic demonstration data." }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#7CA171]/20 text-[#7CA171] border border-[#7CA171]/30">
            Case Intelligence Dossier
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Investigation Report Generator</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Comprehensive 15-section structured intelligence report for Operation Silent Ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6D8F63] hover:bg-[#597850] text-white text-xs font-semibold shadow disabled:opacity-50 transition"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? "Generating PDF..." : "Download Official PDF"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#121A11] hover:bg-[#1A2818] text-[#F4F7F2] border border-[#1A2619] text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Report Document Preview Sheet */}
      <div className="p-8 rounded-xl bg-[#0A0F09] border border-[#1A2619] space-y-6 shadow-2xl max-w-4xl mx-auto print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b border-[#1A2619] pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6D8F63]">
              CASELY INTELLIGENCE DIVISION
            </span>
            <span className="text-xs font-mono text-[#8EAB85]">CR-2026-0842</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F4F7F2]">
            CASE INTELLIGENCE REPORT: OPERATION SILENT LEDGER
          </h2>
          <div className="text-xs text-[#9BB095]">
            Jurisdiction: Cyber Crime Police Station, Jaipur, Rajasthan · Date: 15 October 2026
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-lg bg-[#2A1E0B] border border-[#F5B942]/40 text-xs text-[#F5B942] space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>DEMONSTRATION CASEFILE DISCLAIMER</span>
          </div>
          <p className="text-amber-200/90 leading-relaxed pl-6 text-[11px]">
            All identities, bank account details, telecommunication logs, CCTV observations, and reports contained
            in this dossier are completely fictional and synthesized exclusively for academic demonstration.
            No individual is declared guilty.
          </p>
        </div>

        {/* 15 Sections */}
        <div className="space-y-6 text-xs divide-y divide-[#1A2619]/60">
          {sections.map((sec) => (
            <div key={sec.num} className="pt-4 first:pt-0 space-y-2">
              <h3 className="text-sm font-bold text-[#8EAB85] uppercase tracking-wide">
                {sec.num}. {sec.title}
              </h3>
              <div className="text-[#F4F7F2] leading-relaxed whitespace-pre-wrap text-xs">
                {sec.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
