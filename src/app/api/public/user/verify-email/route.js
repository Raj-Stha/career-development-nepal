import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = 'force-dynamic'

export async function POST(request) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
        }

        // Find user by email and verification token
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        // Check if already verified
        if (user.emailVerified) {
            return NextResponse.json({ message: "Email already verified." }, { status: 200 });
        }

        // Validate token and expiry
        if (
            user.emailVerificationToken !== code ||
            !user.emailVerificationTokenExpiry ||
            user.emailVerificationTokenExpiry < new Date()
        ) {
            return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
        }

        // Update user to mark email as verified and clear token info
        await db.user.update({
            where: { email },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });
    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
