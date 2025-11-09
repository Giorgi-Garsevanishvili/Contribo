import { useSelector } from "react-redux";
import { alertState } from "./componentAlertSlice";

import Alerts from "@/(components)/generalComp/Alerts";

export const CompAlert = () => {
  const compAlertState = useSelector(alertState);

  return (
    <div className="flex items-center justify-center m-0 p-0 w-[95%]">
      <Alerts {...compAlertState} />
    </div>
  );
};
