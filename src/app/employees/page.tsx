"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Plus, MoreHorizontal, X } from "lucide-react";
import * as XLSX from 'xlsx';


import { formatCurrency, getAvatarColor, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(employees.map(e => ({
      'Employee ID': e.employeeCode,
      'Name': e.name,
      'Email': e.email,
      'Designation': e.designation,
      'Department': e.departmentName,
      'Joining Date': e.dateOfJoining,
      'Base Salary': e.baseSalary,
      'PAN': e.panNumber,
      'Bank': e.bankName,
      'Account No': e.bankAccountNumber
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "PayrollPro_Employees.xlsx");
  };

  useEffect(() => {
    import('@/app/actions').then(({ getEmployeesAction, getDepartmentsAction }) => {
      getEmployeesAction().then(data => {
        setEmployees(data);
      });
      getDepartmentsAction().then(data => {
        setDepartments(data);
      });
    });
  }, []);

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 pt-2 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Workforce</h2>
          <p className="text-muted-foreground">Manage your global workforce, view profiles, and update comp details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 border-slate-300 font-semibold gap-2 shadow-sm" onClick={exportToExcel}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button 
            className="h-10 font-semibold gap-2 shadow-sm"
            onClick={() => setDrawerOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Employee</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border rounded-xl shadow-sm">
        <div className="flex items-center w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              type="search" 
              placeholder="Search by name, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none" 
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 bg-slate-50 shrink-0">
            <Filter className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
        <div className="text-sm font-medium text-slate-500 w-full sm:w-auto text-right">
          Showing {filtered.length} employees
        </div>
      </div>

      {/* Table grid */}
      <div className="flex-1 border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 border-b shadow-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] font-semibold text-slate-600 uppercase text-xs tracking-wider h-12">Employee Details</TableHead>
                <TableHead className="font-semibold text-slate-600 uppercase text-xs tracking-wider h-12">Status/Type</TableHead>
                <TableHead className="font-semibold text-slate-600 uppercase text-xs tracking-wider h-12">Department</TableHead>
                <TableHead className="font-semibold text-slate-600 uppercase text-xs tracking-wider h-12">Joining Date</TableHead>
                <TableHead className="text-right font-semibold text-slate-600 uppercase text-xs tracking-wider h-12">Monthly Base</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow key={emp.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(emp.name)} shadow-sm`}>
                        {getInitials(emp.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 leading-tight group-hover:text-primary transition-colors cursor-pointer">{emp.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-slate-500">{emp.employeeCode}</span>
                          <span className="text-slate-300 text-xs">•</span>
                          <span className="text-xs text-slate-500 truncate max-w-[150px]">{emp.designation}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant="success" className="bg-emerald-50 text-emerald-700 border border-emerald-200/50">Active</Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        {emp.employmentType === 'FULL_TIME' ? 'Full Time' : emp.employmentType === 'PART_TIME' ? 'Part Time' : 'Contract'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200/60">
                      {emp.departmentName || 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-slate-600">{new Date(emp.dateOfJoining).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold tabular-data text-slate-900">{formatCurrency(emp.baseSalary)}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    No employees found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Slide-over Drawer for Add Employee */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          ></div>
          
          {/* Drawer content */}
          <div className="relative w-full max-w-lg bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Add Employee</h3>
                <p className="text-sm text-slate-500">Create a new ledger entry for the workforce.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
              {/* Section 1: Personal Info */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <div className="h-4 w-4 rounded-sm bg-primary/20 flex items-center justify-center text-[10px]">1</div>
                  Personal Info
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                    <Input placeholder="e.g. Rahul Sharma" className="mt-1 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Email Address</label>
                      <Input type="email" placeholder="rahul@company.com" className="mt-1 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Phone</label>
                      <Input type="tel" placeholder="+91 98765 43210" className="mt-1 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none" />
                    </div>
                  </div>
                </div>
              </div>

               {/* Section 2: Work Details */}
               <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <div className="h-4 w-4 rounded-sm bg-primary/20 flex items-center justify-center text-[10px]">2</div>
                  Work Details
                </h4>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Department</label>
                      <select className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-none">
                        <option value="" disabled selected>Select...</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Date of Joining</label>
                      <Input type="date" className="mt-1 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Designation</label>
                    <Input placeholder="e.g. Frontend Developer" className="mt-1 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-2 block">Employment Type</label>
                    <div className="grid grid-cols-3 gap-2">
                       <label className="flex items-center justify-center rounded-md border border-primary bg-blue-50/50 px-3 py-2 text-sm font-semibold text-primary cursor-pointer hover:bg-blue-50 transition-colors">
                         <input type="radio" name="empType" value="full" checked className="sr-only" />
                         Full-time
                       </label>
                       <label className="flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                         <input type="radio" name="empType" value="part" className="sr-only" />
                         Part-time
                       </label>
                       <label className="flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                         <input type="radio" name="empType" value="contract" className="sr-only" />
                         Contract
                       </label>
                    </div>
                  </div>
                </div>
              </div>

               {/* Section 3: Compensation */}
               <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <div className="h-4 w-4 rounded-sm bg-primary/20 flex items-center justify-center text-[10px]">3</div>
                  Compensation
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Base Salary (Monthly)</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-2.5 font-semibold text-slate-500">₹</span>
                      <Input type="number" placeholder="0.00" className="pl-8 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none font-mono" />
                    </div>
                  </div>
                  
                  {/* Auto computed preview banner */}
                  <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 p-3 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Computed Preview</span>
                      <span className="text-[10px] font-bold text-primary opacity-60">AUTO-CALC</span>
                    </div>
                    <div className="flex gap-4 text-xs font-medium text-slate-600">
                       <div className="flex gap-1.5"><span className="text-slate-400">HRA:</span> <span className="tabular-data text-slate-900">₹0.00</span></div>
                       <div className="flex gap-1.5"><span className="text-slate-400">PF:</span> <span className="tabular-data text-slate-900">₹0.00</span></div>
                       <div className="flex gap-1.5"><span className="text-slate-400">Pt:</span> <span className="tabular-data text-slate-900">₹200</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Compliance */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <div className="h-4 w-4 rounded-sm bg-primary/20 flex items-center justify-center text-[10px]">4</div>
                  Compliance & Banking
                </h4>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">PAN Number</label>
                      <Input placeholder="ABCDE1234F" className="mt-1 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none uppercase" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Bank IFSC</label>
                      <Input placeholder="HDFC0001234" className="mt-1 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Account Number</label>
                    <Input type="password" placeholder="••••••••••••" className="mt-1 h-10 border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-none font-mono" />
                  </div>
                </div>
              </div>

            </div>

            {/* Footer actions */}
            <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4 px-6 flex justify-between items-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
              <Button variant="ghost" className="font-semibold text-slate-600" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className="font-semibold px-8 shadow-sm" onClick={() => {
                // mock save action
                setTimeout(() => setDrawerOpen(false), 500);
              }}>
                Save Employee
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
