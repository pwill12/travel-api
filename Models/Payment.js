const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    amount: {type: Number},
    data: {type: Object},
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);