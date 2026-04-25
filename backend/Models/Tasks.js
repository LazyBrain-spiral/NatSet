const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  prompt: String,
  createdAt: String,
  aiResponse: String,
  tasks: [
    {
      id: Number,
      title: String,
      description: String,
      completed: Boolean,
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);
