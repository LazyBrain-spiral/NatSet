import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function FreelancerProject() {
  const [projects, setProjects] = useState([]);
  const [loggedInUser] = useState(localStorage.getItem("loggedInUser"));
  const Navigate = useNavigate();
  async function fetchProjects() {
    try {
      const response = await fetch("http://localhost:3001/projects/available");

      const data = await response.json();

      console.log(data);

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#070B1A] text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold">Current Projects</h1>

          <p className="text-zinc-400 mt-2">
            Browse available projects and start earning.
          </p>
        </div>

        <div className="text-lg">
          Welcome,{" "}
          <span className="font-semibold text-purple-400">{loggedInUser}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="rounded-3xl border border-purple-500/10 bg-[#0B1020]/70 backdrop-blur-md p-6">
          <p className="text-zinc-400">Available Projects</p>
          <h2 className="text-4xl font-bold mt-2">{projects.length}</h2>
        </div>

        <div className="rounded-3xl border border-purple-500/10 bg-[#0B1020]/70 backdrop-blur-md p-6">
          <p className="text-zinc-400">Potential Tasks</p>
          <h2 className="text-4xl font-bold mt-2">
            {projects.reduce((acc, project) => acc + project.tasks.length, 0)}
          </h2>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-3xl border border-purple-500/10 bg-[#0B1020]/70 backdrop-blur-md p-20 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-purple-600/10 flex items-center justify-center mb-8">
            <span className="text-4xl">📁</span>
          </div>

          <h2 className="text-4xl font-bold">Nothing assigned yet</h2>

          <p className="text-zinc-400 mt-4">
            New opportunities will appear here once projects become available.
          </p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="
                rounded-3xl
                overflow-hidden
                border
                border-purple-500/10
                bg-[#0B1020]/70
                backdrop-blur-md
                hover:border-purple-500/30
                transition-all
                duration-300
                "
            >
              {/* Project Header */}
              <div className="p-6 border-b border-purple-500/10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{project.title}</h2>

                  <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 text-sm">
                    AI Generated
                  </span>
                </div>

                <p className="mt-4 text-zinc-400 line-clamp-3">
                  {project.prompt}
                </p>

                <div className="flex gap-3 mt-5">
                  <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm">
                    {project.tasks.length} Tasks
                  </span>

                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">
                    ${project.tasks.reduce((sum, task) => sum + task.price, 0)}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-5">
                <div className="space-y-3">
                  {project.tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="
        bg-[#131A2D]
        border border-purple-500/10
        rounded-xl
        p-4
        hover:border-purple-500/30
        hover:bg-[#171F35]
        transition-all
        cursor-pointer
      "
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-purple-300 text-sm">
                          {task.title}
                        </h3>

                        <span className="text-green-400 font-semibold">
                          ${task.price}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                        {task.summary}
                      </p>
                    </div>
                  ))}
                </div>

                {project.tasks.length > 3 && (
                  <div className="mt-4 text-center">
                    <span className="text-purple-400 text-sm">
                      +{project.tasks.length - 3} more tasks
                    </span>
                  </div>
                )}

                <button
                  onClick={() =>
                    Navigate(`/freelancer/projects/${project._id}`)
                  }
                  className="
    w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 transition-all font-medium">
                  View Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FreelancerProject;
