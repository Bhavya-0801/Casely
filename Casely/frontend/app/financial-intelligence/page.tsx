"use client";

import { useEffect, useState } from "react";
import { DollarSign, ArrowRightLeft, AlertTriangle, ShieldCheck, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { fetchTransactions } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function FinancialIntelligencePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchTransactions().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-[#9BB095]">Loading financial records...</div>;

  const chartData = data.transactions.map((t: any) => ({
    name: `${t.sender.split(' ')[0]} → ${t.receiver.split(' ')[0]}`,
    amount: t.amount,
    type: t.transfer_type,
    label: `₹${t.amount.toLocaleString("en-IN")}`
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#6D8F63]/20 text-[#6D8F63] border border-[#6D8F63]/30">
            Audit Ledger
          </span>
          <h1 className="text-xl font-bold text-[#F4F7F2] mt-2">Financial Intelligence & Fund Flow</h1>
          <p className="text-xs text-[#9BB095] mt-0.5">
            Analysis of initial disputed transfers from Jishu Ghosh and subsequent inter-recipient movements.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#9BB095] block uppercase tracking-wider font-semibold">Reported Unauthorized Loss</span>
          <span className="text-2xl font-bold font-mono text-[#EF5350]">₹18,50,000</span>
        </div>
      </div>

      {/* Critical Accounting Notice Box */}
      <div className="p-4 rounded-xl bg-[#2A1E0B] border border-[#F5B942]/40 text-xs text-[#F5B942] space-y-1">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>MANDATORY ACCOUNTING DISTINCTION:</span>
        </div>
        <p className="text-amber-200/90 leading-relaxed pl-6">
          The initial disputed transfers from complainant Jishu Ghosh total <strong>₹18,50,000</strong> (3 outgoing transfers).
          The subsequent transfers between recipient accounts (Manthan, Naman, Rohan) total ₹10,50,000 and represent
          movement of funds <em>within</em> the synthetic transaction dataset.
          <strong> They are NOT additional losses and must not be added to the original reported loss of ₹18,50,000.</strong>
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
          <span className="text-[11px] text-[#9BB095] block font-medium">Initial Disputed Amount</span>
          <span className="text-xl font-bold font-mono text-[#EF5350] mt-1 block">₹18,50,000</span>
          <span className="text-[10px] text-gray-500 mt-1 block">3 Outgoing Transfers</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
          <span className="text-[11px] text-[#9BB095] block font-medium">Subsequent Internal Transfers</span>
          <span className="text-xl font-bold font-mono text-[#7CA171] mt-1 block">₹10,50,000</span>
          <span className="text-[10px] text-gray-500 mt-1 block">3 Inter-Recipient Transfers</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
          <span className="text-[11px] text-[#9BB095] block font-medium">Recipient Account Holders</span>
          <span className="text-xl font-bold font-mono text-[#8EAB85] mt-1 block">3</span>
          <span className="text-[10px] text-gray-500 mt-1 block">Manthan, Naman, Rohan</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
          <span className="text-[11px] text-[#9BB095] block font-medium">Total Recorded Transactions</span>
          <span className="text-xl font-bold font-mono text-[#F4F7F2] mt-1 block">6</span>
          <span className="text-[10px] text-gray-500 mt-1 block">Complete Case Ledger</span>
        </div>
      </div>

      {/* Financial Bar Chart */}
      <div className="p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619]">
        <h3 className="text-sm font-bold text-[#F4F7F2] mb-1">Transaction Amounts (₹)</h3>
        <p className="text-[11px] text-[#9BB095] mb-4">Initial Transfers (Blue) vs Subsequent Fund Movement (Purple)</p>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#9BB095" fontSize={11} tickLine={false} />
              <YAxis stroke="#9BB095" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#050805", borderColor: "#1A2619", borderRadius: "8px", fontSize: "11px" }}
                formatter={(val: any, name: any, itm: any) => [itm.payload.label, itm.payload.type === "initial" ? "Initial Disputed Transfer" : "Subsequent Internal Transfer"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((e: any, i: number) => (
                  <Cell key={`cell-${i}`} fill={e.type === "initial" ? "#6D8F63" : "#7CA171"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="p-5 rounded-xl bg-[#0A0F09] border border-[#1A2619] space-y-3">
        <h3 className="text-sm font-bold text-[#F4F7F2]">Transaction Audit Ledger</h3>
        <table className="w-full text-xs text-left">
          <thead className="bg-[#050805] text-[#9BB095] uppercase text-[10px] border-b border-[#1A2619]">
            <tr>
              <th className="p-3">Ref ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Sender</th>
              <th className="p-3">Receiver & Account</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Classification</th>
              <th className="p-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2619]/50">
            {data.transactions.map((t: any, i: number) => (
              <tr key={i} className="hover:bg-[#121A11]">
                <td className="p-3 font-mono text-[#8EAB85]">{t.id}</td>
                <td className="p-3 text-[#9BB095]">{t.date}</td>
                <td className="p-3 font-medium text-[#F4F7F2]">{t.sender}</td>
                <td className="p-3 font-medium text-[#F4F7F2]">
                  {t.receiver} {t.receiver_account_suffix && <span className="font-mono text-[#8EAB85] text-[11px]">(Acc-{t.receiver_account_suffix})</span>}
                </td>
                <td className="p-3 font-mono font-bold text-[#F4F7F2]">₹{t.amount.toLocaleString("en-IN")}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-semibold ${t.transfer_type === "initial" ? "bg-[#6D8F63]/20 text-[#6D8F63] border border-[#6D8F63]/30" : "bg-[#7CA171]/20 text-[#7CA171] border border-[#7CA171]/30"}`}>
                    {t.transfer_type === "initial" ? "Initial Disputed" : "Subsequent Internal"}
                  </span>
                </td>
                <td className="p-3 text-gray-400 text-[11px]">{t.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
