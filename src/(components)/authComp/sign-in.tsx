"server only";
import { signIn } from "@/lib/auth";
import { ReactNode } from "react";

type SignInProps = {
  prov: string;
  icon: ReactNode;
};

export default function SignIn({ prov, icon }: SignInProps) {
  return (
    <form
      className="flex justify-center items-center"
      action={async () => {
        "use server";
        await signIn(`${prov}`, { redirectTo: "/redirect" });
      }}
    >
      <button className="btn-log" type="submit">
        Log In By {prov.toLocaleUpperCase()} {icon}
      </button>
    </form>
  );
}
