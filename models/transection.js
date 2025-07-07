const mongoose = require("mongoose");

const txnSchema = new mongoose.Schema({
  user: String,
  stock: String,
  amount: Number,
  txnId: String,
  status: String
});

module.exports = mongoose.model("Transaction", txnSchema);
