"use client";

import { useForm } from "react-form"; // Wait, I need react-hook-form
import { useState } from "react";
import { useAuthStore } from "@/store";
import { authenticateUser } from "@/lib/auth";
import { createSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, CheckCircle2, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@payrollpro.dev");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const session = await authenticateUser(email, password);
      if (session) {
        const token = createSession(session);
        login(token, {
          userId: session.userId,
          name: session.name,
          email: session.email,
          role: session.role,
        });
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#0A1628] p-12 text-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="z-10 relative">
          <div className="flex items-center gap-2 mb-24">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight">PayrollPro</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
              Run payroll in <br /> minutes, <br /> not days.
            </h1>
            
            <div className="space-y-4 pt-12">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-lg font-medium text-slate-300">Indian compliance built-in</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-lg font-medium text-slate-300">PF/ESI/TDS auto-calculated</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-lg font-medium text-slate-300">Salary slips in one click</span>
              </div>
            </div>
          </div>
        </div>

        <div className="z-10 relative mt-auto rounded-xl bg-slate-800/50 p-6 border border-slate-700/50 backdrop-blur-sm max-w-md">
          <p className="text-sm leading-relaxed text-slate-300 italic">
            "The automation engine of PayrollPro transformed our monthly closing from a 5-day ordeal into a 30-minute task. It is the architect of our financial efficiency."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">AM</div>
            <div>
              <p className="text-sm font-semibold text-white">Arjun Mehta</p>
              <p className="text-xs text-slate-400">Director of Operations, FinTech India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 lg:p-24">
        <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-8">
          
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-4 justify-center">
             <Building2 className="h-8 w-8 text-primary" />
             <span className="text-2xl font-bold tracking-tight text-[#0A1628]">PayrollPro</span>
          </div>

          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Sign in to your account
            </h1>
            <p className="text-sm text-slate-500">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-4 bg-slate-50 border-slate-200 focus-visible:ring-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pl-4 bg-slate-50 border-slate-200 focus-visible:ring-primary shadow-sm"
                  />
                  <LockKeyhole className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
               <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
               <label htmlFor="remember" className="text-sm text-slate-500 font-medium">
                 Remember me for 30 days
               </label>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 font-medium border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold shadow-sm h-11 transition-all hover:shadow-md"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </Button>
          </form>

          <div className="rounded-lg bg-indigo-50/50 p-4 text-sm border border-indigo-100 shadow-sm">
            <p className="font-semibold text-primary mb-1 flex items-center gap-1.5">
               <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
               Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-slate-600 mt-2 font-mono text-xs p-2 bg-white rounded border border-indigo-50">
               <div>User: <b>admin@payrollpro.dev</b></div>
               <div>Pass: <b>Admin@123</b></div>
            </div>
          </div>
          
          <p className="text-center text-sm text-slate-500 mt-4">
            Don't have an account? <a href="#" className="text-primary font-semibold hover:underline">Contact Sales for Demo</a>
          </p>
        </div>
      </div>
    </div>
  );
}
