import useRegionRole from "@/hooks/useRegionRole";
import { AllowedUsersWithRelations } from "@/types/general-types";

type UserDataUpdateType = {
  roleId: string[];
  regionId: string;
  email?: string;
};

type RegionRoleSelectorType<U> = {
  action: React.Dispatch<React.SetStateAction<U>>;
  user?: AllowedUsersWithRelations;
};

function RegionRoleSelect<U extends UserDataUpdateType>({
  action,
  user,
}: RegionRoleSelectorType<U>) {
  const { roles, regions } = useRegionRole();
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="flex flex-wrap items-start justify-start w-[90%] p-1 overflow-auto">
        {roles
          ? roles.map((role) => (
              <div key={role.id} className="select-def w-fit p-0.5 m-1">
                <label htmlFor={role.id}>{role.name}</label>
                <input
                  id={role.id}
                  
                  onChange={(e) =>
                    action((prev) => {
                      const id = role.id;
                      const isChecked = e.target.checked;
                      //Logic for check and for clear role need adjustments
                      const cleanId = prev.roleId.filter((r) => r !== "");
                      return {
                        ...prev,
                        roleId: isChecked
                          ? [...cleanId, id]
                          : cleanId.filter((r) => r !== id),
                      };
                    })
                  }
                  className="bg-gray-700 m-1"
                  type="checkbox"
                  key={role.id}
                  value={role.id}
                />
              </div>
            ))
          : "Oops! Something went wrong!"}
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
          <option className="bg-gray-700" value="">
            Select Region
          </option>
          {regions
            ? regions.map((region) => (
                <option
                  className="bg-gray-700"
                  key={region.id}
                  value={region.id}
                >
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
