"server only";
import { signIn } from "@/lib/auth";
import { ReactNode } from "react";

type SignInProps = {
  prov: string;
  icon: ReactNode;
  disabled?: boolean;
};

export default function SignIn({ prov, icon, disabled }: SignInProps) {
  return (
    <form
      className="flex flex-col justify-center items-center"
      action={async () => {
        "use server";
        await signIn(`${prov}`, { redirectTo: "/" });
      }}
    >
      <button
        disabled={disabled}
        className="disabled:opacity-40 btn-log w-full"
        type="submit"
      >
        Log In By {prov.toLocaleUpperCase()} {icon}
      </button>
    </form>
  );
}
