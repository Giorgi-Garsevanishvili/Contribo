"use client";
import { useFormStatus } from "react-dom";
import { FiLogOut } from "react-icons/fi";

function SignOutButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="fixed z-90 bg-qirvex-d top-0 left-0 w-full h-full items-center justify-center">
        <div className="flex w-full flex-col h-full items-center justify-center">
          <div>
            <h3 className="animate-spin p-5 text-6xl">.</h3>
          </div>
          <h3 className="m-10">Logging Out...</h3>
        </div>
      </div>
    );
  }

  return (
    <button disabled={pending} className="btn-log p-2 bg-transparent" type="submit">
      <FiLogOut className="text-lg" />
    </button>
  );
}

export default SignOutButton;
