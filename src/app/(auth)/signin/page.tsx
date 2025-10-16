"client only";

import SignIn from "@/(components)/sign-in";

import { FaSlack } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignInForm = () => {
  return (
    <>
      <main className="flex justify-center items-center p-10 m-3 rounded-4xl shadow-inner shadow-gray-500 bg-gray-300/30">
        <div className="flex flex-col justify-center items-center">
          <p className="flex text-2xl bg-white/75 select-none shadow-2xl text-[#18324d] rounded-tl-xl rounded-br-xl shadow-gray-500 font-bold justify-center items-center p-2 m-2 w-fit ">
            Log In
          </p>
          <SignIn
            prov={"slack"}
            icon={<FaSlack className="text-4xl" />}
          ></SignIn>
          <SignIn
            prov={"google"}
            icon={<FcGoogle className="text-4xl" />}
          ></SignIn>
        </div>
      </main>
    </>
  );
};
export default SignInForm;
