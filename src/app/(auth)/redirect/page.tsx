"server only";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  switch (session.user.role) {
    case "ADMIN":
      redirect("/admin");
      return;
    default:
      redirect("/client");
  }
}
