import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

import React from "react";

function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      deleteMethod="role"
      detailPage="roles"
      title="Roles"
      searchKey={"name"}
      axiosGet="/api/console/roles"
      axiosPost="/api/console/roles"
    />
  );
}

export default eventRoles;
