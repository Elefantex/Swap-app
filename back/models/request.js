const { model, Schema } = require("mongoose")

const RequestSchema = new Schema({
    requestMessage: {
        type: String,
        required: true
    },
    
    
},

)

module.exports = model("Request", RequestSchema)