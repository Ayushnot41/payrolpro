import { compareSync } from "bcryptjs";
import { db } from "@/lib/db";
import type { User } from "@/types";

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: User["role"];
  companyId: string;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthSession | null> {
  const user = db.getUserByEmail(email);
  if (!user) return null;

  const isValid = compareSync(password, user.passwordHash);
  if (!isValid) return null;

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
  };
}

/**
 * In-memory session store (replace with JWT or NextAuth in production)
 */
const sessions = new Map<string, AuthSession>();

export function createSession(session: AuthSession): string {
  const token = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  sessions.set(token, session);
  return token;
}

export function getSession(token: string): AuthSession | null {
  return sessions.get(token) || null;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}
