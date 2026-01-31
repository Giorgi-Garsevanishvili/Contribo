"use client";

import HrCasesList from "@/(components)/adminComp/users/hrCasesComps/HrCasesList";
import BackButton from "@/(components)/generalComp/BackButton";
import { useParams } from "next/navigation";

function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
    <BackButton />
    <HrCasesList id={id} />
  </div>;
}
export default User;
