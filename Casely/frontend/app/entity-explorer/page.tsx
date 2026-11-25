"use client";

import { useEffect, useState } from "react";
import { Users, Search, ShieldCheck, Phone, CreditCard, Laptop, Car, MapPin } from "lucide-react";
import { fetchPersons } from "@/lib/api";

export default function EntityExplorerPage() {
  const [persons, setPersons] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  useEffect(() => {
    fetchPersons().then(setPersons);
  }, []);

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.case_role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#8EAB85]/20 text-[#8EAB85] border border-[#8EAB85]/30">
            Entity Intelligence
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Entity Explorer</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Strictly 5 fictional individuals documented in Operation Silent Ledger with verified associations.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9BB095]" />
          <input
            type="text"
            placeholder="Search individuals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050805] border border-[#1A2619] text-xs text-[#F4F7F2] placeholder-gray-500 focus:outline-none focus:border-[#6D8F63]"
          />
        </div>
      </div>

      {/* Persons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPerson(p)}
            className="p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619] hover:border-[#6D8F63] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#121A11] border border-[#6D8F63]/40 text-[#6D8F63] font-bold flex items-center justify-center text-xs">
                  {p.name.split(" ").map((n: string) => n[0]).join("")}
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#121A11] text-[#8EAB85] border border-[#1A2619]">
                  {p.case_role.split("/")[0]}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F4F7F2] mt-3">{p.name}</h3>
              <p className="text-xs text-[#9BB095] mt-1">{p.case_role}</p>
              <p className="text-xs text-gray-400 mt-2.5 line-clamp-2 leading-relaxed">{p.notes}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1A2619]">
              <span className="text-[10px] text-[#9BB095] block mb-1.5 font-medium">Associated Identifiers:</span>
              <div className="flex flex-wrap gap-1">
                {p.associated_ids?.map((id: string, i: number) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050805] text-[#6D8F63] border border-[#1A2619]">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Non-Person Entities Directory */}
      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619] space-y-4">
        <h3 className="text-sm font-bold text-[#F4F7F2]">Connected Technical Identifiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#050805] border border-[#1A2619]">
            <div className="flex items-center gap-2 text-[#8EAB85] font-bold">
              <Phone className="w-4 h-4" /> SIM Identifiers
            </div>
            <div className="mt-2 space-y-1 text-gray-300 font-mono text-[11px]">
              <div>SIM-101 (Krishna Tayal)</div>
              <div>SIM-202 (Manthan)</div>
              <div>SIM-303 (Naman)</div>
              <div>SIM-404 (Rohan)</div>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#050805] border border-[#1A2619]">
            <div className="flex items-center gap-2 text-[#F5B942] font-bold">
              <CreditCard className="w-4 h-4" /> Bank Account Suffixes
            </div>
            <div className="mt-2 space-y-1 text-gray-300 font-mono text-[11px]">
              <div>Acc-1042 (Manthan)</div>
              <div>Acc-2281 (Naman)</div>
              <div>Acc-9033 (Rohan)</div>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#050805] border border-[#1A2619]">
            <div className="flex items-center gap-2 text-[#7CA171] font-bold">
              <Laptop className="w-4 h-4" /> Hardware Devices
            </div>
            <div className="mt-2 space-y-1 text-gray-300 font-mono text-[11px]">
              <div>DEV-77 (Issued to Krishna Tayal)</div>
              <div className="text-[10px] text-gray-500 font-sans">10 Oct to 16 Oct 2026</div>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#050805] border border-[#1A2619]">
            <div className="flex items-center gap-2 text-[#EF5350] font-bold">
              <Car className="w-4 h-4" /> Vehicle Registry
            </div>
            <div className="mt-2 space-y-1 text-gray-300 font-mono text-[11px]">
              <div>RJ14-DEMO-4821 (Rohan)</div>
              <div className="text-[10px] text-gray-500 font-sans">White Sedan on CCTV</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
