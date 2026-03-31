# 🏢 PayrollPro — Enterprise Payroll Management

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**PayrollPro** is a modern, enterprise-grade SaaS platform designed to simplify Indian payroll complexity. Built for high-growth companies, it automates salary calculations, tax compliance (PF/ESI/TDS), and employee workforce management.

---

## 📊 System Overview

### **Architecture & Execution Blueprint**

```mermaid
graph TD
    %% Node Definitions
    Admin(["👤 Admin: Ayush Sarkar"])
    Input{"📥 Data Input"}
    Ledger[("📋 Employee Ledger")]
    Matrix[("⏰ Attendance Matrix")]
    Config[("⚙️ Statutory Config")]
    Engine{{"🚀 Salary Computation Engine"}}
    Run{"💳 Payroll Run"}
    Finalize{{"✅ Finalize & Disburse"}}
    PDF[/📄 Salary slips PDF/]
    Insights[/📈 Insights & Analytics/]
    Excel[/📊 Export Excel/CSV/]

    %% Connections
    Admin --> Input
    Input -.-> Ledger
    Input -.-> Matrix
    Input -.-> Config
    
    Ledger & Matrix & Config ==> Engine
    
    Engine --> Run
    Run -->|Verification| Finalize
    
    Finalize --> PDF
    Finalize --> Insights
    Finalize --> Excel

    %% Styling (Professional & Unique)
    style Admin fill:#1e293b,stroke:#0f172a,stroke-width:2px,color:#fff
    style Input fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
    style Ledger fill:#f8fafc,stroke:#3b82f6,stroke-dasharray: 5 5
    style Matrix fill:#f8fafc,stroke:#3b82f6,stroke-dasharray: 5 5
    style Config fill:#f8fafc,stroke:#3b82f6,stroke-dasharray: 5 5
    style Engine fill:#8b5cf6,stroke:#6d28d9,stroke-width:3px,color:#fff
    style Run fill:#f59e0b,stroke:#b45309,color:#fff
    style Finalize fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    style PDF fill:#fff,stroke:#ef4444
    style Insights fill:#fff,stroke:#6366f1
    style Excel fill:#fff,stroke:#10b981
```

### **Core Platform Capabilities**


| Feature | Description |
| :--- | :--- |
| **Salary Engine** | High-precision Indian payroll logic (Basic, HRA, DA, Special Allowance). |
| **Tax Compliance** | Automatic PF (EPFO), ESI (ESIC), and TDS calculation (Surcharge + Cess). |
| **Regime Comparison** | Live comparison between **New vs. Old Tax Regimes** for employees. |
| **Data Export** | One-click export for Workforce (Excel) and Attendance (CSV). |
| **Insights** | Visual analytics for disbursement trends and department costs. |
| **PDF Generation** | Real-time generation of Salary Slips and Tax Reports. |

---

## 🚀 Getting Started

### **1. Installation**

Clone the repository and install dependencies:

```bash
git clone https://github.com/Ayushnot41/payrolpro.git
cd payrolpro
npm install
```

### **2. Development Mode**

Run the local development server:

```bash
npm run dev
```

The application will be live at `http://localhost:3000`.

### **3. Production Build**

```bash
npm run build
npm start
```

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Shadcn UI.
*   **State Management**: Zustand (Auth & UI Persistence).
*   **Charts**: Recharts (High-fidelity data visualization).
*   **PDF/Export**: jsPDF, html2canvas (PDF), XLSX (Excel), PapaParse (CSV).
*   **Calculations**: Custom-built `salary-engine.ts` for Indian statutory compliance.

---

## 🔒 Administrative Identity

The platform is strictly configured for administrator **Ayush Sarkar**. All payroll disbursements, reports, and system audit logs are hard-coded to this administrative identity to ensure enterprise-level consistency.

---

## 🏗️ Project Structure

```text
src/
├── app/            # Next.js App Router (Pages & API)
├── components/     # UI Design System (Shadcn + Custom)
├── lib/            
│   ├── salary-engine.ts  # Core computation logic
│   ├── db/               # In-memory database (singleton)
│   └── utils.ts          # Formatting & PDF helpers
└── store/          # Global application state (Zustand)
```

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
**Developed by Ayush Sarkar**  
*Building the future of workforce management.*
