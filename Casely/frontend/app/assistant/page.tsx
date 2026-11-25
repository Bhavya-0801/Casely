"use client";

import { useState } from "react";
import { Send, Brain, ShieldCheck, AlertTriangle, FileText, Sparkles, RefreshCcw } from "lucide-react";
import { askAssistant } from "@/lib/api";

const SUGGESTED_QUESTIONS = [
  "Summarize Operation Silent Ledger.",
  "Show all financial transactions involving Rohan.",
  "What evidence connects Krishna Tayal to DEV-77?",
  "What communication records are available between Krishna Tayal and Manthan?",
  "Construct a timeline of events on 14 October.",
  "Which relationships are directly documented?",
  "What are the major evidence gaps in this investigation?",
  "Identify potential patterns without making assumptions about guilt."
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      answer: "I am the Casely Investigation Assistant. I analyze evidence strictly from Operation Silent Ledger (CR-2026-0842). Every response separates documented facts from possible inferences with source citations. How can I assist your investigation?",
      documented_facts: ["Loaded case: Operation Silent Ledger (Jaipur, Rajasthan)", "6 verified source documents indexed"],
      possible_inferences: [],
      evidence_references: [],
      limitations: "I do not declare anyone guilty or assume guilt from association."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (qText?: string) => {
    const query = qText || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: "user", answer: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await askAssistant(query);
      setMessages(prev => [...prev, { role: "assistant", ...resp }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        answer: "Unable to retrieve evidence. Please verify backend connection.",
        documented_facts: [],
        possible_inferences: [],
        evidence_references: [],
        limitations: "System error occurred."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#8EAB85]/20 text-[#8EAB85] border border-[#8EAB85]/30">
            RAG Grounded Intelligence
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">AI Investigation Assistant</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Grounded question answering supported by case documents, financial ledgers, and access audit records.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-medium">
          <ShieldCheck className="w-4 h-4" /> Zero-Hallucination Policy
        </div>
      </div>

      {/* Suggested Questions Bar */}
      <div className="space-y-2">
        <span className="text-[10px] text-[#9BB095] uppercase font-bold tracking-wider">Suggested Inquiries:</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs text-left px-3 py-1.5 rounded-lg bg-[#0A0F09] hover:bg-[#121A11] text-[#9BB095] hover:text-[#F4F7F2] border border-[#1A2619] transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619] space-y-6 min-h-[420px] max-h-[600px] overflow-y-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-[#6D8F63]/20 border border-[#6D8F63]/40 text-[#6D8F63] flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed space-y-3 ${
              m.role === "user"
                ? "bg-[#6D8F63] text-white font-medium"
                : "bg-[#050805] border border-[#1A2619] text-[#F4F7F2]"
            }`}>
              <div>{m.answer}</div>

              {/* Documented Facts */}
              {m.documented_facts?.length > 0 && (
                <div className="pt-2 border-t border-[#1A2619]/60">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8EAB85] block mb-1">
                    Documented Facts:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-300">
                    {m.documented_facts.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Possible Inferences */}
              {m.possible_inferences?.length > 0 && (
                <div className="pt-2 border-t border-[#1A2619]/60">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#7CA171] block mb-1">
                    Possible Inferences (Unverified):
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-400">
                    {m.possible_inferences.map((inf: string, i: number) => (
                      <li key={i}>{inf}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evidence References */}
              {m.evidence_references?.length > 0 && (
                <div className="pt-2 border-t border-[#1A2619]/60">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F5B942] block mb-1">
                    Evidence References:
                  </span>
                  <div className="space-y-1">
                    {m.evidence_references.map((c: any, i: number) => (
                      <div key={i} className="text-[10px] p-1.5 rounded bg-[#0A0F09] border border-[#1A2619] text-gray-300">
                        <span className="font-mono text-[#6D8F63] font-semibold">{c.document_name}</span> ({c.reference}): {c.supporting_excerpt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Limitations */}
              {m.limitations && m.role === "assistant" && (
                <div className="pt-2 border-t border-[#1A2619]/60 text-[10px] text-amber-300/80 italic flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0 text-[#F5B942]" />
                  <span>Limitations: {m.limitations}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-[#9BB095]">
            <Brain className="w-5 h-5 text-[#8EAB85] animate-spin" />
            <span>Retrieving and grounding evidence from Operation Silent Ledger...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-3"
      >
        <input
          type="text"
          placeholder="Ask an investigative question about Operation Silent Ledger..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-[#0A0F09] border border-[#1A2619] text-xs text-[#F4F7F2] placeholder-gray-500 focus:outline-none focus:border-[#6D8F63]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-[#6D8F63] hover:bg-[#597850] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow"
        >
          <span>Ask Casely</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
