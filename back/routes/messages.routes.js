const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messages.controller")

router.post("/messages", messageController.postMessage)
router.get("/messages/:conversationId", messageController.getMessage)
router.post("/messages",messageController.postMessageChat)



module.exports = router