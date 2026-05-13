"use client";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoAdd, IoAddOutline } from "react-icons/io5";
import { useModal } from "../../../../context/ModalContext";
import { useState } from "react";
import { Loader } from "lucide-react";
import { AssignmentStatus, GTypes } from "@/generated/enums";
import usePaginatedData from "@/hooks/usePaginatedData";
import AvailabilityCreate from "./AvailabilityCreate";
import { TbPencilOff } from "react-icons/tb";
import AvailabilityDisplay from "./AvailabilityDisplay";
import AssignmentCreate from "./AssignmentCreate";
import AssignmentDisplay from "./AssignmentDisplay";
import { FaBriefcase } from "react-icons/fa6";

interface NewDataProps {
  id: string;
  name: string;
}

type AssignmentsData = {
  role: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
    image: string | null;
  } | null;
  updatedBy: {
    name: string | null;
    image: string | null;
  } | null;
  event: {
    name: string;
  };
  user: {
    name: string | null;
    image: string | null;
  } | null;
} & {
  id: string;
  eventId: string;
  userId: string | null;
  roleId: string | null;
  ratingScore: number | null;
  comment: string | null;
  validFrom: Date | null;
  validTo: Date | null;
  assignedAt: Date;
  ratedAt: Date | null;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
};

interface RolesData {
  type: GTypes;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

function AssignmentsModalComp({
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
    closeModal;
  };

  const {
    data,
    isLoading: isLoadingData,
    refetch,
  } = usePaginatedData<AssignmentsData[]>(
    `/api/admin/events/${props.id}/eventAssignments`,
    [],
    stepAction,
  );

  const { data: RolesData, isLoading: isLoadingRoles } = usePaginatedData<
    RolesData[]
  >("/api/admin/eventRoles", []);

  return (
    <div className="flex flex-col justify-between transition-all duration-300 ease-out w-full h-full p-2 gap-5 rounded-sm bg-cyan-900 border border-gray-600">
      <div className="flex border-b border-gray-400/60 py-2 items-center justify-between gap-2">
        <div className="flex items-center gap-2 justify-start">
          <div className="flex p-3 rounded-full bg-green-600/20">
            <FaBriefcase size={20} className="text-green-500" />
          </div>
          <div className="flex items-start flex-col justify-start">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-md">Assignments</h2>
              <h2 className="bg-green-600/20 text-green-500 text-sm px-4 h-fit w-fit rounded-2xl">
                {data.length}
              </h2>
            </div>
            <h3 className="text-xs text-gray-300">
              People Assigned to roles for this event
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex bottom-34 z-150 right-4 md:right-6 md:bottom-20  bg-green-600/30 text-green-300 rounded-sm p-2 text-md transition-all items-center justify-center text-sm gap-2 duration-300 ease-out shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75"
        >
          {isOpen ? <TbPencilOff size={20} /> : <IoAddOutline size={20} />}
        </button>
      </div>
      <AssignmentCreate
        refetch={refetch}
        parentRefetch={parentRefetch}
        isOpen={isOpen}
        roles={RolesData}
        eventId={props.id}
      />
      <div className="flex items-start justify-start gap-2 flex-col w-full h-full flex-wrap ">
        {isLoadingData ? (
          <div className="flex w-full h-full items-center justify-center">
            <Loader
              className="right-3 top-2.5 animate-spin text-gray-200"
              size={40}
            />
          </div>
        ) : data.length > 0 ? (
          data.map((assignment) => (
            <AssignmentDisplay
              key={assignment.id}
              assignment={assignment}
              refetch={refetch}
              parentRefetch={parentRefetch}
            />
          ))
        ) : (
          "No Assignments To Display"
        )}
      </div>
      <div className="flex md:flex-row flex-col bg-gray-900/50 rounded-sm mt-1 gap-5 border-t items-center justify-between p-3 border-gray-300/40 w-full h-">
        <div className="flex flex-col items-center gap-2 p-2 w-full ">
          <div className="flex text-md text-gray-300 items-center justify-center gap-3">
            <h3 className="">Total Assignments</h3>
            <h1>{data.length}</h1>
          </div>
          <div className="flex flex-col md:flex-row text-sm text-center items-center gap-3 text-cyan-300 justify-start">
            <IoIosInformationCircleOutline size={18} />
            <h3>Assignment will be live immediately after publishing.</h3>
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

export default AssignmentsModalComp;
