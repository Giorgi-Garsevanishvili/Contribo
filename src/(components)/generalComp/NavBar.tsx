import { auth } from "@/lib/auth";
import Image from "next/image";
import SignOut from "../authComp/sign-out";
import SwitchPageButton from "../generalComp/SwitchPageButton";
import { normalizePage, ROLE_ROUTE_MAP } from "../../lib/roleRoutes";
import HomeButton from "../generalComp/HomeButton";

async function NavBar({ page }: { page: string }) {
  const session = await auth();
  const currentRole = normalizePage(page);

  return (
    <nav className="flex md:hidden flex-col mb-4 items-center justify-center p-2">
      <div className="flex items-center justify-between p-4 flex-row shadow-md bg-[#2c435b90] w-auto h-15 rounded-lg">
        <div className="flex flex-row items-center justify-between p-3 min-w-30 text-white">
          {session ? (
            <Image
              priority
              className="rounded-2xl"
              src={`${session?.user.image}`}
              width={37}
              height={37}
              alt="user-photo"
            />
          ) : null}
          <div className="flex flex-row items-center justify-between p-3 min-w-30 select-none text-white">
            <h2>{session?.user.name}</h2>
          </div>
          <SignOut />
        </div>
      </div>
      <p className="flex bg-gray-500/65 px-10 py-1 text-lg rounded-b-md shadow-md select-none text-white ">
        {page}
      </p>
    </nav>
  );
}

export default NavBar;
