import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { employees } from "@/lib/db/schema";


export async function GET() {
  try {
    const allEmployees = await db.query.employees.findMany({
      with: {
        department: true,
      },
    });
    return NextResponse.json(allEmployees);
  } catch (error) {
    console.error("Failed to fetch employees", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [newEmployee] = await db.insert(employees).values(body).returning();
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Failed to create employee", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
