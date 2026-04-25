import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";


export default function ClientLayout() {
  return (
    <>
      <div className="grid grid-cols-[270px_1fr_270px] w-full overflow-hidden bg-[#0B0B1A]">
        <LeftSidebar />

        <main className="relative h-full overflow-y-auto">
          <Outlet />
        </main>

        <RightSidebar />
      </div>
    </>
  );
}
