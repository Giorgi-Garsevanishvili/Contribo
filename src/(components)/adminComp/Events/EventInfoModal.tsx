import React, { useEffect } from "react";
import RoleAvailabilityComp from "./RoleAvailabilityComp";
import EventCard from "./EventCard";
import AssignmentsModalComp from "./AssignmentsModalComp";
import EventDetails from "./EventDetails";
import { useFetchData } from "@/hooks/useDataFetch";
import usePaginatedData from "@/hooks/usePaginatedData";

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
  description: string | null
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

function EventInfoModal({
  event,
  parentFetch,
}: {
  parentFetch: () => void;
  event: EventDataType;
}) {
  const { data, isLoading, refetch } = usePaginatedData<EventDataType | null>(
    `/api/admin/events/${event.id}`,
    null,
    null,
  );
  useEffect(() => {
    parentFetch();
  }, [refetch]);

  return (
    <div className="flex m-2 flex-col h-fit w-full items-start justify-between gap-4 p-2">
      <div className="flex h-fit w-full w-f">
        <EventDetails
          isLoading={isLoading}
          event={data}
          parentRefetch={refetch}
        />
      </div>
      <div className="flex md:flex-row flex-col h-fit w-full items-start justify-between gap-3">
        <AssignmentsModalComp
          props={{ name: event.name, id: event.id }}
          parentRefetch={refetch}
        />
        <RoleAvailabilityComp
          props={{ name: event.name, id: event.id }}
          parentRefetch={refetch}
        />
      </div>
    </div>
  );
}

export default EventInfoModal;
