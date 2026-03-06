import { useConfirmTab } from "@/hooks/useConfirmTab";
import { useUpdateData } from "@/hooks/useDataUpdate";
import { useEffect, useState } from "react";

type RoleData = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}[];

type UpdateRolePayload = {
  roleId?: string[];
};

function AccessToggle({
  userRoles,
  AccessUrl,
  role,
  user,
  roleData,
  refetchList,
}: {
  roleData: RoleData;
  userRoles: string[];
  AccessUrl: string;
  user: string;
  role: string;
  refetchList: () => void;
}) {
  const { ask } = useConfirmTab();
  const accessID = roleData?.find((userRole) => userRole.name === role);
  const [userRolesUpdate, setUserRolesUpdate] = useState<UpdateRolePayload>({});
  const hasAccess = userRoles.some((userRole) => userRole === accessID?.id);
  const { triggerUpdateData } = useUpdateData(
    AccessUrl,
    userRolesUpdate,
    refetchList,
  );

  useEffect(() => {
    if (!userRolesUpdate.roleId) return;
    triggerUpdateData();
  }, [userRolesUpdate]);

  const handleToggle = async () => {
    const confirm = await ask({
      title:
        role === "RESTRICT" && hasAccess
          ? "Would You Like To Remove Access Restriction"
          : role === "RESTRICT" && !hasAccess
            ? "Would You Like To Restrict Access"
            : hasAccess
              ? `Would You Like To Revoke ${role} Access`
              : `Would You Like To Grant ${role} Access`,

      message:
        role === "RESTRICT" && hasAccess
          ? "By Granting Access, User Will Gain Full Access On Platform"
          : role === "RESTRICT" && !hasAccess
            ? " By Restricting Access User Will Lose Full Access On Platform"
            : hasAccess
              ? `By Revoking ${role} Access, User Will Lose All ${role} privileges`
              : `By Granting ${role} Access, User Will Get All ${role} privileges`,
      value: `For ${user}`,
    });

    if (!confirm || !accessID) return;

    const updatedAccess = hasAccess
      ? userRoles.filter((r) => r !== accessID.id) // remove
      : [...userRoles, accessID.id]; // add

    setUserRolesUpdate({ roleId: updatedAccess });
  };

  return (
    <div className="flex border border-gray-600/30 truncate rounded-md flex-col justify-center items-center">
      <label className="inline-flex m-4 items-center cursor-pointer">
        <span className="select-none text-sm font-medium text-heading">
          Revoke
        </span>
        <input
          onChange={handleToggle}
          checked={hasAccess}
          type="checkbox"
          className="sr-only peer"
        />
        <div className="relative mx-2 w-10 h-5 bg-red-800 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-brand-soft dark:peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:start-1px after:bg-white after:rounded-full after:ring-1 after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800"></div>
        <span className="select-none text-sm font-medium text-heading">
          Grant
        </span>
      </label>
    </div>
  );
}

export default AccessToggle;
