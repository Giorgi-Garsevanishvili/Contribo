"use client";


import PositionHistoryListVolunteer from "@/(components)/userComp/myPositionHistoryComps/PositionHistoryListVolunteer";
import { useParams } from "next/navigation";

function User() {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
      <PositionHistoryListVolunteer fetchUrl={`/api/user/myPositionHistory`} />
    </div>
  );
}
export default User;
