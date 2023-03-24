const express = require("express");
const AuthRouter = express.Router();
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// require("dotenv").config();

AuthRouter.post("/register", async (req, res) => {
  const {name, email, password } = req.body;

  try {
    const emailfind = await UserModel.find({ email: email });
    if (emailfind.length > 0) {
      res.send({msg:"user exist please login"});
    } else {
      bcrypt.hash(password, 3, async (err, secure_password) => {
        if (err) {
          res.send("some err is there");
          console.log(err);
        } else {
          const user = new UserModel({
            name,
            email,
            password: secure_password,
          });
          await user.save();
          res.send({msg:"user registered"});
        }
      });
    }
  } catch (err) {
    res.send({msg:"error in registering the user"});
    console.log(err);
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email: email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          var token = jwt.sign({ course: "backend" }, "masai",{expiresIn:"3600000"});
          res.send({ msg: "login success", token: token, name: user[0].name });
        } else {
          res.send({ msg: "wrong credential" });
        }
      });
    } else {
      res.send({ msg: "user not found" });
    }
  } catch (err) {
    res.send({ msg: "user not exist" });
  }
});

module.exports = {
  AuthRouter,
};