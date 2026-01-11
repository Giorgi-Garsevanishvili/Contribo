"use client";
import VolunteerStats from "@/(components)/adminComp/users/VolunteersStats";
import { useRouter } from "next/navigation";

function Admin() {
  const route = useRouter();
  return (
    <div>
      <div className="flex justify-center items-center">
        <button
          className="flex items-center justify-center btn w-full h-full text-center font-bold rounded-tr-md rounded-bl-md text-m bg-blue-950/70 text-white"
          onClick={() => route.back()}
        >
          Back To Admin
        </button>
      </div>
      <div className=" flex flex-col mt-4 items-center justify-center text-white ">
        <h3 className="bg-gray-900/65 p-2 mb-3 rounded-lg select-none border-b-2 border-white ">Members Statistics</h3>
        <div className="flex flex-row items-center justify-center">
          <VolunteerStats />
        </div>
      </div>
    </div>
  );
}
export default Admin;
