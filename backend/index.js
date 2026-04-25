const express = require("express");
const app = express();
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter.js");
const Task = require("./Models/Tasks.js");

require("dotenv").config();
require("./Models/db.js");

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/auth", AuthRouter);

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const userPrompt = messages[messages.length - 1].content;

  console.log("Creating tasks for:", userPrompt);

  try {
    const ollamaRes = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2",
        messages: [
          {
            role: "user",
            content: `Break down this goal into exactly 5 specific, actionable tasks: "${userPrompt}"

List them as numbered items, each with a title and brief description.
Format: 
1. Title - Description
2. Title - Description
etc.`,
          },
        ],
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      throw new Error("Ollama API error");
    }

    const data = await ollamaRes.json();
    const aiResponse = data?.message?.content || "";

    console.log("🤖 AI Response:", aiResponse);

    const tasks = parseAIResponse(aiResponse, userPrompt);

    console.log("✅ Parsed tasks:", tasks);

    const taskList = {
      prompt: userPrompt,
      createdAt: new Date().toISOString(),
      aiResponse: aiResponse,
      tasks: tasks,
    };

   const savedTask = await Task.create(taskList);

   console.log("💾 Saved to MongoDB:", savedTask._id);

   res.json({
     success: true,
     id: savedTask._id,
     data: savedTask,
   });

    console.log(`💾 Saved: ${filename}`);

    res.json({
      success: true,
      filename,
      data: taskList,
    });
  } catch (err) {
    console.error("❌ Error:", err.message);

    const fallbackTasks = {
      prompt: userPrompt,
      createdAt: new Date().toISOString(),
      tasks: [
        {
          id: 1,
          title: "Research and Planning",
          description: `Research requirements for: ${userPrompt}`,
          completed: false,
        },
        {
          id: 2,
          title: "Setup and Configuration",
          description: "Set up necessary tools and environment",
          completed: false,
        },
        {
          id: 3,
          title: "Core Development",
          description: "Build the main functionality",
          completed: false,
        },
        {
          id: 4,
          title: "Testing and Refinement",
          description: "Test and fix any issues",
          completed: false,
        },
        {
          id: 5,
          title: "Deployment and Launch",
          description: "Deploy and make it live",
          completed: false,
        },
      ],
    };

    res.json({
      success: true,
      filename: "fallback-tasks.json",
      data: fallbackTasks,
    });
  }
});


function parseAIResponse(text, userPrompt) {
  const lines = text.split("\n").filter((line) => line.trim());
  const tasks = [];

  for (const line of lines) {
    const match = line.match(/^(\d+)[\.\)]\s*(.+?)[\.\-:\;]\s*(.+)$/);

    if (match && tasks.length < 5) {
      const id = parseInt(match[1]);
      const title = match[2].trim();
      const description = match[3].trim();

      tasks.push({
        id: id,
        title: title,
        description: description,
        completed: false,
      });
    }
  }

  
  while (tasks.length < 5) {
    const genericTasks = [
      {
        title: "Research and Planning",
        description: `Research requirements for: ${userPrompt}`,
      },
      {
        title: "Setup and Preparation",
        description: "Gather necessary tools and resources",
      },
      {
        title: "Core Implementation",
        description: "Build the main components",
      },
      {
        title: "Testing and Refinement",
        description: "Test thoroughly and make improvements",
      },
      {
        title: "Finalization and Launch",
        description: "Complete and deploy the final result",
      },
    ];

    const nextTask = genericTasks[tasks.length];
    tasks.push({
      id: tasks.length + 1,
      title: nextTask.title,
      description: nextTask.description,
      completed: false,
    });
  }

  return tasks.slice(0, 5);
}

app.listen(PORT, () => {
  console.log(` Backend running at http://localhost:${PORT}`);
  console.log(`   Make sure Ollama is running: ollama run llama2`);
});
