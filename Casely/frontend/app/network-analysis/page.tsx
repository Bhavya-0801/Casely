"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, ShieldCheck, AlertTriangle, Info, Filter } from "lucide-react";
import cytoscape from "cytoscape";

export default function NetworkAnalysisPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    if (!containerRef.current) return;

    const elements: cytoscape.ElementDefinition[] = [
      // Nodes: People
      { data: { id: "jishu", label: "Jishu Ghosh", type: "person", role: "Complainant / Business Owner", doc: "01_FIR_JISHU_GHOSH.pdf" } },
      { data: { id: "krishna", label: "Krishna Tayal", type: "person", role: "IT Maintenance Contractor", doc: "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf" } },
      { data: { id: "manthan", label: "Manthan", type: "person", role: "Recipient Acct 1042 Holder", doc: "02_FINANCIAL_TRANSACTIONS.csv" } },
      { data: { id: "naman", label: "Naman", type: "person", role: "Recipient Acct 2281 Holder", doc: "02_FINANCIAL_TRANSACTIONS.csv" } },
      { data: { id: "rohan", label: "Rohan", type: "person", role: "Recipient Acct 9033 Holder", doc: "02_FINANCIAL_TRANSACTIONS.csv" } },

      // Nodes: SIM Identifiers
      { data: { id: "sim101", label: "SIM-101", type: "sim", role: "Telecom Identifier", doc: "03_COMMUNICATION_RECORDS.csv" } },
      { data: { id: "sim202", label: "SIM-202", type: "sim", role: "Telecom Identifier", doc: "03_COMMUNICATION_RECORDS.csv" } },
      { data: { id: "sim303", label: "SIM-303", type: "sim", role: "Telecom Identifier", doc: "03_COMMUNICATION_RECORDS.csv" } },
      { data: { id: "sim404", label: "SIM-404", type: "sim", role: "Telecom Identifier", doc: "03_COMMUNICATION_RECORDS.csv" } },

      // Nodes: Accounts
      { data: { id: "acc1042", label: "Acc-1042", type: "account", role: "Bank Account Suffix", doc: "02_FINANCIAL_TRANSACTIONS.csv" } },
      { data: { id: "acc2281", label: "Acc-2281", type: "account", role: "Bank Account Suffix", doc: "02_FINANCIAL_TRANSACTIONS.csv" } },
      { data: { id: "acc9033", label: "Acc-9033", type: "account", role: "Bank Account Suffix", doc: "02_FINANCIAL_TRANSACTIONS.csv" } },

      // Nodes: Device & Vehicle & Location
      { data: { id: "dev77", label: "DEV-77", type: "device", role: "Diagnostic Hardware", doc: "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf" } },
      { data: { id: "rj14", label: "RJ14-DEMO-4821", type: "vehicle", role: "White Sedan", doc: "05_CCTV_VEHICLE_ROHAN.pdf" } },
      { data: { id: "workstation", label: "Finance Workstation", type: "location", role: "Physical Terminal", doc: "04_DIGITAL_ACCESS_KRISHNA_TAYAL.pdf" } },

      // Edges: Financial Initial (Disputed)
      { data: { id: "e1", source: "jishu", target: "acc1042", label: "Disputed ₹8.5L", edgeType: "financial", classification: "Documented", evidence: "TXN-001 at 20:05", limitations: "Confirms transfer execution; authorization unverified." } },
      { data: { id: "e2", source: "jishu", target: "acc2281", label: "Disputed ₹6.0L", edgeType: "financial", classification: "Documented", evidence: "TXN-002 at 20:18", limitations: "Confirms transfer execution; authorization unverified." } },
      { data: { id: "e3", source: "jishu", target: "acc9033", label: "Disputed ₹4.0L", edgeType: "financial", classification: "Documented", evidence: "TXN-003 at 20:32", limitations: "Confirms transfer execution; authorization unverified." } },

      // Edges: Financial Subsequent (Internal fund movements)
      { data: { id: "e4", source: "acc1042", target: "acc2281", label: "Internal ₹5.0L", edgeType: "subsequent", classification: "Documented", evidence: "TXN-004 on 14 Oct", limitations: "Internal transfer; not an additional loss." } },
      { data: { id: "e5", source: "acc1042", target: "acc9033", label: "Internal ₹2.0L", edgeType: "subsequent", classification: "Documented", evidence: "TXN-005 on 14 Oct", limitations: "Internal transfer; not an additional loss." } },
      { data: { id: "e6", source: "acc2281", target: "acc9033", label: "Internal ₹3.5L", edgeType: "subsequent", classification: "Documented", evidence: "TXN-006 on 15 Oct", limitations: "Internal transfer; not an additional loss." } },

      // Edges: Account Ownership
      { data: { id: "e7", source: "manthan", target: "acc1042", label: "Account Holder", edgeType: "association", classification: "Documented", evidence: "Bank beneficiary record", limitations: "Ownership does not prove awareness of fraud origin." } },
      { data: { id: "e8", source: "naman", target: "acc2281", label: "Account Holder", edgeType: "association", classification: "Documented", evidence: "Bank beneficiary record", limitations: "Ownership does not prove awareness of fraud origin." } },
      { data: { id: "e9", source: "rohan", target: "acc9033", label: "Account Holder", edgeType: "association", classification: "Documented", evidence: "Bank beneficiary record", limitations: "Ownership does not prove awareness of fraud origin." } },

      // Edges: SIM Associations
      { data: { id: "e10", source: "krishna", target: "sim101", label: "Registered SIM", edgeType: "association", classification: "Documented", evidence: "Telecom subscriber data", limitations: "Subscriber identity only; caller identity unverified." } },
      { data: { id: "e11", source: "manthan", target: "sim202", label: "Registered SIM", edgeType: "association", classification: "Documented", evidence: "Telecom subscriber data", limitations: "Subscriber identity only; caller identity unverified." } },
      { data: { id: "e12", source: "naman", target: "sim303", label: "Registered SIM", edgeType: "association", classification: "Documented", evidence: "Telecom subscriber data", limitations: "Subscriber identity only; caller identity unverified." } },
      { data: { id: "e13", source: "rohan", target: "sim404", label: "Registered SIM", edgeType: "association", classification: "Documented", evidence: "Telecom subscriber data", limitations: "Subscriber identity only; caller identity unverified." } },

      // Edges: Calls (Metadata)
      { data: { id: "e14", source: "sim101", target: "sim202", label: "18:42 (186s)", edgeType: "communication", classification: "Documented", evidence: "CALL-001 duration 186s", limitations: "Contact recorded; audio content unknown." } },
      { data: { id: "e15", source: "sim202", target: "sim303", label: "19:16 (94s)", edgeType: "communication", classification: "Documented", evidence: "CALL-002 duration 94s", limitations: "Contact recorded; audio content unknown." } },
      { data: { id: "e16", source: "sim101", target: "sim202", label: "19:38 (72s)", edgeType: "communication", classification: "Documented", evidence: "CALL-003 duration 72s", limitations: "Contact recorded; audio content unknown." } },
      { data: { id: "e17", source: "sim303", target: "sim404", label: "20:48 (210s)", edgeType: "communication", classification: "Documented", evidence: "CALL-004 duration 210s", limitations: "Contact recorded; audio content unknown." } },
      { data: { id: "e18", source: "sim202", target: "sim404", label: "08:52 (145s)", edgeType: "communication", classification: "Documented", evidence: "CALL-005 on 15 Oct", limitations: "Contact recorded; audio content unknown." } },

      // Edges: Hardware & Vehicle
      { data: { id: "e19", source: "dev77", target: "krishna", label: "Issued (10-16 Oct)", edgeType: "association", classification: "Documented", evidence: "Hardware Register Log", limitations: "Device issued to contractor; does not prove operator." } },
      { data: { id: "e20", source: "dev77", target: "workstation", label: "Connected (19:41)", edgeType: "association", classification: "Documented", evidence: "SYS-AUDIT-441 log", limitations: "Hardware attached; physical operator unconfirmed." } },
      { data: { id: "e21", source: "rohan", target: "rj14", label: "Vehicle Registry", edgeType: "association", classification: "Documented", evidence: "Synthetic Registry", limitations: "Ownership match; driver identity unverified." } },
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "label": "data(label)",
            "color": "#F4F7F2",
            "font-size": "11px",
            "font-family": "sans-serif",
            "text-valign": "bottom",
            "text-margin-y": 6,
            "background-color": "#6D8F63",
            "border-width": 2,
            "border-color": "#1A2619",
            "width": 38,
            "height": 38,
            "text-background-opacity": 0.8,
            "text-background-color": "#050805",
            "text-background-padding": "3px",
            "text-background-shape": "roundrectangle"
          }
        },
        // People
        {
          selector: "node[type = 'person']",
          style: {
            "background-color": "#6D8F63",
            "shape": "ellipse",
            "border-color": "#9BB095",
            "width": 46,
            "height": 46
          }
        },
        // SIM
        {
          selector: "node[type = 'sim']",
          style: {
            "background-color": "#8EAB85",
            "shape": "diamond",
            "border-color": "#A8C2A0",
            "width": 36,
            "height": 36
          }
        },
        // Account
        {
          selector: "node[type = 'account']",
          style: {
            "background-color": "#F5B942",
            "shape": "round-rectangle",
            "border-color": "#FCD34D",
            "width": 42,
            "height": 32
          }
        },
        // Device
        {
          selector: "node[type = 'device']",
          style: {
            "background-color": "#7CA171",
            "shape": "hexagon",
            "border-color": "#B8AEFF",
            "width": 40,
            "height": 40
          }
        },
        // Vehicle
        {
          selector: "node[type = 'vehicle']",
          style: {
            "background-color": "#EF5350",
            "shape": "pentagon",
            "border-color": "#F87171",
            "width": 40,
            "height": 40
          }
        },
        // Location
        {
          selector: "node[type = 'location']",
          style: {
            "background-color": "#10B981",
            "shape": "round-tag",
            "border-color": "#34D399",
            "width": 44,
            "height": 34
          }
        },
        // Edge Defaults
        {
          selector: "edge",
          style: {
            "width": 2,
            "line-color": "#5A6E55",
            "target-arrow-color": "#5A6E55",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "label": "data(label)",
            "font-size": "9px",
            "color": "#9BB095",
            "text-background-opacity": 0.8,
            "text-background-color": "#000000",
            "text-background-padding": "2px",
            "text-rotation": "autorotate"
          }
        },
        // Initial Financial Disputed Transfers
        {
          selector: "edge[edgeType = 'financial']",
          style: {
            "width": 3,
            "line-color": "#6D8F63",
            "target-arrow-color": "#6D8F63",
            "line-style": "solid",
            "color": "#9BB095"
          }
        },
        // Subsequent Internal Transfers
        {
          selector: "edge[edgeType = 'subsequent']",
          style: {
            "width": 2.5,
            "line-color": "#7CA171",
            "target-arrow-color": "#7CA171",
            "line-style": "dashed",
            "color": "#B8AEFF"
          }
        },
        // Communications
        {
          selector: "edge[edgeType = 'communication']",
          style: {
            "width": 2,
            "line-color": "#8EAB85",
            "target-arrow-color": "#8EAB85",
            "line-style": "dotted",
            "color": "#A8C2A0"
          }
        },
        // Active selection
        {
          selector: ":selected",
          style: {
            "border-width": 4,
            "border-color": "#FFFFFF",
            "border-opacity": 1
          }
        }
      ],
      layout: {
        name: "cose",
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 40,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      }
    });

    cy.on("select", "node", (e) => {
      setSelectedItem({ isNode: true, data: e.target.data() });
    });

    cy.on("select", "edge", (e) => {
      setSelectedItem({ isNode: false, data: e.target.data() });
    });

    cy.on("unselect", () => {
      setSelectedItem(null);
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit();
  const handleReset = () => {
    cyRef.current?.reset();
    cyRef.current?.fit();
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <h1 className="text-lg font-bold text-[#F4F7F2]">Interactive Network Analysis</h1>
          <p className="text-xs text-[#9BB095]">
            Cytoscape.js relationship graph mapping entities, financial movements, telecommunications, and access logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-[#050805] hover:bg-[#121A11] border border-[#1A2619] text-[#F4F7F2] text-xs transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-[#050805] hover:bg-[#121A11] border border-[#1A2619] text-[#F4F7F2] text-xs transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            className="p-2 rounded-lg bg-[#050805] hover:bg-[#121A11] border border-[#1A2619] text-[#F4F7F2] text-xs transition"
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-[#050805] hover:bg-[#121A11] border border-[#1A2619] text-[#F4F7F2] text-xs transition"
            title="Reset Layout"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Graph Area & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Graph Canvas */}
        <div className="lg:col-span-8 relative h-[600px] rounded-xl bg-[#000000] border border-[#1A2619] overflow-hidden">
          <div ref={containerRef} className="w-full h-full" />

          {/* Graph Legend Overlay */}
          <div className="absolute bottom-3 left-3 p-3 rounded-lg bg-[#050805]/90 backdrop-blur-md border border-[#1A2619] text-[10px] space-y-1.5 shadow-lg pointer-events-none">
            <div className="font-bold text-[#F4F7F2] uppercase tracking-wider text-[9px] mb-1">Entity Types</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6D8F63]"></span> Person</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rotate-45 bg-[#8EAB85]"></span> SIM ID</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded bg-[#F5B942]"></span> Account</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#7CA171]"></span> Device</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#EF5350]"></span> Vehicle</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]"></span> Location</span>
            </div>
            <div className="font-bold text-[#F4F7F2] uppercase tracking-wider text-[9px] mt-2 pt-1 border-t border-[#1A2619]">Edge Classifications</div>
            <div className="space-y-0.5">
              <span className="flex items-center gap-1.5 text-[#6D8F63]">━━ Initial Disputed Transfer</span>
              <span className="flex items-center gap-1.5 text-[#7CA171]">╍╍ Subsequent Transfer</span>
              <span className="flex items-center gap-1.5 text-[#8EAB85]">···· Call Record (CDR)</span>
            </div>
          </div>
        </div>

        {/* Selected Entity / Relationship Detail Panel */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619] h-[600px] flex flex-col justify-between overflow-y-auto">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A2619]">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#6D8F63]/20 text-[#6D8F63] border border-[#6D8F63]/30">
                  {selectedItem.isNode ? `Entity: ${selectedItem.data.type}` : "Relationship"}
                </span>
                <span className="text-[10px] text-[#8EAB85] font-mono">
                  {selectedItem.data.id}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#F4F7F2]">
                  {selectedItem.data.label}
                </h3>
                {selectedItem.isNode && (
                  <p className="text-xs text-[#8EAB85] mt-0.5 font-medium">{selectedItem.data.role}</p>
                )}
              </div>

              {selectedItem.isNode ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619]">
                    <span className="text-[10px] text-[#9BB095] block">Primary Source Document</span>
                    <span className="text-[#F4F7F2] font-mono">{selectedItem.data.doc}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619]">
                    <span className="text-[10px] text-[#9BB095] block">Investigative Context</span>
                    <span className="text-[#9BB095] leading-relaxed">
                      Entity extracted from verified case records in Operation Silent Ledger.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619]">
                    <span className="text-[10px] text-[#9BB095] block">Classification</span>
                    <span className="text-[#8EAB85] font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {selectedItem.data.classification || "Documented"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619]">
                    <span className="text-[10px] text-[#9BB095] block">Supporting Evidence</span>
                    <span className="text-[#F4F7F2]">{selectedItem.data.evidence}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#2A1E0B] border border-[#F5B942]/30 text-amber-300">
                    <span className="text-[10px] font-bold block text-[#F5B942] uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Limitation
                    </span>
                    <span className="text-xs leading-relaxed mt-1 block">
                      {selectedItem.data.limitations || "Evidence establishes recorded event only. Does not prove criminal intent."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center my-auto p-6 space-y-3">
              <Info className="w-10 h-10 text-[#6D8F63] mx-auto opacity-60" />
              <h4 className="text-sm font-semibold text-[#F4F7F2]">Inspector Panel</h4>
              <p className="text-xs text-[#9BB095] leading-relaxed">
                Click any node (person, SIM, account, device, vehicle) or edge to inspect verified evidence and evidentiary limitations.
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-[#050805] border border-[#1A2619] text-[10px] text-[#9BB095]">
            <strong>Evidentiary Notice:</strong> Casely never labels individuals as guilty. Inferred links remain unverified.
          </div>
        </div>
      </div>
    </div>
  );
}
