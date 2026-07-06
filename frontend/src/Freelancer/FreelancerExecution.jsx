import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function FreelancerExecution() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`http://localhost:3001/projects/${id}`);
        const data = await response.json();
        setProject(data);
        const initialTasks = data.tasks.map((task) => ({
          ...task,
          price: task.price || 0,
          status: task.status || "not_started",
        }));
        setTasks(initialTasks);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
    }
    fetchProject();
  }, [id]);

const handleTaskAction = async (taskId, currentStatus) => {
  const newStatus =
    currentStatus === "not_started" ? "in_progress" : "completed";

  await fetch(`http://localhost:3001/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId, status: newStatus }),
  });

  setTasks((prev) =>
    prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
  );
};

  if (!project) {
    return <div className="text-white p-10">Loading project...</div>;
  }

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalValue = tasks.reduce((sum, t) => sum + t.price, 0);
  const earnedValue = tasks
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.price, 0);

  const getStatusStyle = (status) => {
    if (status === "completed")
      return {
        bg: "bg-green-500/20",
        text: "text-green-400",
        border: "border-green-500/30",
        label: "Completed",
      };
    if (status === "in_progress")
      return {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        border: "border-purple-500/30",
        label: "In Progress",
      };
    return {
      bg: "bg-white/5",
      text: "text-gray-400",
      border: "border-white/10",
      label: "Not Started",
    };
  };

  return (
    <div className="flex-1 p-10 text-white h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-400 mb-8">{project.prompt}</p>

      {/* Stats Bar */}
      <div className="bg-[#111827] border border-white/10 rounded-xl p-5 mb-8 grid grid-cols-3 gap-6">
        <div>
          <p className="text-gray-400 text-sm mb-1">Progress</p>
          <p className="text-purple-400 text-2xl font-bold mb-2">
            {progressPercent}%
          </p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mb-1">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        <div className="border-l border-white/10 pl-6">
          <p className="text-gray-400 text-sm mb-1">Earned / Total Value</p>
          <p className="text-2xl font-bold mb-2">
            <span className="text-green-400">${earnedValue}</span>
            <span className="text-gray-400 text-lg"> / ${totalValue}</span>
          </p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mb-1">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${totalValue > 0 ? Math.round((earnedValue / totalValue) * 100) : 0}%`,
              }}
            />
          </div>
          <p className="text-gray-500 text-xs">
            {totalValue > 0 ? Math.round((earnedValue / totalValue) * 100) : 0}%
            of total value earned
          </p>
        </div>

        <div className="border-l border-white/10 pl-6 flex items-center">
          <div>
            <p className="text-gray-400 text-sm mb-1">Status</p>
            <p className="text-white font-semibold">
              {completedTasks === totalTasks ? "✅ All Done" : "🔧 In Progress"}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {totalTasks - completedTasks} tasks remaining
            </p>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const statusStyle = getStatusStyle(task.status);
          const isCompleted = task.status === "completed";

          return (
            <div
              key={task.id}
              className={`bg-[#111827] border rounded-xl p-5 flex items-start gap-4 transition-all duration-300 ${
                isCompleted
                  ? "border-green-500/20 opacity-80"
                  : "border-white/10"
              }`}
            >
              {/* Status indicator */}
              <div
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : "bg-transparent border-white/30"
                }`}
              >
                {isCompleted && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-lg font-semibold ${isCompleted ? "line-through text-gray-500" : "text-white"}`}
                >
                  {task.title}
                </h2>
                <p className="text-gray-400 mt-1 text-sm leading-relaxed">
                  {task.summary}
                </p>
                {task.scope && (
                  <p className="text-gray-400 text-sm mt-1">
                    <span className="text-white/50">Scope:</span> {task.scope}
                  </p>
                )}
                {task.inputs && (
                  <p className="text-gray-400 text-sm mt-1">
                    <span className="text-white/50">Inputs:</span> {task.inputs}
                  </p>
                )}
                <p className="mt-3 text-sm text-purple-400">
                  Deliverable: {task.deliverable}
                </p>
              </div>

              {/* Price + Status + Submit */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <p className="text-base font-semibold">
                  <span className="text-green-400">
                    ${isCompleted ? task.price : 0}
                  </span>
                  <span className="text-gray-400"> / ${task.price}</span>
                </p>
                <span
                  className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  {isCompleted && (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {!isCompleted && (
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                  )}
                  {statusStyle.label}
                </span>
                {!isCompleted && (
                  <button
                    onClick={() => handleTaskAction(task.id, task.status)}
                    className="mt-1 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-medium transition-all"
                  >
                    {task.status === "not_started"
                      ? "Start Task"
                      : "Submit Task"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FreelancerExecution;
