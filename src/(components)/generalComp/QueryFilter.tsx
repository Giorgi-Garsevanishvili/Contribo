import { HrWarningStatus } from "@/generated/enums";
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

type FilterType = "UNIVERSAL" | "HR-CASES" | "USERS";

type FilterPropType =
  | {
      filterType: "HR-CASES";
      typeData?: DataType; // For HR Cases
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
      roleData?: RoleRegionMembershipDataType;
      regionData?: RoleRegionMembershipDataType;
      membershipData?: RoleRegionMembershipDataType;
      regionValue: string;
      roleValue: string;
      membershipValue: string;
      searchValue: string;
      onRegionFilterChange: (region: string) => void;
      onRoleFilterChange: (role: string) => void;
      onMembershipFilterChange: (membership: string) => void;
      onSearchQueryChange: (search: string) => void;
      filterOn: boolean;
      clearFilter: () => void;
    };

function QueryFilter(props: FilterPropType) {
  return (
    <div className="flex flex-col shadow-md shadow-white bg-gray-200/95 px-5 rounded-lg">
      <div className="flex mt-2 items-center justify-center">
        <h3 className="px-4">Filter</h3>
        <IoFilterSharp size={20} />
      </div>

      <div className="flex flex-col p-1 md:flex-row">
        {props.filterType === "HR-CASES" ? (
          <div
            /** This Is Filters For HR cases */ className="flex flex-col p-1 md:flex-row"
          >
            <div className="flex m-2 w-full items-center justify-between">
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
            <div className="flex m-2 w-full items-center justify-between">
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
            /** This Is Filters For Users List */ className="flex flex-col p-1 md:flex-row"
          >
            <div className="flex m-2 w-full items-center justify-between">
              <label
                htmlFor="type"
                className="text-gray-700 flex items-center justify-center m-1 h-full"
              >
                Role:
              </label>
              <select
                value={props.roleValue}
                onChange={(e) => props.onRoleFilterChange(e.target.value)}
                className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
                name="type"
                id="type"
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
            <div className="flex m-2 w-full items-center justify-between">
              <label
                htmlFor="type"
                className="text-gray-700 flex items-center justify-center m-1 h-full"
              >
                Region:
              </label>
              <select
                value={props.regionValue}
                onChange={(e) => props.onRegionFilterChange(e.target.value)}
                className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
                name="type"
                id="type"
              >
                <option className="p-0 m-0" value="">
                  ALL
                </option>
                {props.regionData?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex m-2 w-full items-center justify-between">
              <label
                htmlFor="type"
                className="text-gray-700 flex items-center justify-center m-1 h-full"
              >
                Membership:
              </label>
              <select
                value={props.membershipValue}
                onChange={(e) => props.onMembershipFilterChange(e.target.value)}
                className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
                name="type"
                id="type"
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
        ) : null}
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
        <button
          onClick={props.clearFilter}
          className={`${props.filterOn ? "flex" : "hidden"} btn px-5 py-0 bg-orange-100`}
        >
          Clear
          <MdFilterListOff className="mx-2" size={20} />
        </button>
      </div>
    </div>
  );
}
export default QueryFilter;
