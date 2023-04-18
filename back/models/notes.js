const { model, Schema } = require("mongoose")

const NoteSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    inicio: {
        type: String,
        required: true
    },
    fin: {
        type: String,
        required: true
    },
    crewcode: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    razon: String,
    requested: Boolean,
    denied: Boolean

},

)

module.exports = model("Note", NoteSchema)