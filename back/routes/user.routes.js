const express = require("express");
const router = express.Router();


const userController = require("../controllers/user.controller")

router.get("/users", userController.users)
router.delete("/users/:id", userController.deleteUser)
router.put("/users/:id", userController.updateUser)
router.put("/users/:id", userController.updateUserPassword)
router.post("/users", userController.createUser)
router.post("/users/login", userController.login)
router.get("/crewcodes", userController.getCrewcodes)
router.post("/login", userController.login)
router.get("/users/:id", userController.userInfo)
router.get("/users",userController.recoverPassword)

module.exports = router