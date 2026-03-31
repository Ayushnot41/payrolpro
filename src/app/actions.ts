"use server";

import { db } from "@/lib/db";
import type { Employee, Company } from "@/types";

export async function getDashboardData() {
  const employees = db.getActiveEmployees();
  const runs = db.getPayrollRunsForCompany().slice(0, 5);
  
  const monthlyTrend = runs.slice(0, 6).reverse().map(r => ({
    name: r.month === 1 ? 'Jan' : r.month === 2 ? 'Feb' : r.month === 3 ? 'Mar' : r.month === 12 ? 'Dec' : r.month === 11 ? 'Nov' : 'Oct',
    total: r.totalNet
  }));

  const deptCounts = new Map();
  employees.forEach(e => {
    deptCounts.set(e.departmentId, (deptCounts.get(e.departmentId) || 0) + 1);
  });
  
  const departmentBreakdown = Array.from(deptCounts.entries()).map(([id, count]) => ({
    name: db.getDepartmentName(id),
    value: count,
  }));

  const complaintStats = [
    { category: "Payroll", count: 4, status: "Pending" },
    { category: "Tax", count: 2, status: "Active" },
    { category: "HR Policy", count: 1, status: "Resolved" },
  ];

  return {
    kpis: {
      totalEmployees: employees.length,
      monthlyPayroll: runs[0]?.totalNet || 0,
      pendingApprovals: runs.filter(r => r.status === "PROCESSING").length,
      complianceStatus: "Active & Compliant",
    },
    complaintStats,
    monthlyTrend: monthlyTrend.length ? monthlyTrend : [
      { name: 'Oct', total: 4200000 },
      { name: 'Nov', total: 4350000 },
      { name: 'Dec', total: 4550000 },
      { name: 'Jan', total: 4612000 },
      { name: 'Feb', total: 4720500 },
      { name: 'Mar', total: 4852000 },
    ],
    departmentBreakdown: departmentBreakdown.length ? departmentBreakdown : [
      { name: 'Engineering', value: 112 },
      { name: 'Sales', value: 54 },
      { name: 'Marketing', value: 38 },
      { name: 'HR', value: 15 },
      { name: 'Ops', value: 28 },
    ],
    recentRuns: runs,
  };
}

export async function getEmployeesAction() {
  return db.getActiveEmployees().map(emp => ({
    ...emp,
    departmentName: db.getDepartmentName(emp.departmentId),
  }));
}

export async function getAttendanceAction(month: number, year: number) {
  const employees = db.getActiveEmployees();
  const rawRecords = db.getAttendanceForMonth(month, year);
  return { employees, rawRecords };
}

export async function getPayrollRunsAction() {
  return db.getPayrollRunsForCompany();
}

export async function getSlipsAction(runId?: string) {
  if (!runId) {
    const runs = db.getPayrollRunsForCompany();
    if (runs.length) {
      runId = runs[0].id;
    }
  }
  if (!runId) return [];
  return db.getSalarySlipsForRun(runId);
}

export async function getDepartmentsAction() {
  return db.departments;
}

export async function getCompanyAction() {
  return db.company;
}
