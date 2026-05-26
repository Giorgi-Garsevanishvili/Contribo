"use client";

import RatingRecordsListVolunteer from "@/(components)/userComp/myRatingRecordsComps/RatingRecordsListVolunteer";
import { useParams } from "next/navigation";

function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
    <RatingRecordsListVolunteer fetchUrl={`/api/user/myRatingHistory`}/>
  </div>;
}
export default User;
