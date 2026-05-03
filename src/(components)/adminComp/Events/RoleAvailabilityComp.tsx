"use client";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoAdd, IoRocket } from "react-icons/io5";
import { useModal } from "../../../../context/ModalContext";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useFetchData } from "@/hooks/useDataFetch";
import { AssignmentStatus, GTypes } from "@/generated/enums";
import usePaginatedData from "@/hooks/usePaginatedData";
import AvailabilityCreate from "./AvailabilityCreate";
import { TbPencilOff } from "react-icons/tb";

interface NewDataProps {
  id: string;
  name: string;
}

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
}: {
  props: NewDataProps;
  stepAction?: boolean;
}) {
  const { closeModal } = useModal();
  const [isEdit, setIsEdit] = useState(false);

  const handleSkip = () => {
    closeModal;
  };

  const {
    data,
    isLoading: isLoadingData,
    refetch,
  } = usePaginatedData<AvailabilityData[]>(
    `/api/admin/events/${props.id}/availabilitySlots`,
    [],
  );

  const { data: RolesData, isLoading: isLoadingRoles } = usePaginatedData<
    RolesData[]
  >("/api/admin/eventRoles", []);

  return (
    <div className="flex flex-col justify-between transition-all duration-300 ease-out w-full p-2 gap-5 rounded-sm bg-cyan-900 border border-gray-600">
      <div className="flex border-b border-gray-400/60 py-2 items-center justify-between gap-2">
        <div className="flex items-center gap-2 justify-start">
          <BsFillPersonLinesFill size={20} className="text-cyan-300" />
          <div className="flex h-7 border border-cyan-950 "></div>
          <div className="flex items-start flex-col justify-start">
            <h2 className="text-md">Role Availability</h2>
            <h3 className="text-xs text-gray-300">{props.name}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsEdit(!isEdit)}
          className="flex bottom-34 z-150 right-4 md:right-6 md:bottom-20 ring ring-gray-900/30 bg-cyan-400 text-gray-700 rounded-sm p-2 text-md transition-all duration-300 ease-out shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75"
        >
          {isEdit ? <TbPencilOff /> : <IoAdd />}
        </button>
      </div>
      <AvailabilityCreate
        isEdit={isEdit}
        roles={RolesData}
        eventId={props.id}
        refetch={refetch}
      />
      <div className="flex gap-3 flex-wrap">
        {data.length > 0
          ? data.map((avv) => (
              <AvailabilityCreate
                refetch={refetch}
                availabilities={avv}
                key={avv.id}
                isEdit={isEdit}
              />
            ))
          : "No Availabilities To Display"}
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
