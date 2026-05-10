"use client";
import { FaPencil } from "react-icons/fa6";
import SelectUsers from "../users/SelectUsers";
import { GTypes } from "@/generated/enums";
import { useRef, useState } from "react";
import { IoRocket } from "react-icons/io5";
import { Loader } from "lucide-react";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import axios from "axios";
import { useCompAlert } from "@/hooks/useCompAlert";

//     eventId: string;
//     userId: string;
//     roleId: string;
//     ratingScore: number;
//     comment?: string | undefined;
//     validFrom?: Date | undefined;
//     validTo?: Date | undefined;

interface AssignmentCreate {
  userId: string;
  roleId: string;
  ratingScore: number;
  comment?: string;
  validFrom: string;
  validTo: string;
}

const emptyForm = {
  ratingScore: 0,
  userId: "",
  roleId: "",
  comment: "",
  validFrom: "",
  validTo: "",
};

interface RolesData {
  type: GTypes;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

function AssignmentCreate({
  roles,
  eventId,
  isOpen,
  refetch,
  parentRefetch,
}: {
  roles: RolesData[];
  eventId: string;
  isOpen: boolean;
  refetch: () => void;
  parentRefetch: () => void;
}) {
  const [formData, setFormData] = useState<AssignmentCreate>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const validation = () => {
    if (
      !formData.userId ||
      !formData.roleId ||
      !formData.validFrom ||
      !formData.validTo ||
      formData.ratingScore === 0
    ) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (!validation()) {
        throw new Error("All Fields Must be provided");
      }

      const validatedData = { ...formData, eventId: eventId };

      const response = await axios.post(
        `/api/admin/events/${eventId}/eventAssignments`,
        validatedData,
      );
      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });

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
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex rounded-md items-center bg-gray-700 border-l-2 border-cyan-500  flex-col w-full h-fit gap-2 p-2"
      >
        <div className="flex w-full items-center justify-between gap-2">
          <h3 className="uppercase text-md font-bold text-cyan-500">
            Event Role
          </h3>

          <FaPencil size={15} className="text-gray-400 mx-1" />
        </div>
        <div className="flex w-fit flex-col gap-2">
          <div className="flex w-full md:flex-row flex-col items-center gap-5">
            <div className="flex flex-col gap-1 w-full">
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

            <div className="flex w-full items-center justify-center">
              <div className="flex flex-col items-start gap-1 w-fit">
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

            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="event_role"
                className="text-xs w-fit uppercase text-gray-200"
              >
                User
              </label>
              <SelectUsers
                selectedId={formData.userId}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, userId: e }));
                }}
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
          <div className="flex w-full">
            <label
              htmlFor="comment"
              className="flex gap-1 w-full flex-col items-start justify-start"
            >
              <h2 className="uppercase text-xs text-gray-200">Comment</h2>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                className="bg-gray-800 ring-1 ring-gray-700  outline-0 p-2 text-wrap w-full h-20 rounded-xs"
                placeholder="Provide Extra Information if necessary"
              />
            </label>
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
              className={`p-2 w btn m-0 w-full md:w-fit cursor-pointer hover:opacity-70 transition-all duration-300 ease-out bg-green-800 rounded-sm`}
            >
              {isLoading ? (
                <Loader
                  className="right-3 top-2.5 animate-spin text-gray-200"
                  size={20}
                />
              ) : (
                <div className="flex justify-center md:w-fit items-center gap-2">
                  <h3>Deploy</h3>
                  <IoRocket size={15} className="text-green-200" />
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : null;
}

export default AssignmentCreate;
