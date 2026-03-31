"use client";

import { useState, useRef } from "react";
import { Receipt, Search, Download, Mail, Filter, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { db } from "@/lib/db";
import { formatCurrency, formatCurrencyDetailed } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function SlipsPage() {
  const [slips, setSlips] = useState(() => db.getSalarySlipsForRun("run-2026-2"));
  const [selectedSlip, setSelectedSlip] = useState<any>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async (slipNumber: string) => {
    if (!slipRef.current) return;
    
    try {
      const canvas = await html2canvas(slipRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Payslip-${slipNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex-1 space-y-6 pt-2 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Salary Slips</h2>
          <p className="text-muted-foreground">Distribute, view, and manage employee payslips for finalized runs.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
           <Button variant="outline" className="border-slate-300 gap-2 font-semibold">
              <Download className="h-4 w-4" /> Download ZIP
           </Button>
           <Button className="gap-2 font-semibold shadow-sm">
              <Mail className="h-4 w-4" /> Bulk Email Slips
           </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border rounded-xl shadow-sm shrink-0">
         <div className="flex items-center w-full sm:w-auto gap-3">
             <select className="flex h-10 w-40 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold shadow-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                 <option>February 2026</option>
                 <option>January 2026</option>
             </select>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search employee or slip ID..." className="h-10 pl-9 bg-slate-50 border-slate-200 shadow-none focus-visible:ring-primary rounded-lg" />
            </div>
         </div>
      </div>

      <div className="flex-1 border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col relative w-full">
         <div className="overflow-auto flex-1 w-full">
            <table className="w-full text-sm">
               <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm border-b shadow-sm">
                  <tr>
                     <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Employee</th>
                     <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Slip Num</th>
                     <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider text-right">Gross Pay</th>
                     <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider text-right">Net Pay</th>
                     <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Status</th>
                     <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {slips.map(s => (
                     <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{s.employeeName}</span>
                              <span className="text-xs font-mono text-slate-500">{s.employeeCode}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-600 font-medium">
                           {s.slipNumber}
                        </td>
                        <td className="px-6 py-4 text-right tabular-data font-semibold text-slate-600">
                           {formatCurrency(s.grossSalary || 0)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-data font-black text-slate-900">
                           {formatCurrency(s.netPay || 0)}
                        </td>
                        <td className="px-6 py-4">
                           {s.emailedAt ? 
                              <Badge variant="success" className="bg-emerald-50 border border-emerald-200/50 text-emerald-700 py-0.5"><CheckCircle2 className="h-3 w-3 mr-1" /> Emailed</Badge> : 
                              <Badge variant="outline" className="bg-slate-50 text-slate-600 py-0.5">Pending</Badge>
                           }
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Dialog>
                              <DialogTrigger asChild>
                                 <Button variant="ghost" className="h-8 font-semibold text-primary hover:bg-blue-50" onClick={() => setSelectedSlip(s)}>
                                    View Slip
                                 </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[800px] h-[90vh] p-0 flex flex-col bg-slate-100 rounded-xl overflow-hidden shadow-2xl border-none">
                                 {/* Top Actions in Modal */}
                                 <div className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10 w-full relative">
                                    <span className="font-bold text-sm tracking-tight text-slate-800">Preview: {s.slipNumber}</span>
                                    <div className="flex gap-2">
                                       <Button variant="outline" size="sm" className="h-8 border-slate-300 font-semibold text-slate-700" onClick={() => window.print()}>Print</Button>
                                       <Button size="sm" className="h-8 font-semibold shadow-sm bg-primary" onClick={() => downloadPDF(s.slipNumber)}>Download PDF</Button>
                                    </div>
                                 </div>

                                 {/* A4 Paper Container */}
                                 <div className="flex-1 overflow-auto p-8 flex justify-center w-full">
                                    {/* A4 Sheet (simulated) */}
                                    <div ref={slipRef} className="bg-white w-[210mm] min-h-[297mm] shadow-lg border border-slate-200 p-12 shrink-0">
                                       
                                       {/* Slip Header */}
                                       <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                                          <div>
                                             <h1 className="text-2xl font-black tracking-tight text-slate-900">ACME CORP</h1>
                                             <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest w-64 leading-relaxed">
                                                123 Tech Park, Whitefield
                                                Bangalore 560066, India
                                             </p>
                                          </div>
                                          <div className="text-right">
                                             <h2 className="text-xl font-bold text-primary tracking-tight">PAYSLIP</h2>
                                             <p className="text-sm font-semibold text-slate-600 mt-1">For the month of February 2026</p>
                                          </div>
                                       </div>

                                       {/* Employee Grid */}
                                       <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm">
                                          <div className="flex justify-between border-b pb-2"><span className="text-slate-500 font-semibold uppercase text-xs tracking-wider">Employee Name</span> <span className="font-bold text-slate-900">{s.employeeName}</span></div>
                                          <div className="flex justify-between border-b pb-2"><span className="text-slate-500 font-semibold uppercase text-xs tracking-wider">Employee Code</span> <span className="font-mono font-medium text-slate-900">{s.employeeCode}</span></div>
                                          <div className="flex justify-between border-b pb-2"><span className="text-slate-500 font-semibold uppercase text-xs tracking-wider">Department</span> <span className="font-semibold text-slate-900">Engineering</span></div>
                                          <div className="flex justify-between border-b pb-2"><span className="text-slate-500 font-semibold uppercase text-xs tracking-wider">Designation</span> <span className="font-semibold text-slate-900">Software Dev</span></div>
                                          <div className="flex justify-between border-b pb-2"><span className="text-slate-500 font-semibold uppercase text-xs tracking-wider">UAN Number</span> <span className="font-mono font-medium text-slate-900">10098****234</span></div>
                                          <div className="flex justify-between border-b pb-2"><span className="text-slate-500 font-semibold uppercase text-xs tracking-wider">Bank A/C</span> <span className="font-mono font-medium text-slate-900">**** **** 5678</span></div>
                                       </div>

                                       <div className="flex gap-4 mb-8">
                                          <div className="px-4 py-2 bg-slate-50 rounded border flex flex-col items-center">
                                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total Days</span>
                                             <span className="font-black text-slate-800">28</span>
                                          </div>
                                          <div className="px-4 py-2 bg-slate-50 rounded border flex flex-col items-center">
                                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Paid Days</span>
                                             <span className="font-black text-slate-800">28</span>
                                          </div>
                                          <div className="px-4 py-2 bg-slate-50 rounded border flex flex-col items-center">
                                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">LOP Days</span>
                                             <span className="font-black text-slate-800">0</span>
                                          </div>
                                       </div>

                                       {/* Earnings & Deductions Tables side by side */}
                                       <div className="flex w-full border-t border-b border-black divide-x divide-slate-200">
                                          <div className="w-1/2">
                                             <div className="bg-slate-100/50 py-2 px-4 border-b">
                                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Earnings</h4>
                                             </div>
                                             <div className="p-4 space-y-3 text-sm flex flex-col h-[200px]">
                                                <div className="flex justify-between"><span className="text-slate-600 font-medium tracking-tight">Basic Salary</span> <span className="tabular-data font-semibold">₹35,000.00</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600 font-medium tracking-tight">House Rent Allowance</span> <span className="tabular-data font-semibold">₹14,000.00</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600 font-medium tracking-tight">Special Allowance</span> <span className="tabular-data font-semibold">₹{formatCurrencyDetailed(s.grossSalary! - 49000).replace('₹','')}</span></div>
                                             </div>
                                             <div className="border-t border-slate-300 p-4 bg-slate-50/50 flex justify-between">
                                                <span className="font-bold text-slate-800 text-sm uppercase tracking-widest">Total Gross</span>
                                                <span className="font-black text-slate-900 tabular-data text-base">{formatCurrencyDetailed(s.grossSalary || 0)}</span>
                                             </div>
                                          </div>
                                          
                                          <div className="w-1/2">
                                             <div className="bg-slate-100/50 py-2 px-4 border-b">
                                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Deductions</h4>
                                             </div>
                                             <div className="p-4 space-y-3 text-sm flex flex-col h-[200px]">
                                                <div className="flex justify-between"><span className="text-slate-600 font-medium tracking-tight">Provident Fund (PF)</span> <span className="tabular-data font-semibold">₹1,800.00</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600 font-medium tracking-tight">Professional Tax</span> <span className="tabular-data font-semibold">₹200.00</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600 font-medium tracking-tight">Income Tax (TDS)</span> <span className="tabular-data font-semibold">₹{formatCurrencyDetailed((s.grossSalary! - (s.netPay! + 2000))).replace('₹','')}</span></div>
                                             </div>
                                             <div className="border-t border-slate-300 p-4 bg-slate-50/50 flex justify-between">
                                                <span className="font-bold text-slate-800 text-sm uppercase tracking-widest">Total Deduct</span>
                                                <span className="font-black text-slate-900 tabular-data text-base">{formatCurrencyDetailed((s.grossSalary || 0) - (s.netPay || 0))}</span>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="mt-8 border-2 border-primary bg-blue-50/30 p-4 flex items-center justify-between rounded">
                                          <span className="font-bold text-primary uppercase tracking-widest text-lg">Net Pay</span>
                                          <span className="font-black text-3xl tabular-data text-primary tracking-tight">{formatCurrencyDetailed(s.netPay || 0)}</span>
                                       </div>
                                       
                                       <div className="mt-4 pt-4 border-t border-dashed">
                                          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest text-center">Amount in words: <span className="text-slate-800 italic">Rupees Forty Eight Thousand Five Hundred Twenty Only</span></p>
                                       </div>

                                       <div className="mt-16 text-center">
                                          <p className="text-[10px] text-slate-400 font-medium mt-1">This is a computer-generated document and does not require signature.</p>
                                       </div>
                                    </div>
                                 </div>
                              </DialogContent>
                           </Dialog>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
