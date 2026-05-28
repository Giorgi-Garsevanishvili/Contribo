"use client";

import FeedbacksListVolunteer from "@/(components)/userComp/eventFeedbacks/FeedbacksListVolunteer";
import RatingRecordsListVolunteer from "@/(components)/userComp/myRatingRecordsComps/RatingRecordsListVolunteer";
import { useParams } from "next/navigation";

function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex w-full items-center m-0 md:p-0 p-2 justify-center flex-col">
    <FeedbacksListVolunteer fetchUrl={`/api/user/eventFeedbacks`}/>
  </div>;
}
export default User;
