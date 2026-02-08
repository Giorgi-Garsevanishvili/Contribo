"client only";

import SignIn from "@/(components)/authComp/sign-in";
import Image from "next/image";
import { FaSlack } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import contriboBgFree from "../../../public/Contribo-qirvex-long-no-fill.svg";

const SignInForm = async ({ showLogo }: { showLogo: boolean }) => {
  return (
    <>
      <div className="flex justify-center items-center p-10 m-3 rounded-4xl shadow-inner shadow-gray-500 bg-gray-300/30">
        <div className="flex flex-col justify-center items-center">
          <div
            className={`${showLogo ? "flex" : "hidden"} bg-gray-200/90 rounded-2xl m-1 p-2`}
          >
            <Image
              priority
              className="w-50 h-auto rounded-2xl"
              src={contriboBgFree}
              alt="Contribo logo"
            />
          </div>
          <p
            className={`${showLogo ? "hidden" : "flex"} text-2xl bg-white/75 select-none shadow-2xl text-[#18324d] rounded-tl-xl rounded-br-xl shadow-gray-500 font-bold justify-center items-center p-2 m-2 w-fit `}
          >
            Log In
          </p>
          <div className="mt-2 flex flex-col">
            <SignIn
              prov={"slack"}
              icon={<FaSlack className="text-4xl" />}
            ></SignIn>
            <SignIn
              prov={"google"}
              icon={<FcGoogle className="text-4xl" />}
            ></SignIn>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignInForm;
