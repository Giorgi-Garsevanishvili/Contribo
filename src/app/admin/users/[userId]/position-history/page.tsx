"use client";

import PositionHistoryList from "@/(components)/adminComp/users/positionHistoryComps/PositionHistoryList";
import { useParams } from "next/navigation";

function User() {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="flex w-full items-center m-0 p-2 md:p-0 md:w-[80%] justify-center flex-col">
      <PositionHistoryList fetchUrl={`/api/admin/users/${id}/positionHistory`} />
    </div>
  );
}
export default User;
