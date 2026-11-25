"use client";

import { useState } from "react";
import { FlaskConical, Play, CheckCircle2, ChevronRight, Code, ShieldCheck, ArrowRight } from "lucide-react";

export default function PromptLabPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(1);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  const templates = [
    {
      id: 1,
      name: "Entity Extraction Prompt",
      badge: "Extraction",
      purpose: "Transforms unstructured police records and access logs into typed entities without hallucination.",
      system_instruction: `You are an investigative document analysis assistant.
Analyze the supplied document and extract all explicitly mentioned entities.
Return structured JSON containing:
- entity_id
- entity_name
- entity_type (Person, Account, SIM, Device, Vehicle, Location)
- source_document
- supporting_text
- confidence
- verification_status

STRICT RULES:
1. Do not invent entities.
2. Do not infer missing personal identities.
3. Preserve exact identifiers (e.g. DEV-77, SIM-101).
4. Every extracted entity must have source evidence.`,
      sample_input: "SYS-AUDIT-441: Interactive login at 19:41 on WORKSTATION-FIN-02 using credential assigned to Jishu Ghosh. Diagnostic adapter DEV-77 was attached.",
      sample_output: `[
  {
    "entity_name": "Jishu Ghosh",
    "entity_type": "Person",
    "supporting_text": "credential assigned to Jishu Ghosh",
    "verification_status": "Documented",
    "confidence": 1.0
  },
  {
    "entity_name": "DEV-77",
    "entity_type": "Device",
    "supporting_text": "Diagnostic adapter DEV-77 was attached",
    "verification_status": "Documented",
    "confidence": 1.0
  }
]`
    },
    {
      id: 2,
      name: "Relationship Extraction Prompt",
      badge: "Relationships",
      purpose: "Discovers documented linkages while enforcing the distinction between correlation and causation.",
      system_instruction: `You are an evidence-grounded relationship extraction system.
Analyze the supplied investigative record. Identify relationships explicitly supported by the source.

CLASSIFICATION RULES:
- Documented: Explicitly substantiated by banking, telecom, or hardware registers.
- Inferred: Reasonable temporal or operational overlap without direct proof.
- Unverified: Anecdotal or inconclusive surveillance.

CRITICAL CONSTRAINTS:
1. Do not assume communication proves criminal coordination.
2. Do not assume account ownership proves fraud knowledge.
3. If evidence is insufficient, explicitly state limitations.`,
      sample_input: "TEL-CDR-2026-104: SIM-101 placed a voice call to SIM-202 on 14 Oct 2026 at 19:38 IST (duration 72 seconds).",
      sample_output: `[
  {
    "source_entity": "SIM-101",
    "relationship_type": "Voice Call Contact (72s)",
    "target_entity": "SIM-202",
    "classification": "Documented",
    "confidence": 0.95,
    "limitations": "Metadata establishes subscriber contact only. Conversation content is unrecorded."
  }
]`
    },
    {
      id: 3,
      name: "Document Summarization Prompt",
      badge: "Summarization",
      purpose: "Generates factual case summaries preserving evidentiary caveats.",
      system_instruction: `Summarize the investigative record strictly distinguishing documented fact from speculative interpretation.
Identify key timestamps, parties named, and gaps in evidence.`,
      sample_input: "05_CCTV_VEHICLE_ROHAN.pdf: White sedan RJ14-DEMO-4821 observed at ATM kiosk at 21:18. Subject entered ATM. Visual clarity insufficient.",
      sample_output: `{
  "key_finding": "Vehicle associated with Rohan was present at ATM kiosk at 21:18.",
  "caveat": "Driver identity remains unverified due to night lighting.",
  "evidence_classification": "Documented observation with inconclusive subject identification."
}`
    },
    {
      id: 4,
      name: "Cross-Document Correlation Prompt",
      badge: "Cross-Document",
      purpose: "Correlates timestamps across separate evidence documents without asserting criminal conspiracy.",
      system_instruction: `Identify temporal alignments across multiple document sources.
Group events by time window and highlight co-occurrences neutrally.`,
      sample_input: "Comparing 03_COMMUNICATION_RECORDS.csv (19:38 call) with 04_DIGITAL_ACCESS.pdf (19:41 login).",
      sample_output: `{
  "temporal_correlation": "A 72-second call between SIM-101 and SIM-202 concluded at 19:39, approximately 2 minutes before the 19:41 workstation login.",
  "limitation": "Temporal proximity does not establish causal coordination."
}`
    },
    {
      id: 5,
      name: "Investigation Report Prompt",
      badge: "Reporting",
      purpose: "Assembles the 15-section case intelligence report for judicial and investigative review.",
      system_instruction: `Compile verified case facts into standard 15-section investigative intelligence report format. Include mandatory demonstration disclaimer and neutral analytical tone.`,
      sample_input: "Complete Case CR-2026-0842 dataset.",
      sample_output: `15-Section Comprehensive Report compiled with verified audit trail.`
    }
  ];

  const current = templates.find(t => t.id === selectedPrompt) || templates[0];

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setExecuted(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#7CA171]/20 text-[#7CA171] border border-[#7CA171]/30">
            Prompt Engineering System
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Prompt Engineering Laboratory</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Demonstrating structured prompts transforming raw documents into structured intelligence.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#9BB095] mb-3">Intelligence Pipeline Workflow</h3>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          {[
            "Raw Evidence", "Chunking & Parser", "Prompt Template",
            "Entity Extraction", "Relationship Discovery", "Graph Assembly",
            "Hybrid RAG Retrieval", "Verified Intelligence"
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded border ${i === 2 || i === 3 ? "bg-[#6D8F63]/20 border-[#6D8F63] text-[#6D8F63] font-semibold" : "bg-[#050805] border-[#1A2619] text-[#9BB095]"}`}>
                {step}
              </span>
              {i < 7 && <ArrowRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Templates Grid & Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                setSelectedPrompt(tpl.id);
                setExecuted(false);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedPrompt === tpl.id
                  ? "bg-[#121A11] border-[#6D8F63] text-[#F4F7F2]"
                  : "bg-[#0A0F09] border-[#1A2619] text-[#9BB095] hover:border-[#6D8F63]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F4F7F2]">{tpl.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#050805] text-[#8EAB85] font-mono">
                  {tpl.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{tpl.purpose}</p>
            </button>
          ))}
        </div>

        {/* Prompt Inspector & Test Harness */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A2619]">
            <div>
              <h3 className="text-base font-bold text-[#F4F7F2]">{current.name}</h3>
              <p className="text-xs text-[#9BB095] mt-0.5">{current.purpose}</p>
            </div>
            <button
              onClick={handleExecute}
              disabled={executing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6D8F63] hover:bg-[#597850] text-white text-xs font-semibold shadow disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{executing ? "Processing..." : "Execute Test"}</span>
            </button>
          </div>

          {/* System Instructions */}
          <div>
            <span className="text-[10px] text-[#9BB095] uppercase font-bold tracking-wider block mb-1.5">
              System Prompt & Behavioral Constraints:
            </span>
            <pre className="p-3.5 rounded-lg bg-[#000000] border border-[#1A2619] text-[11px] font-mono text-[#8EAB85] whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {current.system_instruction}
            </pre>
          </div>

          {/* Sample Input */}
          <div>
            <span className="text-[10px] text-[#9BB095] uppercase font-bold tracking-wider block mb-1.5">
              Test Input (Seeded Record Excerpt):
            </span>
            <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619] text-xs font-mono text-gray-300">
              {current.sample_input}
            </div>
          </div>

          {/* Structured Output Result */}
          <div>
            <span className="text-[10px] text-[#9BB095] uppercase font-bold tracking-wider block mb-1.5 flex items-center justify-between">
              <span>Structured Execution Result:</span>
              {executed && <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Validated</span>}
            </span>
            <pre className="p-3.5 rounded-lg bg-[#000000] border border-[#1A2619] text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {current.sample_output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
