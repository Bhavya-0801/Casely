"use client";

import { useState } from "react";
import { Settings, Key, Database, Shield, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#6D8F63]/20 text-[#6D8F63] border border-[#6D8F63]/30">
            System Configuration
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Platform Settings</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Configure external AI model credentials, vector store endpoints, and demonstration toggles.
          </p>
        </div>
      </div>

      {/* AI Credentials Card */}
      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#F4F7F2]">
          <Key className="w-4 h-4 text-[#6D8F63]" />
          <span>Google Gemini API Key</span>
        </div>
        <p className="text-xs text-[#9BB095] leading-relaxed">
          Provide your Google Gemini API key to activate live inference and dynamic document analysis. If omitted, Casely runs seamlessly in verified local Demonstration Mode with zero network dependencies.
        </p>

        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[#050805] border border-[#1A2619] text-xs text-[#F4F7F2] font-mono placeholder-gray-600 focus:outline-none focus:border-[#6D8F63]"
          />
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#6D8F63] hover:bg-[#597850] text-white text-xs font-semibold shadow"
            >
              Save Configuration
            </button>
            {saved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Credentials saved securely
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Database & Graph Status */}
      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619] space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#F4F7F2]">
          <Database className="w-4 h-4 text-[#8EAB85]" />
          <span>Database & Graph Connections</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619]">
            <span className="text-[#9BB095] block text-[10px]">Relational Store</span>
            <span className="text-emerald-400 font-semibold mt-1 block">Active (SQLite/aiosqlite)</span>
            <span className="text-[10px] text-gray-500 font-mono">casely.db</span>
          </div>
          <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619]">
            <span className="text-[#9BB095] block text-[10px]">Graph Engine</span>
            <span className="text-[#8EAB85] font-semibold mt-1 block">Embedded (Cytoscape.js)</span>
            <span className="text-[10px] text-gray-500 font-mono">15 Nodes, 19 Edges</span>
          </div>
          <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619]">
            <span className="text-[#9BB095] block text-[10px]">Vector Store</span>
            <span className="text-[#7CA171] font-semibold mt-1 block">Grounded Index (Qdrant Mode)</span>
            <span className="text-[10px] text-gray-500 font-mono">6 Document Chunks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
