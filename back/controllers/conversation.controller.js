const conversation = require("../models/conversation");



exports.postConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        // Check if conversation already exists with the same members
        const existingConversation = await conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (existingConversation) {
            return res.status(400).json({ message: 'Conversation already exists' });
        }

        const newConversation = new conversation({
            members: [senderId, receiverId],
        });

        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
};


exports.getConversation = async (req, res) => {
    const userId = req.params.userId; // change `req.params.userId` to `req.params.id`

    try {
        const conversations = await conversation.find({
            members: {
                $in: [userId] // change `req.params.userId` to `userId`
            }
        });
        res.status(200).json(conversations); // change `conversation` to `conversations`
    } catch (err) {
        res.status(500).json(err);
    }
};
exports.deleteConversation = async (req, res) => {
    const conversationId = req.params.conversationId;

    try {
        const deletedConversation = await conversation.findByIdAndDelete(conversationId);

        if (!deletedConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
};
