"use client";

import HrCasesListVolunteer from "@/(components)/userComp/myHrCases/HrCasesListVolunteer";

function User() {
  return (
    <div className="flex w-full items-center m-0 md:w-[80%] md:p-0 p-2 justify-center flex-col">
      <HrCasesListVolunteer fetchUrl={`/api/user/myHrCases`} />
    </div>
  );
}
export default User;
