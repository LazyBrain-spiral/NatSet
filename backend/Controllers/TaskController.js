const Task = require("../Models/Tasks.js");

const getAllTasks = async (req, res) => {
  try {
    const data = await Task.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Task.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { taskId, status } = req.body;
  try {
    const project = await Task.findByIdAndUpdate(
      id,
      { $set: { "tasks.$[task].status": status } },
      { arrayFilters: [{ "task.id": taskId }], new: true },
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllTasks, getTaskById, updateTaskStatus };
