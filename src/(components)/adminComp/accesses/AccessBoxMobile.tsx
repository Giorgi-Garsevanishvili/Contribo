import React from "react";
import RemoveRegionRoles from "./RemoveRegionRoles";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";
import AccessToggle from "./AccessToggle";
import { ImSpinner9 } from "react-icons/im";

type Data = {
  user: {
    image: string | null;
    name: string | null;
    memberStatusLogs: {
      status: {
        name: string;
      } | null;
    }[];
  } | null;
  id: string;
  createdBy: {
    name: string | null;
  } | null;
  createdAt: string;
  updatedBy: {
    name: string | null;
  } | null;
  updatedAt: string | null;
  email: string;
  roles: {
    role: {
      name: string;
    };
    roleId: string;
  }[];
  regionId: string | null;
  region: {
    name: string;
  } | null;
};

type RoleData = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}[];

function AccessBoxMobile({
  toggleInfo,
  access,
  isLoading,
  roles,
  refetch,
}: {
  toggleInfo: string;
  access: Data;
  isLoading: boolean;
  roles: RoleData;
  refetch: () => void;
}) {
  return (
    <div
      className={`md:hidden ${toggleInfo === access.id ? "flex" : "hidden"} rounded-md bg-gray-400/20 border border-gray-700/40 w-full p-2 gap-1 flex-col`}
    >
      <h3 className="flex md:hidden p-1 font-bold">Roles</h3>
      <div className="flex md:hidden border border-gray-600/30 p-2 rounded-md flex-col md:flex-row justify-center items-center md:justify-start">
        <div className="font-medium flex gap-2 truncate">
          {access
            ? access.roles.map((role, index) => (
                <h2
                  key={index}
                  className="rounded-lg border px-1.5 py-0.5 bg-gray-300/50 border-gray-500/50"
                >
                  {role.role.name}
                </h2>
              ))
            : "No Data"}
        </div>
      </div>

      <h3 className="flex md:hidden font-bold">Grant Admin Access:</h3>
      <div className="md:hidden flex items-center justify-center">
        {isLoading ? (
          <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-2 justify-center">
            <ImSpinner9 className="animate-spin" size={20} />
          </div>
        ) : roles ? (
          <AccessToggle
            user={access.user?.name ?? "User"}
            refetchList={refetch}
            roleData={roles}
            AccessUrl={`/api/admin/allowedUsers/${access.id}`}
            userRoles={access.roles.map((role) => role.roleId) ?? []}
            role="ADMIN"
          />
        ) : (
          "Fetch Failed"
        )}
      </div>

      <h3 className="flex md:hidden p-1 font-bold">Restrict Access:</h3>
      <div className="md:hidden flex items-center justify-center">
        {isLoading ? (
          <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-2 justify-center">
            <ImSpinner9 className="animate-spin" size={20} />
          </div>
        ) : roles ? (
          <AccessToggle
            user={access.user?.name ?? "User"}
            refetchList={refetch}
            roleData={roles}
            AccessUrl={`/api/admin/allowedUsers/${access.id}`}
            userRoles={access.roles.map((role) => role.roleId) ?? []}
            role="RESTRICT"
          />
        ) : (
          "Fetch Failed"
        )}
      </div>
      <h3 className="flex md:hidden font-bold">Delete Access</h3>
      <div className="md:hidden flex items-center justify-center">
        <DeleteButtonAdmin
          url={`/api/admin/allowedUsers/${access.id}`}
          fetchAction={refetch}
          value={`Access For ${access.user?.name || access.email}`}
          styleClass="w-full items-center justify-center p-2 md:w-fit h-fit bg-gray-400/40 text-gray-950 border border-gray-700/20 hover:border-red-800 hover:text-red-800"
          message="This Action will delete Access with all user related data"
        />
      </div>
      <RemoveRegionRoles
        allowedUserId={access.id}
        refetch={refetch}
        user={access}
      />
    </div>
  );
}

export default AccessBoxMobile;
