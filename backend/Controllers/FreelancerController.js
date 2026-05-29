const freelancer = require("../Models/Freelancer.js");

const getAllFreelancers = async (req, res) => {
  try {
    const data = await freelancer.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch freelancer data" });
  }
};

const getFreelancerById = async (req, res) => {
  try {
    const { id } = req.params;
    const FreelancerID = await freelancer.findById(id);
    if (!FreelancerID)
      return res.status(404).json({ error: "Freelancer not found" });
    res.json(FreelancerID);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const createFreelancer = async (req, res) => {
  const { name, role, rating, avatar } = req.body;
  try {
    const newFreelancer = new freelancer({ name, role, rating, avatar });
    await newFreelancer.save();
    res.json(newFreelancer);
  } catch (error) {
    res.status(500).json({ error: "cannot add freelancer" });
  }
};

module.exports = { getFreelancerById, getAllFreelancers, createFreelancer };
