"use client";

import HrCasesList from "@/(components)/adminComp/users/hrCasesComps/HrCasesList";
import { useParams } from "next/navigation";



function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex w-full items-center m-0 p-2 md:p-0 md:w-[80%] justify-center flex-col">
    <HrCasesList type="INDIVIDUAL" fetchUrl={`/api/admin/users/${id}/hrWarning`} />
  </div>;
}
export default User;
