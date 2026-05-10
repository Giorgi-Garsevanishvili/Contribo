import React from "react";
import AssignmentsModalComp from "./AssigmentsModalComp";
import RoleAvailabilityComp from "./RoleAvailabilityComp";
import EventCard from "./EventCard";

type EventData = {
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
  startTime: Date;
  endTime: Date;
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
  event: EventData;
}) {
  return (
    <div className="flex m-2 flex-col h-fit w-full items-start justify-between gap-4 p-2">
      <div className="flex h-full w-f">
        <EventCard event={event} parentRefetch={parentFetch} />
      </div>
      <div className="flex md:flex-row flex-col h-fit w-full items-start justify-between gap-3">
        <AssignmentsModalComp
          props={{ name: event.name, id: event.id }}
          parentRefetch={parentFetch}
        />
        <RoleAvailabilityComp
          props={{ name: event.name, id: event.id }}
          parentRefetch={parentFetch}
        />
      </div>
    </div>
  );
}

export default EventInfoModal;
