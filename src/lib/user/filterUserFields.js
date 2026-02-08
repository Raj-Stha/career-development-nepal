function filterUserFields(user) {
    if (!user) return null;
    const { id, name, email, role, image } = user;
    return { id, name, email, role, image };
}

export default filterUserFields;