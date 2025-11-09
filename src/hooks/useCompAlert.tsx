import { AlertType } from "@/(components)/generalComp/Alerts";
import {
  alertState,
  closeAlert,
  setCompAlert,
} from "@/redux/features/componentAlert/componentAlertSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useCompAlertStet = () => {
  const dispatchAlertComp = useDispatch<AppDispatch>();
  const compAlertState = useSelector(alertState);

  const triggerCompAlert = ({ message, type, isOpened }: AlertType) => {
    dispatchAlertComp(
      setCompAlert({
        message,
        type,
        isOpened,
      })
    );
  };

  useEffect(() => {
    if (!compAlertState.isOpened) return;
    const compTimeoutId = setTimeout(
      () => dispatchAlertComp(closeAlert()),
      3000
    );
    return () => clearTimeout(compTimeoutId);
  }, [compAlertState.isOpened]);

  return { triggerCompAlert };
};
