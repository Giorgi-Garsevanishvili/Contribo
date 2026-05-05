import { signOut } from "next-auth/react";

export const responseLogOut = ({
  message,
  signOutReq,
}: {
  message?: string;
  signOutReq?: boolean;
}) => {
  if (message === "Unauthorized access" || signOutReq) {
    return setTimeout(async () => {
      await signOut({ callbackUrl: "/" });
    }, 4000);
  }
};
