const request = require("../models/request");


exports.postRequest = async (req, res) => {
    try {
        const newRequest = new request(
            req.body
        );
        const savedRequest = await newRequest.save();
        res.status(200).json(savedRequest);
    } catch (err) {
        res.status(500).json(err);
    }
};