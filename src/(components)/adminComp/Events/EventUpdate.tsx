"use client";

import { useCompAlert } from "@/hooks/useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { EventLocationDisplay } from "@/lib/EventLocationDisplay";
import LocationSearch from "@/lib/LocationSearch";
import axios from "axios";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { RxUpdate } from "react-icons/rx";

type EventDataType = {
  status: "LIVE" | "ENDED" | "UPCOMING";
  id: string;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
  } | null;
  updatedBy: {
    name: string | null;
  } | null;
  name: string;
  location: string;
  description: string | null;
  startTime: string;
  endTime: string;
  rating: number | null;
  assignments: {
    user: {
      name: string | null;
      image: string | null;
    } | null;
    role: {
      name: string;
    } | null;
  }[];
  availabilities: {
    _count: {
      availabilityEntries: number;
    };
    role: {
      name: string;
    };
    availabilityEntries: {
      user: {
        name: string | null;
        image: string | null;
      };
    }[];
    totalSlots: number;
  }[];
};

interface UpdateEventForm {
  name?: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
}

function EventUpdate({
  event,
  parentRefetch,
  setEditOpen
}: {
  event: EventDataType;
  parentRefetch: () => void;
  setEditOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [formData, setFormData] = useState<UpdateEventForm>({});
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (location: string): void => {
    setFormData((prev) => ({
      ...prev,
      location,
    }));
  };

  const handleEventSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (Object.values(formData).length === 0) {
        throw new Error("All Fields Must be provided");
      }

      const response = await axios.put(
        `/api/admin/events/${event.id}`,
        formData,
      );
      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });
      setFormData({});
      parentRefetch();
      setEditOpen(false)
    } catch (error) {
      const message = getClientErrorMessage(error);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => handleEventSubmit(e)}
      className="w-full transition-all duration-300 ease-out gap-2 flex items-start justify-start flex-col"
    >
      <div className="flex mb-2 text-cyan-300 items-center justify-center gap-2 w-fit">
        <RxUpdate size={18} />
        <p className=" uppercase">Event Update</p>
      </div>
      <div className="flex w-full">
        <label
          htmlFor="event_name"
          className="flex gap-1 w-full flex-col items-start justify-start"
        >
          <h2 className="uppercase text-xs text-gray-200">Event Name</h2>
          <input
            id="event_name"
            value={formData.name}
            name="event_name"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            type="text"
            className="bg-gray-800 ring-1 ring-gray-700 outline-0 p-2 w-full rounded-xs"
            placeholder={event.name || "e.g. Welcome Party 2026"}
          />
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-5 text-gray-200 w-full justify-between  mt-5">
        <div className="flex w-full">
          <label
            htmlFor="event_start"
            className="flex gap-1 w-full flex-col items-start justify-start"
          >
            <h2 className="uppercase text-xs">
              Start Time -{" "}
              {new Date(event.startTime).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <input
              id="event_start"
              type="datetime-local"
              name="event_start"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startTime: e.target.value,
                }))
              }
              className="bg-gray-800 ring-1 ring-gray-700 accent-gray-200  outline-0 p-2 w-full rounded-xs"
              placeholder={"e.g. Welcome Party 2026"}
            />
          </label>
        </div>
        <div className="flex w-full">
          <label
            htmlFor="event_end"
            className="flex gap-1 w-full flex-col items-start justify-start"
          >
            <h2 className="uppercase text-xs">
              End Time -{" "}
              {new Date(event.endTime).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <input
              id="event_end"
              type="datetime-local"
              name="event_end"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  endTime: e.target.value,
                }))
              }
              className="bg-gray-800 ring-1 ring-gray-700  outline-0 p-2 w-full rounded-xs"
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
            <h2 className="uppercase text-xs text-gray-200">
              Location - {`${event.location || ""}`}
            </h2>
            <LocationSearch onLocationSelect={handleLocationSelect} />
            {formData.location && (
              <div className="mt-3 p-3 w-full bg-gray-800 ring-1 ring-gray-700  rounded-xs text-gray-200">
                <EventLocationDisplay location={formData.location} />
              </div>
            )}
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
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="bg-gray-800 ring-1 ring-gray-700  outline-0 p-2 text-wrap w-full h-20 rounded-xs"
              placeholder={
                event.description || "Provide Extra Information if necessary"
              }
            />
          </label>
        </div>
      </div>
      <div className="flex bg-gray-900/50 rounded-sm mt-3 border-t items-center justify-between p-3 border-gray-300/40 w-full h-">
        <p className="text-sm md:flex hidden text-gray-400 capitalize">
          Event Update
        </p>
        <div className="flex md:flex-row md:w-fit w-full flex-col justify-center items-center gap-2 ">
          {/* <button
            onClick={handleCancel}
            type="button"
            className="p-2 w-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-gray-600 rounded-sm"
          >
            Cancel Process
          </button> */}
          <button
            type="submit"
            disabled={isLoading || Object.values(formData).length === 0}
            className={`p-2 w btn m-0 bg-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-cyan-700 rounded-sm`}
          >
            {isLoading ? (
              <Loader
                className="right-3 top-2.5 animate-spin text-gray-200"
                size={20}
              />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default EventUpdate;
