const prisma = require("../db/prisma");

// CREATE
const create = async (data) => {
    return prisma.report.create({
        data
    });
};

// GET ALL
const findAll = async () => {
    return prisma.report.findMany({
        include: {
            user: true
        }
    });
};

// GET BY ID
const findById = async (id) => {
    return prisma.report.findUnique({
        where: { id },
        include: {
            user: true
        }
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