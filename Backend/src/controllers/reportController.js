const reportService = require("../services/reportService");
const supabase = require("../config/supabase");

// =====================
// CREATE (FIX TOTAL)
// =====================
const create = async (req, res) => {
    try {
        let photoUrl = null;

        // upload ke supabase
        if (req.file) {
            const file = req.file;
            // const fileName = Date.now() + "-" + file.originalname;
            const cleanName = file.originalname.replace(/\s+/g, "_");
            const fileName = Date.now() + "-" + cleanName;

            const { error } = await supabase.storage
                .from("reports")
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from("reports")
                .getPublicUrl(fileName);

            photoUrl = data.publicUrl;
        }

        // 🔥 FIX: jangan pakai ...req.body
        const payload = {
            title: req.body.title,
            category: req.body.category,
            location: req.body.location,
            description: req.body.description,
            userId: Number(req.body.userId),
            status: req.body.status || "pending",
            photo: photoUrl
        };

        const report = await reportService.createReport(payload);

        res.send({
            message: "report created",
            data: report
        });

    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(400).send(err.message);
    }
};

// =====================
// GET ALL
// =====================
const getAll = async (req, res) => {
    const reports = await reportService.getAllReports();
    res.send(reports);
};

// =====================
// GET BY ID
// =====================
const getById = async (req, res) => {
    try {
        const report = await reportService.getReportById(Number(req.params.id));
        res.send(report);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// =====================
// UPDATE (FIX TOTAL)
// =====================
const update = async (req, res) => {
    try {
        let photoUrl = null;

        if (req.file) {
            const file = req.file;
            const fileName = Date.now() + "-" + file.originalname;

            const { error } = await supabase.storage
                .from("reports")
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

            if (error) throw error;

            const { data } = supabase.storage
                .from("reports")
                .getPublicUrl(fileName);

            photoUrl = data.publicUrl;
        }

        // 🔥 FIX: pilih field manual (hindari id kebawa)
        const updatedData = {
            title: req.body.title,
            category: req.body.category,
            location: req.body.location,
            description: req.body.description,
            status: req.body.status,
        };

        if (req.body.userId) {
            updatedData.userId = Number(req.body.userId);
        }

        if (photoUrl) {
            updatedData.photo = photoUrl;
        }

        const report = await reportService.updateReport(
            Number(req.params.id),
            updatedData
        );

        res.send({
            message: "updated",
            data: report
        });

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(400).send(err.message);
    }
};

// =====================
// DELETE
// =====================
// const remove = async (req, res) => {
//     try {
//         await reportService.deleteReport(Number(req.params.id));
//         res.send("deleted");
//     } catch (err) {
//         res.status(400).send(err.message);
//     }
// };

const remove = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // 🔥 ambil data report dulu
        const report = await reportService.getReportById(id);

        // 🔥 kalau ada foto → hapus dari storage
        if (report.photo) {
            const fileName = report.photo.split("/").pop();

            const { error } = await supabase.storage
                .from("reports")
                .remove([fileName]);

            if (error) {
                console.error("Gagal hapus file:", error.message);
            }
        }

        // 🔥 baru hapus dari DB
        await reportService.deleteReport(id);

        res.send("deleted");

    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};