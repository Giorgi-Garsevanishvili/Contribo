"server only";

import { signOutAction } from "@/actions/auth";
import SignOutButton from "./SignOutButton";

export default function SignOut() {
  return (
    <form className="flex justify-center items-center" action={signOutAction}>
      <SignOutButton />
    </form>
  );
}
