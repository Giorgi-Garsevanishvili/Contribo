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
    <div>
      {/* <div>
        <select name="type" id="type">
          {type?.map((type) => (
            <option value={type}>{type}</option>
          ))}
        </select>
      </div> */}
      <div className="flex border">
        <select
          onChange={(e) =>
            onStatusFilterChange(e.target.value as HrWarningStatus)
          }
          name="status"
          id="status"
        >
          {Object.entries(HrWarningStatus).map((status) => (
            <option value={status[0]}>{status[0]}</option>
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
