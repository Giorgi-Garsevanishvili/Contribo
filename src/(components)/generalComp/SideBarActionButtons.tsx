import Link from "next/link";
import { IconType } from "react-icons/lib";

function SideBarActionButtons({
  currentPath,
  pathCheck,
  Icon,
  title,
  home,
}: {
  currentPath: string;
  pathCheck: string;
  Icon: IconType;
  title: string;
  home?: boolean;
}) {
  return (
    <Link
      className={`flex px-4 md:ring-0 ring-2 relative ring-gray-300/80 text-center md:flex-row flex-col ${(home ? currentPath === pathCheck : currentPath.startsWith(pathCheck)) ? "bg-white text-primary" : "bg-gray-800/90 shadow "} items-center w-full md:gap-3 p-3 m-1 md:mb-0.5 px-4 md:px-3 md:py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors  group`}
      href={pathCheck}
    >
      <div className="absolute backdrop-blur-xs top-0 left-0 right-0 bottom-0 p-0 m-0 rounded-md z-2"></div>
      <span className="material-symbols-outlined z-5 text-[20px]">
        <Icon size={25} />
      </span>
      <span className="material-symbols-outlined opacity-50 absolute text-[20px]">
        <Icon size={25} />
      </span>
      <span className="text-sm hidden md:flex z-5 font-medium">{title}</span>
    </Link>
  );
}

export default SideBarActionButtons;
