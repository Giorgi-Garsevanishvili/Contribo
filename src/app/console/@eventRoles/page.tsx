import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

import React from "react";

function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      deleteMethod="eventRoles"
      detailPage="eventRoles"
      title="Event Role"
      searchKey={"name"}
      axiosGet="/api/console/event-roles"
      axiosPost="/api/console/event-roles"
    />
  );
}

export default eventRoles;
