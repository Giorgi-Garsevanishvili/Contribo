"use client";
import UsersList from "@/(components)/adminComp/users/UsersList";
import VolunteerStats from "@/(components)/adminComp/users/VolunteersStats";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

function Admin() {
  const route = useRouter();
  return (
    <>
      <div className="flex w-screen justify-center items-center">
        <button
          className="flex items-center border-1 justify-center btn p-2 text-center font-bold rounded-tr-md rounded-bl-md text-m bg-blue-950/70 text-white"
          onClick={() => route.back()}
        >
          <IoMdArrowRoundBack size={25} />
        </button>
        <h3 className=" bg-gray-900/65 p-2 rounded-lg text-white select-none border-b-2 border-white ">
          Members Statistics
        </h3>
      </div>
      <div className=" flex flex-col mt-4 items-center justify-center text-white ">
        <div className="flex flex-row items-center justify-center">
          <VolunteerStats />
        </div>
        <div>
          <UsersList />
        </div>
      </div>
    </>
  );
}
export default Admin;
