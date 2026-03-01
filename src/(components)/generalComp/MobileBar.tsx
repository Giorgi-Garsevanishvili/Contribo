import { auth } from "@/lib/auth";
import { normalizePage } from "@/lib/roleRoutes";
import ConsoleSideBarActions from "./ConsoleSideBarActions";
import AdminSideBarActions from "./AdminSideBarActions";
import SwitchRole from "./SwitchRole";

async function MobileBar({ page }: { page: string }) {
  const session = await auth();
  const currentRole = normalizePage(page);
  return (
    <div className="w-full h-20 content-center items-center bottom-0 md:hidden border-r border-slate-200 fixed flex-col text-2xl z-150">
      <nav className="flex w-full h-full items-start justify-start  space-y-1 text-white overflow-auto">
        <div className="ml-0 mt-0 top-0 m-0">
          <SwitchRole page={page} session={session} />
        </div>
        <div className="ml-19 pl-2 h-full flex items-center overflow-x-auto overflow-hidden justify-center">
          {currentRole === "console" ? (
            <ConsoleSideBarActions />
          ) : currentRole === "admin" ? (
            <AdminSideBarActions />
          ) : (
            ""
          )}
        </div>
      </nav>
    </div>
  );
}

export default MobileBar;
