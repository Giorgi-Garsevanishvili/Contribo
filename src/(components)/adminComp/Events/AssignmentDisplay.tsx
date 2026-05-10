import React from "react";
import { IoIosTime } from "react-icons/io";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";
import { AssignmentStatus } from "@/generated/enums";
import UserSmallDisplay from "../users/UserSmallDisplay";

type AssignmentData = {
  role: {
    name: string;
  } | null;
  event: {
    name: string;
  };
  createdBy: {
    name: string | null;
    image: string | null;
  } | null;
  updatedBy: {
    name: string | null;
    image: string | null;
  } | null;
  user: {
    name: string | null;
    image: string | null;
  } | null;
} & {
  validFrom: Date | null;
  validTo: Date | null;
  id: string;
  eventId: string;
  status: AssignmentStatus;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string | null;
  roleId: string | null;
  comment: string | null;
  assignedAt: Date;
  ratingScore: number | null;
  ratedAt: Date | null;
};

function AssignmentDisplay({
  assignment,
  refetch,
}: {
  refetch: () => void;
  assignment?: AssignmentData;
}) {
  return assignment ? (
    <div className="flex rounded-md items-start bg-gray-700 border-l-2 border-cyan-500  flex-col w-80  min-h-60 l gap-2 p-5">
      <div className="flex w-full items-center justify-between gap-2">
        <h3 className="uppercase text-md font-bold text-cyan-500">Assignee</h3>

        <DeleteButtonAdmin
          url={`/api/admin/eventAssignments/${assignment.id}`}
          value={`Availability: ${assignment.role?.name} for ${assignment.user?.name}`}
          styleClass="w-fit items-center justify-center p-0 m-0 h-fit bg-transparent text-gray-200 hover:text-red-400"
          message="This Action will delete User Assignment"
          fetchAction={refetch}
        />
      </div>
      <div className="flex w-fit flex-col gap-2">
        <div className="flex my-1 py-2 border-b border-gray-500/60">
          {assignment.user && <UserSmallDisplay user={assignment.user} />}
        </div>
        <div className="flex items-center p-1 gap-5">
          <div className="flex flex-col gap-1 w-fit">
            <label
              htmlFor="event_role"
              className="text-xs uppercase text-gray-200"
            >
              Role
            </label>
            <h3>{assignment.role?.name}</h3>
          </div>

          <div className="flex flex-col gap-1 w-fit">
            <label
              htmlFor="event_role"
              className="text-xs w-fit uppercase text-gray-200"
            >
              Rating
            </label>
            <h3>{assignment.ratingScore}</h3>
          </div>
        </div>
        {assignment.comment && (
          <>
            <label
              htmlFor="event_role"
              className="text-xs w-fit uppercase text-gray-200"
            >
              Comment
            </label>
            <h5 className="w-full items-center rounded-md p-2 text-sm justify-center text-start border border-yellow-500/60 ">
              {assignment.comment}
            </h5>
          </>
        )}
        {assignment.validFrom && assignment.validTo ? (
          <div className="flex border-t border-gray-500/60 py-2 flex-col md:flex-row gap-5 text-gray-200 w-full justify-between  mt-3">
            <div className="flex items-start justify-start w-full">
              <label
                htmlFor="availability_period"
                className="flex gap-1 w-full flex-col items-start justify-start"
              >
                <h2 className="uppercase text-xs">Validity Period</h2>
                <div className="flex gap-1.5 text-xs text-start items-center text-gray-400 w-full h-fit">
                  <div>
                    <IoIosTime size={15} />
                  </div>
                  <h5 className="flex wrap-anywhere">{`${new Date(assignment.validFrom).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })} - ${new Date(assignment.validTo).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}`}</h5>
                </div>
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
}

export default AssignmentDisplay;
