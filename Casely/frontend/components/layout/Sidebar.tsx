"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, Network, Clock, DollarSign,
  PhoneCall, FileText, Users, MessageSquare, FlaskConical,
  FileBarChart, Shield, Settings
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Investigations", href: "/investigations", icon: FolderOpen },
  { name: "Case Workspace", href: "/investigations/cr-2026-0842", icon: Shield },
  { name: "Network Analysis", href: "/network-analysis", icon: Network },
  { name: "Timeline Analysis", href: "/timeline", icon: Clock },
  { name: "Financial Intelligence", href: "/financial-intelligence", icon: DollarSign },
  { name: "Communications", href: "/communications", icon: PhoneCall },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Entity Explorer", href: "/entity-explorer", icon: Users },
  { name: "AI Assistant", href: "/assistant", icon: MessageSquare },
  { name: "Prompt Lab", href: "/prompt-lab", icon: FlaskConical },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Audit Logs", href: "/audit-logs", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#000000]/95 backdrop-blur-md border-r border-[#1A2619] flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1A2619] flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6D8F63] to-[#45613E] flex items-center justify-center font-bold text-white shadow-md shadow-[#6D8F63]/25">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-[#F4F7F2]">CASELY</h1>
          </div>
        </div>
        <p className="text-[11px] text-[#9BB095] tracking-wide font-medium mt-1">
          Every Case Has a Network.
        </p>
      </div>

      {/* Case Context Pill */}
      <div className="px-4 py-3 bg-[#080D08]/90 border-b border-[#1A2619]">
        <div className="text-[10px] text-[#9BB095] uppercase tracking-wider font-semibold">Active Case</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-[#6D8F63] animate-pulse"></span>
          <span className="text-xs font-medium text-[#F4F7F2] truncate">Op. Silent Ledger</span>
        </div>
        <div className="text-[10px] text-[#8EAB85] font-mono mt-0.5">CR-2026-0842 · Jaipur</div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#121A11] text-[#8EAB85] border-l-2 border-[#6D8F63] pl-2.5 font-semibold"
                  : "text-[#9BB095] hover:text-[#F4F7F2] hover:bg-[#0C120B]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#6D8F63]" : "text-[#7A8E75]"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1A2619] bg-[#050805]">
        <div className="flex items-center justify-between text-[10px] text-[#9BB095]">
          <span>Security Clearance</span>
          <span className="text-[#8EAB85] font-semibold">LEVEL 3</span>
        </div>
        <div className="text-[10px] text-[#5A6E55] mt-1">
          Casely v1.0 · University Edition
        </div>
      </div>
    </aside>
  );
}
