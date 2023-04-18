const mongoose = require("mongoose")

require('dotenv').config();

const URI = "mongodb+srv://admin:samuel@cluster0.xgq4q0o.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(URI, {
    useNewUrlParser: true,
  

})

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("database is connected")
})