"use client";
import { FaCalendarAlt } from "react-icons/fa";
import { EventLocationDisplay } from "@/lib/EventLocationDisplay";
import { IoIosTime } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";
import { useModal } from "../../../../context/ModalContext";
import { TbPencilOff, TbUserCheck, TbUserSearch } from "react-icons/tb";
import { Loader } from "lucide-react";
import { useRef, useState } from "react";
import EventCreateModal from "./EventCreateModal";
import EventUpdate from "./EventUpdate";
import { BiSolidDetail } from "react-icons/bi";
import StatusDisplay from "@/(components)/generalComp/StatusDisplay";
import { FiRefreshCw } from "react-icons/fi";
import { FaFlagCheckered } from "react-icons/fa6";
import { responseLogOut } from "@/lib/ResponseLogOut";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import axios from "axios";
import { useConfirmTab } from "@/hooks/useConfirmTab";
import { useCompAlert } from "@/hooks/useCompAlert";

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
  finalizedAt: string | null;
  startTime: string;
  description: string | null;
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

function EventDetails({
  event,
  parentRefetch,
  isLoading,
}: {
  event: EventDataType | null;
  isLoading: boolean;
  parentRefetch: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const { closeModal } = useModal();

  const [isLoadingFinalize, setIsLoadingFinalize] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const { ask } = useConfirmTab();

  const HandleFinalize = async () => {
    try {
      setIsLoadingFinalize(true);

      const confirmed = await ask({
        title: `Would You Like To Finalize Event:`,
        value: `${event?.name}`,
        message: `This Action Will Assigns Predefined Availability And Availability Scores to all volunteers and will request feedbacks from them`,
      });

      if (!confirmed) {
        setIsLoadingFinalize(false);
        return;
      }
      const response = await axios.post(
        `/api/admin/events/${event?.id}/finalize`,
      );

      triggerCompAlertRef.current({
        message: response.data.message,
        type: "success",
        isOpened: true,
      });

      const signOutReq = response.data.requiresSignOut === true;
      if (signOutReq) {
        responseLogOut({ signOutReq: signOutReq });
      }

      parentRefetch();
      setIsLoadingFinalize(false);
    } catch (error) {
      setIsLoadingFinalize(false);

      const message = getClientErrorMessage(error);

      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });

      responseLogOut({ message: message });
    }
  };

  const handleDelete = () => {
    parentRefetch();
    closeModal();
  };

  const takenSlots =
    event?.availabilities.reduce(
      (acc, curr) => acc + curr._count.availabilityEntries,
      0,
    ) || 0;
  const totalAvailableSlots =
    event?.availabilities.reduce((acc, curr) => acc + curr.totalSlots, 0) || 0;

  return isLoading || isLoadingFinalize ? (
    <div className="flex w-full h-full items-center justify-center">
      <Loader
        className="right-3 top-2.5 animate-spin text-gray-200"
        size={40}
      />
    </div>
  ) : event ? (
    <div className="flex w-full flex-col items-center justify-start border border-gray-400/30 rounded-md bg-cyan-900 p-1.5 gap-5">
      <div className="flex items-start  md:justify-end w-full  py-1  justify-between gap-3">
        <div className="bg-white w-fit h-fit rounded-md">
          <StatusDisplay status={event.status} />
        </div>
        <div className="flex gap-2 w-fit not-visited: items-center justify-center">
          <button
            disabled={event.finalizedAt !== null}
            onClick={() => setEditOpen(!editOpen)}
            type="button"
            className="cursor-pointer disabled:opacity-20 hover:text-orange-400 transition-all duration-300 ease-out p-1 bg-cyan-600/60 rounded-md"
          >
            {editOpen ? <TbPencilOff size={20} /> : <MdOutlineEdit size={20} />}
          </button>
          <button
            onClick={parentRefetch}
            type="button"
            className="cursor-pointer hover:text-yellow-400 transition-all duration-300 ease-out p-1 bg-cyan-600/60 rounded-md"
          >
            <FiRefreshCw size={20} />
          </button>
          <button
            disabled={
              event.status === "LIVE" ||
              event.status === "UPCOMING" ||
              event.finalizedAt !== null
            }
            onClick={HandleFinalize}
            type="button"
            className="cursor-pointer disabled:opacity-20 hover:text-green-500 transition-all duration-300 ease-out p-1 bg-cyan-600/60 rounded-md"
          >
            <FaFlagCheckered size={20} />
          </button>
          <DeleteButtonAdmin
            url={`/api/admin/events/${event.id}`}
            value={`Event: ${event.name}`}
            styleClass="w-fit items-center justify-center p-1 bg-cyan-600/60 rounded-md p-0 m-0 h-fit text-gray-200 hover:text-red-400"
            message="This Action will delete Event with all user related event"
            fetchAction={handleDelete}
          />
        </div>
      </div>
      <div className={`${editOpen ? "flex" : "hidden"} w-full`}>
        <EventUpdate
          setEditOpen={setEditOpen}
          parentRefetch={parentRefetch}
          event={event}
        />
      </div>
      <div
        className={`${editOpen ? "hidden" : "flex"} w-full flex-col items-center justify-between gap-5 `}
      >
        <div className="flex items-start flex-col h-fit md:flex-row  md:justify-end w-full  py-1  justify-between gap-3">
          <div className="flex w-full relative flex-col md:flex-row h-fit gap-4">
            <div className="flex items-center md:w-25 justify-between bg-white rounded-md overflow-hidden shadow shadow-gray-500/30 grow flex-col">
              <p className="text-md p-1 h-[35%]  flex-col w-full flex items-center font-semibold justify-center text-white bg-blue-900">
                {new Date(event.startTime).toLocaleString("en-US", {
                  month: "short",
                })}
              </p>
              <p className="text-black font-bold p-1 h-full flex items-center w-fit text-4xl">
                {" "}
                {new Date(event.startTime).getDate()}
              </p>
            </div>
            <div className="flex justify-center truncate items-start h-fit w-full flex-col gap-1">
              <h1 className="text-2xl font-semibold">{event.name}</h1>
              <div className="flex gap-2 items-center text-center w-fit h-fit">
                <div>
                  <IoIosTime size={15} />
                </div>
                <h5 className="truncate">{`${new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}</h5>
              </div>
              <div className="flex gap-2 items-center text-center w-fit h-fit">
                <div className="text-gray-200">
                  <FaCalendarAlt size={15} />
                </div>
                <h5 className="truncate text-gray-200">{`${new Date(event.startTime).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} - ${new Date(event.endTime).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`}</h5>
              </div>

              <div className="flex gap-2 items-center text-center w-fit h-fit">
                <div className="text-gray-200">
                  <FaFlagCheckered size={15} />
                </div>
                {event.finalizedAt ? (
                  <div className="flex items-start flex-row justify-between gap-2">
                    <h2 className="font-bold text-green-300">Finalized At:</h2>
                    <h5 className="truncate text-gray-200">{`${new Date(event.finalizedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`}</h5>
                  </div>
                ) : (
                  "Not Finalized"
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-col items-center text-center w-full bg-cyan-800/80 h-full rounded-md border border-orange-300 p-2 grow">
            <BiSolidDetail size={15} />
            {event.description || "Description is not provided"}
          </div>
          <div className="flex shrink-0 gap-2 w-full md:w-fit">
            <div className="flex bg-green-600/30 rounded-md px-2 py-1 flex-col w-fit grow h-full gap-2">
              <div className="flex gap-2 text-xl items-center justify-start">
                <TbUserCheck className="text-green-500" size={30} />
                {event.assignments.length}
              </div>
              <h3>Assignments</h3>
            </div>
            <div className="flex bg-cyan-600/30 rounded-md px-2 py-1 flex-col w-fit grow h-full gap-2">
              <div className="flex gap-2 text-xl items-center justify-start">
                <TbUserSearch className="text-cyan-500" size={30} />
                {totalAvailableSlots - takenSlots}
              </div>
              <h3>Personnel Required</h3>
            </div>
          </div>
        </div>
        <div className="flex w-full rounded-md bg-gray-400/40 p-2">
          <EventLocationDisplay location={event.location} />
        </div>
      </div>
    </div>
  ) : null;
}

export default EventDetails;
