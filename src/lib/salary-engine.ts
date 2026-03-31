/**
 * PayrollPro Salary Computation Engine
 * Pure functions only — no database calls, no side effects.
 * All inputs passed explicitly. Fully unit testable.
 */

import {
  PF_RATE_EMPLOYEE,
  PF_RATE_EMPLOYER,
  PF_WAGE_CEILING,
  ESI_RATE_EMPLOYEE,
  ESI_RATE_EMPLOYER,
  ESI_SALARY_LIMIT,
  HRA_METRO_RATE,
  PROFESSIONAL_TAX,
  TAX_SLABS_NEW_REGIME,
  TAX_SLABS_OLD_REGIME,
  STANDARD_DEDUCTION_NEW,
  STANDARD_DEDUCTION_OLD,
  REBATE_87A_LIMIT_NEW,
} from "./constants";

export interface SalaryConfig {
  hraPercent?: number;
  daPercent?: number;
  isMetro?: boolean;
}

export interface TaxConfig {
  pfRateEmployee: number;
  pfRateEmployer: number;
  esiRateEmployee: number;
  esiRateEmployer: number;
  esiSalaryLimit: number;
  taxRegime: "OLD" | "NEW";
}

export interface GrossBreakdown {
  basicSalary: number;
  hra: number;
  da: number;
  specialAllowance: number;
  grossSalary: number;
}

export interface DeductionBreakdown {
  pfEmployee: number;
  pfEmployer: number;
  esiEmployee: number;
  esiEmployer: number;
  tds: number;
  professionalTax: number;
  leaveDeduction: number;
  totalDeductions: number;
}

export interface PayrollResult {
  gross: GrossBreakdown;
  deductions: DeductionBreakdown;
  netPay: number;
}

const DEFAULT_TAX_CONFIG: TaxConfig = {
  pfRateEmployee: PF_RATE_EMPLOYEE,
  pfRateEmployer: PF_RATE_EMPLOYER,
  esiRateEmployee: ESI_RATE_EMPLOYEE,
  esiRateEmployer: ESI_RATE_EMPLOYER,
  esiSalaryLimit: ESI_SALARY_LIMIT,
  taxRegime: "NEW",
};

export function computeGrossSalary(
  baseSalary: number,
  config: SalaryConfig = {}
): GrossBreakdown {
  const { hraPercent = HRA_METRO_RATE, daPercent = 0 } = config;

  const basicSalary = baseSalary;
  const hra = round2(basicSalary * (hraPercent / 100));
  const da = round2(basicSalary * (daPercent / 100));
  const specialAllowance = round2(
    Math.max(0, baseSalary * 0.3 - da)
  ); // ~30% of base as special allowance residual
  const grossSalary = round2(basicSalary + hra + da + specialAllowance);

  return { basicSalary, hra, da, specialAllowance, grossSalary };
}

export function computePF(basicSalary: number, taxConfig: TaxConfig = DEFAULT_TAX_CONFIG) {
  const pfWage = Math.min(basicSalary, PF_WAGE_CEILING);
  const pfEmployee = round2(pfWage * (taxConfig.pfRateEmployee / 100));
  const pfEmployer = round2(pfWage * (taxConfig.pfRateEmployer / 100));
  return { pfEmployee, pfEmployer };
}

export function computeESI(grossSalary: number, taxConfig: TaxConfig = DEFAULT_TAX_CONFIG) {
  if (grossSalary > taxConfig.esiSalaryLimit) {
    return { esiEmployee: 0, esiEmployer: 0 };
  }
  const esiEmployee = round2(grossSalary * (taxConfig.esiRateEmployee / 100));
  const esiEmployer = round2(grossSalary * (taxConfig.esiRateEmployer / 100));
  return { esiEmployee, esiEmployer };
}

export function computeLeaveDeduction(
  basicSalary: number,
  workingDays: number,
  unpaidLeaves: number
): number {
  if (workingDays <= 0 || unpaidLeaves <= 0) return 0;
  return round2((basicSalary / workingDays) * unpaidLeaves);
}

export function computeTDS(
  annualGross: number,
  regime: "OLD" | "NEW" = "NEW"
): number {
  const slabs = regime === "NEW" ? TAX_SLABS_NEW_REGIME : TAX_SLABS_OLD_REGIME;
  const standardDeduction = regime === "NEW" ? STANDARD_DEDUCTION_NEW : STANDARD_DEDUCTION_OLD;

  const taxableIncome = Math.max(0, annualGross - standardDeduction);

  // Rebate 87A
  if (regime === "NEW" && taxableIncome <= REBATE_87A_LIMIT_NEW) {
    return 0;
  }
  if (regime === "OLD" && taxableIncome <= 500000) {
    return 0;
  }

  // Calculate tax
  let tax = 0;
  for (const slab of slabs) {
    if (taxableIncome > slab.from) {
      const upper = slab.to === Infinity ? taxableIncome : Math.min(taxableIncome, slab.to);
      const taxableInSlab = upper - slab.from + (slab.from === 0 ? 0 : 1); 
      // Adjusted logic for precision:
      const actualFrom = slab.from === 0 ? 0 : slab.from - 1;
      const actualUpper = slab.to === Infinity ? taxableIncome : Math.min(taxableIncome, slab.to);
      const slabIncome = Math.max(0, actualUpper - actualFrom);
      tax += slabIncome * (slab.rate / 100);
    }
  }

  // Surcharge (simplified for high earners > 50L)
  let surcharge = 0;
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) surcharge = tax * 0.10;
  else if (taxableIncome > 10000000) surcharge = tax * 0.15;

  // Health and Education Cess
  const cess = (tax + surcharge) * 0.04;
  const totalTax = round2(tax + surcharge + cess);

  return round2(totalTax / 12);
}

export function computeDeductions(
  gross: GrossBreakdown,
  taxConfig: TaxConfig = DEFAULT_TAX_CONFIG,
  unpaidLeaves: number = 0,
  workingDays: number = 26
): DeductionBreakdown {
  const { pfEmployee, pfEmployer } = computePF(gross.basicSalary, taxConfig);
  const { esiEmployee, esiEmployer } = computeESI(gross.grossSalary, taxConfig);
  const tds = computeTDS(gross.grossSalary * 12, taxConfig.taxRegime);
  const professionalTax = PROFESSIONAL_TAX;
  const leaveDeduction = computeLeaveDeduction(
    gross.basicSalary,
    workingDays,
    unpaidLeaves
  );

  const totalDeductions = round2(
    pfEmployee + esiEmployee + tds + professionalTax + leaveDeduction
  );

  return {
    pfEmployee,
    pfEmployer,
    esiEmployee,
    esiEmployer,
    tds,
    professionalTax,
    leaveDeduction,
    totalDeductions,
  };
}

export function computeNetPay(grossSalary: number, totalDeductions: number): number {
  return round2(Math.max(0, grossSalary - totalDeductions));
}

export function computeFullPayroll(
  baseSalary: number,
  salaryConfig?: SalaryConfig,
  taxConfig?: TaxConfig,
  unpaidLeaves?: number,
  workingDays?: number
): PayrollResult {
  const gross = computeGrossSalary(baseSalary, salaryConfig);
  const deductions = computeDeductions(
    gross,
    taxConfig,
    unpaidLeaves,
    workingDays
  );
  const netPay = computeNetPay(gross.grossSalary, deductions.totalDeductions);

  return { gross, deductions, netPay };
}

// TDS Calculator — side-by-side regime comparison
export function compareTaxRegimes(annualCTC: number) {
  const newRegimeTDS = computeTDS(annualCTC, "NEW");
  const oldRegimeTDS = computeTDS(annualCTC, "OLD");

  return {
    newRegime: {
      grossIncome: annualCTC,
      standardDeduction: STANDARD_DEDUCTION_NEW,
      taxableIncome: Math.max(0, annualCTC - STANDARD_DEDUCTION_NEW),
      monthlyTDS: newRegimeTDS,
      annualTax: round2(newRegimeTDS * 12),
    },
    oldRegime: {
      grossIncome: annualCTC,
      standardDeduction: STANDARD_DEDUCTION_OLD,
      taxableIncome: Math.max(0, annualCTC - STANDARD_DEDUCTION_OLD),
      monthlyTDS: oldRegimeTDS,
      annualTax: round2(oldRegimeTDS * 12),
    },
    savings: round2((oldRegimeTDS - newRegimeTDS) * 12),
    recommendedRegime: newRegimeTDS <= oldRegimeTDS ? "NEW" : "OLD",
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
