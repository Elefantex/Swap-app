const message = require("../models/message");



exports.postMessage = async (req, res) => {
    try {
        const newMessage = new message(
            req.body
        );

        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.postMessageChat = async (req, res) => {
    const { sender, text, conversationId } = req.body;

    try {
        const newMessage = new message({
            sender,
            text,
            conversationId,
        });

        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.getMessage = async (req, res) => {
    try {
        const messages = await message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messages)
    }
    catch (err) {
        res.status(500).json(err)
    }
}
