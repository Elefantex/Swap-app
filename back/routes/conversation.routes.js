const express = require("express");
const router = express.Router();


const conversationController = require("../controllers/conversation.controller")

router.post("/conversations", conversationController.postConversation)
router.get("/conversations/:userId", conversationController.getConversation)
router.delete("/conversations/:conversationId", conversationController.deleteConversation)




module.exports = router