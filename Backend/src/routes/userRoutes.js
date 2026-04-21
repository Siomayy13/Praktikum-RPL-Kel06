const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.patch("/:id", userController.update);
router.delete("/:id", userController.remove);

module.exports = router;