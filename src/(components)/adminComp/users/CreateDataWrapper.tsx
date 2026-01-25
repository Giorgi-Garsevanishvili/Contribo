import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";

type Props<T extends object = object> = {
  Component: React.ComponentType<T>;
  componentProps?: T;
  title: string;
};

function CreateDataWrapper<T extends object>({
  Component,
  componentProps,
  title,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex transition-all duration-300 flex-col shadow-sm rounded-2xl m-1 p-0 justify-between w-full bg-gray-200/60">
      <button
        onClick={() => setOpen(!open)}
        className="flex px-8 py-3 btn justify-between transition-all duration-300 w-full m-0 bg-gray-300/85 shadow-md mb-2"
      >
        <h2>{title}</h2>
        {open ? (
          <FaAngleUp className="animate-pulse" size={22} />
        ) : (
          <FaAngleDown className="animate-pulse" size={22} />
        )}
      </button>
      <div className={open ? "flex" : "hidden"}>
        <Component {...(componentProps as T)} />
      </div>
    </div>
  );
}

export default CreateDataWrapper;
