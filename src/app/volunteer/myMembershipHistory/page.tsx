"use client";


import MembershipListVolunteer from "@/(components)/userComp/myMembershipHistoryComps/MembershipLogListVolunteer";
import { useParams } from "next/navigation";

function User() {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
      <MembershipListVolunteer fetchUrl={`/api/user/myMembershipHistory`} />
    </div>
  );
}
export default User;
