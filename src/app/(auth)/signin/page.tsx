"client only";

import SignIn from "@/(components)/sign-in";

import { FaSlack } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignInForm = () => {
  return (
    <>
      <main className="flex justify-center items-center w-fit h-fit p-10 m-3 rounded-4xl shadow-md bg-gray-200 hover:*:**:not-[]:">
        <div className="flex flex-col ">
          <p className="flex text-2xl font-bold justify-center items-center pt-1 pb-4 ">
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
