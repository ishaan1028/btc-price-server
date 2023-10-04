const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const utils = require("./utils/utils.js");
const { socketConnections } = require("./utils/socket.io.js");

const PORT = process.env.PORT || 3001;
const cors = {
  origin: process.env.FRONTEND,
};

async function main() {
  try {
    // Connecting to mongoDb Atlas
    await utils.MongoDBAtlasConnect(mongoose);

    const app = express();

    const httpServer = http.createServer(app);
    const io = socketIO(httpServer, { cors });

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
