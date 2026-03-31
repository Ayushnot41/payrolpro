"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDashboardData } from "@/app/actions";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mock data for charts since we're using a simple DB
  const payrollTrend = [
    { name: 'Jan', amount: 4200000 },
    { name: 'Feb', amount: 4852000 },
    { name: 'Mar', amount: 4500000 },
    { name: 'Apr', amount: 4700000 },
  ];

  const deptDistribution = [
    { name: 'Engineering', value: 45 },
    { name: 'Sales', value: 25 },
    { name: 'Marketing', value: 15 },
    { name: 'HR', value: 10 },
    { name: 'Finance', value: 5 },
  ];

  return (
    <div className="flex-1 space-y-6 pt-2 h-[calc(100vh-80px)] overflow-y-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Payroll Insights</h2>
          <p className="text-muted-foreground text-sm">Deep dive into compensation trends, cost analytics and workforce patterns.</p>
        </div>
        <Button variant="outline" className="gap-2 border-slate-200">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-indigo-50/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-indigo-500 rounded-lg text-white">
                <IndianRupee className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> 12%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Annual CTC Liability</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹5.82 Cr</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-emerald-500 rounded-lg text-white">
                <Users className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> 4%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Company Networth</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹24.5 Cr</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-amber-500 rounded-lg text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100 flex items-center gap-0.5">
                <ArrowDownRight className="h-3 w-3" /> 2%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg. Employee Cost</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹7.2 L</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-slate-800 rounded-lg text-white">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Attendance Efficiency</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">94.2%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payroll Trend Chart */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Disbursement Trend (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payrollTrend}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10}}
                  tickFormatter={(v) => `₹${v/100000}L`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: any) => [formatCurrency(Number(v)), "Total Disbursement"]}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="h-4 w-4 text-emerald-500" />
              Cost by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-[350px] flex flex-col">
             <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deptDistribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deptDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-2 mt-4 px-4 pb-4">
                {deptDistribution.map((d, index) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{d.name}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, className, variant = "default" }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
