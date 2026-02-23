import packageJson from "../../../package.json";
import { SiGooglesearchconsole } from "react-icons/si";
import { FaUser } from "react-icons/fa";
import SignOut from "../authComp/sign-out";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { PiPlantFill } from "react-icons/pi";
import SwitchPageButton from "../generalComp/SwitchPageButton";
import { normalizePage, ROLE_ROUTE_MAP } from "@/lib/roleRoutes";
import BrandMark from "../generalComp/BrandMark";
import ContriboLogo from "../../../public/Ind-Logo-Contribo-4-no-fill.svg";
import { MdSettingsSuggest } from "react-icons/md";
import ConsoleSideBarActions from "./ConsoleSideBarActions";
import AdminSideBarActions from "./AdminSideBarActions";

async function SideBar({ page }: { page: string }) {
  const session = await auth();
  const currentRole = normalizePage(page);
  return (
    <aside className="w-60 h-full border-r border-slate-200 flex flex-col bg-gray-600 text-2xl z-1000">
      <div className="p-6 flex items-center gap-3 text-gray-200">
        <div className="size-10 rounded-lg  flex items-center justify-center bg-white text-gray-900">
          <span className="material-symbols-outlined">
            {currentRole === "console" ? (
              <SiGooglesearchconsole size={25} />
            ) : currentRole === "admin" ? (
              <MdSettingsSuggest size={25} />
            ) : (
              <Image
                width={35}
                height={35}
                src={ContriboLogo}
                alt="Contribo Logo"
              />
            )}
          </span>
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight uppercase">
            {currentRole === "console" ? "Qirvex Console" : currentRole === "admin" ? "Contribo Admin" : "Volunteer Page"}
          </h1>
          <p className="text-xs text-slate-300">
            System v{packageJson.version}
          </p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1 text-white overflow-auto">
        <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Switch Role
        </div>
        <div className="flex">
          {session?.user.roles
            ?.filter((role) => ROLE_ROUTE_MAP[role] !== currentRole)
            .map((role) => (
              <SwitchPageButton key={role} name={role} />
            ))}
        </div>
        {currentRole === "console" ? <ConsoleSideBarActions /> : currentRole === "admin" ? <AdminSideBarActions /> : ""}
      </nav>
      <BrandMark />
      <div className="p-4 border-t border-slate-200 ">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-200">
          <div className="flex flex-col items-center justify-center">
            <div
              className={`size-8 items-center justify-center flex rounded-full overflow-hidden bg-blue-200`}
            >
              {session?.user.image ? (
                <Image
                  className="w-full h-full object-cover"
                  alt="Admin user profile picture"
                  width={40}
                  height={40}
                  src={session?.user.image}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <FaUser size={20} />
                </div>
              )}
            </div>
            <div className="flex mt-1 grow w-full items-center justify-center gap-1">
              <FaStar size={12} className="text-yellow-500" />
              <IoSettingsSharp size={12} />
              <PiPlantFill size={12} className="text-green-800" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate">{session?.user.name}</p>

            <p className="text-[10px] text-slate-500 truncate">
              {session?.user.email}
            </p>
          </div>
          <div className="text-sm text-slate-500  hover:text-primary transition-colors">
            <SignOut />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
