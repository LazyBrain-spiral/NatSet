const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  getAvailableTasks,
} = require("../Controllers/TaskController.js");

router.get("/", getAllTasks);

router.get("/available", getAvailableTasks);

router.get("/:id", getTaskById);

router.patch("/:id", updateTaskStatus);

module.exports = router;
