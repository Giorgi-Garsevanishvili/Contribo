import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

import React from "react";

function eventRoles() {
  return (
    <MiniDashCard
      type="general"
      deleteMethod="memberStatus"
      detailPage="memberStatus"
      title="Member Status"
      searchKey={"name"}
      axiosGet="/api/console/member-status"
      axiosPost="/api/console/member-status"
    />
  );
}

export default eventRoles;
