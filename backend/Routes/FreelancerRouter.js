
const express = require("express");
const router = express.Router();
const {
  getAllFreelancers,
  getFreelancerById,
  createFreelancer,
} = require("../Controllers/FreelancerController.js");

router.get("/", getAllFreelancers);
router.get("/:id", getFreelancerById);
router.post("/", createFreelancer);

module.exports = router;