"use client";

import MembershipList from "@/(components)/adminComp/users/membershipLogComps/MembershipLogList";
import PositionHistoryList from "@/(components)/adminComp/users/positionHistoryComps/PositionHistoryList";
import { useParams } from "next/navigation";

function User() {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
      <MembershipList fetchUrl={`/api/admin/users/${id}/memberStatusLog`} />
    </div>
  );
}
export default User;
