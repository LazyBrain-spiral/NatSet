import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function RightSidebar() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://localhost:3001/tasks");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="w-64 h-screen bg-[#0B0B12] text-white flex flex-col border border-white/10 rounded-xl">
      <div className="p-4 text-2xl font-bold border-b border-white/5">
        Recent Activity
      </div>

      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project._id}>
                <Link
                  to={`/client/projects/${project._id}`}
                  className="block py-3 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  {project.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 text-gray-500 text-sm">Loading projects...</li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default RightSidebar;
