import usePaginatedData from "@/hooks/usePaginatedData";
import EventDetailsVolunteer from "./EventDetailsVolunteer";
import { FeedbackRequestStatus } from "@/generated/enums";
import FeedbacksCardVolunteer from "../eventFeedbacks/FeedbacksCardVolunteer";
import FeedbacksCardVolunteerInEvent from "../eventFeedbacks/FeedbacksCardVolunteerInEvent";
import { useSession } from "next-auth/react";

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

function EventInfoModalVolunteer({ event }: { event: EventDataType }) {
  const session = useSession();
  const { data, isLoading, refetch } = usePaginatedData<EventDataType | null>(
    `/api/user/events/${event.id}`,
    null,
    null,
  );

  const {
    data: feedbacks,
    isLoading: isLoadingFeedback,
    refetch: refetchFeedbacks,
  } = usePaginatedData<FeedbackDataType[] | null>(
    `/api/user/events/${event.id}/eventFeedbacks`,
    null,
    null,
  );

  return (
    <div className="flex m-2 flex-col h-fit w-full items-start justify-between gap-4 p-2">
      <div className="flex h-fit w-full w-f">
        <EventDetailsVolunteer isLoading={isLoading} event={data} />
      </div>
      {feedbacks && feedbacks.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          {feedbacks?.map((feedback) =>
            feedback.userId === session.data?.user.userId ? (
              <FeedbacksCardVolunteer
                key={feedback.id}
                parentRefetch={refetch}
                feedbackData={feedback}
              />
            ) : (
              feedback.requestStatus === "SUBMITTED" && (
                <FeedbacksCardVolunteerInEvent
                  key={feedback.id}
                  parentRefetch={refetch}
                  feedbackData={feedback}
                />
              )
            ),
          )}
        </div>
      )}
    </div>
  );
}

export default EventInfoModalVolunteer;
