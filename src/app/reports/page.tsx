"use client";

import { Download, FileText, IndianRupee, PieChart, Users, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-6 pt-2 h-[calc(100vh-80px)] overflow-y-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Download statutory reports, tax filings, and custom financial registers.</p>
        </div>
      </div>

       <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
         {/* Compliance Reports */}
         <div className="col-span-full mb-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
               <FileText className="h-4 w-4" /> Statutory Compliance
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               <Card className="shadow-sm border-slate-200 hover:border-primary/50 transition-colors group cursor-pointer">
                 <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                       <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                          <span className="font-bold text-sm">PF</span>
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary">
                          <Download className="h-4 w-4" />
                       </Button>
                    </div>
                    <CardTitle className="text-base text-slate-900 group-hover:text-primary transition-colors">ECR Return (EPFO)</CardTitle>
                    <CardDescription className="text-xs mt-1">Electronic Challan cum Return formatted text file for monthly PF upload.</CardDescription>
                 </CardContent>
               </Card>

               <Card className="shadow-sm border-slate-200 hover:border-emerald-500/50 transition-colors group cursor-pointer">
                 <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                       <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          <span className="font-bold text-sm">ESI</span>
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-emerald-600">
                          <Download className="h-4 w-4" />
                       </Button>
                    </div>
                    <CardTitle className="text-base text-slate-900 group-hover:text-emerald-700 transition-colors">ESIC Return Format</CardTitle>
                    <CardDescription className="text-xs mt-1">Excel template containing employee ESIC contribution data for portal upload.</CardDescription>
                 </CardContent>
               </Card>

               <Card className="shadow-sm border-slate-200 hover:border-amber-500/50 transition-colors group cursor-pointer">
                 <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                       <div className="h-10 w-10 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <span className="font-bold text-sm">TDS</span>
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-amber-600">
                          <Download className="h-4 w-4" />
                       </Button>
                    </div>
                    <CardTitle className="text-base text-slate-900 group-hover:text-amber-700 transition-colors">Form 24Q (Quarterly)</CardTitle>
                    <CardDescription className="text-xs mt-1">TDS return data preparation sheet for Q4 FY2025-26 under Section 192.</CardDescription>
                 </CardContent>
               </Card>
            </div>
         </div>

         {/* Internal Financial Reports */}
         <div className="col-span-full mt-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
               <PieChart className="h-4 w-4" /> Internal Analytics
            </h3>
            
            <Card className="shadow-sm border-slate-200">
               <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x border-slate-100">
                  <div className="w-full md:w-1/3 p-6 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                     <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <IndianRupee className="h-5 w-5 text-blue-600" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">Variance Report</h4>
                        <p className="text-xs text-slate-500 mt-1">Month over month changes in total compensation and head count.</p>
                        <div className="mt-3 text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">Generate <ArrowRight className="h-3 w-3" /></div>
                     </div>
                  </div>

                  <div className="w-full md:w-1/3 p-6 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                     <div className="h-12 w-12 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-violet-600" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">Bank Transfer File</h4>
                        <p className="text-xs text-slate-500 mt-1">NEFT/RTGS format file with account names, numbers, and IFSC codes.</p>
                        <div className="mt-3 text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">Generate <ArrowRight className="h-3 w-3" /></div>
                     </div>
                  </div>

                  <div className="w-full md:w-1/3 p-6 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                     <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-orange-600" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">JV Register</h4>
                        <p className="text-xs text-slate-500 mt-1">Journal Voucher summary for easy import into Tally or Zoho Books.</p>
                        <div className="mt-3 text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">Generate <ArrowRight className="h-3 w-3" /></div>
                     </div>
                  </div>
               </div>
            </Card>
         </div>

       </div>
    </div>
  );
}
