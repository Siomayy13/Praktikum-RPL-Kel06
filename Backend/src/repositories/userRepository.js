const prisma = require("../db/prisma");

// FIND ALL
const findUsers = async () => {
    return await prisma.user.findMany();
};

// FIND BY ID
const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: Number(id) }
    });
};

// FIND BY EMAIL
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

// CREATE
const insertUser = async (data) => {
    return await prisma.user.create({ data });
};

// UPDATE
const updateUser = async (id, data) => {
    return await prisma.user.update({
        where: { id: Number(id) },
        data
    });
};

// DELETE
const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id: Number(id) }
    });
};

module.exports = {
    findUsers,
    findUserById,
    findUserByEmail,
    insertUser,
    updateUser,
    deleteUser
};