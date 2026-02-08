import { slugify } from "transliteration";

// Format and clean a slug from any language input
export const formatSlug = (input) => {
    const rawSlug = slugify(input || "");
    return rawSlug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;
};

// Ensure slug is unique by checking existing entries
// checkUnique should be a function that returns true if slug is available
export const generateUniqueSlug = async (baseSlug, checkUnique) => {
    let formattedSlug = formatSlug(baseSlug);
    let uniqueSlug = formattedSlug;
    let counter = 1;

    // If checkUnique is a Prisma model, convert to callback
    if (checkUnique && typeof checkUnique.findFirst === 'function') {
        const model = checkUnique;
        checkUnique = async (slug) => {
            const existing = await model.findFirst({ where: { slug } });
            return !existing; // return true if slug is available
        };
    }

    // Ensure checkUnique is a function
    if (typeof checkUnique !== 'function') {
        throw new Error('checkUnique must be a function or a Prisma model with findFirst method');
    }

    while (!(await checkUnique(uniqueSlug))) {
        uniqueSlug = `${formattedSlug}-${counter++}`;
    }

    return uniqueSlug;
};

// Ensure name is unique in the same way
export const generateUniqueName = async (baseName, checkUnique) => {
    let uniqueName = baseName;
    let counter = 1;

    // If checkUnique is a Prisma model, convert to callback
    if (checkUnique && typeof checkUnique.findFirst === 'function') {
        const model = checkUnique;
        checkUnique = async (name) => {
            const existing = await model.findFirst({ where: { name } });
            return !existing; // return true if name is available
        };
    }

    // Ensure checkUnique is a function
    if (typeof checkUnique !== 'function') {
        throw new Error('checkUnique must be a function or a Prisma model with findFirst method');
    }

    while (!(await checkUnique(uniqueName))) {
        uniqueName = `${baseName} ${counter++}`;
    }

    return uniqueName;
};