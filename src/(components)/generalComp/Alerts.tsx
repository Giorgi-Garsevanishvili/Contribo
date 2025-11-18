import React from "react";

export type AlertType = {
  message: string;
  type: "error" | "warning" | "success";
  isOpened: boolean;
};

type TriggerAlertParams = AlertType & {
  setState: React.Dispatch<React.SetStateAction<AlertType>>;
};

export const AlertObj = {
  message: "",
  type: "success",
  isOpened: false,
} as AlertType;

export const triggerAlert = ({
  message,
  type,
  isOpened,
  setState,
}: TriggerAlertParams) => {
  setState({ message, type, isOpened });
};

function Alerts({ message, type, isOpened }: AlertType) {
  const alertColor =
    type === "error"
      ? "#e90505"
      : type === "success"
      ? "#007a10"
      : type === "warning"
      ? "#c49b05"
      : "#000000";

  return (
    <section
      style={{
        borderTopColor: alertColor,
      }}
      className={`flex ${
        isOpened
          ? "opacity-100 h-auto p-2.5 "
          : "h-0 p-0 m-0 opacity-0 overflow-hidden"
      } duration-500 transition-all w-full ease-in-out border-t-6 font-bold text-amber-950 items-center justify-center bg-[#d4d4d4] rounded-sm  `}
    >
      {message}
    </section>
  );
}

export default Alerts;
