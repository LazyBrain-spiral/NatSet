const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const { signup, login, tasks , getUserById } = require("../Controllers/AuthController");

const router = require("express").Router();
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/users/:id", getUserById);
module.exports = router;
