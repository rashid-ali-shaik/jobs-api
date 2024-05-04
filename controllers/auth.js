const { StatusCodes } = require("http-status-codes");
const { BadReq, UnAuthorize } = require("../errors");
const User = require("../models/user");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadReq("please provide values");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadReq("Invalid username");
  }
  const validPassword = await user.checkPassword(password);
  if (!validPassword) {
    throw new BadReq("Invalid password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
