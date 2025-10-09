import { FaGithub } from "react-icons/fa";
import { FaSlack } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  return (
    <>
      <main className="flex justify-center items-center w-2xl h-9/12 rounded-4xl shadow-md bg-gray-200 hover:*:**:not-[]:">
        <div className="flex flex-col p-2 ">
          <p className="flex justify-center items-center p-10 text-3xl">Choose your Log in Method</p>
          <button className="btn-log ">
            Log In By GitHub <FaGithub className="text-4xl" />
          </button>
          <button className="btn-log ">
            Log In By Slack <FaSlack className="text-4xl" />
          </button>
          <button className="btn-log">
            Log In By Google <FcGoogle className="text-4xl" />
          </button>
        </div>
      </main>
    </>
  );
};
export default SignIn;
