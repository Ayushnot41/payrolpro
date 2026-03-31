import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const employeeCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  designation: z.string().min(2, "Designation is required"),
  departmentId: z.string().min(1, "Department is required"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  baseSalary: z.number().min(1, "Base salary must be greater than 0"),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format (e.g., ABCDE1234F)")
    .optional()
    .or(z.literal("")),
  bankAccountNumber: z.string().optional(),
  bankIfsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format")
    .optional()
    .or(z.literal("")),
  bankName: z.string().optional(),
});

export const employeeUpdateSchema = employeeCreateSchema.partial();

export const payrollGenerateSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2030),
});

export const attendanceSchema = z.object({
  employeeId: z.string(),
  date: z.string(),
  status: z.enum([
    "PRESENT",
    "ABSENT",
    "HALF_DAY",
    "PAID_LEAVE",
    "UNPAID_LEAVE",
    "HOLIDAY",
    "WEEK_OFF",
  ]),
});

export const taxConfigSchema = z.object({
  pfRateEmployee: z.number().min(0).max(100),
  pfRateEmployer: z.number().min(0).max(100),
  esiRateEmployee: z.number().min(0).max(100),
  esiRateEmployer: z.number().min(0).max(100),
  esiSalaryLimit: z.number().min(0),
  taxRegime: z.enum(["OLD", "NEW"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;
export type PayrollGenerateInput = z.infer<typeof payrollGenerateSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type TaxConfigInput = z.infer<typeof taxConfigSchema>;
