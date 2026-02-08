import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withRole } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic'

async function handler(req) {
  try {
    const { id: userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Find the target user (must not be deleted)
    const targetUser = await db.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found or already deleted" },
        { status: 404 }
      );
    }

    if (!targetUser.emailVerified) {
      return NextResponse.json(
        { error: "Cannot delete an unverified user" },
        { status: 400 }
      );
    }

    if (targetUser.id === req.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    if (targetUser.isDeleted) {
      return NextResponse.json(
        { error: "User is already deleted" },
        { status: 400 }
      );
    }


    // Soft delete the user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });

    return NextResponse.json(
      {
        message: "User soft-deleted successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error soft-deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export const DELETE = withRole(["admin"])(handler);
