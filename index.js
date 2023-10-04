const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const utils = require("./utils/utils.js");
const { socketConnections } = require("./utils/socket.io.js");
const cors = require("cors");

const PORT = process.env.PORT || 3001;
const corsObj = {
  origin: process.env.FRONTEND,
};

async function main() {
  try {
    // Connecting to mongoDb Atlas
    await utils.MongoDBAtlasConnect(mongoose);

    const app = express();

    app.use(cors(corsObj));

    app.get("/", (req, res) =>
      res.send({ status: "welcome to btc tracker API" })
    );

    const httpServer = http.createServer(app);
    const io = socketIO(httpServer, { cors: corsObj });

    socketConnections(io);

    httpServer.listen(PORT, () =>
      console.log(`server running on port ${PORT}`)
    );
  } catch (err) {
    console.log("err", err);
    throw new Error(err);
  }
}

main();
