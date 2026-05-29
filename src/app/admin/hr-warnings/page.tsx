"use client";

import HrCasesList from "@/(components)/adminComp/users/hrCasesComps/HrCasesList";
import { useParams } from "next/navigation";

function hrCasePageAdmin() {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="flex items-center m-0 md:p-0 p-2 w-full md:w-[80%] justify-center flex-col">
      <HrCasesList type="GLOBAL" fetchUrl={`/api/admin/hrWarnings`} />
    </div>
  );
}
export default hrCasePageAdmin;
