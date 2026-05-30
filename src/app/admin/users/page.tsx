"use client";

import UsersList from "@/(components)/adminComp/users/usersComps/UsersList";

function UserList() {
  return (
    <>
      <div className=" flex flex-col mt-4 items-center justify-center text-white ">
        <div className="flex items-center justify-center">
          <UsersList />
        </div>
      </div>
    </>
  );
}
export default UserList;
