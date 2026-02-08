import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/registerEmail";
import generateVerificationCode from "@/lib/user/generateVerificationCode";
import isValidEmail from "@/lib/user/isValidEmail";

export const dynamic = 'force-dynamic'

export async function POST(request) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email
        if (!email || typeof email !== "string" || !isValidEmail(email)) {
            return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
        }

        // Check if user exists
        const user = await db.user.findFirst({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 400 });
        }

        // Generate verification code and expiry
        const verificationCode = generateVerificationCode();
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

        // Update user
        await db.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: verificationCode,
                emailVerificationTokenExpiry: expiry,
            },
        });

        // Send verification email
        await sendVerificationEmail(email, verificationCode);

        return NextResponse.json(
            {
                message: "Verification email sent. Please check your inbox.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Resend verification code error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}   