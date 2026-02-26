import { auth } from "@/lib/auth";
import { normalizePage } from "@/lib/roleRoutes";
import ConsoleSideBarActions from "./ConsoleSideBarActions";
import AdminSideBarActions from "./AdminSideBarActions";
import SwitchRole from "./SwitchRole";

async function MobileBar({ page }: { page: string }) {
  const session = await auth();
  const currentRole = normalizePage(page);
  return (
    <div className="w-full h-20 content-center items-center bottom-0 md:hidden border-r border-slate-200 fixed flex-col bg-gray-600 text-2xl z-1000">
      <nav className="flex w-full h-full items-center justify-start  space-y-1 text-white overflow-auto">
        <SwitchRole page={page} session={session} />
        <div className="ml-22">
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
