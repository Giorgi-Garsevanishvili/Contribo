import React from "react";

function LoadingCard() {
  return (
    <div className="mx-auto bg-white md:w-200 w-full rounded-md border">
      <div className="flex relative animate-pulse items-center space-x-2">
        <div className="h-30 w-30 rounded-sm bg-gray-200"></div>
        <div className="flex-1  items-center space-y-2 gap-2 ">
          <div className="flex justify-between items-center p-1 w-full">
            <div className="w-25 h-2 rounded bg-gray-200"></div>
            <div className="h-7 row-span-1 w-20 rounded-sm bg-gray-200"></div>
          </div>
          <div className="space-y-2 p-2">
            <div className="h-2 rounded bg-gray-200"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-200"></div>
              <div className="col-span-1 h-2 rounded bg-gray-200"></div>
            </div>
            <div className="h-2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingCard;
