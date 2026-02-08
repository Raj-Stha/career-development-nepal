import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"
import db from "@/lib/db"
import bcryptjs from "bcryptjs"
import isStrongPassword from "@/lib/user/isStrongPassword"

export const dynamic = 'force-dynamic'

async function handler(request) {
    if (request.method !== "PATCH") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
    }

    const userId = request.headers.get("x-user-id");
    // const userId = request.user?.id
    if (!userId) {
        return NextResponse.json({ error: "User ID not found in token" }, { status: 400 })
    }

    const user = await db.user.findUnique({
        where: { id: userId },
        select: { password: true, providerId: true },
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.providerId) {
        return NextResponse.json(
            { error: "Password change not allowed for social login users" },
            { status: 403 }
        )
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json()

    if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json({ error: "All password fields are required" }, { status: 400 })
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password)
    if (!isMatch) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "New passwords do not match" }, { status: 400 })
    }

    if (!isStrongPassword(newPassword)) {
        return NextResponse.json(
            { error: "Password must be at least 6 characters and include uppercase, lowercase, number, and special character." },
            { status: 400 }
        )
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10)

    await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: "Password updated successfully" })
}

export const PATCH = withAuth(handler)
