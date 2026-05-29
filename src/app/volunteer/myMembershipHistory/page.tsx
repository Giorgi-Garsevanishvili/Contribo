"use client";


import MembershipListVolunteer from "@/(components)/userComp/myMembershipHistoryComps/MembershipLogListVolunteer";
import { useParams } from "next/navigation";

function User() {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="flex w-full items-center m-0 p-2 md:p-0 md:w-[80%] justify-center flex-col">
      <MembershipListVolunteer fetchUrl={`/api/user/myMembershipHistory`} />
    </div>
  );
}
export default User;
