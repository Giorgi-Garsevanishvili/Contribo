import { auth } from "./auth";

export const RestrictionCheck = async (role: string) => {
  const session = await auth();
  let restricted = false;

  if (session?.user.roles?.includes(role)) {
    restricted = true;
  }

  return { restricted };
};
