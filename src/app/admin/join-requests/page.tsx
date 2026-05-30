"use client";

import JoinRequestsList from "@/(components)/adminComp/join-requests/JoinRequestsList";
import HrCasesList from "@/(components)/adminComp/users/hrCasesComps/HrCasesList";
import { useParams } from "next/navigation";

function User() {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="flex w-full md:w-[80%] md:p-0 items-center m-0 p-2 justify-center flex-col">
      <JoinRequestsList />
    </div>
  );
}
export default User;
