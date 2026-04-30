import React from "react";
import { IoPricetags } from "react-icons/io5";

// name: string;
//     location: string;
//     startTime: Date;
//     endTime: Date;
//     description: string;
//     createdById: string;
//     regionId: string;
//     finalizedAt?: string | undefined;

function EventCreateModal() {
  return (
    <>
      <form className="w-full gap-2 flex items-start justify-start flex-col">
        <div className="flex mb-2 text-cyan-300 items-center justify-center gap-2 w-fit">
          <IoPricetags size={18} />
          <p className=" uppercase">General Information</p>
        </div>
        <div className="flex w-full">
          <label
            htmlFor="event_name"
            className="flex gap-1 w-full flex-col items-start justify-start"
          >
            <h2 className="uppercase text-xs text-gray-200">Event Name</h2>
            <input
              id="event_name"
              type="text"
              className="bg-gray-800 outline-0 p-2 w-full rounded-xs"
              placeholder="e.g. Welcome Party 2026"
            />
          </label>
        </div>
        <div className="flex flex-col md:flex-row gap-5 text-gray-200 w-full justify-between  mt-5">
          <div className="flex w-full">
            <label
              htmlFor="event_start"
              className="flex gap-1 w-full flex-col items-start justify-start"
            >
              <h2 className="uppercase text-xs">Start Time</h2>
              <input
                id="event_start"
                type="datetime-local"
                className="bg-gray-800 accent-gray-200  outline-0 p-2 w-full rounded-xs"
                placeholder="e.g. Welcome Party 2026"
              />
            </label>
          </div>
          <div className="flex w-full">
            <label
              htmlFor="event_end"
              className="flex gap-1 w-full flex-col items-start justify-start"
            >
              <h2 className="uppercase text-xs">End Time</h2>
              <input
                id="event_end"
                type="datetime-local"
                className="bg-gray-800  outline-0 p-2 w-full rounded-xs"
                placeholder="e.g. Welcome Party 2026"
              />
            </label>
          </div>
        </div>
        <div className="w-full gap-3 mt-4 flex flex-col ">
          <div className="flex w-full">
            <label
              htmlFor="event_location"
              className="flex gap-1 w-full flex-col items-start justify-start"
            >
              <h2 className="uppercase text-xs text-gray-200">Location</h2>
              <input
                id="event_location"
                type="text"
                className="bg-gray-800 outline-0 p-2 w-full rounded-xs"
                placeholder="e.g. Welcome Party 2026"
              />
            </label>
          </div>
          <div className="flex w-full">
            <label
              htmlFor="event_description"
              className="flex gap-1 w-full flex-col items-start justify-start"
            >
              <h2 className="uppercase text-xs text-gray-200">Description</h2>
              <textarea
                id="event_description"
                className="bg-gray-800  outline-0 p-2 text-wrap w-full h-20 rounded-xs"
                placeholder="Provide Extra Information if necessary"
              />
            </label>
          </div>
        </div>
      </form>
      <div className="flex bg-gray-900/50 rounded-sm mt-3 border-t items-center justify-between p-3 border-gray-300/40 w-full h-">
        <p className="text-sm md:flex hidden text-gray-400 capitalize">
          general Information
        </p>
        <div className="flex md:flex-row md:w-fit w-full flex-col justify-center items-center gap-2 ">
          <button className="p-2 w-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-gray-600 rounded-sm">
            Cancel Process
          </button>
          <button className="p-2 w-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-cyan-700 rounded-sm">
            Deploy and Continue
          </button>
        </div>
      </div>
    </>
  );
}

export default EventCreateModal;
