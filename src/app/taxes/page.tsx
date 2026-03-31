"use client";

import { useState } from "react";
import { Calculator, Percent, Save, ShieldCheck, Scale, MousePointerClick, Download } from "lucide-react";
import { formatCurrency, formatCurrencyDetailed } from "@/lib/utils";
import { compareTaxRegimes } from "@/lib/salary-engine";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/components/ui/badge";

export default function TaxesPage() {
  const [ctcInput, setCtcInput] = useState("1200000");
  const reportRef = useRef<HTMLDivElement>(null);
  const comp = compareTaxRegimes(Number(ctcInput) || 0);

  const downloadTaxReport = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Tax-Report-${ctcInput}.pdf`);
    } catch (error) {
      console.error("Error generating tax PDF:", error);
    }
  };

  return (
    <div className="flex-1 space-y-6 pt-2 h-[calc(100vh-80px)] overflow-y-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tax & Deductions</h2>
          <p className="text-muted-foreground">Configure statutory compliance rates and evaluate tax regimes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 font-semibold gap-2 border-slate-300" onClick={downloadTaxReport}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button className="h-10 font-semibold gap-2 shadow-sm px-6">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Main Grid: Config vs Calculator */}
      <div ref={reportRef} className="grid lg:grid-cols-2 gap-8 items-start w-full max-w-7xl p-4 bg-white/50 rounded-xl">
        
        {/* Left Col: Statutory Rates */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm border-t-4 border-t-indigo-500 overflow-hidden">
             <CardHeader className="bg-slate-50 border-b pb-4 pt-5">
               <CardTitle className="flex items-center gap-2">
                 <ShieldCheck className="h-5 w-5 text-indigo-500" />
                 Provident Fund (PF)
               </CardTitle>
               <CardDescription>Employee Provident Fund Organization rules</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employee Contribution</Label>
                      <div className="relative">
                         <Input defaultValue="12" type="number" className="pr-8 h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-indigo-500" />
                         <Percent className="h-3 w-3 absolute right-3 top-3.5 text-slate-400" />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employer Contribution</Label>
                      <div className="relative">
                         <Input defaultValue="12" type="number" className="pr-8 h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-indigo-500" />
                         <Percent className="h-3 w-3 absolute right-3 top-3.5 text-slate-400" />
                      </div>
                   </div>
                   <div className="space-y-1.5 col-span-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Max Wage Ceiling (₹)</Label>
                      <Input defaultValue="15000" type="number" className="h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-indigo-500" />
                      <p className="text-[10px] text-slate-400 mt-1">PF calculation is restricted to this ceiling amount.</p>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm border-t-4 border-t-emerald-500 overflow-hidden">
             <CardHeader className="bg-slate-50 border-b pb-4 pt-5">
               <CardTitle className="flex items-center gap-2">
                 <Scale className="h-5 w-5 text-emerald-500" />
                 Employee State Insurance (ESI)
               </CardTitle>
               <CardDescription>ESIC contribution rates and limits</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employee Rate</Label>
                      <div className="relative">
                         <Input defaultValue="0.75" type="number" step="0.01" className="pr-8 h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-emerald-500" />
                         <Percent className="h-3 w-3 absolute right-3 top-3.5 text-slate-400" />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employer Rate</Label>
                      <div className="relative">
                         <Input defaultValue="3.25" type="number" step="0.01" className="pr-8 h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-emerald-500" />
                         <Percent className="h-3 w-3 absolute right-3 top-3.5 text-slate-400" />
                      </div>
                   </div>
                   <div className="space-y-1.5 col-span-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Salary Limit (₹)</Label>
                      <Input defaultValue="21000" type="number" className="h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-emerald-500" />
                      <p className="text-[10px] text-slate-400 mt-1">Employees earning above this are exempt from ESI.</p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Col: TDS Calculator */}
        <div className="space-y-6">
           <Card className="border-primary shadow-md overflow-hidden bg-primary text-white relative">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
              
              <CardHeader className="pb-4 relative z-10">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-white flex items-center gap-2">
                         <Calculator className="h-5 w-5" />
                         TDS Impact Calculator
                       </CardTitle>
                       <CardDescription className="text-blue-100 mt-1">Compare New vs Old Tax Regimes in real-time</CardDescription>
                    </div>
                 </div>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10 pb-8">
                 <div className="bg-white/10 border border-white/20 rounded-xl p-5 backdrop-blur-md pb-6">
                    <Label className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-2 block">Expected Annual CTC (₹)</Label>
                    <Input 
                      type="number" 
                      value={ctcInput}
                      onChange={(e) => setCtcInput(e.target.value)}
                      className="h-14 bg-white/20 border-white/30 text-white font-black text-2xl placeholder:text-blue-200 shadow-none focus-visible:ring-white Focus-visible:border-white w-full tabular-data" 
                    />
                    
                    <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
                       {/* New Regime */}
                       <div className="border-r border-white/20 pr-8">
                          <h4 className="flex items-center justify-between text-sm font-bold text-white mb-4">
                             New Regime
                             {comp.recommendedRegime === 'NEW' && <Badge variant="success" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none py-0.5 px-2">Winner</Badge>}
                          </h4>
                          
                          <div className="space-y-3 text-xs text-blue-100">
                             <div className="flex justify-between">
                               <span>Standard Ded.</span>
                               <span className="font-mono">{formatCurrencyDetailed(comp.newRegime.standardDeduction)}</span>
                             </div>
                             <div className="flex justify-between border-b border-white/10 pb-2">
                               <span>Taxable Inc.</span>
                               <span className="font-mono text-white font-semibold">{formatCurrencyDetailed(comp.newRegime.taxableIncome)}</span>
                             </div>
                             
                             <div className="flex justify-between pt-2">
                               <span className="font-semibold uppercase text-white">Annual Tax</span>
                               <span className="font-black text-lg text-white tabular-data">{formatCurrencyDetailed(comp.newRegime.annualTax)}</span>
                             </div>
                             <div className="flex justify-between border-t border-white/10 pt-2 text-[10px] font-bold uppercase tracking-widest text-blue-200">
                               <span>Monthly TDS</span>
                               <span className="text-white">{formatCurrencyDetailed(comp.newRegime.monthlyTDS)}</span>
                             </div>
                          </div>
                       </div>

                       {/* Old Regime */}
                       <div className="pl-4">
                          <h4 className="flex items-center justify-between text-sm font-bold text-white mb-4">
                             Old Regime
                             {comp.recommendedRegime === 'OLD' && <Badge variant="success" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none py-0.5 px-2">Winner</Badge>}
                          </h4>
                          
                          <div className="space-y-3 text-xs text-blue-100">
                             <div className="flex justify-between">
                               <span>Standard Ded.</span>
                               <span className="font-mono">{formatCurrencyDetailed(comp.oldRegime.standardDeduction)}</span>
                             </div>
                             <div className="flex justify-between border-b border-white/10 pb-2">
                               <span>Taxable Inc.</span>
                               <span className="font-mono text-white font-semibold">{formatCurrencyDetailed(comp.oldRegime.taxableIncome)}</span>
                             </div>
                             
                             <div className="flex justify-between pt-2">
                               <span className="font-semibold uppercase text-white">Annual Tax</span>
                               <span className="font-black text-lg text-white tabular-data">{formatCurrencyDetailed(comp.oldRegime.annualTax)}</span>
                             </div>
                             <div className="flex justify-between border-t border-white/10 pt-2 text-[10px] font-bold uppercase tracking-widest text-blue-200">
                               <span>Monthly TDS</span>
                               <span className="text-white">{formatCurrencyDetailed(comp.oldRegime.monthlyTDS)}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-lg">
                    <span className="text-sm font-bold text-slate-800">Potential Tax Savings</span>
                    <span className={`text-xl font-black tabular-data ${comp.savings > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                       {comp.savings > 0 ? formatCurrencyDetailed(comp.savings) : "₹0.00"}
                    </span>
                 </div>
              </CardContent>
           </Card>

           <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <h4 className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                <MousePointerClick className="h-4 w-4" /> Opting for Old Regime?
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Remember to collect and verify <span className="font-semibold px-1 bg-white rounded">Section 80C</span> investments (up to ₹1.5L), <span className="font-semibold px-1 bg-white rounded">Section 80D</span> (Health Insurance), and Rent Receipts for HRA exemptions before Q4 finalizing.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
