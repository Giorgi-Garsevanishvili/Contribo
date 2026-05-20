import { useEffect } from "react";
import usePaginatedData from "@/hooks/usePaginatedData";
import EventDetailsVolunteer from "./EventDetailsVolunteer";

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

function EventInfoModalVolunteer({
  event,
  parentFetch,
}: {
  parentFetch: () => void;
  event: EventDataType;
}) {
  const { data, isLoading, refetch } = usePaginatedData<EventDataType | null>(
    `/api/user/events/${event.id}`,
    null,
    null,
  );
  // useEffect(() => {
  //   parentFetch();
  // }, [refetch]);

  return (
    <div className="flex m-2 flex-col h-fit w-full items-start justify-between gap-4 p-2">
      <div className="flex h-fit w-full w-f">
        <EventDetailsVolunteer
          isLoading={isLoading}
          event={data}
        />
      </div>
    </div>
  );
}

export default EventInfoModalVolunteer;
