import { Outlet } from "react-router-dom";
import FLeftSidebar from "./FLeftSidebar";


export default function FreelancerLayout() {
  return (
    <>
      <div className="grid grid-cols-[270px_1fr] min-h-screen w-full overflow-hidden bg-[#0B0B1A]">
        <FLeftSidebar />

        <main className="relative h-full overflow-y-auto">
          <Outlet />
        </main>

        
      </div>
    </>
  );
}
