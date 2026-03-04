"use client";

import AccessList from "@/(components)/adminComp/accesses/AccessList";
import { useParams } from "next/navigation";

function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
    <AccessList />
  </div>;
}
export default User;
