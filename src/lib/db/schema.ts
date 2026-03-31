import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  numeric,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["ADMIN", "HR", "FINANCE"]);
export const employmentTypeEnum = pgEnum("employment_type", [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
]);
export const stdStatusEnum = pgEnum("std_status", [
  "DRAFT",
  "PROCESSING",
  "FINALIZED",
  "DISBURSED",
  "CANCELLED",
]);
export const taxRegimeEnum = pgEnum("tax_regime", ["OLD", "NEW"]);
export const attendanceStatusEnum = pgEnum("attendance_status", [
  "PRESENT",
  "ABSENT",
  "HALF_DAY",
  "PAID_LEAVE",
  "UNPAID_LEAVE",
  "WEEK_OFF",
]);

// Tables
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  gstin: varchar("gstin", { length: 15 }).notNull(),
  cin: varchar("cin", { length: 21 }).notNull(),
  payrollDay: integer("payroll_day").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  headCount: integer("head_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeCode: varchar("employee_code", { length: 50 }).notNull().unique(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  departmentId: uuid("department_id")
    .references(() => departments.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  designation: varchar("designation", { length: 255 }).notNull(),
  employmentType: employmentTypeEnum("employment_type").notNull(),
  dateOfJoining: timestamp("date_of_joining").notNull(),
  baseSalary: numeric("base_salary", { precision: 12, scale: 2 }).notNull(),
  panNumber: varchar("pan_number", { length: 10 }),
  bankAccountNumber: varchar("bank_account_number", { length: 50 }),
  bankIfsc: varchar("bank_ifsc", { length: 20 }),
  bankName: varchar("bank_name", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const employeesRelations = relations(employees, ({ one }) => ({
  company: one(companies, {
    fields: [employees.companyId],
    references: [companies.id],
  }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
}));

export const taxConfigs = pgTable("tax_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  pfRateEmployee: numeric("pf_rate_employee", { precision: 5, scale: 2 }).notNull(),
  pfRateEmployer: numeric("pf_rate_employer", { precision: 5, scale: 2 }).notNull(),
  esiRateEmployee: numeric("esi_rate_employee", { precision: 5, scale: 2 }).notNull(),
  esiRateEmployer: numeric("esi_rate_employer", { precision: 5, scale: 2 }).notNull(),
  esiSalaryLimit: numeric("esi_salary_limit", { precision: 12, scale: 2 }).notNull(),
  taxRegime: taxRegimeEnum("tax_regime").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendance = pgTable("attendance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  status: attendanceStatusEnum("status").notNull(),
  source: varchar("source", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payrollRuns = pgTable("payroll_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .references(() => companies.id)
    .notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  status: stdStatusEnum("status").notNull(),
  totalGross: numeric("total_gross", { precision: 15, scale: 2 }).notNull(),
  totalDeductions: numeric("total_deductions", { precision: 15, scale: 2 }).notNull(),
  totalNet: numeric("total_net", { precision: 15, scale: 2 }).notNull(),
  totalEmployees: integer("total_employees").notNull(),
  generatedBy: uuid("generated_by").references(() => users.id),
  generatedByName: varchar("generated_by_name", { length: 255 }),
  approvedBy: uuid("approved_by").references(() => users.id),
  finalizedAt: timestamp("finalized_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payrollRecords = pgTable("payroll_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  payrollRunId: uuid("payroll_run_id")
    .references(() => payrollRuns.id)
    .notNull(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  employeeName: varchar("employee_name", { length: 255 }).notNull(),
  employeeCode: varchar("employee_code", { length: 50 }).notNull(),
  departmentName: varchar("department_name", { length: 255 }),
  daysInMonth: integer("days_in_month").notNull(),
  daysWorked: numeric("days_worked", { precision: 5, scale: 2 }).notNull(),
  daysAbsent: numeric("days_absent", { precision: 5, scale: 2 }).notNull(),
  unpaidLeaves: numeric("unpaid_leaves", { precision: 5, scale: 2 }).notNull(),
  basicSalary: numeric("basic_salary", { precision: 12, scale: 2 }).notNull(),
  hra: numeric("hra", { precision: 12, scale: 2 }).notNull(),
  da: numeric("da", { precision: 12, scale: 2 }).notNull(),
  specialAllowance: numeric("special_allowance", { precision: 12, scale: 2 }).notNull(),
  grossSalary: numeric("gross_salary", { precision: 12, scale: 2 }).notNull(),
  pfEmployee: numeric("pf_employee", { precision: 12, scale: 2 }).notNull(),
  pfEmployer: numeric("pf_employer", { precision: 12, scale: 2 }).notNull(),
  esiEmployee: numeric("esi_employee", { precision: 12, scale: 2 }).notNull(),
  esiEmployer: numeric("esi_employer", { precision: 12, scale: 2 }).notNull(),
  tds: numeric("tds", { precision: 12, scale: 2 }).notNull(),
  professionalTax: numeric("professional_tax", { precision: 12, scale: 2 }).notNull(),
  otherDeductions: numeric("other_deductions", { precision: 12, scale: 2 }).notNull(),
  totalDeductions: numeric("total_deductions", { precision: 12, scale: 2 }).notNull(),
  netPay: numeric("net_pay", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const salarySlips = pgTable("salary_slips", {
  id: uuid("id").primaryKey().defaultRandom(),
  payrollRecordId: uuid("payroll_record_id")
    .references(() => payrollRecords.id)
    .notNull(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  slipNumber: varchar("slip_number", { length: 50 }).notNull().unique(),
  emailedAt: timestamp("emailed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
