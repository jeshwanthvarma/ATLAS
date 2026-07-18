const bcrypt = require("bcrypt");
const authRepository = require("../repositories/authRepository");

async function registerUser(userData) {
    const existingUser = await authRepository.findUserByEmail(userData.email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return {
        ...userData,
        passwordHash: hashedPassword,
    };
}

module.exports = {
    registerUser,
};