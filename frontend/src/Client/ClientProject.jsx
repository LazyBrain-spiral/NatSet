import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ClientProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`http://localhost:3001/tasks/${id}`);
        const data = await response.json();
        setProject(data);

        const pricePerTask = 80;
        const initialTasks = data.tasks.map((task, index) => ({
          ...task,
          price: pricePerTask * (index + 1),
          status: task.status || "not_started",
        }));
        setTasks(initialTasks);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
    }
    fetchProject();
  }, [id]);

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        let newStatus;
          if (t.status ===  'not_started')
            {
            newStatus = 'in_progress'; 
        }
          if (t.status ===  'in_progress')
            {
            newStatus = 'completed'; 
        }
          if (t.status ===  'completed')
            {
            newStatus = 'not_started'; 
        }

        fetch(`http://localhost:3001/tasks/${id}`,{
          method: "PATCH",
          headers : {'Content-type': 'application/json'},
          body : JSON.stringify({taskId , status:newStatus})
        });

        return { ...t ,  status:newStatus};

      }),
    );
  };

  if (!project) {
    return <div className="text-white p-10">Loading project...</div>;
  }
  // if (!project.assigned) {
  //   return (
  //     <div className="flex-1 p-10 text-white">
  //       <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
  //       <p className="text-gray-400 mb-8">{project.prompt}</p>
  //       <p className="text-gray-500">This project has not been assigned yet.</p>
  //     </div>
  //   );
  // }

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalValue = tasks.reduce((sum, t) => sum + t.price, 0);
  const earnedValue = tasks
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.price, 0);

  const freelancer = project.freelancer || {
    name: "Rahul Verma",
    role: "Frontend Developer",
    rating: 4.8,
    avatar: null,
  };

  const startDate = project.startDate || "May 21, 2025";
  const dueDate = project.dueDate || "Jun 15, 2025";

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

  const getToggleStyle = (status) => {
    if (status === "completed") return "bg-green-500 border-green-500";
    if (status === "in_progress") return "bg-transparent border-purple-500";
    return "bg-transparent border-white/30";
  };

  return (
    <div className="flex-1 p-10 text-white h-screen overflow-y-auto">
      
      <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-400 mb-8">{project.prompt}</p>

      
      <div className="bg-[#111827] border border-white/10 rounded-xl p-5 mb-8 grid grid-cols-4 gap-6">
        
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
          <p className="text-gray-400 text-sm mb-2">Assigned Freelancer</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {freelancer.avatar ? (
                <img
                  src={freelancer.avatar}
                  className="w-full h-full rounded-full object-cover"
                  alt={freelancer.name}
                />
              ) : (
                freelancer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{freelancer.name}</p>
              <p className="text-gray-400 text-xs">{freelancer.role}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-gray-400 text-xs">
                  {freelancer.rating}
                </span>
              </div>
            </div>
          </div>
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

        
        <div className="border-l border-white/10 pl-6 flex items-center gap-3">
          <div className="text-purple-400 text-2xl">📅</div>
          <div>
            <p className="text-gray-400 text-xs">Start Date</p>
            <p className="text-sm font-semibold mb-2">{startDate}</p>
            <p className="text-gray-400 text-xs">Due Date</p>
            <p className="text-sm font-semibold">{dueDate}</p>
          </div>
        </div>
      </div>

     
      <div className="space-y-4">
        {tasks.map((task) => {
          const statusStyle = getStatusStyle(task.status);
          const toggleStyle = getToggleStyle(task.status);
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
              
              <button
                onClick={() => toggleTask(task.id)}
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${toggleStyle}`}
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
                {task.status === "in_progress" && (
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                )}
              </button>

              
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-lg font-semibold ${isCompleted ? "line-through text-gray-500" : "text-white"}`}
                >
                  {task.title}
                </h2>
                <p className="text-gray-400 mt-1 text-sm leading-relaxed">
                  {task.description}
                </p>
                <p className="mt-3 text-sm text-purple-400">
                  Deliverable: {task.deliverable}
                </p>
              </div>

             
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
                  {task.status === "completed" && (
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
                  {task.status === "in_progress" && (
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                  )}
                  {task.status === "not_started" && (
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                  )}
                  {statusStyle.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClientProject;
