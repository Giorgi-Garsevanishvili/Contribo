import { normalizePage } from "@/lib/roleRoutes";
import ConsoleSideBarActions from "./ConsoleSideBarActions";
import AdminSideBarActions from "./AdminSideBarActions";
import VolunteerSideBarActions from "./VolunteerSideBarActions";

async function MobileBar({ page }: { page: string }) {
  const currentRole = normalizePage(page);
  return (
    <div className="w-full h-20 content-center items-center bottom-0 md:hidden md:border-r md:border-slate-200 fixed flex-col text-2xl z-150">
      <nav className="flex w-full h-full  items-start justify-center space-y-1 text-white overflow-auto">
        <div className="h-full flex mx-1 items-center overflow-x-auto overflow-hidden justify-center">
          {currentRole === "console" ? (
            <ConsoleSideBarActions />
          ) : currentRole === "admin" ? (
            <AdminSideBarActions />
          ) : (
            <VolunteerSideBarActions />
          )}
        </div>
      </nav>
    </div>
  );
}

export default MobileBar;
