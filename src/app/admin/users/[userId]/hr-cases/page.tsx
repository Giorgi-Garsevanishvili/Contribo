"use client";

import HrCasesList from "@/(components)/adminComp/users/hrCasesComps/HrCasesList";
import { useParams } from "next/navigation";

function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
    <HrCasesList fetchUrl={`/api/admin/users/${id}/hrWarning`} />
  </div>;
}
export default User;
