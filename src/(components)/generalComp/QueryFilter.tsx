import { HrWarningStatus } from "@/generated/enums";

function QueryFilter<T>({
  onTypeFilterChange,
  onStatusFilterChange,
  onSearchQueryChange,
  type,
}: {
  type?: T[];
  onTypeFilterChange: (type: string) => void;
  onStatusFilterChange: (status: HrWarningStatus) => void;
  onSearchQueryChange: (search: string) => void;
}) {
  return (
    <div className="flex bg-gray-200/95 px-3 py-1 rounded-lg">
      {/* <div>
        <select name="type" id="type">
          {type?.map((type) => (
            <option value={type}>{type}</option>
          ))}
        </select>
      </div> */}
      <div className="flex border rounded-2lg">
        <select
          onChange={(e) =>
            onStatusFilterChange(e.target.value as HrWarningStatus)
          }
          name="status"
          id="status"
        >
          <option value=""></option>
          {Object.entries(HrWarningStatus).map((status, index) => (
            <option key={index} value={status[0]}>{status[0]}</option>
          ))}
        </select>
      </div >
      <div className="flex border">
        <input
        className="input-def"
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
