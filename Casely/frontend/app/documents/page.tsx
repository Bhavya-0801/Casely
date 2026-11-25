"use client";

import { useEffect, useState } from "react";
import { FileText, Search, UploadCloud, Eye, CheckCircle2, ShieldAlert } from "lucide-react";
import { fetchDocuments } from "@/lib/api";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  useEffect(() => {
    fetchDocuments().then(setDocs);
  }, []);

  const filtered = docs.filter(d =>
    d.filename.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    d.doc_ref.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#6D8F63]/20 text-[#6D8F63] border border-[#6D8F63]/30">
            Chain of Custody
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Document Management Repository</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Six seeded source documents from Operation Silent Ledger with entity extraction and processing audit.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9BB095]" />
          <input
            type="text"
            placeholder="Search documents or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050805] border border-[#1A2619] text-xs text-[#F4F7F2] placeholder-gray-500 focus:outline-none focus:border-[#6D8F63]"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d, i) => (
          <div key={i} className="p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619] hover:border-[#6D8F63]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#050805] text-[#8EAB85] border border-[#1A2619]">
                  {d.doc_ref}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {d.processing_status}
                </span>
              </div>
              <h3 className="text-sm font-bold font-mono text-[#F4F7F2] mt-2.5 truncate" title={d.filename}>
                {d.filename}
              </h3>
              <span className="text-[11px] text-[#6D8F63] font-medium block mt-0.5">{d.category}</span>
              <p className="text-xs text-[#9BB095] mt-2.5 line-clamp-3 leading-relaxed">
                {d.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1A2619] flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Date: {d.upload_date}</span>
              <button
                onClick={() => setSelectedDoc(d)}
                className="flex items-center gap-1 text-[#6D8F63] hover:underline font-semibold"
              >
                <Eye className="w-3.5 h-3.5" /> Inspect Evidence
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Dropzone */}
      <div className="p-8 rounded-xl bg-[#0A0F09] border-2 border-dashed border-[#1A2619] hover:border-[#6D8F63]/50 transition-all text-center space-y-2">
        <UploadCloud className="w-10 h-10 text-[#6D8F63] mx-auto opacity-70" />
        <h3 className="text-sm font-bold text-[#F4F7F2]">Upload Additional Investigation Document</h3>
        <p className="text-xs text-[#9BB095] max-w-sm mx-auto">
          Supported file formats: PDF, CSV, TXT. Documents will be chunked, embedded, and added to the case graph.
        </p>
        <button className="px-4 py-2 mt-2 rounded-lg bg-[#121A11] hover:bg-[#1A2818] text-[#F4F7F2] border border-[#1A2619] text-xs font-semibold">
          Select Document File
        </button>
      </div>

      {/* Inspect Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0A0F09] border border-[#1A2619] rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2619]">
              <div>
                <span className="text-xs font-mono text-[#8EAB85]">{selectedDoc.doc_ref}</span>
                <h3 className="text-lg font-bold text-[#F4F7F2]">{selectedDoc.filename}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-[#9BB095] hover:text-white text-sm px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[#000000] border border-[#1A2619] text-xs font-mono text-gray-300 max-h-80 overflow-y-auto leading-relaxed space-y-2">
              <p><strong>Document Reference:</strong> {selectedDoc.doc_ref}</p>
              <p><strong>Category:</strong> {selectedDoc.category}</p>
              <p><strong>Processing Status:</strong> {selectedDoc.processing_status} (Qdrant & Cytoscape Indexed)</p>
              <div className="mt-3 pt-3 border-t border-[#1A2619]/70">
                <p className="text-[#F4F7F2] font-sans text-xs">{selectedDoc.summary}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-lg bg-[#6D8F63] text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
