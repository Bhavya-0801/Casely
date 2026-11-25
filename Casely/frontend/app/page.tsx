"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen, Users, FileText, ArrowRightLeft, DollarSign,
  Network, ArrowUpRight, ShieldCheck, Clock, ExternalLink
} from "lucide-react";
import { fetchOverview, fetchTransactions, fetchTimeline } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function OverviewPage() {
  const [overview, setOverview] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    fetchOverview().then(setOverview);
    fetchTransactions().then(setFinancials);
    fetchTimeline().then(events => setTimeline(events.slice(0, 5)));
  }, []);

  if (!overview) {
    return <div className="p-8 text-center text-[#9BB095]">Loading Casely Intelligence Overview...</div>;
  }

  const kpis = [
    { label: "Active Investigations", value: "1", sub: "CR-2026-0842", icon: FolderOpen, color: "#6D8F63" },
    { label: "Identified Individuals", value: "5", sub: "Verified Entities", icon: Users, color: "#8EAB85" },
    { label: "Source Documents", value: "6", sub: "Seeded Evidence", icon: FileText, color: "#7CA171" },
    { label: "Recorded Transactions", value: "6", sub: "3 Initial + 3 Subsequent", icon: ArrowRightLeft, color: "#F5B942" },
    { label: "Reported Financial Loss", value: "₹18.5L", sub: "Initial Disputed Debits", icon: DollarSign, color: "#EF5350" },
    { label: "Extracted Relationships", value: "19", sub: "Graph Linkages", icon: Network, color: "#8EAB85" },
  ];

  // Prepare chart data
  const chartData = financials?.transactions.map((t: any) => ({
    name: `${t.sender.split(' ')[0]} → ${t.receiver.split(' ')[0]}`,
    amount: t.amount / 100000,
    type: t.transfer_type,
    fullAmount: `₹${(t.amount).toLocaleString('en-IN')}`
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-[#0A0F09] via-[#080D08] to-[#0A0F09] border border-[#1A2619]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#6D8F63]/20 text-[#6D8F63] border border-[#6D8F63]/30">
              Intelligence Operations
            </span>
            <span className="text-xs text-[#9BB095]">Casely Active Casefile</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F4F7F2] mt-1.5">Casely Intelligence Overview</h1>
          <p className="text-sm text-[#9BB095] mt-0.5">
            Investigative intelligence derived from connected evidence, digital access logs, and financial flows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/investigations/cr-2026-0842"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6D8F63] hover:bg-[#597850] text-white text-xs font-semibold shadow-lg shadow-[#6D8F63]/20 transition-all"
          >
            <span>Open Case Workspace</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/network-analysis"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#121A11] hover:bg-[#1A2818] text-[#F4F7F2] border border-[#1A2619] text-xs font-semibold transition-all"
          >
            <Network className="w-4 h-4 text-[#8EAB85]" />
            <span>Launch Graph</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0A0F09] border border-[#1A2619] hover:border-[#6D8F63]/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#9BB095] leading-tight">{kpi.label}</span>
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: kpi.color }} />
              </div>
              <div className="mt-3">
                <div className="text-xl font-bold text-[#F4F7F2] font-mono tracking-tight">{kpi.value}</div>
                <div className="text-[10px] text-[#9BB095] mt-0.5 truncate">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Central Section: Active Case & Financial Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Investigation Card */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Case
              </span>
              <span className="text-xs font-mono text-[#8EAB85]">CR-2026-0842</span>
            </div>
            <h3 className="text-lg font-bold text-[#F4F7F2] mt-3">OPERATION SILENT LEDGER</h3>
            <p className="text-xs text-[#9BB095] mt-1 leading-relaxed">
              {overview.case.case_summary}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#1A2619]/70 text-xs">
              <div>
                <span className="text-[#9BB095] block text-[10px]">Location</span>
                <span className="text-[#F4F7F2] font-medium">{overview.case.location}</span>
              </div>
              <div>
                <span className="text-[#9BB095] block text-[10px]">Category</span>
                <span className="text-[#F4F7F2] font-medium truncate block">{overview.case.category}</span>
              </div>
              <div>
                <span className="text-[#9BB095] block text-[10px]">FIR Reference</span>
                <span className="text-[#6D8F63] font-mono">{overview.case.fir_ref}</span>
              </div>
              <div>
                <span className="text-[#9BB095] block text-[10px]">Reported Loss</span>
                <span className="text-[#EF5350] font-bold font-mono">₹18,50,000</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#1A2619] flex items-center justify-between">
            <span className="text-[11px] text-[#9BB095]">Single Primary Casefile</span>
            <Link
              href="/investigations/cr-2026-0842"
              className="text-xs text-[#6D8F63] hover:underline font-semibold flex items-center gap-1"
            >
              Open Full Workspace →
            </Link>
          </div>
        </div>

        {/* Financial Flow Bar Chart */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-[#F4F7F2]">Recorded Financial Activity (₹ Lakhs)</h3>
              <p className="text-[11px] text-[#9BB095]">
                Initial unauthorized transfers (Blue) vs Subsequent recipient transfers (Purple)
              </p>
            </div>
            <Link href="/financial-intelligence" className="text-xs text-[#6D8F63] hover:underline">
              Details →
            </Link>
          </div>

          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#9BB095" fontSize={10} tickLine={false} />
                <YAxis stroke="#9BB095" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#050805", borderColor: "#1A2619", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: any, name: any, item: any) => [item.payload.fullAmount, item.payload.type === "initial" ? "Initial Disputed Debit" : "Subsequent Transfer"]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.type === "initial" ? "#6D8F63" : "#7CA171"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#9BB095] bg-[#050805] p-2.5 rounded-lg border border-[#1A2619]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#6D8F63]"></span> Initial Outgoing: ₹18.50L
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#7CA171]"></span> Subsequent Internal: ₹10.50L
              </span>
            </div>
            <span className="text-amber-400/90 text-[10px]">
              Note: Subsequent transfers do not increase total reported loss.
            </span>
          </div>
        </div>
      </div>

      {/* Lower Section: Timeline Preview & Entity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Preview */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8EAB85]" />
              <h3 className="text-sm font-bold text-[#F4F7F2]">Recent Chronological Events</h3>
            </div>
            <Link href="/timeline" className="text-xs text-[#6D8F63] hover:underline">
              Full Timeline (11 Events) →
            </Link>
          </div>

          <div className="space-y-3">
            {timeline.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#050805] border border-[#1A2619]">
                <div className="text-[10px] font-mono text-[#8EAB85] bg-[#0A0F09] px-2 py-1 rounded border border-[#1A2619] flex-shrink-0">
                  {ev.event_time.split("T")[1]?.slice(0, 5) || "Time"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[#1A2619] text-[#9BB095]">
                      {ev.category}
                    </span>
                    <span className="text-[10px] text-gray-500 truncate">{ev.source_document_ref}</span>
                  </div>
                  <p className="text-xs text-[#F4F7F2] mt-0.5 line-clamp-1">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entity Distribution Panel */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#F4F7F2]">Entity Distribution</h3>
            <Link href="/entity-explorer" className="text-xs text-[#6D8F63] hover:underline">
              Explorer →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { type: "People", count: 5, color: "#6D8F63", desc: "Complainant, contractor & recipients" },
              { type: "Phone / SIM IDs", count: 4, color: "#8EAB85", desc: "SIM-101 to SIM-404" },
              { type: "Bank Accounts", count: 3, color: "#F5B942", desc: "Suffixes 1042, 2281, 9033" },
              { type: "Hardware Devices", count: 1, color: "#7CA171", desc: "DEV-77 issued for maintenance" },
              { type: "Vehicles", count: 1, color: "#EF5350", desc: "Partial RJ14-DEMO-4821" },
              { type: "Locations", count: 1, color: "#10B981", desc: "Finance Workstation / ATM" },
            ].map((ent, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#050805] border border-[#1A2619]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#9BB095]">{ent.type}</span>
                  <span className="text-base font-bold font-mono" style={{ color: ent.color }}>{ent.count}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{ent.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1A2619] text-[11px] text-[#9BB095]">
            All entities extracted from verified documents in Operation Silent Ledger.
          </div>
        </div>
      </div>
    </div>
  );
}
