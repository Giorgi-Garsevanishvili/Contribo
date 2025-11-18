"use client";
import { useSelector } from "react-redux";
import { alertState } from "./componentAlertSlice";

import Alerts from "@/(components)/generalComp/Alerts";

export const CompAlert = () => {
  const compAlertState = useSelector(alertState);

  return (
    <div className="fixed  z-10 top-3 right-0 m-0 p-0 min-w-[20rem] min-h-[5rem]">
      <Alerts {...compAlertState} />
    </div>
  );
};
