"use client";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { useModal } from "../../../../context/ModalContext";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { AssignmentStatus, GTypes } from "@/generated/enums";
import usePaginatedData from "@/hooks/usePaginatedData";
import AvailabilityCreate from "./AvailabilityCreate";
import { TbPencilOff } from "react-icons/tb";
import AvailabilityDisplay from "./AvailabilityDisplay";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";

interface NewDataProps {
  id: string;
  name: string;
  finalized: string | null;
  eventStart: string
  eventEnd:string
}

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

interface RolesData {
  type: GTypes;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

function RoleAvailabilityComp({
  props,
  stepAction,
  parentRefetch,
}: {
  props: NewDataProps;
  stepAction?: boolean;
  parentRefetch: () => void;
}) {
  const { closeModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);

  const handleSkip = () => {
    closeModal();
  };

  const {
    data,
    isLoading: isLoadingData,
    refetch,
  } = usePaginatedData<AvailabilityData[]>(
    `/api/admin/events/${props.id}/availabilitySlots`,
    [],
    stepAction,
  );

  useEffect(() => {
    refetch();
  }, [parentRefetch]);

  const { data: RolesData, isLoading: isLoadingRoles } = usePaginatedData<
    RolesData[]
  >("/api/admin/eventRoles", []);

  return (
    <div className="flex flex-col justify-between transition-all duration-300 ease-out w-full h-fit p-2 gap-5 rounded-sm bg-cyan-900 border border-gray-600">
      <div className="flex border-b flex-col w-full md:flex-row border-gray-400/60 py-2 items-center justify-between gap-2">
        <div className="flex items-center gap-2 justify-start">
          <div className="flex p-3 rounded-full bg-cyan-600/20">
            <BsFillPersonLinesFill size={20} className="text-cyan-500" />
          </div>
          <div className="flex items-start flex-col justify-start">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-md">Availabilities</h2>
              <h2 className="bg-cyan-600/20 text-cyan-500 text-sm px-4 h-fit w-fit rounded-2xl">
                {data.length}
              </h2>
            </div>
            <h3 className="text-xs text-gray-300">Roles open for volunteers</h3>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-fit items-center justify-between">
          {data.length > 0 && props.finalized === null ? (
            <DeleteButtonAdmin
              extraTXT="All Availabilities"
              url={`/api/admin/events/${props.id}/availabilitySlots`}
              value={`All Availabilities For Event: ${data[0].event.name}`}
              styleClass="w-fit items-center justify-center  p-1 grow md:w-fit bg-cyan-600/60 rounded-md p-0 m-0 h-fit text-gray-200 hover:text-red-200"
              message="This Action will delete All Availabilities for this event, All related data will be deleted. Action Is Permanent!"
              fetchAction={refetch}
            />
          ) : null}
          <button
            type="button"
            disabled={props.finalized !== null}
            onClick={() => setIsOpen(!isOpen)}
            className="flex bottom-34 disabled:opacity-20 z-150 right-4 md:right-6 md:bottom-20 ring grow items-center justify-center ring-gray-900/30 bg-cyan-400 text-gray-700 rounded-sm p-2 text-md transition-all duration-300 ease-out shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75"
          >
            {isOpen ? <TbPencilOff /> : <IoAdd />}
          </button>
        </div>
      </div>
      <AvailabilityCreate
        isOpen={isOpen}
        eventEnd={props.eventEnd}
        eventStart={props.eventStart}
        roles={RolesData}
        eventId={props.id}
        refetch={refetch}
        parentRefetch={parentRefetch}
      />
      <div className="flex gap-3 h-fit flex-wrap ">
        {isLoadingData ? (
          <div className="flex w-full h-full items-center justify-center">
            <Loader
              className="right-3 top-2.5 animate-spin text-gray-200"
              size={40}
            />
          </div>
        ) : data.length > 0 ? (
          data.map((avv) => (
            <AvailabilityDisplay
              refetch={refetch}
              parentRefetch={parentRefetch}
              availabilities={avv}
              key={avv.id}
            />
          ))
        ) : (
          <h3 className="text-sm text-gray-300">
            No Availabilities To Display
          </h3>
        )}
      </div>
      <div className="flex md:flex-row flex-col bg-gray-900/50 rounded-sm mt-1 gap-5 border-t items-center justify-between p-3 border-gray-300/40 w-full h-">
        <div className="flex flex-col items-center gap-2 p-2 w-full ">
          <div className="flex text-md text-gray-300 items-center justify-center gap-3">
            <h3 className="">Total Personnel Required</h3>
            <h1>{data.reduce((acc, curr) => acc + curr.totalSlots, 0)}</h1>
          </div>
          <div className="flex flex-col md:flex-row text-sm text-center items-center gap-3 text-cyan-300 justify-start">
            <IoIosInformationCircleOutline size={18} />
            <h3>Availability will be live immediately after publishing.</h3>
          </div>
        </div>

        {stepAction && (
          <div className="flex  md:w-fit w-full flex-col justify-center items-center gap-2 ">
            <button
              onClick={handleSkip}
              type="button"
              className="p-2 w-full cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-gray-600 rounded-sm"
            >
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleAvailabilityComp;
