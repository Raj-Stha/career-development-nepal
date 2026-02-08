function isStrongPassword(password) {
    // At least 6 characters, one uppercase, one lowercase, one number, one special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return strongPasswordRegex.test(password);
}

export default isStrongPassword;