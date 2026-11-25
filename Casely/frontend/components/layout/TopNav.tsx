"use client";

import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Intelligence Overview";
    if (pathname.includes("investigations/cr-2026-0842")) return "Case Workspace — Operation Silent Ledger";
    if (pathname.includes("investigations")) return "Active Investigations";
    if (pathname.includes("network")) return "Interactive Network Analysis";
    if (pathname.includes("timeline")) return "Chronological Timeline Analysis";
    if (pathname.includes("financial")) return "Financial Intelligence & Fund Flow";
    if (pathname.includes("communications")) return "Telecommunication Metadata Analysis";
    if (pathname.includes("documents")) return "Evidence Document Repository";
    if (pathname.includes("entity")) return "Entity & Individual Explorer";
    if (pathname.includes("assistant")) return "AI Investigation Assistant (RAG)";
    if (pathname.includes("prompt-lab")) return "Prompt Engineering Laboratory";
    if (pathname.includes("reports")) return "Investigation Intelligence Reports";
    if (pathname.includes("audit")) return "System & Query Audit Trail";
    if (pathname.includes("settings")) return "Platform Configuration";
    return "Casely Intelligence Platform";
  };

  return (
    <header className="h-14 bg-[#000000]/85 backdrop-blur-md border-b border-[#1A2619] px-6 flex items-center justify-between sticky top-0 z-30 ml-64">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-[#F4F7F2] tracking-wide">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Verification Status Badge */}
        <div className="flex items-center gap-1.5 text-xs text-[#9BB095] bg-[#0A0F09] px-3 py-1 rounded-md border border-[#1A2619]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6D8F63]" />
          <span>Evidence Grounded</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1A2619]">
          <div className="w-7 h-7 rounded-full bg-[#121A11] border border-[#6D8F63]/40 flex items-center justify-center text-xs font-bold text-[#8EAB85]">
            ID
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-medium text-[#F4F7F2]">Investigator Demo</span>
            <span className="text-[10px] text-[#9BB095]">Cyber Crime Unit</span>
          </div>
        </div>
      </div>
    </header>
  );
}
