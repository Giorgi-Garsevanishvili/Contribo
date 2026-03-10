import React from "react";

function JoinRequestTitleBar() {
  return (
    <div className=" hidden md:grid font-bold text-sm grid-cols-[1fr_1fr_1fr_1fr_0.8fr] w-full gap-7  uppercase grid-rows-1 select-none justify-start items-center bg-gray-100/80 text-gray-700 p-1 px-3 m-1 rounded-lg">
      <h3 className="flex justify-start items-center">User</h3>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Region Requested</h3>
      </div>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Request Date</h3>
      </div>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Status</h3>
      </div>
      <div className="md:flex justify-center hidden">
        <h3 className="font-medium">Action</h3>
      </div>
    </div>
  );
}

export default JoinRequestTitleBar;
