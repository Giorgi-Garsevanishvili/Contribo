import { HrWarningStatus, RatingAction } from "@/generated/enums";
import { IoFilterSharp } from "react-icons/io5";
import { MdFilterListOff } from "react-icons/md";

type RoleRegionMembershipDataType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}[];

type DataType = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

type FilterType = "UNIVERSAL" | "HR-CASES" | "USERS" | "RATING";

type FilterPropType =
  | {
      filterType: "HR-CASES";
      typeData: DataType; // For HR Cases
      typeValue: string; // For HR Cases
      statusValue: string; // For HR Cases
      searchValue: string;
      onTypeFilterChange: (type: string) => void; // For HR Cases
      onStatusFilterChange: (status: string) => void; // For HR Cases
      onSearchQueryChange: (search: string) => void;
      filterOn: boolean;
      clearFilter: () => void;
    }
  | {
      filterType: "USERS";
      roleData: RoleRegionMembershipDataType;
      membershipData: RoleRegionMembershipDataType;
      roleValue: string;
      membershipValue: string;
      searchValue: string;
      onRoleFilterChange: (role: string) => void;
      onMembershipFilterChange: (membership: string) => void;
      onSearchQueryChange: (search: string) => void;
      filterOn: boolean;
      clearFilter: () => void;
    }
  | {
      filterType: "RATING";
      searchValue: string;
      actionValue: string;
      onActionFilterChange: (action: string) => void;
      onSearchQueryChange: (search: string) => void;
      filterOn: boolean;
      clearFilter: () => void;
    }
  | {
      filterType: "STANDARD";
      searchValue: string;
      onSearchQueryChange: (search: string) => void;
      filterOn: boolean;
      clearFilter: () => void;
    };

function QueryFilter(props: FilterPropType) {
  return (
    <div className="flex w-[20rem] md:w-auto  flex-col md:shadow-md shadow-white bg-gray-200/95 md:px-5 rounded-lg">
      <div className="flex mt-2 items-center justify-center">
        <h3 className="px-4">Filter</h3>
        <IoFilterSharp size={20} />
      </div>

      <div className="flex flex-col p-1 md:flex-row">
        {props.filterType === "HR-CASES" ? (
          <div
            /** This Is Filters For HR cases */ className="flex md:overflow-auto  overflow-x-scroll p-1 flex-row"
          >
            <div className="flex bg-gray-300 ring-1 ring-gray-600/30 md:ring-0 p-1 rounded-md md:bg-transparent m-2 w-full items-center justify-between">
              <label
                htmlFor="type"
                className="text-gray-700 flex items-center justify-center m-0.5 h-full"
              >
                Type:
              </label>
              <select
                value={props.typeValue}
                onChange={(e) => props.onTypeFilterChange(e.target.value)}
                className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
                name="type"
                id="type"
              >
                <option className="p-0 m-0" value="">
                  ALL
                </option>
                {props.typeData?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex bg-gray-300 ring-1 ring-gray-600/30 md:ring-0 p-1 rounded-md md:bg-transparent m-2 w-full items-center justify-between">
              <label
                htmlFor="status"
                className="text-gray-700 flex items-center justify-center m-0.5 h-full"
              >
                Status:
              </label>
              <select
                value={props.statusValue}
                className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
                onChange={(e) =>
                  props.onStatusFilterChange(e.target.value as HrWarningStatus)
                }
                name="status"
                id="status"
              >
                <option className="p-0 m-0" value="">
                  ALL
                </option>
                {Object.keys(HrWarningStatus).map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : props.filterType === "USERS" ? (
          <div
            /** This Is Filters For Users List */ className="flex md:overflow-auto  overflow-x-scroll p-1 flex-row"
          >
            <div className="flex bg-gray-300 ring-1 ring-gray-600/30 md:ring-0 p-1 rounded-md md:bg-transparent m-2 w-full items-center justify-between">
              <label
                htmlFor="role"
                className="text-gray-700 flex items-center justify-center m-1 h-full"
              >
                Role:
              </label>
              <select
                value={props.roleValue}
                onChange={(e) => props.onRoleFilterChange(e.target.value)}
                className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
                name="role"
                id="role"
              >
                <option className="p-0 m-0" value="">
                  ALL
                </option>
                {props.roleData?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex bg-gray-300 ring-1 ring-gray-600/30 md:ring-0 p-1 rounded-md md:bg-transparent m-2 w-full items-center justify-between">
              <label
                htmlFor="membership"
                className="text-gray-700 flex items-center justify-center m-1 h-full"
              >
                Membership:
              </label>
              <select
                value={props.membershipValue}
                onChange={(e) => props.onMembershipFilterChange(e.target.value)}
                className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
                name="membership"
                id="membership"
              >
                <option className="p-0 m-0" value="">
                  ALL
                </option>
                {props.membershipData?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : props.filterType === "RATING" ? (
          <div
            /** This Is Filters For Rating List */ className="flex md:overflow-auto  overflow-x-scroll p-1 flex-row"
          >
            <div className="flex bg-gray-300 ring-1 ring-gray-600/30 md:ring-0 p-1 rounded-md md:bg-transparent m-2 w-full items-center justify-between">
              <label
                htmlFor="type"
                className="text-gray-700 flex items-center justify-center m-1 h-full"
              >
                Action
              </label>
              <select
                value={props.actionValue}
                onChange={(e) => props.onActionFilterChange(e.target.value)}
                className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
                name="action"
                id="action"
              >
                <option className="p-0 m-0" value="">
                  ALL
                </option>
                {Object.values(RatingAction)?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : props.filterType === "STANDARD" ? null : null}
        <div className="flex items-center justify-center">
          <input
            value={props.searchValue}
            placeholder="search"
            className=" border rounded-md border-gray-400 md:mb-0 mb-2 px-3 text-black h-fit"
            onChange={(e) => props.onSearchQueryChange(e.target.value)}
            type="text"
            name="search"
            id="search"
          />
        </div>
      </div>
      <button
        onClick={props.clearFilter}
        className={`${props.filterOn ? "flex" : "hidden"} btn px-5 py-0 bg-orange-100`}
      >
        Clear
        <MdFilterListOff className="mx-2" size={20} />
      </button>
    </div>
  );
}
export default QueryFilter;
