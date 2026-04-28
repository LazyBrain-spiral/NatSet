const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User exists already, please login up!",
        success: false,
      });
    }

    const userModel = new UserModel({ name, email });

    userModel.password = await bcrypt.hash(password, 10);
    console.log(userModel);
    await userModel.save();

    res.status(201).json({
      message: "Signup successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user) {
      return res.status(409).json({
        message: "User doesn't exist! please signup up!",
        success: false,
      });
    }
    if (!isMatch) {
      return res.status(404).json({
        message: "Invalid credentials please try again!",
        sucess: false,
      });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.status(201).json({
      message: "login successful",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


module.exports = { signup, login };
