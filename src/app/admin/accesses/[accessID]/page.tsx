"use client";

import SingleAccessInfo from "@/(components)/adminComp/accesses/SingleAccessInfo";
import { useParams } from "next/navigation";

function User() {
  const params = useParams();
  const id = params.accessID;
  
  return (
    <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
      <SingleAccessInfo id={id} />
    </div>
  );
}
export default User;
