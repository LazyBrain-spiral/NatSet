import React, { useEffect } from "react";
import { useState } from "react";

function FreelancerDashboard() {
  const [projects, setProjects] = useState([]);
  const [loggedInUser] = useState(localStorage.getItem("loggedInUser"));
  async function fetchProjects() {
  try {
    const response = await fetch(
      "http://localhost:3001/projects/available"
    );

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
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="flex justify-between items-center border-b border-zinc-700 pb-4">
        <h1 className="text-3xl font-bold font-montserrat">Client Dashboard</h1>

        <div className="text-lg">
          Welcome,{" "}
          <span className="font-semibold text-blue-400">{loggedInUser}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-zinc-800 p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>

            <p className="text-zinc-400 mb-4">{project.prompt}</p>

            <div className="space-y-3">
              {project.tasks.map((task) => (
                <div key={task.id} className="bg-zinc-700 p-3 rounded-lg">
                  <h3 className="font-semibold text-blue-400">{task.title}</h3>

                  <p className="text-sm text-zinc-300 mt-1">{task.summary}</p>

                  <p className="text-sm text-green-400 mt-2">${task.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FreelancerDashboard;
