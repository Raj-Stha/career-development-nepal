import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const popup = await db.popup.findFirst();

        if (!popup) {
            return NextResponse.json({ error: "No popup found" }, { status: 404 });
        }

        return NextResponse.json(popup, { status: 200 });
    } catch (error) {
        console.error("Error fetching popup:", error);
        return NextResponse.json({ error: "Error fetching popup" }, { status: 500 });
    }
}
