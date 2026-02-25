"use client";
import UsersList from "@/(components)/adminComp/users/UsersList";
import VolunteerStats from "@/(components)/adminComp/users/VolunteersStats";

function UserList() {
  return (
    <>
      <div className=" flex flex-col mt-4 items-center justify-center text-white ">
        <div className="flex flex-row items-center justify-center">
          <VolunteerStats />
        </div>
        <div className="flex items-center justify-center">
          <UsersList />
        </div>
      </div>
    </>
  );
}
export default UserList;
