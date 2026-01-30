import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const redirectByRole = async () => {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const roles = session?.user.roles as string[];

  const priority = [
    { name: "REGULAR", path: "/volunteer" },
    { name: "ADMIN", path: "/admin" },
    { name: "QIRVEX", path: "/console" },
  ];

  for (const role of priority) {
    if (roles.includes(role.name)) {
      redirect(role.path);
    }
  }

  redirect("/unauthorized");
};
