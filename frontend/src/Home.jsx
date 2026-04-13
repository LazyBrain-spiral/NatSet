import React, { useState } from "react";
import { handleSuccess } from "./Utils";

const projects = [
  {
    id: "PRJ-001",
    project_analysis: {
      project_type: "social_media_marketing",
      complexity: "Medium",
      estimated_total_days: 30,
    },
  },
  {
    id: "PRJ-002",
    project_analysis: {
      project_type: "marketing_video_production",
      complexity: "High",
      estimated_total_days: 45,
    },
  },
  {
    id: "PRJ-003",
    project_analysis: {
      project_type: "logistics_app_gps_module",
      complexity: "High",
      estimated_total_days: 60,
    },
  },
  {
    id: "PRJ-004",
    project_analysis: {
      project_type: "e_commerce_platform_redesign",
      complexity: "High",
      estimated_total_days: 90,
    },
  },
  {
    id: "PRJ-005",
    project_analysis: {
      project_type: "social_media_marketing",
      complexity: "Low",
      estimated_total_days: 20,
    },
  },
];

const stats = [
  { id: 1, Detail: "Total Earning", value: "25,45,000" },
  { id: 2, Detail: "Active Projects", value: "5" },
  { id: 3, Detail: "Completed", value: "15" },
];

export default function ClientDashboard() {
  const [showModal, setShowModal] = useState(false);

  const [loggedInUser] = useState(localStorage.getItem("loggedInUser"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
    handleSuccess("Logged out successfully");
  };
  return (
    <div className="min-h-screen [background:radial-gradient(ellipse_at_center,_#1a2535_0%,_#080d14_100%)] py-24 sm:py-32 font-sans">
      <div className="fixed top-4 right-4 z-50">
        <button
          className="px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-600/40 hover:border-red-400 transition-all text-sm font-medium backdrop-blur-2xl"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Hello {loggedInUser} 👋
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            Analyse your projects in detail.
          </p>
        </div>

        {/* Stats */}
        <div className="py-24 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="mx-auto flex max-w-xs flex-col gap-y-4"
                >
                  <div className="text-base/7 text-gray-100">{stat.Detail}</div>
                  <div className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                    {stat.value}
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex justify-between items-center pb-6 border-b border-slate-800 mt-16">
          <h1 className="text-2xl font-semibold text-white">
            Active & Ongoing Contracts
          </h1>
          <button
            className="px-4 py-2 border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition-all text-sm"
            onClick={() => setShowModal(true)}
          >
            Add Contract
          </button>
        </div>

        {/* Project Cards */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex max-w-xl mt-16 flex-col items-start justify-between bg-slate-800/60 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)] cursor-pointer border-t-2 border-t-blue-500/60"
            >
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                {project.id}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white capitalize">
                {project.project_analysis.project_type.replace(/_/g, " ")}
              </h3>
              <div className="flex gap-3 mt-6">
                <div className="bg-slate-900/60 border border-slate-600 p-3 rounded-xl">
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
                    Complexity
                  </p>
                  <p className="text-orange-400 text-sm font-semibold uppercase">
                    {project.project_analysis.complexity}
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-600 p-3 rounded-xl">
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
                    Timeline
                  </p>
                  <p className="text-emerald-400 text-sm font-semibold">
                    {project.project_analysis.estimated_total_days} Days
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Modal Placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-white text-xl font-semibold mb-4">
              Add Contract
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Contract form goes here.
            </p>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-all"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
