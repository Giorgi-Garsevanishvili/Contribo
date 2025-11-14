import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";
import React from "react";

function page() {
  return (
    <MiniDashDetails
      type="general"
      title="Event Roles"
      axiosGet="/api/console/event-roles"
      axiosPut="/api/console/event-roles"
      deleteMethod="eventRoles"
    />
  );
}

export default page;
