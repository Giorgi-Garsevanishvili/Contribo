"use client";

import EventsList from "@/(components)/adminComp/Events/EventsList";
import UsersList from "@/(components)/adminComp/users/usersComps/UsersList";
import VolunteerStats from "@/(components)/adminComp/users/VolunteersStats";

function UserList() {
  return (
    <>
      <div className=" flex flex-col mt-4 items-center justify-center text-white ">
        <div className="flex items-center justify-center">
          <EventsList />
        </div>
      </div>
    </>
  );
}
export default UserList;
