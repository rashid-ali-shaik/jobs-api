const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    maxlength: 30,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

//mongoose middleware
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//instance methods
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.name },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_DURATION }
  );
};

//checkPassword
userSchema.methods.checkPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
