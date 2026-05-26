"use client";

import HrCasesListVolunteer from "@/(components)/userComp/myHrCases/HrCasesListVolunteer";

function User() {
  return (
    <div className="flex w-full items-center m-0 p-0 justify-center flex-col">
      <HrCasesListVolunteer fetchUrl={`/api/user/myHrCases`} />
    </div>
  );
}
export default User;
