import { IoIosTime } from "react-icons/io";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";
import { AssignmentStatus } from "@/generated/enums";
import { FaUser } from "react-icons/fa6";
import { TiStarFullOutline } from "react-icons/ti";
import UserSmallDisplay from "../users/UserSmallDisplay";

type AvailabilityData = {
  totalCapacity: number;
  activeCount: number;
  available: number;
  event: {
    name: string;
    finalizedAt: Date | null;
    region: {
      name: string;
    } | null;
  };
  role: {
    name: string;
  };
  CreatedBy: {
    name: string | null;
  } | null;
  updatedBy: {
    name: string | null;
  } | null;
  availabilityEntries: {
    id: string;
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
  id: string;
  eventId: string;
  roleId: string;
  totalSlots: number;
  published: boolean;
  ratingScore: number;
  validFrom: Date | null;
  validTo: Date | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

function AvailabilityDisplay({
  availabilities,
  refetch,
  parentRefetch,
}: {
  refetch: () => void;
  availabilities: AvailabilityData;
  parentRefetch: () => void;
}) {
  const handleDelete = () => {
    refetch();
    parentRefetch();
  };
  return availabilities ? (
    <div className="flex rounded-md items-start bg-gray-700 border-l-2 border-cyan-500  flex-col w-full l gap-2 p-2">
      <div className="flex w-full flex-col gap-2">
        <div className="flex ml-2 gap-3 flex-wrap justify-between py-2 border-b border-gray-500/60">
          <div className="flex items-center justify-center text-xs gap-3">
            <div className="flex p-2 rounded-full bg-cyan-600/20">
              <FaUser size={12} className="text-cyan-500" />
            </div>
            {availabilities.role.name}
          </div>

          {availabilities.event.finalizedAt === null && (
            <DeleteButtonAdmin
              extraTXT="Availability"
              url={`/api/admin/availabilitySlots/${availabilities.id}`}
              value={`Availability: ${availabilities.role.name}`}
              styleClass="w-fit items-center w-full md:w-fit justify-center rounded-md bg-gray-500/40 p-1 m-0 h-fit  text-gray-200 hover:text-red-400"
              message="This Action will delete Availability with all user related data"
              fetchAction={handleDelete}
            />
          )}
        </div>
        <div className="flex gap-3 px-2 w-full items-center justify-between flex-wrap">
          {availabilities.validFrom && availabilities.validTo ? (
            <div className="flex py-1 flex-col md:flex-row gap-5 text-gray-200 w-fit items-center justify-between ">
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
          <div className="flex border p-1 px-3 border-gray-400 rounded-md  gap-5 items-start justify-center w-fit">
            <div className="flex flex-col text-sm items-center justify-center w-fit gap-1">
              <label className="text-xs w-fit uppercase text-gray-400">
                Slots
              </label>
              <h3 className="font-semibold text-cyan-400">
                {availabilities.available} / {availabilities.totalSlots}
              </h3>
            </div>
            <div className="flex text-xs flex-col items-center justify-center w-fit gap-1">
              <label className="text-xs w-fit uppercase text-gray-400">
                Rating
              </label>
              <h3 className="font-semibold flex gap-1 items-center justify-center">
                <TiStarFullOutline className="text-yellow-500" />
                {availabilities.ratingScore}
              </h3>
            </div>
          </div>
          {availabilities.availabilityEntries.length > 0 && (
            <div className="flex w-full justify-between relative gap-1 flex-wrap py-2 border-t border-gray-500/60">
              <div className="flex grow flex-wrap">
                {availabilities.availabilityEntries.map((avv) => (
                  <div
                    key={avv.user.id}
                    className="flex w-fit gap-2 p-1 bg-gray-900 rounded-full group h-fit relative"
                  >
                    <UserSmallDisplay
                      user={{
                        image: avv.user.image,
                        name: avv.user.name,
                        visualBar: true,
                      }}
                    />
                    <div className="md:group-hover:flex md:hidden flex">
                      {availabilities.event.finalizedAt === null && (
                        <DeleteButtonAdmin
                          url={`/api/admin/availabilityEntries/${avv.id}`}
                          value={`Availability ${availabilities.role.name} for ${avv.user.name}`}
                          styleClass="w-fit items-center justify-center p-0 m-0 h-fit bg-transparent text-gray-200 hover:text-red-400"
                          message="This Action will delete Availability with all user related data"
                          fetchAction={refetch}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {availabilities.event.finalizedAt === null && (
                  <DeleteButtonAdmin
                    extraTXT="All Entries"
                    url={`/api/admin/availabilitySlots/${availabilities.id}/availabilityEntries`}
                    value={`Availability Entries For: ${availabilities.role.name}`}
                    styleClass="w-fit items-center justify-center rounded-md bg-gray-500/40 p-1 m-0 h-fit  text-gray-200 hover:text-red-400"
                    message="This Action will delete Availability Entries with all user related data"
                    fetchAction={parentRefetch}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default AvailabilityDisplay;
