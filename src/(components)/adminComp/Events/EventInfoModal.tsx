import { useEffect } from "react";
import RoleAvailabilityComp from "./RoleAvailabilityComp";
import AssignmentsModalComp from "./AssignmentsModalComp";
import EventDetails from "./EventDetails";
import usePaginatedData from "@/hooks/usePaginatedData";
import { FeedbackRequestStatus } from "@/generated/enums";
import FeedbacksCardAdminInEvent from "../eventFeedbacks/FeedbacksCardAdminInEvent";

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
  finalizedAt: string | null;
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

type FeedbackDataType = {
  id: string;
  userId: string | null;
  user: {
    name: string | null;
  } | null;
  eventId: string;
  requestStatus: FeedbackRequestStatus;
  requestedAt: Date;
  respondedAt: Date | null;
  responded: boolean;
  feedback: string | null;
  rating: number | null;
  event: {
    name: string;
  };
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
  const {
    data: feedbacks,
    isLoading: isLoadingFeedback,
    refetch: refetchFeedbacks,
  } = usePaginatedData<FeedbackDataType[] | null>(
    `/api/admin/events/${event.id}/eventFeedbacks`,
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
          eventEnd={event.endTime}
          eventStart={event.startTime}
          props={{
            name: event.name,
            id: event.id,
            finalized: data?.finalizedAt || null,
          }}
          parentRefetch={refetch}
        />
        <RoleAvailabilityComp
          props={{
            eventEnd: event.endTime,
            eventStart: event.startTime,
            name: event.name,
            id: event.id,
            finalized: data?.finalizedAt || null,
          }}
          parentRefetch={refetch}
        />
      </div>
      {feedbacks && feedbacks.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          {feedbacks?.map((feedback) => (
            <FeedbacksCardAdminInEvent
              key={feedback.id}
              parentRefetch={refetch}
              feedbackData={feedback}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventInfoModal;
