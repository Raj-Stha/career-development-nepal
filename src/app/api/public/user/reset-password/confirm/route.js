import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import isValidEmail from "@/lib/user/isValidEmail";
import isStrongPassword from "@/lib/user/isStrongPassword";

export const dynamic = 'force-dynamic'

export async function POST(request) {
    try {
        const { email, code, newPassword, confirmPassword } = await request.json();

        // Basic validation
        if (!email || !code || !newPassword || !confirmPassword) {
            return NextResponse.json({ error: "Email, code, new password, and confirmation are required." }, { status: 400 });
        }

        if (!isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
        }

        if (!isStrongPassword(newPassword)) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters and include uppercase, lowercase, number, and special character." },
                { status: 400 }
            );
        }

        // Fetch user
        const user = await db.user.findUnique({ where: { email } });

        if (!user || user.isDeleted) {
            return NextResponse.json({ error: "User not found or is deleted." }, { status: 404 });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ error: "Email is not verified." }, { status: 403 });
        }

        if (
            !user.emailVerificationToken ||
            user.emailVerificationToken !== code ||
            !user.emailVerificationTokenExpiry ||
            new Date(user.emailVerificationTokenExpiry) < new Date()
        ) {
            return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
        }

        // Update password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        await db.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                emailVerificationToken: null,
                emailVerificationTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: "Password has been successfully reset." }, { status: 200 });
    } catch (error) {
        console.error("Password reset confirmation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
