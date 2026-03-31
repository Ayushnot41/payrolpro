"use client";

import { useState, useEffect } from "react";
import { Download, Upload, Calendar as CalendarIcon, Search } from "lucide-react";
import Papa from 'papaparse';


import { ATTENDANCE_STATUS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AttendancePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  
  // Use fixed month for demo consistency
  const year = 2026;
  const month = 3; // March
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const exportToCSV = () => {
    const csvData = employees.map(emp => {
      const row: any = { 'Employee': emp.name, 'ID': emp.employeeCode };
      days.forEach(d => {
        row[`${d} Mar`] = getDayStatus(emp.id, d);
      });
      return row;
    });
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Payroll_Attendance_March_2026.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    import('@/app/actions').then(({ getAttendanceAction }) => {
      getAttendanceAction(month, year).then(data => {
        setEmployees(data.employees);
        setAttendance(data.rawRecords);
      });
    });
  }, [month, year]);

  const getDayStatus = (empId: string, day: number) => {
    const dateStr = `${year}-03-${String(day).padStart(2, '0')}`;
    const record = attendance.find(a => a.employeeId === empId && a.date === dateStr);
    return record?.status || "PRESENT";
  };

  const isWeekend = (day: number) => {
    const d = new Date(year, month - 1, day).getDay();
    return d === 0 || d === 6; // Sunday or Saturday
  };

  return (
    <div className="flex-1 space-y-4 pt-2 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance Ledger</h2>
          <p className="text-muted-foreground">Manage daily attendance records and leave tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 border-slate-300 gap-2 shadow-sm" onClick={exportToCSV}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline font-semibold">Export CSV</span>
          </Button>
          <Button className="h-9 gap-2 shadow-sm font-semibold">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import Data</span>
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between bg-white p-3 border rounded-xl shadow-sm shrink-0">
         <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2 border bg-slate-50 rounded-lg px-3 py-1.5 shadow-inner">
               <CalendarIcon className="h-4 w-4 text-slate-500" />
               <select className="bg-transparent border-none text-sm font-bold text-slate-700 focus:outline-none">
                  <option>March 2026</option>
                  <option>February 2026</option>
                  <option>January 2026</option>
               </select>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
              <Input placeholder="Find employee..." className="h-8 pl-8 bg-slate-50 border-slate-200 text-sm focus-visible:ring-primary shadow-none rounded-lg" />
            </div>
         </div>
         
         <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden lg:flex">
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500"></div> Present</span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500"></div> Absent</span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500"></div> Half Day</span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-orange-500"></div> Paid Leave</span>
         </div>
      </div>

      {/* Matrix Grid */}
      <div className="flex-1 border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-auto flex-1 w-full max-w-full">
           <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm">
                 <tr>
                    <th className="sticky left-0 z-30 bg-slate-50 border-r border-b px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px] w-64 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Employee</th>
                    {days.map(d => (
                       <th key={d} className={`border-b border-r px-1 py-2 text-center font-bold text-slate-600 ${isWeekend(d) ? 'bg-slate-100/50' : ''} min-w-[36px]`}>
                         <div className="flex flex-col items-center gap-1">
                            <span className="text-[9px] uppercase tracking-widest text-slate-400">{d} Mar</span>
                            <span>{new Date(year, month - 1, d).toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                         </div>
                       </th>
                    ))}
                    <th className="sticky right-0 z-20 bg-slate-50 border-l border-b px-4 py-2 text-center font-bold text-slate-700 uppercase tracking-wider text-[10px] w-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">Total P</th>
                 </tr>
              </thead>
              <tbody>
                 {employees.map(emp => {
                    let totalP = 0;
                    return (
                       <tr key={emp.id} className="border-b hover:bg-slate-50/50 transition-colors group">
                          <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/50 border-r px-4 py-2 font-medium text-slate-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors truncate max-w-[250px]">
                             <div className="flex flex-col">
                               <span>{emp.name}</span>
                               <span className="text-[10px] font-mono text-slate-400">{emp.employeeCode}</span>
                             </div>
                          </td>
                          {days.map(d => {
                             const status = getDayStatus(emp.id, d);
                             const config = ATTENDANCE_STATUS_CONFIG[status as keyof typeof ATTENDANCE_STATUS_CONFIG];
                             const weekend = isWeekend(d);
                             
                             if (status === 'PRESENT') totalP += 1;
                             if (status === 'HALF_DAY') totalP += 0.5;

                             if (weekend && status === 'WEEK_OFF') {
                               return <td key={d} className="border-r px-1 py-1 text-center bg-slate-100/50">
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                  </div>
                               </td>
                             }

                             return (
                                <td key={d} className={`border-r px-0.5 py-1 text-center ${weekend ? 'bg-slate-50/30' : ''}`}>
                                  <div className={`mx-auto flex h-6 w-7 items-center justify-center rounded text-[10px] font-bold ${config.bgColor} ${config.color} cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all`}>
                                     {config.shortLabel}
                                  </div>
                                </td>
                             )
                          })}
                          <td className="sticky right-0 z-10 bg-white group-hover:bg-slate-50/50 border-l px-4 py-2 text-center font-black tabular-data text-slate-800 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors">
                             {totalP}
                          </td>
                       </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
