"use client";

import { HiOutlineSun } from "react-icons/hi2";
import { FaMoon } from "react-icons/fa";
import { useTheme } from "./useTheme";

function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-20 z-150 right-4 md:right-6 md:bottom-5 ring ring-gray-900/30 bg-gray-200 rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75 duration-200"
    >
      {dark ? <HiOutlineSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;
