"use client";

import EventsList from "@/(components)/adminComp/Events/EventsList";

function UserList() {
  return (
    <div className="flex w-full md:w-[80%] items-center m-0 md:p-0 p-2 justify-center flex-col">
      <EventsList />
    </div>
  );
}
export default UserList;
