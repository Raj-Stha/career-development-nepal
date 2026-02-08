import { NextResponse } from "next/server";
import db from "@/lib/db";
import generateVerificationCode from "@/lib/user/generateVerificationCode";
import isValidEmail from "@/lib/user/isValidEmail";
import { sendPasswordResetVerificationEmail } from "@/lib/registerEmail";

export const dynamic = 'force-dynamic'

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || !isValidEmail(email)) {
            return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user || user.isDeleted) {
            return NextResponse.json({ error: "User not found or is deleted." }, { status: 404 });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ error: "Email is not verified." }, { status: 403 });
        }

        const now = new Date();
        if (user.emailVerificationTokenExpiry && user.emailVerificationTokenExpiry > now) {
            const secondsLeft = Math.ceil((user.emailVerificationTokenExpiry - now) / 1000);
            return NextResponse.json(
                {
                    error: `A verification code was already sent. Please wait ${secondsLeft} seconds before requesting a new one.`,
                },
                { status: 429 }
            );
        }

        const verificationCode = generateVerificationCode();
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

        await db.user.update({
            where: { email },
            data: {
                emailVerificationToken: verificationCode,
                emailVerificationTokenExpiry: expiry,
            },
        });

        await sendPasswordResetVerificationEmail(email, verificationCode);

        return NextResponse.json(
            { message: "Verification code sent to your email." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Reset password initiation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
