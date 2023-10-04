const Price = require("../models/price.model");
const { getDateParams } = require("../utils/utils");
const axios = require("axios");

const REQUEST_LIMIT = 3000;

const addUserInDB = async (userId) => {
  try {
    const { todayStart, todayEnd } = getDateParams();
    const newPrice = {
      limit: 0,
      users: [userId],
      prices: [],
      currentDate: todayEnd,
    };

    const priceDoc = await Price.findOneAndUpdate(
      {
        $and: [
          { currentDate: { $gte: todayStart } },
          { currentDate: { $lte: todayEnd } },
        ],
      },
      { $push: { users: userId } },
      { new: true }
    );

    if (!priceDoc) {
      const newPriceDoc = await Price.create(newPrice);
      console.log("addUserInDB: ", newPriceDoc);
    }

    console.log("addUserInDB", priceDoc);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const removeUserFromDB = async (userId) => {
  try {
    const { todayStart, todayEnd } = getDateParams();

    const updatedDoc = await Price.findOneAndUpdate(
      {
        $and: [
          { currentDate: { $gte: todayStart } },
          { currentDate: { $lte: todayEnd } },
        ],
      },
      { $pull: { users: userId } },
      { new: true }
    );

    console.log("remoedUser", updatedDoc);
    return updatedDoc.users;
  } catch (err) {
    console.log(err);
    throw new Error("Error creating price", err);
  }
};

const addPrice = async (price) => {
  try {
    const { todayStart, todayEnd } = getDateParams();

    const priceDoc = await Price.findOneAndUpdate(
      {
        $and: [
          { currentDate: { $gte: todayStart } },
          { currentDate: { $lte: todayEnd } },
        ],
      },
      {
        $push: { prices: { $each: [price], $position: 0 } },
        $inc: { limit: 1 },
      },
      { new: true }
    );

    if (priceDoc.limit >= REQUEST_LIMIT) {
      throw new Error("max request limit reached");
    }

    console.log("successfully added price", priceDoc);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const headers = {
  "X-CMC_PRO_API_KEY": process.env.API_KEY_CMC,
};

const getBtcUSDTPrice = async () => {
  try {
    const url =
      "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=btc&convert=usdt";
    const { data } = await axios.get(url, { headers });
    console.log("successfully fetched btc price", data);

    const CMP = data.data.BTC[0].quote.USDT.price;
    return CMP;
  } catch (err) {
    console.log("Error fetching BTC price", err);
    throw new Error(err);
  }
};

module.exports = {
  addPrice,
  addUserInDB,
  removeUserFromDB,
  getBtcUSDTPrice,
};
