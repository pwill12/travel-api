const router = require("express").Router();
const User = require("../Models/User");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");

//Nodemailer Transporter

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "Gmail",
  port: 587,
  secure: true,
  auth: {
    user: "pwill2339@gmail.com",
    pass: "dsfoakjmonuqqawb",
  },
});

//Register Route

router.post("/register", async (req, res) => {
  let token = crypto.randomBytes(32).toString("hex");
  const newUser = new User({
    username: req.body.username,
    phone: req.body.phone,
    email: req.body.email,
    accountVerifyToken: token,
    accountVerifyTokenExpiration: Date.now() + 3600000,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    await newUser
      .save()
      //Gmail now flags emails from nodemailer as scams...remove it from spams to inbox
      .then((savedUser) => {
        transport.sendMail({
          to: req.body.email,
          from: "princesolo919@gmail.com",
          subject: "Verify your Account on TravelBooking",
          html: `
                    <p>Please click on the link below to verify your email</p>
                    <p>Click this <a href="http://localhost:4000/api/verify/${token}">url</a> to verify your account.</p>
                  `,
        });
        res.status(201).json({
          message:
            "Account successfully created, please check your email or spams to verify your email before logging in.",
          savedUser,
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Verify Token after registeration(OTP)

router.get("/verify/:token", async (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    accountVerifyToken: token,
    accountVerifyTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (user === null) {
        res.status(403).json("Account already verified or OTP Expired");
      } else {
        user.isUserVerified = true;
        user.accountVerifyToken = undefined;
        user.accountVerifyTokenExpiration = undefined;
        user.save();
        res.status(201).json({ message: "Account verified successfully." });
      }
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
});

//Login Route

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("Wrong email address");
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    const inputPassword = req.body.password;

    if (originalPassword === inputPassword) {
      if (user.isUserVerified === false) {
        res.status(401).json("Account not verified");
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isUserVerified: user.isUserVerified,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;

        res.status(201).json({ ...others, accessToken });
      }
    } else {
      res.status(401).json("wrong password");
    }
  } catch (error) {
    res.status(500).json(error)
  }
});

router.put("/resetpassword/:id", async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Password Updated Successfully.", updatedUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
