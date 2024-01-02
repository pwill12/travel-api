
const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema(
  {
    bus: { type: String},
    ac: { type: Boolean},
    img: { type: String},
    from: { type: String},
    to: { type: String},
    depart: { type: String},
    return: { type: String},
    seats: { type: Number},
    amount: { type: Number},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", BusSchema);
