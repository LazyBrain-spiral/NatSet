const express = require("express");
const app = express();
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter.js");
const TaskRouter = require("./Routes/TaskRouter.js");
const FreelancerRouter = require("./Routes/FreelancerRouter.js");

require("dotenv").config();
require("./Models/db.js");

const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/ping", (req, res) => res.send("pong"));

app.use("/auth", AuthRouter);
app.use("/projects", TaskRouter);

app.post("/chat", async (req, res) => {
  const { messages, budget } = req.body;
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
            content: `You are a project manager breaking down a client's goal into exactly 5 freelancer-ready tasks.

                      Goal: "${userPrompt}"

                      Each task must be written as a clear work order that a freelancer can pick up and execute independently — no prior context assumed.

                      Requirements:
                      - Each task is self-contained with a defined scope, so a freelancer knows exactly what to build or deliver
                      - Include acceptance criteria (what "done" looks like) for each task
                      - Specify any inputs the freelancer will need (e.g. designs, APIs, credentials, assets)
                      - Tasks must be logically sequenced so output of one can feed into the next
                      - No vague tasks like "research", "set up", "review", "finalization", or "launch" — every task must produce a concrete deliverable
                      - The 5th task must be a real deliverable, NOT a wrap-up like "finalization", "launch", "review", or "deploy"
                      - Written in plain, professional language a non-technical client could also understand
                      - Total budget for this project is $${budget}. Allocate it across the 5 tasks based on complexity. Higher complexity = higher price.

                      Output format strictly (follow this exactly, no deviations):
                      Project Title: A short 5-word max professional title for this project.

                      1. Task Title
                      Summary: One sentence describing the deliverable.
                      Scope: What exactly needs to be done.
                      Inputs: What the freelancer needs to start (designs, APIs, credentials, etc.).
                      Deliverable: The specific file, feature, or artifact they hand back.
                      Price: number only, no symbols

                      2. Task Title
                      Summary: ...
                      Scope: ...
                      Inputs: ...
                      Deliverable: ...
                      Price: number only, no symbols

                      3. Task Title
                      Summary: ...
                      Scope: ...
                      Inputs: ...
                      Deliverable: ...
                      Price: number only, no symbols

                      4. Task Title
                      Summary: ...
                      Scope: ...
                      Inputs: ...
                      Deliverable: ...
                      Price: number only, no symbols

                      5. Task Title
                      Summary: ...
                      Scope: ...
                      Inputs: ...
                      Deliverable: ...
                      Price: number only, no symbols

                      Only output the list. No intros, no explanations, no extra commentary.`,
          },
        ],
        stream: false,
      }),
    });
    if (!ollamaRes.ok) throw new Error("Ollama API error");
    const data = await ollamaRes.json();
    const aiResponse = data?.message?.content || "";
    console.log("🤖 AI Response:", aiResponse);
    const { tasks, projectTitle } = parseAIResponse(aiResponse, userPrompt,budget);
    console.log("✅ Parsed tasks:", tasks);
    res.json({
      success: true,
      data: {
        prompt: userPrompt,
        title: projectTitle,
        createdAt: new Date().toISOString(),
        aiResponse,
        tasks,
        assigned:false,
      },
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.json({
      success: true,
      data: {
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
      },
    });
  }
});

app.post("/save", async (req, res) => {
  const Task = require("./Models/Tasks.js");
  const { data } = req.body;
  try {
    const savedTask = await Task.create(data);
    console.log("💾 Saved to MongoDB:", savedTask._id);
    res.json({ success: true, id: savedTask._id });
  } catch (err) {
    console.error("❌ Save error:", err.message);
    res.status(500).json({ error: "Failed to save" });
  }
});

function generateTitle(prompt) {
  const trimmed = prompt.trim();
  const short = trimmed.length > 60 ? trimmed.slice(0, 57) + "..." : trimmed;
  return short.charAt(0).toUpperCase() + short.slice(1);
}

function parseAIResponse(text, userPrompt, budget) {
  const tasks = [];
  const titleMatch = text.match(/^Project Title:\s*(.+)/m);
  const projectTitle = titleMatch
    ? titleMatch[1].trim()
    : generateTitle(userPrompt);
  const bodyText = text.replace(/^Project Title:.+\n?/m, "");
  const blocks = bodyText.split(/(?=^\d+\.\s)/m).filter((b) => b.trim());
  for (const block of blocks) {
    if (tasks.length >= 5) break;
    const titleMatch = block.match(/^(\d+)\.\s+(.+)/m);
    if (!titleMatch) continue;
    const id = parseInt(titleMatch[1]);
    const title = titleMatch[2].trim().replace(/^Task Title:\s*/i, "");
    const summary = extractField(block, "Summary");
    const price = extractField(block, "Price");
    const scope = extractField(block, "Scope");
    const inputs = extractField(block, "Inputs");
    const deliverable = extractField(block, "Deliverable");
    const descriptionParts = [];
    if (summary) descriptionParts.push(summary);
    if (scope) descriptionParts.push(`Scope: ${scope}`);
    if (inputs) descriptionParts.push(`Inputs: ${inputs}`);
    if (deliverable) descriptionParts.push(`Deliverable: ${deliverable}`);
    tasks.push({
      id,
      title,
      summary: summary || "",
      scope: scope || "",
      inputs: inputs || "",
      deliverable: deliverable || "",
      description: descriptionParts.join(" | "),
      completed: false,
      price: Number(price.replace(/[^0-9.]/g, "")) || 0,
    });
  }

  if (budget) {
    const totalAllocated = tasks.reduce((sum, t) => sum + t.price, 0);
    if (totalAllocated > 0) {
      tasks.forEach((t) => {
        t.price = Math.round((t.price / totalAllocated) * Number(budget));
      });
    }
  }

  const genericTasks = [
    {
      title: "Define Project Requirements",
      description: `Document all functional requirements for: ${userPrompt}`,
    },
    {
      title: "Create Technical Specification",
      description: "Write a detailed spec the freelancer can follow",
    },
    {
      title: "Build Core Feature",
      description: "Implement the primary functionality",
    },
    {
      title: "Integrate and Connect Modules",
      description: "Wire all components together and verify data flow",
    },
    {
      title: "Deliver Tested Build",
      description: "Hand off a tested, documented, ready-to-use build",
    },
  ];
  while (tasks.length < 5) {
    const next = genericTasks[tasks.length];
    tasks.push({
      id: tasks.length + 1,
      title: next.title,
      summary: next.description,
      scope: "",
      inputs: "",
      deliverable: "",
      description: next.description,
      completed: false,
      price: 0,
    });
  }
  return { tasks: tasks.slice(0, 5), projectTitle };
}

function extractField(block, fieldName) {
  const pattern = new RegExp(
    `${fieldName}:\\s*([\\s\\S]*?)(?=\\n(?:Summary|Scope|Inputs|Deliverable|Price):|$)`,
    "i",
  );
  const match = block.match(pattern);
  return match ? match[1].replace(/\n/g, " ").trim() : "";
}
app.use("/freelancers", FreelancerRouter);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`Make sure Ollama is running: ollama run llama2`);
});
