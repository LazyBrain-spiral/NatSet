const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User"); 


const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().max(100).min(4).required(),
    email: joi.string().email().required(),
    password: joi.string().max(100).min(4).required(),
    role: joi.string().valid("client", "freelancer").required(), 
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Invalid input data", error });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().max(100).min(4).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Invalid input data", error });
  }
  next();
};


const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User exists already, please login!",
        success: false,
      });
    }

    const userModel = new UserModel({ name, email, role });
    userModel.password = await bcrypt.hash(password, 10);

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

    
    if (!user) {
      return res.status(404).json({
        message: "User doesn't exist! please signup!",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials please try again!",
        success: false,
      });
    }

    
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name,
      role: user.role,
      _id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signupValidation,
  loginValidation,
  signup,
  login,
};
