"use client";
import { useCompAlert } from "@/hooks/useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { EventLocationDisplay } from "@/lib/EventLocationDisplay";
import LocationSearch from "@/lib/LocationSearch";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRef, useState } from "react";
import { IoPricetags } from "react-icons/io5";
import { useModal } from "../../../../context/ModalContext";

//     name: string;
//     location: string;
//     startTime: Date;
//     endTime: Date;
//     description: string;
//     createdById: string;
//     regionId: string;
//     finalizedAt?: string | undefined;

interface CreateEventFormData {
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
}

const emptyForm = {
  name: "",
  description: "",
  location: "",
  startTime: "",
  endTime: "",
};

function EventCreateModal() {
  const [formData, setFormData] = useState<CreateEventFormData>(emptyForm);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useModal();

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
      const response = await axios.post("/api/admin/events", formData);
      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });
      setFormData(emptyForm);

      openModal(
        "Event Details",
        `${response.data.data.name}`,
        <div className="">Here We Are: {response.data.data.id}</div>,
      );
    } catch (error) {
      const message = getClientErrorMessage(error);
      console.log(error);

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
    <>
      <form
        onSubmit={(e) => handleEventSubmit(e)}
        className="w-full gap-2 flex items-start justify-start flex-col"
      >
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
              value={formData.name}
              name="event_name"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              type="text"
              className="bg-gray-800 ring-1 ring-gray-700 outline-0 p-2 w-full rounded-xs"
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
                name="event_start"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="bg-gray-800 ring-1 ring-gray-700 accent-gray-200  outline-0 p-2 w-full rounded-xs"
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
              <h2 className="uppercase text-xs text-gray-200">Location</h2>
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="bg-gray-800 ring-1 ring-gray-700  outline-0 p-2 text-wrap w-full h-20 rounded-xs"
                placeholder="Provide Extra Information if necessary"
              />
            </label>
          </div>
        </div>
        <div className="flex bg-gray-900/50 rounded-sm mt-3 border-t items-center justify-between p-3 border-gray-300/40 w-full h-">
          <p className="text-sm md:flex hidden text-gray-400 capitalize">
            general Information
          </p>
          <div className="flex md:flex-row md:w-fit w-full flex-col justify-center items-center gap-2 ">
            <button className="p-2 w-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-gray-600 rounded-sm">
              Cancel Process
            </button>
            <button
              type="submit"
              disabled={
                isLoading || Object.values(formData).some((e) => e === "")
              }
              className={`p-2 w-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-cyan-700 rounded-sm`}
            >
              {isLoading ? (
                <Loader
                  className="right-3 top-2.5 animate-spin text-gray-200"
                  size={20}
                />
              ) : (
                "Deploy and Continue"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default EventCreateModal;
