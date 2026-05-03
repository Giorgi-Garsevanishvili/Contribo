"use client";

import React, { useEffect, useRef, useState } from "react";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";
import { FaPencil } from "react-icons/fa6";
import { AssignmentStatus, GTypes } from "@/generated/enums";
import axios from "axios";
import { useCompAlert } from "@/hooks/useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import { Loader } from "lucide-react";
import { IoIosTime } from "react-icons/io";
import { IoRocket } from "react-icons/io5";

interface AvailabilityData {
  totalCapacity: number;
  activeCount: number;
  available: number;
  role: {
    name: string;
  };
  event: {
    name: string;
    finalizedAt: Date | null;
    region: {
      name: string;
    } | null;
  };
  CreatedBy: {
    name: string | null;
  } | null;
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
  ratingScore: number;
  roleId: string;
  totalSlots: number;
  published: boolean;
  validFrom: Date | null;
  validTo: Date | null;
  eventId: string;
  id: string;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

interface RolesData {
  type: GTypes;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface AvailabilityFormData {
  ratingScore: number;
  roleId: string;
  totalSlots: number;
  published: boolean;
  validFrom: string;
  validTo: string;
}

const emptyForm = {
  ratingScore: 0,
  roleId: "",
  totalSlots: 0,
  published: false,
  validFrom: "",
  validTo: "",
};

function AvailabilityCreate({
  isEdit,
  roles,
  eventId,
  refetch,
  availabilities,
}: {
  isEdit: boolean;
  roles?: RolesData[];
  eventId?: string;
  refetch: () => void;
  availabilities?: AvailabilityData;
}) {
  const [formData, setFormData] = useState<AvailabilityFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const handleAvailabilitySubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (Object.values(formData).some((val) => val === "" || val === 0)) {
        throw new Error("All Fields Must be provided");
      }

      const validatedData = { ...formData, eventId: eventId };

      const response = await axios.post(
        `/api/admin/events/${eventId}/availabilitySlots`,
        validatedData,
      );
      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });
      setFormData(emptyForm);

      if (refetch) {
        refetch();
      }
      setFormData(emptyForm);
    } catch (error) {
      const message = getClientErrorMessage(error);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return isEdit && roles ? (
    <form
      onSubmit={handleAvailabilitySubmit}
      className="flex rounded-md items-center bg-gray-700 border-l-2 border-cyan-500  flex-col w-full h-fit gap-2 p-2"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <h3 className="uppercase text-md font-bold text-cyan-500">
          Event Role
        </h3>

        <FaPencil size={15} className="text-gray-400 mx-1" />
      </div>
      <div className="flex w-fit flex-col gap-2">
        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-1 w-fit">
            <label
              htmlFor="event_role"
              className="text-xs uppercase text-gray-200"
            >
              Choose Role
            </label>
            <select
              value={formData.roleId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, roleId: e.target.value }))
              }
              name="eventRole"
              className="cursor-pointer border rounded-sm p-1 border-gray-500"
              id="event_role"
            >
              <option value="">Select</option>
              {roles.map((role) => (
                <option
                  className="cursor-pointer"
                  key={role.id}
                  value={role.id}
                >
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-fit">
            <label
              htmlFor="event_role"
              className="text-xs w-fit uppercase text-gray-200"
            >
              Total Slots
            </label>
            <input
              id="total_slot"
              name="total_slot"
              min={0}
              value={formData.totalSlots}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalSlots: Number(e.target.value),
                }))
              }
              type="number"
              className="cursor-pointer border w-20 rounded-sm p-1 border-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1 w-fit">
            <label
              htmlFor="event_role"
              className="text-xs w-fit uppercase text-gray-200"
            >
              Rating
            </label>
            <input
              type="number"
              value={formData.ratingScore}
              min={0}
              name="rating"
              id="rating"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ratingScore: Number(e.target.value),
                }))
              }
              className="cursor-pointer flex w-20 border rounded-sm p-1 border-gray-500"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 text-gray-200 w-full justify-between  mt-3">
          <div className="flex w-full">
            <label
              htmlFor="valid_from"
              className="flex gap-1 w-full flex-col items-start justify-start"
            >
              <h2 className="uppercase text-xs">Start Time</h2>
              <input
                id="valid_from"
                type="datetime-local"
                name="valid_from"
                value={formData.validFrom}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    validFrom: e.target.value,
                  }))
                }
                className="bg-gray-800 ring-1 ring-gray-700 accent-gray-200  outline-0 p-2 w-full rounded-xs"
                placeholder="e.g. Welcome Party 2026"
              />
            </label>
          </div>
          <div className="flex w-full">
            <label
              htmlFor="valid_to"
              className="flex gap-1 w-full flex-col items-start justify-start"
            >
              <h2 className="uppercase text-xs">End Time</h2>
              <input
                id="valid_to"
                type="datetime-local"
                name="valid_to"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    validTo: e.target.value,
                  }))
                }
                value={formData.validTo}
                className="bg-gray-800 ring-1 ring-gray-700  outline-0 p-2 w-full rounded-xs"
                placeholder="e.g. Welcome Party 2026"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="flex bg-gray-900/50 rounded-sm mt-3 border-t items-center justify-between p-3 border-gray-300/40 w-full h-">
        <p className="text-sm md:flex hidden text-gray-400 capitalize">
          general Information
        </p>
        <div className="flex md:flex-row md:w-fit w-full flex-col justify-center items-center gap-2 ">
          <button
            onClick={() => setFormData(emptyForm)}
            type="button"
            className="p-2 w-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-gray-600 rounded-sm"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={
              isLoading ||
              Object.values(formData).some((e) => e === "" || e === 0)
            }
            className={`p-2 w btn m-0 bg-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-cyan-700 rounded-sm`}
          >
            {isLoading ? (
              <Loader
                className="right-3 top-2.5 animate-spin text-gray-200"
                size={20}
              />
            ) : (
              <div className="flex items-center gap-2 justify-start">
                <h3>Deploy</h3>
                <IoRocket size={15} className="text-cyan-200" />
              </div>
            )}
          </button>
        </div>
      </div>
    </form>
  ) : availabilities ? (
    <div className="flex rounded-md items-start bg-gray-700 border-l-2 border-cyan-500  flex-col w-80 h-fit gap-2 p-5">
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

export default AvailabilityCreate;
