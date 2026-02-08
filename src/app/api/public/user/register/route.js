import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/lib/registerEmail";
import generateVerificationCode from "@/lib/user/generateVerificationCode";
import isValidEmail from "@/lib/user/isValidEmail";
import isStrongPassword from "@/lib/user/isStrongPassword";

export const dynamic = 'force-dynamic'

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, role, image } = body;

        // Validate name
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json({ error: "Name is required." }, { status: 400 });
        }

        // Validate email
        if (!email || typeof email !== "string" || !isValidEmail(email)) {
            return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
        }

        // Validate password
        let hashedPassword;
        if (typeof password !== "string" || !isStrongPassword(password)) {
            return NextResponse.json({
                error:
                    "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
            }, { status: 400 });
        }
        hashedPassword = await bcryptjs.hash(password, 10);

        // Check for existing user
        const existingUser = await db.user.findFirst({ where: { email } });

        if (existingUser) {
            if (existingUser.emailVerified && existingUser.providerId) {
                return NextResponse.json({
                    error: "Email is already associated with a social login. Please log in using your provider.",
                    providerLinked: true,
                }, { status: 409 });
            } else if (existingUser.emailVerified) {
                return NextResponse.json({ error: "User already exists and is verified." }, { status: 400 });
            } else {
                return NextResponse.json({
                    error: "Email already registered but not verified. Please verify your email first.",
                    unverified: true,
                }, { status: 409 });
            }
        }

        // Generate verification code and expiry
        const verificationCode = generateVerificationCode();
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

        // Create user
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                image,
                emailVerified: false,
                emailVerificationToken: verificationCode,
                emailVerificationTokenExpiry: expiry,
            },
        });

        // Send verification email
        await sendVerificationEmail(email, verificationCode);

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                },
                message: "Verification email sent. Please check your inbox.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
