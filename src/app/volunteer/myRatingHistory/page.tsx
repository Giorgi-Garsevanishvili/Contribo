"use client";

import RatingRecordsListVolunteer from "@/(components)/userComp/myRatingRecordsComps/RatingRecordsListVolunteer";
import { useParams } from "next/navigation";

function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex w-full items-center m-0 p-2 md:p-0 md:w-[80%] justify-center flex-col">
    <RatingRecordsListVolunteer fetchUrl={`/api/user/myRatingHistory`}/>
  </div>;
}
export default User;
