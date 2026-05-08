const prisma = require("../db/prisma");

// CREATE
const create = async (data) => {
    return prisma.report.create({
        data
    });
};

const reportSelect = {
    id: true,
    title: true,
    category: true,
    location: true,
    description: true,
    photo: true,
    status: true,
    createdAt: true,
    userId: true,
    adminId: true,
    user: { select: { id: true, name: true, email: true, photo: true } },
    admin: { select: { id_admin: true, username: true, email: true, photo: true } }
};

// GET ALL
const findAll = async () => {
    return prisma.report.findMany({
        select: reportSelect,
        orderBy: { createdAt: 'desc' }
    });
};

// GET BY ID
const findById = async (id) => {
    return prisma.report.findUnique({
        where: { id },
        select: reportSelect
    });
};

// UPDATE
const update = async (id, data) => {
    return prisma.report.update({
        where: { id },
        data
    });
};

// DELETE
const remove = async (id) => {
    return prisma.report.delete({
        where: { id }
    });
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};