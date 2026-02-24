"use client";

import RatingRecordsList from "@/(components)/adminComp/users/ratingRecordsComps/RatingRecordsList";
import BackButton from "@/(components)/generalComp/BackButton";
import { useParams } from "next/navigation";

function User() {
  const params = useParams()
  const id = params.userId
  return <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
    <RatingRecordsList fetchUrl={`/api/admin/users/${id}/ratingHistory`}/>
  </div>;
}
export default User;
