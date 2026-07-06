import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function FreelancerView() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`http://localhost:3001/projects/${id}`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
    }

    fetchProject();
  }, [id]);

  const handleTakeProject = async () => {
    const freelancerId = localStorage.getItem("userId"); 
    await fetch(`http://localhost:3001/projects/${id}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freelancerId }),
    });
    history.back();
  };

  if (!project) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="flex-1 p-10 text-white h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-400 mb-10">{project.prompt}</p>
      <button
        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
        onClick={handleTakeProject}
      >
        Take Project
      </button>

      <div className="space-y-5">
        {project.tasks.map((task) => (
          <div
            key={task.id}
            className="bg-[#111827] border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-3">{task.title}</h2>

            <p className="text-gray-300 mb-4">{task.summary}</p>

            {task.scope && (
              <p className="text-gray-400 mb-2">
                <span className="text-white/70 font-medium">Scope:</span>{" "}
                {task.scope}
              </p>
            )}

            {task.inputs && (
              <p className="text-gray-400 mb-2">
                <span className="text-white/70 font-medium">Inputs:</span>{" "}
                {task.inputs}
              </p>
            )}

            {task.deliverable && (
              <p className="text-purple-400 mt-3">
                Deliverable: {task.deliverable}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FreelancerView;
