const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.patch("/:id", userController.update);
router.delete("/:id", userController.remove);
router.put("/:id/photo", upload.single("photo"), userController.updatePhoto);

module.exports = router;