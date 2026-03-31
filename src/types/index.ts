import type { EmploymentType, AttendanceStatus, PayrollStatus, UserRole } from "@/lib/constants";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  companyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  address: string;
  gstin?: string;
  cin?: string;
  payrollDay: number;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  companyId: string;
  headEmployeeId?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  companyId: string;
  departmentId: string;
  departmentName?: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  employmentType: EmploymentType;
  dateOfJoining: string;
  dateOfLeaving?: string;
  baseSalary: number;
  panNumber: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDTO {
  id: string;
  employeeCode: string;
  departmentId: string;
  departmentName: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  employmentType: EmploymentType;
  dateOfJoining: string;
  baseSalary: number;
  panNumber: string; // masked
  bankAccountNumber: string; // masked
  bankIfsc: string;
  bankName: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  source: "MANUAL" | "CSV_IMPORT" | "SYSTEM";
  createdAt: string;
}

export interface PayrollRun {
  id: string;
  companyId: string;
  month: number;
  year: number;
  status: PayrollStatus;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  totalEmployees: number;
  generatedBy: string;
  generatedByName?: string;
  approvedBy?: string;
  finalizedAt?: string;
  createdAt: string;
}

export interface PayrollRecord {
  id: string;
  payrollRunId: string;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  daysInMonth: number;
  daysWorked: number;
  daysAbsent: number;
  unpaidLeaves: number;
  basicSalary: number;
  hra: number;
  da: number;
  specialAllowance: number;
  grossSalary: number;
  pfEmployee: number;
  pfEmployer: number;
  esiEmployee: number;
  esiEmployer: number;
  tds: number;
  professionalTax: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  createdAt: string;
}

export interface TaxConfigData {
  id: string;
  companyId: string;
  pfRateEmployee: number;
  pfRateEmployer: number;
  esiRateEmployee: number;
  esiRateEmployer: number;
  esiSalaryLimit: number;
  taxRegime: "OLD" | "NEW";
  createdAt: string;
}

export interface SalarySlip {
  id: string;
  payrollRecordId: string;
  employeeId: string;
  slipNumber: string;
  emailedAt?: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalEmployees: number;
  monthlyPayroll: number;
  pendingApprovals: number;
  complianceStatus: string;
  monthlyPayrollTrend: { month: string; amount: number }[];
  departmentBreakdown: { name: string; count: number; cost: number }[];
  recentRuns: PayrollRun[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: { path: string[]; message: string }[];
}
