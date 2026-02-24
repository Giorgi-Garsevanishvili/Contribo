"use client";
import UsersList from "@/(components)/adminComp/users/UsersList";
import VolunteerStats from "@/(components)/adminComp/users/VolunteersStats"
import BackButton from "@/(components)/generalComp/BackButton";


function UserList() {
  return (
    <>
      <div className="flex w-screen justify-center items-center">
        <h3 className=" bg-gray-900/65 p-2 rounded-lg text-white select-none border-b-2 border-white ">
          Members Statistics
        </h3>
      </div>
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
