const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  getAvailableTasks,
  assignProject,
} = require("../Controllers/TaskController.js");

router.get("/available", getAvailableTasks);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.patch("/:id/assign", assignProject);
router.patch("/:id", updateTaskStatus);



module.exports = router;
