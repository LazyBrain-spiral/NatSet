import React from 'react'
import { Link } from 'react-router-dom'

function LeftSidebar() {
  return (
    <div className="w-64 bg-[#0B0B12] text-white flex flex-col border border-white/10 rounded-xl">
      <div className="p-4 text-2xl font-bold">Natset</div>
      <nav className="flex-1 px-4 py-2">
        <ul>
          <li>
            <Link
              to="/client/messages"
              className="block py-2 px-3 rounded hover:bg-gray-700"
            >
              New Project
            </Link>
            <Link
              to="/client/home"
              className="block py-2 px-3 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/client/projects"
              className="block py-2 px-3 rounded hover:bg-gray-700"
            >
              Projects
            </Link>
          </li>
          <li>
          </li>

          <hr className="border-t border-[#d7d7d7] m-4" />
          <li>
            <Link
              to="/client/settings"
              className="block py-2 px-3 rounded hover:bg-gray-700"
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className="block py-2 px-3 rounded hover:bg-gray-700"
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default LeftSidebar
