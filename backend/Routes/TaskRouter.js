const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/ensureAuthenticated");

const {
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  getAvailableTasks,
  assignProject,
  completeProject,
} = require("../Controllers/TaskController.js");

router.get("/available", getAvailableTasks);
router.get("/",ensureAuthenticated, getAllTasks);
router.get("/:id", getTaskById);
router.patch("/:id/assign", assignProject);
router.patch("/:id", updateTaskStatus);
router.patch("/:id/complete", completeProject);


module.exports = router;
