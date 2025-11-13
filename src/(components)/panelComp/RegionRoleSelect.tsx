import useRegionRole from "@/hooks/useRegionRole";

type UserDataUpdateType = {
  roleId: string;
  regionId: string;
  email?: string;
};

type RegionRoleSelectorType<U> = {
  action: React.Dispatch<React.SetStateAction<U>>;
};

function RegionRoleSelect<U>({ action }: RegionRoleSelectorType<U>) {
  const { roles, regions } = useRegionRole();
  return (
    <div className="flex w-full items-center justify-center flex-row">
      <div className="flex flex-row items-center justify-between w-[80%] p-1">
        <select
          onChange={(e) =>
            action((prev) => ({ ...prev, roleId: e.target.value }))
          }
          className="select-def"
          name="role"
          id="role"
        >
          <option className="bg-gray-700" value="">Select Role</option>
          {roles
            ? roles.map((role) => (
                <option className="bg-gray-700" key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))
            : "Oops! Something went wrong!"}
        </select>
      </div>
      <div className="flex flex-col items-center justify-between w-[80%] p-1">
        <select
          onChange={(e) =>
            action((prev) => ({ ...prev, regionId: e.target.value }))
          }
          className="select-def"
          name="role"
          id="role"
        >
          <option className="bg-gray-700" value="">Select Region</option>
          {regions
            ? regions.map((region) => (
                <option className="bg-gray-700" key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))
            : "Oops! Something went wrong!"}
        </select>
      </div>
    </div>
  );
}

export default RegionRoleSelect;
