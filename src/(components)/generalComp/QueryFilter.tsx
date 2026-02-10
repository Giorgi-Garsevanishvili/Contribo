import { HrWarningStatus } from "@/generated/enums";

type DataType = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

function QueryFilter<T>({
  onTypeFilterChange,
  onStatusFilterChange,
  onSearchQueryChange,
  typeData,
}: {
  typeData?: DataType;
  onTypeFilterChange: (type: string) => void;
  onStatusFilterChange: (status: HrWarningStatus) => void;
  onSearchQueryChange: (search: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row bg-gray-200/95 px-5 py-1 rounded-lg">
      <div className="flex m-2 flex-col items-center justify-between">
        <label htmlFor="type" className="text-gray-700 m-1 h-full">
          Type
        </label>
        <select
        onChange={(e) => onTypeFilterChange(e.target.value)}
          className="text-center h-fit rounded-lg bg-gray-400 p-0 cursor-pointer"
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
      <div className="flex m-2 flex-col items-center justify-between">
        <label htmlFor="status" className="text-gray-700 m-1 h-full">
          Status
        </label>
        <select
          className="text-center h-fit rounded-lg bg-gray-400 p-0 cursor-pointer"
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
      <div className="flex m-2 flex-col items-center justify-between">
        <label htmlFor="search" className="m-1 text-gray-700">
          Search
        </label>
        <input
          className="input-def mb-0 p-0 h-fit"
          onChange={(e) => onSearchQueryChange(e.target.value)}
          type="text"
          name="search"
          id="search"
        />
      </div>
    </div>
  );
}
export default QueryFilter;
