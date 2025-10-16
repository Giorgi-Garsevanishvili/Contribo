"use client";
import { HiOutlineSun } from "react-icons/hi2";
import { FaMoon } from "react-icons/fa";

import { useEffect, useState } from "react";

function Theme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const dark = localStorage.getItem("dark");
    let isDark: boolean;

    if (dark === null) {
      isDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      isDark = dark === "true";
    }

    setDark(isDark);
    updateBodyClass(isDark);
  }, []);

  const updateBodyClass = (isDark: boolean) => {
    const body = document.querySelectorAll(".layout-body");
    if (!body) return;

    body.forEach((e) => {
      e.classList.remove(isDark ? "bg-qirvex-l" : "bg-qirvex-d");
      e.classList.add(isDark ? "bg-qirvex-d" : "bg-qirvex-l");
    });
  };

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("dark", String(newDark));
    updateBodyClass(newDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-4 bg-gray-200 rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75 duration-200"
    >
      {dark ? <HiOutlineSun /> : <FaMoon />}
    </button>
  );
}
export default Theme;
