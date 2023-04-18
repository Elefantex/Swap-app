const { model, Schema } = require("mongoose")

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    rank: {
        type: String,
        required: true
    },
    crewcode: {
        type: String,
        required: true
    },
    roster: {
        type: Number
    },
    part: {
        type: Boolean
    }
},

)


module.exports = model("User", UserSchema)