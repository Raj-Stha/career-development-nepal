import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import { generateToken, generateRefreshToken } from "@/lib/jwt";

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, providerId, name, image, provider } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    let user = await db.user.findFirst({
      where: providerId ? { email, providerId } : { email },
    });

    // If social login and user does not exist — register automatically
    if (providerId && !user) {
      user = await db.user.create({
        data: {
          name: name || "User",
          email,
          password: "",
          image,
          role: "user",
          provider,
          providerId,
          emailVerified: true,
        },
      });
    }

    // No user found still?
    if (!user) {
      return NextResponse.json({ error: "No user found." }, { status: 400 });
    }

    // Check if user is soft-deleted
    if (user.isDeleted) {
      return NextResponse.json({ error: "Account has been deactivated." }, { status: 403 });
    }

    // Require email verification for credentials login
    if (!user.emailVerified && !providerId) {
      return NextResponse.json(
        {
          error: "Email not verified. Please verify your email first.",
          unverified: true,
        },
        { status: 403 }
      );
    }

    // For credentials login only, verify password
    if (!providerId) {
      if (!user.password) {
        return NextResponse.json(
          { error: "No password set. Please use social login." },
          { status: 400 }
        );
      }

      const passwordMatch = await bcryptjs.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Wrong password." }, { status: 400 });
      }
    }

    // Await token generation
    const accessToken = await generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const refreshToken = await generateRefreshToken({ id: user.id });

    const { id, name: userName, email: userEmail, role, image: userImage } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: { id, name: userName, email: userEmail, role, image: userImage },
        tokens: {
          accessToken,
          refreshToken,
          accessTokenExpiresIn: "15m",
          refreshTokenExpiresIn: "30d",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
