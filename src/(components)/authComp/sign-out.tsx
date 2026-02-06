"server only";

import { signOut } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default function SignOut() {
  return (
    <form
      className="flex justify-center items-center"
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <SignOutButton />
    </form>
  );
}
