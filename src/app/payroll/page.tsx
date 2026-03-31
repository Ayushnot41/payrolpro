"use client";

import { useState, useEffect } from "react";
import { Calculator, ChevronRight, X, PlayCircle, FileText, CheckCircle2, History, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PAYROLL_STATUS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PayrollPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    import('@/app/actions').then(({ getPayrollRunsAction }) => {
      getPayrollRunsAction().then(setRuns);
    });
  }, []);

  const handleRunPayroll = () => {
    setWizardOpen(true);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep === 2) { // Transition to Computation
      setCurrentStep(3);
      setIsProcessing(true);
      setProgress(0);
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            return 100;
          }
          return p + 5;
        });
      }, 100);
      
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const getMonthName = (m: number) => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m-1];

  return (
    <div className="flex-1 space-y-6 pt-2 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payroll Processing</h2>
          <p className="text-muted-foreground">Manage and execute company-wide payroll processing.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 border-slate-300 font-semibold gap-2 shadow-sm">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Audit Log</span>
          </Button>
          <Button 
            className="h-10 font-semibold gap-2 shadow-sm"
            onClick={handleRunPayroll}
          >
            <PlayCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Run Payroll</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full space-y-4">
        {runs.map(run => {
          const config = PAYROLL_STATUS_CONFIG[run.status as keyof typeof PAYROLL_STATUS_CONFIG];
          
          return (
            <Card key={run.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Info block */}
                <div className="flex items-center gap-6 flex-1">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-indigo-400 uppercase leading-none mb-1">{getMonthName(run.month).slice(0,3)}</span>
                    <span className="text-base font-black text-indigo-700 leading-none">{run.year}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      {getMonthName(run.month)} {run.year} Payroll
                      <Badge variant="outline" className={`border-transparent ${config.bgColor} ${config.color} uppercase text-[10px] tracking-wider px-2 py-0 h-5`}>
                        {config.label}
                      </Badge>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Processed on {new Date(run.createdAt).toLocaleDateString()} • {run.totalEmployees} Employees</p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex items-center gap-8 px-8 border-x border-slate-100 shrink-0 hidden lg:flex">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Gross</span>
                    <span className="text-lg font-bold tabular-data text-slate-700">{formatCurrency(run.totalGross)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Deductions</span>
                    <span className="text-lg font-bold tabular-data text-slate-700">{formatCurrency(run.totalDeductions)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Net Disbursed</span>
                    <span className="text-xl font-black tabular-data text-primary leading-none">{formatCurrency(run.totalNet)}</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="shrink-0 flex items-center justify-end">
                  <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 hover:bg-blue-50">
                    View Register <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Full Page Wizard Overlay */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in fade-in duration-200">
          
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm shrink-0">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setWizardOpen(false)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                <X className="h-4 w-4 text-slate-600" />
              </Button>
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-slate-900 leading-tight">Run Payroll: April 2026</h2>
                <p className="text-xs text-slate-500 font-medium tracking-wide">Step {currentStep} of 5 • Processing Ledger</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Draft saved just now</span>
              <Button variant="outline" size="sm" className="h-8 font-semibold text-slate-600 border-slate-200">
                Save & Exit
              </Button>
              <div className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center ml-2 shadow-inner">
                <span className="text-[10px] font-bold text-slate-600">AS</span>
              </div>
            </div>
          </header>

          {/* Stepper Config */}
          <div className="bg-white border-b pt-6 pb-6 px-12 flex justify-center shrink-0">
            <div className="flex items-center max-w-3xl w-full justify-between relative">
              <div className="absolute left-0 right-0 top-3 border-t-2 border-slate-100 -z-10"></div>
              
              {[
                { label: 'SELECT PERIOD', num: 1 },
                { label: 'ATTENDANCE REVIEW', num: 2 },
                { label: 'SALARY COMPUTATION', num: 3 },
                { label: 'PAYROLL REGISTER', num: 4 },
                { label: 'APPROVE & FINALIZE', num: 5 }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 bg-white px-2">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep > step.num ? 'bg-primary text-white border-primary shadow-sm' : currentStep === step.num ? 'bg-white border-2 border-primary text-primary shadow-sm shadow-primary/20 scale-110 transition-transform' : 'bg-slate-50 border-2 border-slate-200 text-slate-400'}`}>
                    {currentStep > step.num ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.num}
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest ${currentStep >= step.num ? 'text-primary' : 'text-slate-400'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto flex py-16 px-6">
            <div className="w-full max-w-4xl mx-auto flex flex-col">
              
              {currentStep === 1 && (
                 <div className="text-center space-y-8 animate-in slide-in-from-bottom-8 opacity-0 duration-500 fill-mode-forwards">
                   <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configure Payroll Run</h1>
                   <p className="text-slate-500 max-w-md mx-auto">Select the payroll cycle and verify total active headcount before proceeding into attendance mapping.</p>
                   
                   <div className="mt-12 max-w-md mx-auto bg-white border border-slate-200 shadow-sm rounded-xl p-6 text-left space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Payroll Cycle</label>
                        <select className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold shadow-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                          <option>April 2026 (1st - 30th)</option>
                          <option>March 2026 (1st - 31st)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                         <div>
                           <div className="text-xs text-slate-500 font-semibold mb-1">Active Employees</div>
                           <div className="text-2xl font-black text-slate-900 tabular-data">247</div>
                         </div>
                         <div>
                           <div className="text-xs text-slate-500 font-semibold mb-1">Working Days</div>
                           <div className="text-2xl font-black text-slate-900 tabular-data">22</div>
                         </div>
                      </div>
                   </div>
                 </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col items-center justify-center space-y-12 animate-in slide-in-from-bottom-8 opacity-0 duration-500 fill-mode-forwards w-full">
                  
                  <div className="text-center space-y-4">
                     <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                           <circle cx="64" cy="64" r="56" className="text-slate-100 stroke-current" strokeWidth="8" fill="transparent" />
                           <circle cx="64" cy="64" r="56" className="text-primary stroke-current transition-all duration-300 ease-out" strokeWidth="8" strokeLinecap="round" fill="transparent" strokeDasharray="351.858" strokeDashoffset={351.858 - (progress / 100) * 351.858} />
                        </svg>
                        <div className="text-2xl font-black text-slate-900 tabular-data">{Math.round(progress)}%</div>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mt-6">{isProcessing ? "Processing Employee Records..." : "Computation Complete"}</h3>
                     <p className="text-sm text-slate-500">{isProcessing ? `Applying tax components and statutory deductions for ${Math.floor((progress/100)*247)} of 247 employees.` : "All 247 employee salaries successfully computed."}</p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-6 w-full max-w-3xl mt-12 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-forwards">
                     <Card className="shadow-sm border-slate-200">
                       <CardContent className="p-5">
                         <div className="flex items-center justify-between mb-4">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Gross</span>
                           <FileText className="h-4 w-4 text-slate-300" />
                         </div>
                         <div className="text-xl font-black text-slate-900 tabular-data tracking-tight pb-1">₹62,45,000<span className="text-emerald-500/0 font-bold ml-1 text-2xl leading-none animate-pulse">•</span></div>
                         <p className="text-[10px] font-semibold text-emerald-600 mt-1 uppercase tracking-wider">{isProcessing ? 'Updating in real-time' : 'Finalized'}</p>
                       </CardContent>
                     </Card>
                     
                     <Card className="shadow-sm border-slate-200">
                       <CardContent className="p-5">
                         <div className="flex items-center justify-between mb-4">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Deductions</span>
                           <FileText className="h-4 w-4 text-slate-300" />
                         </div>
                         <div className="text-xl font-black text-red-600 tabular-data tracking-tight pb-1">₹13,93,000<span className="text-orange-500/0 font-bold ml-1 text-2xl leading-none animate-pulse">•</span></div>
                         <p className="text-[10px] font-semibold text-amber-600 mt-1 uppercase tracking-wider">{isProcessing ? 'Calculating statutory tax' : 'Finalized'}</p>
                       </CardContent>
                     </Card>

                     <Card className="shadow-md border-primary bg-primary/5">
                       <CardContent className="p-5 relative overflow-hidden">
                         <div className="absolute right-0 top-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                         <div className="flex items-center justify-between mb-4 relative z-10">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Total Net Pay</span>
                           <FileText className="h-4 w-4 text-primary opacity-60" />
                         </div>
                         <div className="text-2xl font-black text-primary tabular-data tracking-tight pb-1 relative z-10">₹48,52,000<span className="text-primary font-bold ml-1 text-2xl leading-none animate-pulse">•</span></div>
                         <p className="text-[10px] font-bold text-primary opacity-70 mt-1 uppercase tracking-wider relative z-10">{isProcessing ? 'Estimated Disbursement' : 'Ready'}</p>
                       </CardContent>
                     </Card>
                  </div>

                  <div className="w-full max-w-3xl rounded-xl bg-indigo-50/50 p-4 border border-indigo-100 flex items-start gap-3 opacity-0 animate-in fade-in duration-500 delay-500 fill-mode-forwards">
                     <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                     <div>
                       <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">Architecture Protocol Active</h4>
                       <p className="text-xs text-slate-600 mt-1 leading-relaxed">Our engine is currently validating Income Tax (Section 192) and Provident Fund contributions. You can continue to the next step once the core ledger balance is finalized.</p>
                     </div>
                  </div>
                </div>
              )}

            </div>
          </main>

          {/* Footer controls */}
          <footer className="h-20 bg-white border-t flex items-center justify-between px-12 shrink-0">
             <Button variant="ghost" onClick={() => setWizardOpen(false)} className="font-semibold text-slate-500 hover:text-slate-900">
               Cancel Run
             </Button>
             <div className="flex gap-3">
               <Button 
                variant={currentStep === 3 && isProcessing ? "secondary" : "default"} 
                className={currentStep === 3 && isProcessing ? "opacity-50 font-semibold px-8" : "font-semibold px-8 shadow-sm transition-all"} 
                disabled={currentStep === 3 && isProcessing}
                onClick={nextStep}
               >
                 {currentStep < 5 ? (currentStep === 3 ? "Review Register →" : "Next Step →") : "Sign & Finalize Run"}
               </Button>
             </div>
          </footer>
        </div>
      )}
    </div>
  );
}
