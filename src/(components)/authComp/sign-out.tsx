"server only";

import { signOut } from "@/lib/auth";
import { FiLogOut } from "react-icons/fi";

export default function SignOut() {
  return (
    <form
      className="flex justify-center items-center"
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button className="btn-log p-2 bg-transparent" type="submit">
        <FiLogOut className="text-lg"/>
      </button>
    </form>
  );
}
