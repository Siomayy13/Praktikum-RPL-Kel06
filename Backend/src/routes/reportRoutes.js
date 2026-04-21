const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const upload = require("../middlewares/upload");

// CREATE (pakai upload)
router.post("/", upload.single("photo"), reportController.create);

// READ
router.get("/", reportController.getAll);
router.get("/:id", reportController.getById);

// UPDATE (WAJIB pakai upload juga)
router.put("/:id", upload.single("photo"), reportController.update);

// DELETE
router.delete("/:id", reportController.remove);

module.exports = router;