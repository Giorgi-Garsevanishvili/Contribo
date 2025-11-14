import MiniDashCard from "@/(components)/panelComp/MiniDashCard";
import React from "react";

function page() {
  return (
    <MiniDashCard
      type="user"
      deleteMethod="allowedUser"
      detailPage="AllowedUser"
      title="Allowed Users"
      searchKey={"email"}
      axiosGet="/api/console/allowed-users"
      axiosPost="/api/console/allowed-users"
    />
  );
}

export default page;
