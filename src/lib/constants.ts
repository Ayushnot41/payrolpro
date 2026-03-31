// Indian Tax Slabs — New Regime FY 2025-26
export const TAX_SLABS_NEW_REGIME = [
  { from: 0, to: 400000, rate: 0 },
  { from: 400001, to: 800000, rate: 5 },
  { from: 800001, to: 1200000, rate: 10 },
  { from: 1200001, to: 1600000, rate: 15 },
  { from: 1600001, to: 2000000, rate: 20 },
  { from: 2000001, to: 2400000, rate: 25 },
  { from: 2400001, to: Infinity, rate: 30 },
];

export const TAX_SLABS_OLD_REGIME = [
  { from: 0, to: 250000, rate: 0 },
  { from: 250001, to: 500000, rate: 5 },
  { from: 500001, to: 1000000, rate: 20 },
  { from: 1000001, to: Infinity, rate: 30 },
];

// Standard deductions
export const STANDARD_DEDUCTION_NEW = 75000;
export const STANDARD_DEDUCTION_OLD = 50000;

// Rebate 87A
export const REBATE_87A_LIMIT_NEW = 1200000;
export const REBATE_87A_AMOUNT_NEW = 25000;

// PF
export const PF_RATE_EMPLOYEE = 12;
export const PF_RATE_EMPLOYER = 12;
export const PF_WAGE_CEILING = 15000;
export const PF_MAX_MONTHLY = 1800;

// ESI
export const ESI_RATE_EMPLOYEE = 0.75;
export const ESI_RATE_EMPLOYER = 3.25;
export const ESI_SALARY_LIMIT = 21000;

// HRA
export const HRA_METRO_RATE = 40;
export const HRA_NON_METRO_RATE = 20;

// Professional Tax (Karnataka example)
export const PROFESSIONAL_TAX = 200;

// Departments
export const DEPARTMENTS = [
  { id: "dept-1", name: "Engineering" },
  { id: "dept-2", name: "Sales" },
  { id: "dept-3", name: "Marketing" },
  { id: "dept-4", name: "Human Resources" },
  { id: "dept-5", name: "Operations" },
  { id: "dept-6", name: "Finance" },
  { id: "dept-7", name: "Product" },
  { id: "dept-8", name: "Design" },
];

export const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const ATTENDANCE_STATUSES = [
  "PRESENT",
  "ABSENT",
  "HALF_DAY",
  "PAID_LEAVE",
  "UNPAID_LEAVE",
  "HOLIDAY",
  "WEEK_OFF",
] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const PAYROLL_STATUSES = [
  "DRAFT",
  "PROCESSING",
  "APPROVED",
  "FINALIZED",
  "DISBURSED",
] as const;
export type PayrollStatus = (typeof PAYROLL_STATUSES)[number];

export const USER_ROLES = ["ADMIN", "HR", "FINANCE", "VIEWER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ATTENDANCE_STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; shortLabel: string; color: string; bgColor: string }
> = {
  PRESENT: { label: "Present", shortLabel: "P", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  ABSENT: { label: "Absent", shortLabel: "A", color: "text-red-700", bgColor: "bg-red-100" },
  HALF_DAY: { label: "Half Day", shortLabel: "HD", color: "text-blue-700", bgColor: "bg-blue-100" },
  PAID_LEAVE: { label: "Paid Leave", shortLabel: "PL", color: "text-orange-700", bgColor: "bg-orange-100" },
  UNPAID_LEAVE: { label: "Unpaid Leave", shortLabel: "UL", color: "text-red-700", bgColor: "bg-red-50 border border-red-200" },
  HOLIDAY: { label: "Holiday", shortLabel: "HO", color: "text-gray-600", bgColor: "bg-gray-200" },
  WEEK_OFF: { label: "Week Off", shortLabel: "WO", color: "text-gray-500", bgColor: "bg-gray-100" },
};

export const PAYROLL_STATUS_CONFIG: Record<
  PayrollStatus,
  { label: string; color: string; bgColor: string }
> = {
  DRAFT: { label: "Draft", color: "text-gray-700", bgColor: "bg-gray-100" },
  PROCESSING: { label: "Processing", color: "text-blue-700", bgColor: "bg-blue-100" },
  APPROVED: { label: "Approved", color: "text-amber-700", bgColor: "bg-amber-100" },
  FINALIZED: { label: "Finalized", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  DISBURSED: { label: "Disbursed", color: "text-purple-700", bgColor: "bg-purple-100" },
};
