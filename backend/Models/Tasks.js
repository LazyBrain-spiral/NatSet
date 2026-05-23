const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  prompt: String,
  title: String,
  createdAt: String,
  aiResponse: String,
  tasks: [
    {
      id: Number,
      title: String,
      summary: String,
      scope: String,
      inputs: String,
      deliverable: String,
      description: String,
      status: {
        type: String,
        enum: ["not_started", "in_progress", "completed"],
        default: "not_started",
      },
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);
