"use client";

import { useEffect, useState } from "react";
import {
  Users,
  IndianRupee,
  FileCheck,
  ShieldCheck,
  PlayCircle,
  UserPlus,
  Receipt,
  Settings2,
  AlertCircle,
  MessageSquareWarning,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


import { formatCurrency, formatCurrencyDetailed, formatRelativeDate } from "@/lib/utils";
import { PAYROLL_STATUS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{
    kpis: any;
    monthlyTrend: any[];
    departmentBreakdown: any[];
    recentRuns: any[];
  } | null>(null);

  useEffect(() => {
    import('@/app/actions').then(({ getDashboardData }) => {
      getDashboardData().then(data => {
        setData(data);
        setMounted(true);
      });
    });
  }, []);

  if (!mounted || !data) return null;

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#6366F1'];

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Manage your overall workforce payroll and compliance records.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Employees</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 tabular-data">{data.kpis.totalEmployees}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              +12 this month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">This Month Payroll</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 tabular-data">
              {formatCurrency(data.kpis.monthlyPayroll)}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              +9.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Approvals</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
              <FileCheck className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 tabular-data">{data.kpis.pendingApprovals}</div>
            <p className="text-xs text-slate-500 mt-1">
              <a href="#" className="text-primary hover:underline font-medium">View all</a>
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Compliance Status</CardTitle>
            <div className="h-8 w-8 rounded-full bg-violet-50 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900">{data.kpis.complianceStatus}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              PF/ESI Returns Filed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Trend Chart */}
        <Card className="col-span-4 shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Monthly Payroll Trend</CardTitle>
              <CardDescription>Expenditure across the last 6 months (in ₹)</CardDescription>
            </div>
            <select className="text-xs border rounded px-2 py-1 bg-slate-50 font-medium text-slate-600">
              <option>FY 2025-26</option>
              <option>FY 2024-25</option>
            </select>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} 
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(Number(value) || 0), "Payroll"]} 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Headcount Donut */}
        <Card className="col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Headcount by Department</CardTitle>
            <CardDescription>Current distribution across {data.departmentBreakdown.length} teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.departmentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.departmentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tabular-data">{data.kpis.totalEmployees}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Employees</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 px-4">
              {data.departmentBreakdown.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-slate-600 truncate max-w-[80px]">{dept.name}</span>
                  </div>
                  <span className="font-semibold tabular-data text-slate-900">{dept.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
         {/* Recent Payrolls */}
         <Card className="col-span-5 shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b pb-4">
            <div>
              <CardTitle>Recent Payroll Runs</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold border-slate-300">
              View All History
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600 uppercase text-xs tracking-wider">Month</TableHead>
                  <TableHead className="font-semibold text-slate-600 uppercase text-xs tracking-wider">Employees</TableHead>
                  <TableHead className="font-semibold text-slate-600 uppercase text-xs tracking-wider">Net Pay</TableHead>
                  <TableHead className="font-semibold text-slate-600 uppercase text-xs tracking-wider">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600 uppercase text-xs tracking-wider text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentRuns.map((run) => {
                  const monthName = run.month === 1 ? 'January' : run.month === 2 ? 'February' : run.month === 3 ? 'March' : run.month === 12 ? 'December' : 'Other';
                  const config = PAYROLL_STATUS_CONFIG[run.status as keyof typeof PAYROLL_STATUS_CONFIG];
                  
                  return (
                    <TableRow key={run.id} className="cursor-default">
                      <TableCell className="font-medium text-slate-900">{monthName} {run.year}</TableCell>
                      <TableCell className="tabular-data text-slate-600">{run.totalEmployees}</TableCell>
                      <TableCell className="tabular-data font-semibold text-slate-900">{formatCurrency(run.totalNet)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-transparent ${config.bgColor} ${config.color} font-bold rounded px-2`}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary">
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Complaints Section */}
        <Card className="col-span-5 shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-red-50/30 border-b pb-4">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg">Employee Grievance & Complaints</CardTitle>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {data.complaintStats.reduce((acc: number, c: any) => acc + c.count, 0)} Total Active
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
               <TableHeader>
                 <TableRow className="bg-transparent hover:bg-transparent">
                   <TableHead className="font-semibold text-slate-600 px-6 py-4 uppercase text-xs tracking-wider">Subject Category</TableHead>
                   <TableHead className="font-semibold text-slate-600 px-6 py-4 uppercase text-xs tracking-wider">Cases</TableHead>
                   <TableHead className="font-semibold text-slate-600 px-6 py-4 uppercase text-xs tracking-wider text-right">Status</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {data.complaintStats.map((complaint: any, idx: number) => (
                   <TableRow key={idx} className="hover:bg-slate-50 transition-colors">
                     <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-900">{complaint.category}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Priority: {complaint.count > 3 ? "High" : "Normal"}</span>
                        </div>
                     </TableCell>
                     <TableCell className="px-6 py-4 tabular-data font-semibold">{complaint.count}</TableCell>
                     <TableCell className="px-6 py-4 text-right">
                        <Badge variant="outline" className={complaint.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}>
                          {complaint.status}
                        </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-500 uppercase tracking-wider">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 shadow-sm hover:border-primary/50 hover:bg-slate-50">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-slate-700">Run Payroll</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 shadow-sm hover:border-primary/50 hover:bg-slate-50">
                  <UserPlus className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-slate-700">Add Employee</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 shadow-sm hover:border-primary/50 hover:bg-slate-50">
                  <Receipt className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-slate-700">Last Slips</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-slate-200 shadow-sm hover:border-primary/50 hover:bg-slate-50">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-slate-700">Tax Config</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-white border-transparent shadow-md overflow-hidden relative">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-black/10 blur-xl"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-lg">Quarterly Audit Ready?</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                Your compliance data for Q1 is ready for verification. Ensure all salary components are locked before running the final report.
              </p>
              <Button size="sm" className="bg-white text-primary hover:bg-blue-50 font-bold shadow-sm">
                Review Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
