import { HrWarningStatus } from "@/generated/enums";
import { IoFilterSharp } from "react-icons/io5";
import { MdFilterListOff } from "react-icons/md";

type DataType = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

function QueryFilter({
  clearFilter,
  onTypeFilterChange,
  onStatusFilterChange,
  onSearchQueryChange,
  typeValue,
  statusValue,
  searchValue,
  typeData,
  filterOn,
}: {
  typeData?: DataType;
  typeValue: string;
  statusValue: string;
  searchValue: string;
  onTypeFilterChange: (type: string) => void;
  onStatusFilterChange: (status: HrWarningStatus) => void;
  onSearchQueryChange: (search: string) => void;
  filterOn: boolean;
  clearFilter: () => void;
}) {
  return (
    <div className="flex flex-col shadow-md shadow-white bg-gray-200/95 px-5 rounded-lg">
      <div className="flex mt-2 items-center justify-center">
        <h3 className="px-4">Filter</h3>
        <IoFilterSharp size={20} />
      </div>

      <div className="flex flex-col p-1 md:flex-row">
        <div className="flex m-2 w-full items-center justify-between">
          <label
            htmlFor="type"
            className="text-gray-700 flex items-center justify-center m-0.5 h-full"
          >
            Type:
          </label>
          <select
            value={typeValue}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
            name="type"
            id="type"
          >
            <option className="p-0 m-0" value="">
              ALL
            </option>
            {typeData?.map((item, index) => (
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
            value={statusValue}
            className="text-center px-0.5 h-fit rounded-sm bg-gray-300 cursor-pointer"
            onChange={(e) =>
              onStatusFilterChange(e.target.value as HrWarningStatus)
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
        <div className="flex items-center justify-center">
          <input
            value={searchValue}
            placeholder="search"
            className=" border rounded-md border-gray-400 mb-0 px-3 text-black h-fit"
            onChange={(e) => onSearchQueryChange(e.target.value)}
            type="text"
            name="search"
            id="search"
          />
        </div>
        <button
          onClick={clearFilter}
          className={`${filterOn ? "flex" : "hidden"} btn px-5 py-0 bg-orange-100`}
        >
          Clear 
          <MdFilterListOff className="mx-2" size={20} />
        </button>
      </div>
    </div>
  );
}
export default QueryFilter;
