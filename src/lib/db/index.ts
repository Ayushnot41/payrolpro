/**
 * In-memory data store — simulates Neon PostgreSQL
 * In production, replace with Drizzle ORM + Neon.
 * This file seeds realistic data for 20 employees, 3 months payroll, etc.
 */

import { hashSync } from "bcryptjs";
import type {
  User, Company, Department, Employee,
  AttendanceRecord, PayrollRun, PayrollRecord, TaxConfigData, SalarySlip,
} from "@/types";
import { DEPARTMENTS } from "@/lib/constants";
import { computeFullPayroll } from "@/lib/salary-engine";
import {
  generateEmployeeCode, getDaysInMonth, generateSlipNumber,
} from "@/lib/utils";

// =================== COMPANY ===================
const company: Company = {
  id: "company-1",
  name: "Acme Technologies Pvt Ltd",
  address: "123 Tech Park, Whitefield, Bangalore - 560066",
  gstin: "29ABCDE1234F1ZH",
  cin: "U72900KA2020PTC123456",
  payrollDay: 28,
  createdAt: "2024-01-15T00:00:00Z",
};

// =================== USERS ===================
const users: User[] = [
  {
    id: "user-1", name: "Ayush Sarkar", email: "admin@payrollpro.dev",
    passwordHash: hashSync("Admin@123", 10), role: "ADMIN",
    companyId: "company-1", isActive: true, createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "user-2", name: "Priya Sharma", email: "hr@payrollpro.dev",
    passwordHash: hashSync("Hr@123", 10), role: "HR",
    companyId: "company-1", isActive: true, createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "user-3", name: "Rahul Mehta", email: "finance@payrollpro.dev",
    passwordHash: hashSync("Finance@123", 10), role: "FINANCE",
    companyId: "company-1", isActive: true, createdAt: "2024-02-15T00:00:00Z",
  },
];

// =================== DEPARTMENTS ===================
const departments: Department[] = DEPARTMENTS.map((d) => ({
  ...d,
  companyId: "company-1",
  createdAt: "2024-01-15T00:00:00Z",
}));

// =================== EMPLOYEES ===================
const EMPLOYEE_DATA = [
  { name: "Rajesh Kumar", dept: "dept-1", designation: "Senior Software Developer", salary: 85000, type: "FULL_TIME" as const, doj: "2023-03-15", phone: "9876543210", pan: "ABCDE1234F", bank: "1234567890", ifsc: "HDFC0001234", bankName: "HDFC Bank" },
  { name: "Priya Nair", dept: "dept-2", designation: "Sales Manager", salary: 70000, type: "FULL_TIME" as const, doj: "2022-08-01", phone: "9876543211", pan: "FGHIJ5678K", bank: "2345678901", ifsc: "ICIC0002345", bankName: "ICICI Bank" },
  { name: "Amit Patel", dept: "dept-3", designation: "Marketing Lead", salary: 75000, type: "FULL_TIME" as const, doj: "2023-01-10", phone: "9876543212", pan: "KLMNO9012P", bank: "3456789012", ifsc: "SBIN0003456", bankName: "SBI" },
  { name: "Neha Singh", dept: "dept-4", designation: "HR Manager", salary: 72000, type: "FULL_TIME" as const, doj: "2022-06-15", phone: "9876543213", pan: "QRSTU3456V", bank: "4567890123", ifsc: "HDFC0004567", bankName: "HDFC Bank" },
  { name: "Vikram Reddy", dept: "dept-1", designation: "DevOps Engineer", salary: 90000, type: "FULL_TIME" as const, doj: "2023-05-20", phone: "9876543214", pan: "WXYZA7890B", bank: "5678901234", ifsc: "AXIS0005678", bankName: "Axis Bank" },
  { name: "Sanjay Gupta", dept: "dept-5", designation: "Operations Director", salary: 95000, type: "FULL_TIME" as const, doj: "2021-11-01", phone: "9876543215", pan: "CDEFG1234H", bank: "6789012345", ifsc: "KOTK0006789", bankName: "Kotak Bank" },
  { name: "Meera Krishnan", dept: "dept-1", designation: "Full Stack Developer", salary: 80000, type: "FULL_TIME" as const, doj: "2023-07-01", phone: "9876543216", pan: "IJKLM5678N", bank: "7890123456", ifsc: "HDFC0007890", bankName: "HDFC Bank" },
  { name: "Anita Desai", dept: "dept-2", designation: "Business Development Executive", salary: 55000, type: "FULL_TIME" as const, doj: "2024-01-15", phone: "9876543217", pan: "OPQRS9012T", bank: "8901234567", ifsc: "ICIC0008901", bankName: "ICICI Bank" },
  { name: "Karthik Iyer", dept: "dept-1", designation: "Tech Lead", salary: 120000, type: "FULL_TIME" as const, doj: "2021-04-01", phone: "9876543218", pan: "UVWXY3456Z", bank: "9012345678", ifsc: "SBIN0009012", bankName: "SBI" },
  { name: "Deepika Rao", dept: "dept-6", designation: "Finance Analyst", salary: 65000, type: "FULL_TIME" as const, doj: "2023-09-10", phone: "9876543219", pan: "ABCDF1234G", bank: "0123456789", ifsc: "HDFC0000123", bankName: "HDFC Bank" },
  { name: "Arjun Menon", dept: "dept-7", designation: "Product Manager", salary: 110000, type: "FULL_TIME" as const, doj: "2022-03-01", phone: "9876543220", pan: "HIJKL5678M", bank: "1234509876", ifsc: "AXIS0001234", bankName: "Axis Bank" },
  { name: "Sneha Joshi", dept: "dept-8", designation: "UI/UX Designer", salary: 68000, type: "FULL_TIME" as const, doj: "2023-11-01", phone: "9876543221", pan: "NOPQR9012S", bank: "2345610987", ifsc: "KOTK0002345", bankName: "Kotak Bank" },
  { name: "Ravi Shankar", dept: "dept-1", designation: "Backend Developer", salary: 78000, type: "FULL_TIME" as const, doj: "2024-02-01", phone: "9876543222", pan: "TUVWX3456Y", bank: "3456721098", ifsc: "SBIN0003456", bankName: "SBI" },
  { name: "Pooja Verma", dept: "dept-4", designation: "HR Executive", salary: 45000, type: "FULL_TIME" as const, doj: "2024-06-01", phone: "9876543223", pan: "ZABCD7890E", bank: "4567832109", ifsc: "ICIC0004567", bankName: "ICICI Bank" },
  { name: "Manoj Kumar", dept: "dept-5", designation: "Logistics Coordinator", salary: 42000, type: "FULL_TIME" as const, doj: "2024-04-15", phone: "9876543224", pan: "FGHIJ1234K", bank: "5678943210", ifsc: "HDFC0005678", bankName: "HDFC Bank" },
  { name: "Kavita Sharma", dept: "dept-3", designation: "Content Strategist", salary: 52000, type: "FULL_TIME" as const, doj: "2024-01-01", phone: "9876543225", pan: "LMNOP5678Q", bank: "6789054321", ifsc: "AXIS0006789", bankName: "Axis Bank" },
  { name: "Suresh Babu", dept: "dept-1", designation: "QA Engineer", salary: 62000, type: "CONTRACT" as const, doj: "2025-01-01", phone: "9876543226", pan: "RSTUV9012W", bank: "7890165432", ifsc: "KOTK0007890", bankName: "Kotak Bank" },
  { name: "Lakshmi Narayan", dept: "dept-6", designation: "Accounts Manager", salary: 73000, type: "FULL_TIME" as const, doj: "2022-10-01", phone: "9876543227", pan: "XYZAB3456C", bank: "8901276543", ifsc: "SBIN0008901", bankName: "SBI" },
  { name: "Arun Prakash", dept: "dept-2", designation: "Regional Sales Lead", salary: 82000, type: "FULL_TIME" as const, doj: "2023-06-15", phone: "9876543228", pan: "DEFGH7890I", bank: "9012387654", ifsc: "HDFC0009012", bankName: "HDFC Bank" },
  { name: "Divya Menon", dept: "dept-7", designation: "Associate Product Manager", salary: 70000, type: "PART_TIME" as const, doj: "2024-08-01", phone: "9876543229", pan: "JKLMN1234O", bank: "0123498765", ifsc: "ICIC0000123", bankName: "ICICI Bank" },
];

const employees: Employee[] = EMPLOYEE_DATA.map((e, i) => ({
  id: `emp-${i + 1}`,
  employeeCode: generateEmployeeCode(i + 1),
  companyId: "company-1",
  departmentId: e.dept,
  name: e.name,
  email: `${e.name.toLowerCase().replace(/\s/g, ".")}@acme.com`,
  phone: `+91 ${e.phone}`,
  designation: e.designation,
  employmentType: e.type,
  dateOfJoining: e.doj,
  baseSalary: e.salary,
  panNumber: e.pan,
  bankAccountNumber: e.bank,
  bankIfsc: e.ifsc,
  bankName: e.bankName,
  isActive: true,
  createdAt: e.doj + "T00:00:00Z",
  updatedAt: e.doj + "T00:00:00Z",
}));

// =================== TAX CONFIG ===================
const taxConfig: TaxConfigData = {
  id: "tax-1",
  companyId: "company-1",
  pfRateEmployee: 12,
  pfRateEmployer: 12,
  esiRateEmployee: 0.75,
  esiRateEmployer: 3.25,
  esiSalaryLimit: 21000,
  taxRegime: "NEW",
  createdAt: "2024-01-15T00:00:00Z",
};

// =================== ATTENDANCE (generate for last 3 months) ===================
function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const monthsToGenerate = [
    { month: 1, year: 2026 },
    { month: 2, year: 2026 },
    { month: 3, year: 2026 },
  ];

  for (const { month, year } of monthsToGenerate) {
    const daysInMonth = getDaysInMonth(month, year);
    for (const emp of employees) {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        let status: AttendanceRecord["status"] = "PRESENT";

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          status = "WEEK_OFF";
        } else {
          // Random attendance with 90% present, 5% leave, 5% absent
          const rand = Math.random();
          if (rand > 0.95) status = "ABSENT";
          else if (rand > 0.90) status = "PAID_LEAVE";
        }

        records.push({
          id: `att-${emp.id}-${year}-${month}-${day}`,
          employeeId: emp.id,
          date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          status,
          source: "SYSTEM",
          createdAt: date.toISOString(),
        });
      }
    }
  }
  return records;
}

// =================== PAYROLL RUNS ===================
function generatePayrollData() {
  const runs: PayrollRun[] = [];
  const records: PayrollRecord[] = [];
  const slips: SalarySlip[] = [];

  const monthsData = [
    { month: 1, year: 2026, status: "DISBURSED" as const },
    { month: 2, year: 2026, status: "FINALIZED" as const },
    { month: 3, year: 2026, status: "DRAFT" as const },
  ];

  for (const m of monthsData) {
    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;
    const daysInMonth = getDaysInMonth(m.month, m.year);
    const runId = `run-${m.year}-${m.month}`;

    for (const emp of employees) {
      const result = computeFullPayroll(emp.baseSalary, { hraPercent: 40 }, undefined, 0, 26);
      totalGross += result.gross.grossSalary;
      totalDeductions += result.deductions.totalDeductions;
      totalNet += result.netPay;

      const recordId = `record-${runId}-${emp.id}`;
      records.push({
        id: recordId,
        payrollRunId: runId,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeCode: emp.employeeCode,
        departmentName: departments.find(d => d.id === emp.departmentId)?.name,
        daysInMonth,
        daysWorked: 26,
        daysAbsent: 0,
        unpaidLeaves: 0,
        basicSalary: result.gross.basicSalary,
        hra: result.gross.hra,
        da: result.gross.da,
        specialAllowance: result.gross.specialAllowance,
        grossSalary: result.gross.grossSalary,
        pfEmployee: result.deductions.pfEmployee,
        pfEmployer: result.deductions.pfEmployer,
        esiEmployee: result.deductions.esiEmployee,
        esiEmployer: result.deductions.esiEmployer,
        tds: result.deductions.tds,
        professionalTax: result.deductions.professionalTax,
        otherDeductions: 0,
        totalDeductions: result.deductions.totalDeductions,
        netPay: result.netPay,
        createdAt: `${m.year}-${String(m.month).padStart(2, "0")}-28T00:00:00Z`,
      });

      if (m.status !== "DRAFT") {
        slips.push({
          id: `slip-${recordId}`,
          payrollRecordId: recordId,
          employeeId: emp.id,
          slipNumber: generateSlipNumber(m.year, m.month, employees.indexOf(emp) + 1),
          emailedAt: m.status === "DISBURSED" ? `${m.year}-${String(m.month).padStart(2, "0")}-28T12:00:00Z` : undefined,
          createdAt: `${m.year}-${String(m.month).padStart(2, "0")}-28T00:00:00Z`,
        });
      }
    }

    runs.push({
      id: runId,
      companyId: "company-1",
      month: m.month,
      year: m.year,
      status: m.status,
      totalGross: Math.round(totalGross),
      totalDeductions: Math.round(totalDeductions),
      totalNet: Math.round(totalNet),
      totalEmployees: employees.length,
      generatedBy: "user-1",
      generatedByName: "Ayush Sarkar",
      approvedBy: m.status !== "DRAFT" ? "user-1" : undefined,
      finalizedAt: m.status === "FINALIZED" || m.status === "DISBURSED"
        ? `${m.year}-${String(m.month).padStart(2, "0")}-28T18:00:00Z`
        : undefined,
      createdAt: `${m.year}-${String(m.month).padStart(2, "0")}-25T00:00:00Z`,
    });
  }

  return { runs, records, slips };
}

// =================== INITIALIZE ===================
const attendance = generateAttendance();
const { runs: payrollRuns, records: payrollRecords, slips: salarySlips } = generatePayrollData();

// =================== DATA STORE (singleton) ===================
export const db = {
  company,
  users,
  departments,
  employees,
  attendance,
  payrollRuns,
  payrollRecords,
  salarySlips,
  taxConfig,

  // Helper methods
  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email && u.isActive);
  },

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  },

  getActiveEmployees(): Employee[] {
    return this.employees.filter((e) => e.isActive);
  },

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((e) => e.id === id);
  },

  getDepartmentName(id: string): string {
    return this.departments.find((d) => d.id === id)?.name || "Unknown";
  },

  getAttendanceForMonth(month: number, year: number): AttendanceRecord[] {
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    return this.attendance.filter((a) => a.date.startsWith(prefix));
  },

  getEmployeeAttendance(employeeId: string, month: number, year: number): AttendanceRecord[] {
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    return this.attendance.filter(
      (a) => a.employeeId === employeeId && a.date.startsWith(prefix)
    );
  },

  getPayrollRunsForCompany(): PayrollRun[] {
    return this.payrollRuns.sort((a, b) => {
      const dateA = a.year * 100 + a.month;
      const dateB = b.year * 100 + b.month;
      return dateB - dateA;
    });
  },

  getPayrollRecords(runId: string): PayrollRecord[] {
    return this.payrollRecords.filter((r) => r.payrollRunId === runId);
  },

  getPayrollRecordForEmployee(employeeId: string, runId: string): PayrollRecord | undefined {
    return this.payrollRecords.find(
      (r) => r.employeeId === employeeId && r.payrollRunId === runId
    );
  },

  getSalarySlipsForRun(runId: string): (SalarySlip & { employeeName?: string; employeeCode?: string; grossSalary?: number; netPay?: number })[] {
    const records = this.getPayrollRecords(runId);
    return this.salarySlips
      .filter((s) => records.some((r) => r.id === s.payrollRecordId))
      .map((s) => {
        const record = records.find((r) => r.id === s.payrollRecordId);
        const emp = this.getEmployeeById(s.employeeId);
        return {
          ...s,
          employeeName: emp?.name,
          employeeCode: emp?.employeeCode,
          grossSalary: record?.grossSalary,
          netPay: record?.netPay,
        };
      });
  },

  addEmployee(emp: Employee): void {
    this.employees.push(emp);
  },

  updateEmployee(id: string, data: Partial<Employee>): Employee | undefined {
    const idx = this.employees.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    this.employees[idx] = { ...this.employees[idx], ...data, updatedAt: new Date().toISOString() };
    return this.employees[idx];
  },

  updateAttendance(employeeId: string, date: string, status: AttendanceRecord["status"]): void {
    const idx = this.attendance.findIndex(
      (a) => a.employeeId === employeeId && a.date === date
    );
    if (idx !== -1) {
      this.attendance[idx].status = status;
    } else {
      this.attendance.push({
        id: `att-${employeeId}-${date}`,
        employeeId,
        date,
        status,
        source: "MANUAL",
        createdAt: new Date().toISOString(),
      });
    }
  },
};
