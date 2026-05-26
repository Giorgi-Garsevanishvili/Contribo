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
  ratingScore: string;
  roleId: string;
  totalSlots: string;
  published: boolean;
  validFrom: string;
  validTo: string;
}

const emptyForm = {
  ratingScore: "",
  roleId: "",
  totalSlots: "",
  published: false,
  validFrom: "",
  validTo: "",
};

const formatDateForInput = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
};

function AvailabilityCreate({
  isOpen,
  roles,
  eventId,
  eventEnd,
  eventStart,
  refetch,
  parentRefetch,
}: {
  isOpen: boolean;
  roles?: RolesData[];
  eventId?: string;
  refetch: () => void;
  eventEnd: string;
  eventStart: string;
  parentRefetch: () => void;
}) {
  const [formData, setFormData] = useState<AvailabilityFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const [dateErrors, setDateErrors] = useState<{
    validFrom?: string;
    validTo?: string;
  }>({});

  const validateDateRange = (
    from: string,
    to: string,
  ): { validFrom?: string; validTo?: string } => {
    const errors: { validFrom?: string; validTo?: string } = {};

    if (from && from < eventStart) {
      errors.validFrom = "Start time cannot be before event start";
    }

    if (from && from > eventEnd) {
      errors.validFrom = "Start time cannot be after event end";
    }

    if (to && to < eventStart) {
      errors.validTo = "End time cannot be before event start";
    }

    if (to && to > eventEnd) {
      errors.validTo = "End time cannot be after event end";
    }

    if (from && to && from > to) {
      errors.validFrom = "Start time must be before end time";
      errors.validTo = "End time must be after start time";
    }

    return errors;
  };

  const validation = () => {
    if (
      !formData.roleId ||
      !formData.validFrom ||
      !formData.validTo ||
      !formData.ratingScore ||
      !formData.totalSlots
    ) {
      return false;
    }

    if (Number(formData.ratingScore) <= 0 || Number(formData.totalSlots) <= 0) {
      return false;
    }

    if (Object.keys(dateErrors).length > 0) {
      return false;
    }

    return true;
  };

  const handleDateChange = (field: "validFrom" | "validTo", value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Validate on change
    const errors = validateDateRange(
      newFormData.validFrom,
      newFormData.validTo,
    );
    setDateErrors(errors);
  };

  const handleAvailabilitySubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (!validation()) {
        throw new Error("All Fields Must be provided");
      }

      const validatedData = {
        ...formData,
        eventId: eventId,
        ratingScore: Number(formData.ratingScore),
        totalSlots: Number(formData.totalSlots),
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
      };

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
      parentRefetch();
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

  return isOpen && roles ? (
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
        <div className="flex md:flex-row flex-col items-center gap-5">
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
              className="cursor-pointer bg-gray-700 border rounded-sm p-1 border-gray-500"
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
          <div className="flex gap-3">
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
                    totalSlots: e.target.value,
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
                    ratingScore: e.target.value,
                  }))
                }
                className="cursor-pointer flex w-20 border rounded-sm p-1 border-gray-500"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 text-gray-200 w-full justify-between  mt-3">
          <div className="flex flex-col w-full">
            <label
              htmlFor="valid_from"
              className="flex gap-1 w-full flex-col h-full items-start justify-start"
            >
              <h2 className="uppercase text-xs">Start Time</h2>
              <input
                id="valid_from"
                min={eventStart}
                max={eventEnd}
                type="datetime-local"
                name="valid_from"
                value={formData.validFrom}
                onChange={(e) => handleDateChange("validFrom", e.target.value)}
                className="bg-gray-800 ring-1 ring-gray-700 accent-gray-200  outline-0 p-2 w-full rounded-xs"
                placeholder="e.g. Welcome Party 2026"
              />
            </label>
            {dateErrors.validFrom && (
              <span className="text-xs text-red-400 mt-1">
                {dateErrors.validFrom}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="valid_to"
              className="flex gap-1 w-full flex-col h-full items-start justify-start"
            >
              <h2 className="uppercase text-xs">End Time</h2>
              <input
                id="valid_to"
                type="datetime-local"
                min={formData.validFrom || eventStart}
                max={eventEnd}
                name="valid_to"
                onChange={(e) => handleDateChange("validTo", e.target.value)}
                value={formData.validTo}
                className="bg-gray-800 ring-1 ring-gray-700  outline-0 p-2 w-full rounded-xs"
                placeholder="e.g. Welcome Party 2026"
              />
            </label>
            {dateErrors.validTo && (
              <span className="text-xs text-red-400 mt-1">
                {dateErrors.validTo}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-full flex-wrap items-center mt-2 justify-center md:justify-start">
          <div className="flex items-center rounded-md bg-gray-800 p-1.5 justify-center">
            <label
              htmlFor="Whole_event"
              className="flex gap-1 w-full flex-col h-full items-start justify-between"
            >
              <h2 className="uppercase text-xs">Whole Event</h2>
              <div className="flex items-center justify-center w-full h-full">
                <input
                  id="Whole_event"
                  type="checkbox"
                  name="Whole_event"
                  checked={
                    formData.validFrom === formatDateForInput(eventStart) &&
                    formData.validTo === formatDateForInput(eventEnd)
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        validFrom: formatDateForInput(eventStart),
                        validTo: formatDateForInput(eventEnd),
                      }));
                      setDateErrors({});
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        validFrom: "",
                        validTo: "",
                      }));
                    }
                  }}
                  className="w-4 h-4 cursor-pointer accent-cyan-500 bg-gray-700 border border-gray-500 rounded"
                />
              </div>
            </label>
          </div>
          <div className="flex items-center rounded-md bg-gray-800 p-1.5 justify-center">
            <label
              htmlFor="first_half"
              className="flex gap-1 w-full flex-col h-full items-start justify-between"
            >
              <h2 className="uppercase text-xs">First Half</h2>
              <div className="flex items-center justify-center w-full h-full">
                <input
                  id="first_half"
                  type="checkbox"
                  name="first_half"
                  checked={
                    formData.validFrom === formatDateForInput(eventStart) &&
                    formData.validTo ===
                      formatDateForInput(
                        new Date(
                          (new Date(eventStart).getTime() +
                            new Date(eventEnd).getTime()) /
                            2,
                        ),
                      )
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        validFrom: formatDateForInput(eventStart),
                        validTo: formatDateForInput(
                          new Date(
                            (new Date(eventStart).getTime() +
                              new Date(eventEnd).getTime()) /
                              2,
                          ),
                        ),
                      }));
                      setDateErrors({});
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        validFrom: "",
                        validTo: "",
                      }));
                    }
                  }}
                  className="w-4 h-4 cursor-pointer accent-cyan-500 bg-gray-700 border border-gray-500 rounded"
                />
              </div>
            </label>
          </div>
          <div className="flex items-center  rounded-md bg-gray-800 p-1.5 justify-center ">
            <label
              htmlFor="second_half"
              className="flex gap-1 w-full flex-col h-full items-start justify-between"
            >
              <h2 className="uppercase text-xs">Second Half</h2>
              <div className="flex items-center justify-center w-full h-full">
                <input
                  id="second_half"
                  type="checkbox"
                  name="second_half"
                  checked={
                    formData.validTo === formatDateForInput(eventEnd) &&
                    formData.validFrom ===
                      formatDateForInput(
                        new Date(
                          (new Date(eventStart).getTime() +
                            new Date(eventEnd).getTime()) /
                            2,
                        ),
                      )
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        validTo: formatDateForInput(eventEnd),
                        validFrom: formatDateForInput(
                          new Date(
                            (new Date(eventStart).getTime() +
                              new Date(eventEnd).getTime()) /
                              2,
                          ),
                        ),
                      }));
                      setDateErrors({});
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        validFrom: "",
                        validTo: "",
                      }));
                    }
                  }}
                  className="w-4 h-4 cursor-pointer accent-cyan-500 bg-gray-700 border border-gray-500 rounded"
                />
              </div>
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
            disabled={isLoading || !validation()}
            className={`p-2 w btn m-0 w-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-cyan-700 rounded-sm`}
          >
            {isLoading ? (
              <Loader
                className="right-3 top-2.5 animate-spin text-gray-200"
                size={20}
              />
            ) : (
              <div className="flex justify-center md:w-fit items-center gap-2">
                <h3>Deploy</h3>
                <IoRocket size={15} className="text-cyan-200" />
              </div>
            )}
          </button>
        </div>
      </div>
    </form>
  ) : null;
}

export default AvailabilityCreate;
