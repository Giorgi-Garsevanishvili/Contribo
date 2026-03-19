import React from "react";
import DeleteButtonAdmin from "../users/DeleteButtonAdmin";
import RemoveRegionRoles from "./RemoveRegionRoles";
import AccessToggle from "./AccessToggle";
import { ImSpinner9 } from "react-icons/im";
import { IoMdGlobe } from "react-icons/io";
import AccessBoxMobile from "./AccessBoxMobile";
import DetailsInfo from "./DetailsInfo";

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

type DetailData = {
  id: string;
  createdBy: {
    name: string | null;
  } | null;
  createdAt: string;
  updatedBy: {
    name: string | null;
  } | null;
  updatedAt: string | null;
};

type RoleData = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}[];

function AccessCard({
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
  const DetailInfoData = {
    id: access.id,
    updatedAt: access.updatedAt,
    createdAt: access.createdAt,
    updatedBy: access.updatedBy,
    createdBy: access.createdBy,
  } as DetailData;

  return (
    <>
      <div className="md:flex hidden justify-center items-center gap-1.5">
        <IoMdGlobe size={18} className="text-gray-500" />
        <h3 className="font-medium truncate">
          {access.region ? access.region.name : "No Data"}
        </h3>
      </div>

      <div className="md:flex hidden border border-gray-600/30 p-2 pt-0 md:pt-2 rounded-md flex-col md:flex-row justify-center items-center md:justify-start">
        <h3 className="flex md:hidden p-1 font-bold">Roles</h3>
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

      <div className="hidden md:flex items-center justify-center">
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

      <div className="hidden md:flex items-center justify-center">
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

      <div className="md:flex hidden w-full items-center justify-center ">
        <RemoveRegionRoles
          allowedUserId={access.id}
          refetch={refetch}
          user={access}
        />
      </div>

      <div className="md:flex hidden w-full items-center justify-center ">
        <DeleteButtonAdmin
          url={`/api/admin/allowedUsers/${access.id}`}
          fetchAction={refetch}
          value={`Access For ${access.user?.name || access.email}`}
          styleClass="items-center justify-center p-2 md:w-fit h-fit bg-gray-400/40 text-gray-950 border border-gray-700/20 hover:border-red-800 hover:text-red-800"
          message="This Action will delete Access with all user related data"
        />
      </div>

      <AccessBoxMobile
        isLoading={isLoading}
        roles={roles}
        refetch={refetch}
        toggleInfo={toggleInfo}
        access={access}
      />

      <DetailsInfo details={access} />
    </>
  );
}

export default AccessCard;
