const mongoose = require("mongoose")

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
  

})

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("database is connected")
})