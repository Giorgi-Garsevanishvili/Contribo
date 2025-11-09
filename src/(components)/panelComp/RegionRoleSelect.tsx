import useRegionRole from "@/hooks/useRegionRole";

type UserDataUpdateType = {
  roleId: string;
  regionId: string;
  email?: string;
};

type RegionRoleSelectorType = {
  action: React.Dispatch<React.SetStateAction<UserDataUpdateType>>;
};

function RegionRoleSelect({ action }: RegionRoleSelectorType) {
  const { roles, regions } = useRegionRole();
  return (
    <div className="flex w-full items-center justify-center flex-row">
      <div className="flex flex-row items-center justify-between w-[80%] p-1">
        <label htmlFor="role">Role: </label>
        <select
          onChange={(e) =>
            action((prev) => ({ ...prev, roleId: e.target.value }))
          }
          className=" flex cursor-pointer bg-[#e7e7e7c7] text-black flex-grow items-center justify-center mx-2 p-0.5 rounded-md"
          name="role"
          id="role"
        >
          <option value=""></option>
          {roles
            ? roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))
            : "Oops! Something went wrong!"}
        </select>
      </div>
      <div className="flex flex-row items-center justify-between w-[80%] p-1">
        <label htmlFor="role">Region: </label>
        <select
          onChange={(e) =>
            action((prev) => ({ ...prev, regionId: e.target.value }))
          }
          className=" flex cursor-pointer bg-[#e7e7e7c7] text-black flex-grow items-center justify-center mx-2 p-0.5 rounded-md"
          name="role"
          id="role"
        >
          <option value=""></option>
          {regions
            ? regions.map((region) => (
                <option key={region.id} value={region.id}>
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
