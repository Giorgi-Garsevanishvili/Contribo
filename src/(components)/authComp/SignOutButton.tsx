"use client";
import { useFormStatus } from "react-dom";
import { FiLogOut } from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";

function SignOutButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="absolute select-none  z-600  bg-qirvex-d left-0 bottom-0 top-0 right-0 w-full m-0 h-svh touch-none items-center justify-center ">
        <div className="flex w-full  text-white flex-col h-full items-center justify-center">
          <div className="flex items-center rounded-lg shadow-lg p-2 justify-center">
            <ImSpinner9 className="animate-spin" size={40} />
          </div>
          <h3 className="m-10">Logging Out...</h3>
        </div>
      </div>
    );
  }

  return (
    <button
      disabled={pending}
      className="btn rounded-lg text-gray-600 ring bg-white/70 p-3"
      type="submit"
    >
      <FiLogOut className="text-lg" />
    </button>
  );
}

export default SignOutButton;
