const {
  addPrice,
  addUserInDB,
  removeUserFromDB,
  getBtcUSDTPrice,
} = require("../services/service");
const { clearInterval } = require("timers");

let getBtcProcess = null;

const socketConnections = (io) => {
  const addUser = async (socketId) => {
    await addUserInDB(socketId);
    if (!getBtcProcess) getBtcProcess = setInterval(emitBTCPrice, 2000);
  };

  const emitBTCPrice = async () => {
    try {
      const btcUSDTPrice = await getBtcUSDTPrice();
      await addPrice(btcUSDTPrice);
      io.emit("getBTCPrice", { price: btcUSDTPrice });
    } catch (error) {
      console.error("Error emitting BTC/USDT price:", error.message);
      io.emit("error", {
        error: `Error emitting BTC/USDT price: ${error.message}`,
      });
      clearInterval(getBtcProcess);
      getBtcProcess = null;
    }
  };

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    addUser(socket.id);

    socket.on("disconnect", async () => {
      const onlineUsers = await removeUserFromDB(socket.id);
      console.log("a user disconnected!", socket.id);
      if (onlineUsers.length == 0) {
        clearInterval(getBtcProcess);
        getBtcProcess = null;
      }
    });
  });
};

module.exports = {
  socketConnections,
};
