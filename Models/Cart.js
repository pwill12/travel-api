const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userid: { type: String },
    fooditems: [{
        foodid: { type: String },
        title: { type: String },
        quantity: { type: String },
        price: { type: Number },
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);