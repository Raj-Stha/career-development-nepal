import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withRole } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic'

// Validation helper functions
const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const isImageUrl = (url) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
    return imageExtensions.test(url) || url.includes('image') || url.includes('img');
};

const isVideoUrl = (url) => {
    const videoExtensions = /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v)(\?.*)?$/i;
    return videoExtensions.test(url) || url.includes('video') || url.includes('youtube') || url.includes('vimeo');
};

const isGifUrl = (url) => {
    const gifExtension = /\.gif(\?.*)?$/i;
    return gifExtension.test(url) || url.includes('giphy') || url.includes('tenor');
};

// Error response helper
const errorResponse = (error, message, status) => {
    return NextResponse.json({ error, message }, { status });
};

// Success response helper
const successResponse = (message, data, status = 200) => {
    return NextResponse.json({ success: true, message, ...(data && { data }) }, { status });
};

// Validation schema
const validatePopupData = (data) => {
    const { image, video, gif } = data;

    // At least one media type must be provided - FIXED: Changed && to ||
    if (!image && !video && !gif) {
        return { isValid: false, error: "At least one media type (image, video, or gif) is required" };
    }

    // Validate URLs if provided - FIXED: Changed && to ! to check for invalid URLs
    if (image && !validateUrl(image.trim())) {
        return { isValid: false, error: "Please provide a valid image URL" };
    }

    if (video && !validateUrl(video.trim())) {
        return { isValid: false, error: "Please provide a valid video URL" };
    }

    if (gif && !validateUrl(gif.trim())) {
        return { isValid: false, error: "Please provide a valid GIF URL" };
    }

    // Optional: Validate URL types - FIXED: Changed && to ! for proper validation
    if (image && image.trim() && !isImageUrl(image.trim())) {
        console.warn("Provided image URL may not be a valid image format");
    }

    if (video && video.trim() && !isVideoUrl(video.trim())) {
        console.warn("Provided video URL may not be a valid video format");
    }

    if (gif && gif.trim() && !isGifUrl(gif.trim())) {
        console.warn("Provided GIF URL may not be a valid GIF format");
    }

    return { isValid: true };
};

// Sanitize popup data
const sanitizePopupData = (data) => {
    const { image, video, gif } = data;

    return {
        image: image?.trim() || null,
        video: video?.trim() || null,
        gif: gif?.trim() || null,
    };
};

// Database select fields
const popupSelectFields = {
    id: true,
    image: true,
    video: true,
    gif: true,
    createdAt: true,
    updatedAt: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

// Handle database errors
const handleDatabaseError = (error, operation) => {
    console.error(`Error ${operation} popup:`, error);

    if (error.message.includes('connect')) {
        return errorResponse("Database connection error", "Unable to connect to database. Please try again later.", 503);
    }

    if (error.message.includes('Foreign key constraint')) {
        return errorResponse("Invalid user", "The specified user does not exist", 400);
    }

    return errorResponse("Internal server error", `An unexpected error occurred while ${operation} the popup`, 500);
};

// CREATE popup
export const POST = withRole(["admin", "editor"])(async (request) => {
    try {
        const data = await request.json();
        console.log(data);
        const userId = request.headers.get("x-user-id");
        console.log(userId);

        if (!userId) {
            return errorResponse("Authentication error", "User ID is required", 401);
        }

        const validation = validatePopupData(data);
        // FIXED: Changed validation.isValid to !validation.isValid
        if (!validation.isValid) {
            return errorResponse("Validation error", validation.error, 400);
        }

        const sanitizedData = sanitizePopupData(data);

        const popup = await db.popup.create({
            data: {
                ...sanitizedData,
                userId,
            },
            select: popupSelectFields,
        });

        return successResponse("Popup created successfully", popup, 201);

    } catch (error) {
        return handleDatabaseError(error, "creating");
    }
});

// UPDATE popup by ID
export const PUT = withRole(["admin", "editor"])(async (request) => {
    try {
        const data = await request.json();
        const { id } = data;

        // FIXED: Changed id?.trim() to !id?.trim()
        if (!id?.trim()) {
            return errorResponse("Validation error", "Popup ID is required", 400);
        }

        const validation = validatePopupData(data);
        // FIXED: Changed validation.isValid to !validation.isValid
        if (!validation.isValid) {
            return errorResponse("Validation error", validation.error, 400);
        }

        const existing = await db.popup.findUnique({
            where: { id: id.trim() },
            select: { id: true }
        });

        // FIXED: Changed existing to !existing
        if (!existing) {
            return errorResponse("Popup not found", `No popup found with ID: ${id}`, 404);
        }

        const sanitizedData = sanitizePopupData(data);

        const updated = await db.popup.update({
            where: { id: id.trim() },
            data: sanitizedData,
            select: popupSelectFields,
        });

        return successResponse("Popup updated successfully", updated);

    } catch (error) {
        return handleDatabaseError(error, "updating");
    }
});

// DELETE popup by ID
export const DELETE = withRole(["admin", "editor"])(async (request) => {
    try {
        const { id } = await request.json();

        // FIXED: Changed id?.trim() to !id?.trim()
        if (!id?.trim()) {
            return errorResponse("Validation error", "Popup ID is required", 400);
        }

        const existing = await db.popup.findUnique({
            where: { id: id.trim() },
            select: {
                id: true,
                image: true,
                video: true,
                gif: true
            }
        });

        // FIXED: Changed existing to !existing
        if (!existing) {
            return errorResponse("Popup not found", `No popup found with ID: ${id}`, 404);
        }

        await db.popup.delete({ where: { id: id.trim() } });

        // Create a descriptive message based on what media was in the popup
        const mediaTypes = [];
        if (existing.image) mediaTypes.push("image");
        if (existing.video) mediaTypes.push("video");
        if (existing.gif) mediaTypes.push("gif");

        const mediaDescription = mediaTypes.length > 0 ? ` (${mediaTypes.join(", ")})` : "";

        return successResponse(`Popup${mediaDescription} deleted successfully`);

    } catch (error) {
        return handleDatabaseError(error, "deleting");
    }
});