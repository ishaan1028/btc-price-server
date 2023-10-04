const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  limit: {
    type: Number,
    default: 0,
    required: true,
  },
  prices: {
    type: Array,
    required: true,
    default: [],
  },
  users: {
    type: Array,
    required: true,
    default: [],
  },
  currentDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Price", priceSchema, "price");
