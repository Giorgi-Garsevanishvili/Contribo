"use client";

import FeedbacksListAdmin from "@/(components)/adminComp/eventFeedbacks/FeedbacksListAdmin";
import HrCasesList from "@/(components)/adminComp/users/hrCasesComps/HrCasesList";
import { useParams } from "next/navigation";

function hrCasePageAdmin() {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="flex items-center m-0 md:p-0 p-2 w-full md:w-[80%] justify-center flex-col">
      <FeedbacksListAdmin  fetchUrl={`/api/admin/eventFeedbacks`} />
    </div>
  );
}
export default hrCasePageAdmin;
