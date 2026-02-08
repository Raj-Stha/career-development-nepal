import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const teams = await db.category.findMany({
            orderBy: {
                priority: "asc",
            },
        });
        return NextResponse.json(teams, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error getting categories" }, { status: 500 });
    }
}
