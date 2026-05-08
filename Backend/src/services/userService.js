const userRepository = require("../repositories/userRepository");

// GET ALL
const getAllUsers = async () => {
    return await userRepository.findUsers();
};

// GET BY ID
const getUserById = async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) throw new Error("user tidak ditemukan");
    return user;
};

// REGISTER
const registerUser = async (data) => {
    const existing = await userRepository.findUserByEmail(data.email);
    if (existing) throw new Error("email sudah digunakan");

    return await userRepository.insertUser({
        name: data.name,
        email: data.email,
        password: data.password
    });
};

// LOGIN
const loginUser = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);

    if (!user) throw new Error("email tidak ditemukan");
    if (user.password !== password) throw new Error("password salah");

    return user;
};

// UPDATE
const updateUser = async (id, data) => {
    return await userRepository.updateUser(id, data);
};

// DELETE
const deleteUser = async (id) => {
    return await userRepository.deleteUser(id);
};

module.exports = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    updateUser,
    deleteUser
};