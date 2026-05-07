"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const storedDark = localStorage.getItem("dark");
    let isDark: boolean;

    if (storedDark === null) {
      isDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      isDark = storedDark === "true";
    }

    setDark(isDark);
    updateBodyClass(isDark);
  }, []);

  const updateBodyClass = (isDark: boolean) => {
    const body = document.querySelectorAll(".layout-body");

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

  return {
    dark,
    toggleTheme,
  };
}