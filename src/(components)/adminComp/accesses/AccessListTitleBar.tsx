import React from "react";

function AccessListTitleBar() {
  return (
    <div className=" hidden md:grid font-bold text-sm grid-cols-[1fr_1fr_1fr_1fr_1fr_0.35fr_0.35fr] w-full  uppercase grid-rows-1 select-none justify-start items-center bg-gray-100/80 text-gray-700 p-1 px-3 m-1 rounded-lg">
      <h3 className="flex justify-start items-center">Name & Email</h3>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Region</h3>
      </div>
      <div className="md:flex hidden">
        <h3 className="font-medium">Role</h3>
      </div>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Admin Access</h3>
      </div>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Restrict Access</h3>
      </div>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Kick</h3>
      </div>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Delete</h3>
      </div>
    </div>
  );
}

export default AccessListTitleBar;
