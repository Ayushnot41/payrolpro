"use client";

import { useEffect, useState } from "react";
import { Save, Building2, Wallet, Users, LayoutDashboard, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    import("@/app/actions").then(({ getCompanyAction }) => {
      getCompanyAction().then(setCompany);
    });
  }, []);

  if (!company) return null;
  return (
    <div className="flex-1 space-y-6 pt-2 h-[calc(100vh-80px)] overflow-y-auto w-full max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organization Profile</h2>
          <p className="text-muted-foreground">Manage your company details, integrations, and workspace settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 font-semibold text-slate-600 border-slate-300">
            Discard Changes
          </Button>
          <Button className="h-10 font-semibold gap-2 shadow-sm px-6">
            <Save className="h-4 w-4" />
            Save Profile
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start w-full">
         
         {/* Sidebar Nav for Settings */}
         <div className="col-span-1 border rounded-xl bg-white shadow-sm p-4 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-primary font-bold shadow-sm border border-blue-100/50 cursor-pointer transition-colors">
               <Building2 className="h-4 w-4 shrink-0" />
               Company Profile
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
               <Wallet className="h-4 w-4 shrink-0" />
               Bank Integrations
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
               <Users className="h-4 w-4 shrink-0" />
               Roles & Permissions
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
               <Database className="h-4 w-4 shrink-0" />
               Data Migration
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
               <Key className="h-4 w-4 shrink-0" />
               API Keys
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 border-t mt-4 text-red-600 font-semibold hover:bg-red-50 cursor-pointer transition-colors">
               <LayoutDashboard className="h-4 w-4 shrink-0" />
               Danger Zone
            </div>
         </div>

         {/* Main Content Form */}
         <div className="col-span-3 space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b pb-4 pt-5">
                 <CardTitle>Business Entity Details</CardTitle>
                 <CardDescription>This information is used on exact payroll slips and official communications.</CardDescription>
               </CardHeader>
               <CardContent className="pt-6 space-y-6">
                  
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Legal Company Name</label>
                        <Input defaultValue={company.name} className="h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-primary" />
                     </div>
                     <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tax Identification (PAN)</label>
                        <Input defaultValue={company.pan || "ABCDE1234F"} className="h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-primary uppercase" />
                     </div>
                     
                     <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Registration No (CIN)</label>
                        <Input defaultValue={company.cin || "U72900KA2025PTC123456"} className="h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-primary uppercase" />
                     </div>
                     <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">GSTIN</label>
                        <Input defaultValue={company.gstin || "29ABCDE1234F1Z5"} className="h-10 border-slate-200 shadow-none font-semibold text-slate-900 focus-visible:ring-primary uppercase" />
                     </div>

                     <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Registered Corporate Address</label>
                        <textarea 
                          rows={3} 
                          className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium text-slate-900 resize-none"
                          defaultValue={company.address}
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b pb-4 pt-5">
                 <CardTitle>Statutory Registrations</CardTitle>
                 <CardDescription>PF and ESI identifiers for automated compliance filing.</CardDescription>
               </CardHeader>
               <CardContent className="pt-6 space-y-6">
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">EPFO Establishment Code</label>
                        <Input defaultValue="KN/BNG/1234567/000" className="h-10 bg-slate-50 border-slate-200 shadow-none font-mono text-sm text-slate-900 focus-visible:ring-primary uppercase" />
                     </div>
                     <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">ESIC Employer Code Number</label>
                        <Input defaultValue="53000123450000123" className="h-10 bg-slate-50 border-slate-200 shadow-none font-mono text-sm text-slate-900 focus-visible:ring-primary uppercase" />
                     </div>
                     <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Professional Tax Certificate (PT)</label>
                        <Input defaultValue="9012345678" className="h-10 bg-slate-50 border-slate-200 shadow-none font-mono text-sm text-slate-900 focus-visible:ring-primary uppercase" />
                     </div>
                     <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">TAN Number</label>
                        <Input defaultValue="BLRA12345B" className="h-10 bg-slate-50 border-slate-200 shadow-none font-mono text-sm text-slate-900 focus-visible:ring-primary uppercase" />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

      </div>
    </div>
  );
}
