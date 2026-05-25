const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
  name: String,
  role: String,
  rating: Number,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Freelancer", freelancerSchema);
