const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  updateTaskStatus,
} = require("../Controllers/TaskController.js");

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTaskStatus);

module.exports = router;
