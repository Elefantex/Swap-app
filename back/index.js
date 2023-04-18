const express = require("express");
const app = express();
const { mongoose } = require("./database");
const cors = require("cors");

const swapRouter = require("./routes/swaps.routes");
const userRouter = require("./routes/user.routes")
const conversationRouter = require ("./routes/conversation.routes")
const messageRouter = require ("./routes/messages.routes")
const requestRouter = require("./routes/request.routes")
const noteRoute = require("./routes/notes.routes")


app.set("port", process.env.PORT || 3001);
app.use(express.json(), cors());

app.listen(app.get("port"), () => {
    console.log(`Server listening on ${app.get("port")}`);
});

app.use("/", swapRouter);
app.use("/", userRouter)
app.use("/",conversationRouter)
app.use("/",messageRouter)
app.use("/",requestRouter)
app.use("/",noteRoute)

