import { RegionStatus } from "@prisma/client";

type RegionDataUpdateType = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  website?: string;
  logo?: string;
  status?: RegionStatus;
};

type RegionDataUpdateActionType<U> = {
  action: React.Dispatch<React.SetStateAction<U>>;
};

const RegionStatusObj = ["ACTIVE", "PAUSED", "DEACTIVATED", "PENDING"];

function RegionDataUpdate<U extends RegionDataUpdateType>({
  action,
}: RegionDataUpdateActionType<U>) {
  return (
    <div className="flex w-full items-center justify-center flex-row">
      <div className="flex flex-col items-center justify-between w-[98%] p-1">
        <input
          type="text"
          name="name"
          placeholder="Update Name"
          className="flex w-full h-10 input-def"
          onChange={(e) =>
            action((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="email"
          name="email"
          placeholder="Update Email"
          className="flex w-full h-10 input-def"
          onChange={(e) =>
            action((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          type="text"
          name="phone"
          placeholder="Update Phone"
          className="flex w-full h-10 input-def"
          onChange={(e) =>
            action((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
        <input
          type="text"
          name="address"
          placeholder="Update Address"
          className="flex w-full h-10 input-def"
          onChange={(e) =>
            action((prev) => ({ ...prev, address: e.target.value }))
          }
        />
        <input
          type="text"
          name="description"
          placeholder="Update Description"
          className="flex w-full h-10 input-def"
          onChange={(e) =>
            action((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <input
          type="text"
          name="website"
          placeholder="Update Website"
          className="flex w-full h-10 input-def"
          onChange={(e) =>
            action((prev) => ({ ...prev, website: e.target.value }))
          }
        />
        <input
          type="text"
          name="logo"
          placeholder="Update Logo"
          className="flex w-full h-10 input-def"
          onChange={(e) =>
            action((prev) => ({ ...prev, logo: e.target.value }))
          }
        />
        <select
          onChange={(e) =>
            action((prev) => ({ ...prev, status: e.target.value }))
          }
          className="select-def"
          name="status"
        >
          <option className="bg-gray-700" value="">
            Select Status
          </option>
          {RegionStatusObj.map((status, index) => (
            <option className="bg-gray-700" value={status} key={index}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default RegionDataUpdate;
