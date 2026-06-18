import { Folder, Sparkles } from "lucide-react";
import {Link} from "react-router-dom"
export default function FreelancerDashboard() {
  const user = localStorage.getItem("loggedInUser") || "freelancer";

  return (
    <div className="min-h-screen bg-[#070B1A] text-white p-8">
      
      <div className="flex justify-end mb-6">
        <p className="text-lg">
          Welcome, <span className="font-semibold text-purple-400">{user}</span>
        </p>
      </div>

      
      <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-[#0B1023] to-[#0A0F1D] p-12 shadow-[0_0_40px_rgba(139,92,246,0.08)]">
        <h1 className="text-6xl font-bold">
          Hello,{" "}
          <span className="bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
            {user}
          </span>
        </h1>

        <p className="mt-4 text-zinc-400 text-xl">
          Let's build something great today.
        </p>
      </div>

      {/* Current Projects */}
      <div className="mt-8 rounded-3xl border border-purple-500/10 bg-[#0B1020]/70 backdrop-blur-sm p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <Folder className="text-purple-400" size={22} />
          </div>

          <div>
            <h2 className="text-3xl font-bold">Current Projects</h2>
            <p className="text-zinc-400">Track and manage your ongoing work.</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-28 w-28 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-8">
            <Folder size={40} className="text-purple-400" />
          </div>

          <h3 className="text-4xl font-bold mb-4">Nothing assigned yet</h3>

          <p className="text-zinc-400 text-lg max-w-xl">
            You don't have any projects assigned to you right now. Check back
            later for new opportunities.
          </p>

          <Link to="/freelancer/projects" className="mt-8 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition flex items-center gap-3">
            <Sparkles size={18} />
            Browse Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
