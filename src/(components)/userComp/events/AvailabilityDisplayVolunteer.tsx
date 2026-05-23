import { IoIosTime } from "react-icons/io";
import { AssignmentStatus } from "@/generated/enums";
import { FaUser } from "react-icons/fa6";
import { TiStarFullOutline } from "react-icons/ti";
import { BsLightningChargeFill } from "react-icons/bs";
import UserSmallDisplay from "@/(components)/adminComp/users/UserSmallDisplay";

type AvailabilityData = {
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

function AvailabilityDisplayVolunteer({
  eventStatus,
  availabilities,
  taken,
  handleCancel,
  handleClaim,
}: {
  eventStatus: "LIVE" | "ENDED" | "UPCOMING";
  availabilities: AvailabilityData;
  taken: boolean;
  handleClaim: ({
    e,
    ratingScore,
    slotId,
  }: {
    e: React.MouseEvent<HTMLButtonElement>;
    ratingScore: number;
    slotId: string;
  }) => void;
  handleCancel: ({
    e,
    slotId,
  }: {
    e: React.MouseEvent<HTMLButtonElement>;
    slotId: string;
  }) => void;
}) {
  return availabilities ? (
    <div
      className={`flex ${taken ? "border-orange-300 border-2" : ""} rounded-md items-start bg-gray-700 border-l-2 border-cyan-500  flex-col w-full l gap-2 p-2`}
    >
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex ml-2 gap-3 justify-between items-center py-2 border-b border-gray-500/60">
          <div className="flex items-center justify-center text-xs gap-3">
            <div className="flex p-2 rounded-full bg-cyan-600/20">
              <FaUser size={12} className="text-cyan-500" />
            </div>
            {availabilities.role.name}
          </div>
          <button
            type="button"
            disabled={eventStatus === "ENDED"}
            onClick={(e) =>
              taken
                ? handleCancel({
                    e,
                    slotId: availabilities.id,
                  })
                : availabilities.available > 0
                  ? handleClaim({
                      e,
                      slotId: availabilities.id,
                      ratingScore: availabilities.ratingScore,
                    })
                  : null
            }
            className={`flex bottom-34 z-150 right-4 md:right-6 md:bottom-20 ring ring-gray-900/30 ${eventStatus === "ENDED" ? "bg-gray-600" : taken ? "bg-red-800" : availabilities.available === 0 ? "bg-green-900 hover:opacity-100" : "bg-yellow-700"}  text-gray-50 rounded-sm p-2 text-md transition-all duration-300 ease-out items-center justify-center gap-2 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75`}
          >
            {eventStatus === "ENDED"
              ? "Closed"
              : taken
                ? "Cancel"
                : availabilities.available === 0
                  ? "All Slots Are taken"
                  : "Claim Slot"}
            <BsLightningChargeFill size={15} />
          </button>
        </div>
        <div className="flex gap-3 grow px-2 w-full items-center justify-between flex-wrap">
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
          {availabilities.availabilityEntries.length > 0 ? (
            <div className="flex w-full relative py-2 border-t border-gray-500/60">
              {availabilities.availabilityEntries.map((avv) => (
                <UserSmallDisplay
                  key={avv.user.id}
                  user={{
                    image: avv.user.image,
                    name: avv.user.name,
                    visualBar: true,
                  }}
                />
              ))}
            </div>
          ) : (
            <h3 className="flex text-xs text-gray-400 items-center grow my-2.5 justify-center w-full relative py-2  border-t border-gray-500/60">
              You Will See Availabilities Here
            </h3>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default AvailabilityDisplayVolunteer;
