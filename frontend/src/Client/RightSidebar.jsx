import React from "react";
import { Link } from "react-router-dom";

function RightSidebar() {
  return (

    <div className="w-64 h-screen bg-[#0B0B12] text-white flex flex-col border border-white/10 rounded-xl">
      <div className="p-4 text-2xl font-bold border-b border-white/5">
        Recent Activity
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {" "}
          {/* Added space-y-2 to separate the items slightly */}
          <li>
            <Link
              to="/client/home"
              className="block py-3 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              Project 1
            </Link>
          </li>
          <li>
            <Link
              to="/client/projects"
              className="block py-3 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              Project 2
            </Link>
          </li>
          <li>
            <Link
              to="/client/messages"
              className="block py-3 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              Project 3
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default RightSidebar;