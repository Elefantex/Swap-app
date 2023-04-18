const express = require("express");
const router = express.Router();

const requestController = require("../controllers/request.controller")

router.post("/request", requestController.postRequest)




module.exports = router