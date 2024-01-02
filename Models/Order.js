const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    item: {type: String},
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);