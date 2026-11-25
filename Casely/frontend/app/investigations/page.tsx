"use client";

import Link from "next/link";
import { FolderOpen, ArrowUpRight, ShieldCheck, DollarSign, Calendar, MapPin, FileText } from "lucide-react";
import { SEED_CASE } from "@/lib/seedData";

export default function InvestigationsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F4F7F2]">Active Casefiles</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Strictly one active demonstration investigation loaded in compliance with system requirements.
          </p>
        </div>
        <div className="text-xs text-[#8EAB85] bg-[#0A0F09] px-3 py-1.5 rounded-lg border border-[#1A2619] font-mono">
          Case Count: 1
        </div>
      </div>

      {/* Single Case Card */}
      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619] hover:border-[#6D8F63]/50 transition-all shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1A2619]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Investigation
              </span>
              <span className="text-xs font-mono text-[#8EAB85] bg-[#050805] px-2 py-0.5 rounded border border-[#1A2619]">
                {SEED_CASE.case_ref}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#F4F7F2] mt-2 tracking-wide">
              {SEED_CASE.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9BB095] mt-2">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#6D8F63]" /> {SEED_CASE.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#8EAB85]" /> Incident: {SEED_CASE.incident_date}</span>
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-[#7CA171]" /> {SEED_CASE.fir_ref}</span>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <span className="text-[11px] text-[#9BB095]">Reported Unauthorized Loss</span>
            <span className="text-2xl font-bold font-mono text-[#EF5350]">₹18,50,000</span>
            <Link
              href="/investigations/cr-2026-0842"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6D8F63] hover:bg-[#597850] text-white text-xs font-semibold shadow-md shadow-[#6D8F63]/20 transition-all mt-1"
            >
              <span>Open Case Workspace</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-xs text-[#9BB095] mt-4 leading-relaxed">
          {SEED_CASE.case_summary}
        </p>

        {/* Case Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#1A2619]/70 text-xs">
          <div className="p-2.5 rounded-lg bg-[#050805] border border-[#1A2619]">
            <span className="text-[#9BB095] text-[10px] block">Complainant</span>
            <span className="text-[#F4F7F2] font-semibold">Jishu Ghosh</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#050805] border border-[#1A2619]">
            <span className="text-[#9BB095] text-[10px] block">Recipient Accounts</span>
            <span className="text-[#8EAB85] font-semibold">Manthan, Naman, Rohan</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#050805] border border-[#1A2619]">
            <span className="text-[#9BB095] text-[10px] block">Key Physical Device</span>
            <span className="text-[#7CA171] font-semibold">DEV-77 (Issued to Krishna Tayal)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#050805] border border-[#1A2619]">
            <span className="text-[#9BB095] text-[10px] block">Evidence Documents</span>
            <span className="text-[#F5B942] font-semibold">6 Verified Records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
