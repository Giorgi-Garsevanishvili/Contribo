import MiniDashDetails from "@/(components)/panelComp/MiniDashDetails";
import React from "react";

function page() {
  return (
    <MiniDashDetails
      type="general"
      title="Member Status"
      axiosGet="/api/console/member-status"
      axiosPut="/api/console/member-status"
      deleteMethod="memberStatus"
    />
  );
}

export default page;
