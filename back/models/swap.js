const { model, Schema } = require("mongoose")

const SwapSchema = new Schema({
    tipoSwap: {
        type: String,
        required: true
    },
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
    rank: {
        type: String,
        required: true
    },
    crewcode: {
        type: String,
        required: true
    },
    roster: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    razon: String

},

)

module.exports = model("Swap", SwapSchema)