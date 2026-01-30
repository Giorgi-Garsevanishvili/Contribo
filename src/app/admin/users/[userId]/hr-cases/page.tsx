"use client";

import HrCasesList from "@/(components)/adminComp/users/hrCasesComps/HrCasesList";
import { useParams } from "next/navigation";

function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex flex-col">
    <HrCasesList id={id} />
  </div>;
}
export default User;
