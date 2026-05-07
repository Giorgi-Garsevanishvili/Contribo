import React from "react";
import { IoIosTime } from "react-icons/io";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";
import { AssignmentStatus } from "@/generated/enums";

type AvailabilityData = {
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
      name: string | null;
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

function AvailabilityDisplay({
  availabilities,
  refetch,
}: {
  refetch: () => void;
  availabilities?: AvailabilityData;
}) {
  return availabilities ? (
    <div className="flex rounded-md items-start bg-gray-700 border-l-2 border-cyan-500  flex-col w-80  h-50 l gap-2 p-5">
      <div className="flex w-full items-center justify-between gap-2">
        <h3 className="uppercase text-md font-bold text-cyan-500">
          Event Role
        </h3>

        <DeleteButtonAdmin
          url={`/api/admin/availabilitySlots/${availabilities.id}`}
          value={`Availability: ${availabilities.role.name}`}
          styleClass="w-fit items-center justify-center p-0 m-0 h-fit bg-transparent text-gray-200 hover:text-red-400"
          message="This Action will delete Availability with all user related data"
          fetchAction={refetch}
        />
      </div>
      <div className="flex w-fit flex-col gap-2">
        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-1 w-fit">
            <label
              htmlFor="event_role"
              className="text-xs uppercase text-gray-200"
            >
              Role
            </label>
            <h3>{availabilities.role.name}</h3>
          </div>
          <div className="flex flex-col gap-1 w-fit">
            <label
              htmlFor="event_role"
              className="text-xs w-fit uppercase text-gray-200"
            >
              Total Slots
            </label>
            <h3>{availabilities.totalSlots}</h3>
          </div>
          <div className="flex flex-col gap-1 w-fit">
            <label
              htmlFor="event_role"
              className="text-xs w-fit uppercase text-gray-200"
            >
              Rating
            </label>
            <h3>{availabilities.ratingScore}</h3>
          </div>
        </div>
        {availabilities.validFrom && availabilities.validTo ? (
          <div className="flex flex-col md:flex-row gap-5 text-gray-200 w-full justify-between  mt-3">
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
                  <h5 className="flex wrap-anywhere">{`${new Date(availabilities.validFrom).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })} - ${new Date(availabilities.validTo).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}`}</h5>
                </div>
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
}

export default AvailabilityDisplay;
