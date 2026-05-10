"use client";

import EventsList from "@/(components)/adminComp/Events/EventsList";

function UserList() {
  return (
    <>
      <div className=" flex flex-col mt-2 items-center justify-center ">
        <div className="flex items-center flex-col justify-center">
          <EventsList />
        </div>
      </div>
    </>
  );
}
export default UserList;
