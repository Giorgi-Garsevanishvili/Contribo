import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";
import React from "react";

function page() {
  return (
    <MiniDashDetails
      type="general"
      title="Roles"
      axiosGet="/api/console/roles"
      axiosPut="/api/console/roles"
      deleteMethod="role"
    />
  );
}

export default page;
