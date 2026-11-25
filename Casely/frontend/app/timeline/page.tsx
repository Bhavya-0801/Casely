"use client";

import { useEffect, useState } from "react";
import { Clock, Filter, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { fetchTimeline } from "@/lib/api";

export default function TimelinePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchTimeline().then(setEvents);
  }, []);

  const categories = ["all", "Communication", "Digital Access", "Financial", "CCTV", "Legal / FIR", "Hardware"];

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter(e => e.category === selectedCategory || (selectedCategory === "Legal / FIR" && e.category.includes("FIR")));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#8EAB85]/20 text-[#8EAB85] border border-[#8EAB85]/30">
            Chronological Sequence
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Timeline Analysis</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Verified chronological sequence of events spanning telecom contact, digital logins, and transactions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-[#6D8F63] text-white"
                  : "bg-[#050805] text-[#9BB095] hover:text-white border border-[#1A2619]"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619] relative">
        {/* Vertical line indicator */}
        <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-[#1A2619]"></div>

        <div className="space-y-6 relative">
          {filteredEvents.map((ev, idx) => (
            <div key={idx} className="flex items-start gap-6 group">
              {/* Dot */}
              <div className="w-8 h-8 rounded-full bg-[#050805] border-2 border-[#6D8F63] flex items-center justify-center flex-shrink-0 z-10 shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8EAB85]"></span>
              </div>

              {/* Event Card */}
              <div className="flex-1 p-4 rounded-xl bg-[#050805] border border-[#1A2619] hover:border-[#6D8F63]/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-[#1A2619]/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0F09] text-[#8EAB85] border border-[#1A2619]">
                      {ev.event_time.replace("T", " ")} IST
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1A2619] text-[#9BB095]">
                      {ev.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Ref: {ev.source_document_ref}
                  </span>
                </div>

                <p className="text-xs text-[#F4F7F2] mt-2.5 leading-relaxed font-medium">
                  {ev.description}
                </p>

                {/* Related entities */}
                <div className="mt-3 pt-2 border-t border-[#1A2619]/40 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-[#9BB095] mr-1">Linked Entities:</span>
                  {ev.related_entity_names.map((name: string, i: number) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0F09] text-[#6D8F63] border border-[#1A2619]">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
