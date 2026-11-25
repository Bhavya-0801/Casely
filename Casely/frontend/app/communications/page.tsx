"use client";

import { useEffect, useState } from "react";
import { PhoneCall, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import { fetchCommunications } from "@/lib/api";

export default function CommunicationsPage() {
  const [calls, setCalls] = useState<any[]>([]);

  useEffect(() => {
    fetchCommunications().then(setCalls);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#8EAB85]/20 text-[#8EAB85] border border-[#8EAB85]/30">
            CDR Intelligence
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Communication Intelligence</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Analysis of synthetic call records and subscriber SIM identity associations.
          </p>
        </div>
      </div>

      {/* Mandatory CDR Warning */}
      <div className="p-4 rounded-xl bg-[#2A1E0B] border border-[#F5B942]/40 text-xs text-[#F5B942] space-y-1">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>EVIDENTIARY LIMITATION WARNING:</span>
        </div>
        <p className="text-amber-200/90 leading-relaxed pl-6">
          Call metadata establishes recorded contact between subscriber identifiers only.
          It does NOT establish the content, purpose, conversation topic, or criminal nature of any communication.
        </p>
      </div>

      {/* Subscriber SIM Mapping Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { sim: "SIM-101", person: "Krishna Tayal", role: "IT Contractor" },
          { sim: "SIM-202", person: "Manthan", role: "Recipient Account Holder" },
          { sim: "SIM-303", person: "Naman", role: "Recipient Account Holder" },
          { sim: "SIM-404", person: "Rohan", role: "Recipient Account Holder" }
        ].map((sub, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
            <span className="text-xs font-mono font-bold text-[#8EAB85]">{sub.sim}</span>
            <div className="text-sm font-bold text-[#F4F7F2] mt-1">{sub.person}</div>
            <div className="text-[10px] text-[#9BB095] mt-0.5">{sub.role}</div>
          </div>
        ))}
      </div>

      {/* CDR Table */}
      <div className="p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619] space-y-3">
        <h3 className="text-sm font-bold text-[#F4F7F2]">Call Detail Records (5 Seeded Logs)</h3>
        <table className="w-full text-xs text-left">
          <thead className="bg-[#050805] text-[#9BB095] uppercase text-[10px] border-b border-[#1A2619]">
            <tr>
              <th className="p-3">Call ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time (IST)</th>
              <th className="p-3">Caller SIM & Associated Person</th>
              <th className="p-3">Receiver SIM & Associated Person</th>
              <th className="p-3">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2619]/50">
            {calls.map((c, i) => (
              <tr key={i} className="hover:bg-[#121A11]">
                <td className="p-3 font-mono text-[#8EAB85]">{c.id}</td>
                <td className="p-3 text-[#9BB095]">{c.date}</td>
                <td className="p-3 font-mono text-[#F4F7F2]">{c.time}</td>
                <td className="p-3">
                  <span className="font-mono text-[#8EAB85] font-bold">{c.caller_sim}</span>
                  <span className="text-[#9BB095] ml-1.5">({c.caller_person})</span>
                </td>
                <td className="p-3">
                  <span className="font-mono text-[#8EAB85] font-bold">{c.receiver_sim}</span>
                  <span className="text-[#9BB095] ml-1.5">({c.receiver_person})</span>
                </td>
                <td className="p-3 font-mono font-semibold text-[#F4F7F2]">{c.duration_seconds} seconds</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
