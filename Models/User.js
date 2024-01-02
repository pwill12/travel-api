const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String},
    phone: { type: Number , unique: true},
    email: { type: String, unique: true },
    password: { type: String },
    admin: {
        type: Boolean,
        default: false
    },
    isUserVerified: {
      type: Boolean,
      default: false,
    },
    accountVerifyToken: String,
    accountVerifyTokenExpiration: Date,
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema);