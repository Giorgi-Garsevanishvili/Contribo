"use client";
import { FaCalendarAlt } from "react-icons/fa";
import { EventLocationDisplay } from "@/lib/EventLocationDisplay";
import { IoIosTime } from "react-icons/io";
import { TbUserCheck, TbUserSearch } from "react-icons/tb";
import { Loader } from "lucide-react";
import { BiSolidDetail } from "react-icons/bi";
import StatusDisplay from "@/(components)/generalComp/StatusDisplay";
import UserSmallDisplay from "@/(components)/adminComp/users/UserSmallDisplay";
import AvailabilityDisplayVolunteer from "./AvailabilityDisplayVolunteer";
import usePaginatedData from "@/hooks/usePaginatedData";
import { AssignmentStatus } from "@/generated/enums";
import { use, useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";
import axios from "axios";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { useSession } from "next-auth/react";

type AvailabilityDataReturn = {
  taken: boolean;
  totalCapacity: number;
  activeCount: number;
  available: number;
  role: {
    name: string;
  };
  event: {
    name: string;
    region: {
      name: string;
    } | null;
    finalizedAt: Date | null;
  };
  updatedBy: {
    name: string | null;
  } | null;
  availabilityEntries: {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    status: AssignmentStatus;
  }[];
  _count: {
    availabilityEntries: number;
  };
  CreatedBy: {
    name: string | null;
  } | null;
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  updatedById: string | null;
  roleId: string;
  ratingScore: number;
  eventId: string;
  totalSlots: number;
  published: boolean;
  validFrom: Date | null;
  validTo: Date | null;
  createdById: string | null;
};

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
  startTime: string;
  description: string | null;
  endTime: string;
  rating: number | null;
  assignments: {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
    role: {
      name: string;
    } | null;
    comment: string | null;
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

function EventDetailsVolunteer({
  event,
  isLoading,
}: {
  event: EventDataType | null;
  isLoading: boolean;
}) {
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const session = useSession();

  const takenSlots =
    event?.availabilities.reduce(
      (acc, curr) => acc + curr._count.availabilityEntries,
      0,
    ) || 0;
  const totalAvailableSlots =
    event?.availabilities.reduce((acc, curr) => acc + curr.totalSlots, 0) || 0;

  const {
    data,
    isLoading: AvailabilitiesLoad,
    refetch,
  } = usePaginatedData<AvailabilityDataReturn[] | null>(
    `/api/user/events/${event?.id}/availabilitySlots`,
    [],
    null,
  );

  const handleSpotTake = async ({
    e,
    ratingScore,
    slotId,
  }: {
    e: React.MouseEvent<HTMLButtonElement>;
    ratingScore: number;
    slotId: string;
  }) => {
    try {
      e.preventDefault();
      setIsLoadingCreate(true);

      const response = await axios.post(
        `/api/user/events/${event?.id}/availabilityEntries`,
        { slotId: slotId, ratingScore: ratingScore },
      );
      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });

      if (refetch) {
        refetch();
      }
    } catch (error) {
      const message = getClientErrorMessage(error);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleSpotCancel = async ({
    e,
    slotId,
  }: {
    e: React.MouseEvent<HTMLButtonElement>;
    slotId: string;
  }) => {
    try {
      e.preventDefault();
      setIsLoadingCreate(true);

      const response = await axios.delete(
        `/api/user/events/${event?.id}/availabilityEntries`,
        {
          data: {
            slotId,
          },
        },
      );
      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });

      if (refetch) {
        refetch();
      }
    } catch (error) {
      const message = getClientErrorMessage(error);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      setIsLoadingCreate(false);
    }
  };

  return isLoading || isLoadingCreate ? (
    <div className="flex w-full h-full items-center justify-center">
      <Loader
        className="right-3 top-2.5 animate-spin text-gray-200"
        size={40}
      />
    </div>
  ) : event ? (
    <div className="flex w-full flex-col items-center justify-start border border-gray-400/30 rounded-md bg-cyan-900 p-2 gap-5">
      <div className="flex items-start  md:justify-end w-full  py-1  justify-between gap-3">
        <div className="bg-white w-fit h-fit rounded-md">
          <StatusDisplay status={event.status} />
        </div>
      </div>
      <div
        className={`flex w-full flex-col items-center justify-between gap-5 px-2`}
      >
        <div className="flex items-start flex-col md:flex-row  md:justify-end w-full  py-1  justify-between gap-4">
          <div className="flex md:grow w-full md:w-fit h-full gap-4">
            <div className="flex items-center justify-between bg-white rounded-md overflow-hidden shadow shadow-gray-500/30 h-full w-25 shrink-0 flex-col">
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
            <div className="flex justify-center truncate items-start h-full w-fit flex-col gap-1">
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
            </div>
          </div>
          <div className="flex gap-2 items-center text-center w-full bg-cyan-800/80 h-full rounded-md border border-orange-300 p-2 grow">
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
      <div className="flex grow w-full flex-col shrink-0 md:flex-row gap-3 rounded-md bg-gray-400/40 p-2">
        <div className="flex grow md:min-w-80 rounded-md border p-2 bg-gray-800/50 border-orange-300 shrink-0 gap-2  justify-start flex-col">
          <h3 className="text-lg text-cyan-100">Assignments:</h3>
          {event.assignments.length > 0 ? (
            event.assignments.map((user, index) => {
              return (
                user.user && (
                  <div
                    className="flex w-full flex-col bg-cyan-900 rounded-md gap-2 p-2"
                    key={`${user.user.id}${index}`}
                  >
                    <div className="flex items-center justify-start gap-2">
                      <UserSmallDisplay
                        user={{
                          name: `${user.user.name?.slice(0, 20)}...`,
                          image: user.user.image,
                        }}
                      />
                      <h3 className="text-green-500">{user.role?.name}</h3>
                    </div>
                    {user.user.id === session.data?.user.userId && (
                      <div className="border-t flex gap-2 flex-col py-2 border-gray-500/60">
                        <label
                          htmlFor="event_role"
                          className="text-xs w-fit uppercase text-gray-200"
                        >
                          Comment
                        </label>
                        <h5 className="w-full items-center rounded-md p-2 text-sm justify-center text-start border border-yellow-500/60 ">
                          {user.comment}
                        </h5>
                      </div>
                    )}
                  </div>
                )
              );
            })
          ) : (
            <h3 className="text-md text-gray-300">No Assignments To Display</h3>
          )}
        </div>
        <div className="flex justify-start grow flex-wrap gap-1">
          {AvailabilitiesLoad ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader
                className="right-3 top-2.5 animate-spin text-gray-200"
                size={40}
              />
            </div>
          ) : (
            data &&
            data.map((avv) => (
              <div key={avv.id} className="flex flex-wrap w-80">
                <AvailabilityDisplayVolunteer
                  taken={avv.taken}
                  key={avv.id}
                  eventStatus={event.status}
                  handleClaim={({ e, slotId, ratingScore }) =>
                    handleSpotTake({
                      e,
                      slotId: slotId,
                      ratingScore: ratingScore,
                    })
                  }
                  handleCancel={({ e, slotId }) =>
                    handleSpotCancel({
                      e,
                      slotId: slotId,
                    })
                  }
                  availabilities={avv}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default EventDetailsVolunteer;
