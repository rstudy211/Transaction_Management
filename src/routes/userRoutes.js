const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
const { admin, auth } = require("../middleware/auth");

router.get("/", admin, userController.allUsers);

router.get("/me", auth, userController.getUser);

router.post("/login", userController.loginUser);

router.post("/logout", userController.logoutUser);

router.post("/create", admin, userController.createUser);

router.post("/register", userController.createUser);


router.get("/:id", admin, userController.getUserById);

module.exports = router;
