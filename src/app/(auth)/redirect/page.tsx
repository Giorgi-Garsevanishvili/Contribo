import "server-only";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const roles = session?.user.roles as string[];

  const priority = [
    {name: "QIRVEX", path: "/console"},
    {name: "ADMIN", path: "/admin"},
    {name: "REGULAR", path: "/client"},
  ]

  for (const role of priority){
    if(roles.includes(role.name)){
      redirect(role.path)
    }
  }

  redirect("/unauthorized");
}
