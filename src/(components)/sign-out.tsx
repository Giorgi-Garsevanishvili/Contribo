import { signOut } from "@/lib/auth";

export default function SignOut() {
  return (
    <form
      className="flex justify-center items-center"
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button className="btn-log" type="submit">
        Sign Out
      </button>
    </form>
  );
}
