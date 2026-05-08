const reportRepo = require("../repositories/reportRepository");

// CREATE REPORT
const createReport = async (data) => {
    return await reportRepo.create(data);
};

// GET ALL
const getAllReports = async () => {
    return await reportRepo.findAll();
};

// GET BY ID
const getReportById = async (id) => {
    const report = await reportRepo.findById(id);
    if (!report) throw new Error("report tidak ditemukan");
    return report;
};

// UPDATE
const updateReport = async (id, data) => {
    return await reportRepo.update(id, data);
};

// DELETE
const deleteReport = async (id) => {
    return await reportRepo.remove(id);
};

module.exports = {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport
};