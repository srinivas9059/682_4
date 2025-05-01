import React, { useEffect, useState } from "react";
import "../dark.css";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const shouldUseDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (shouldUseDark) {
      document.body.classList.add("dark-mode");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const isCurrentlyDark = document.body.classList.contains("dark-mode");
    if (isCurrentlyDark) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button id="dark-mode-toggle" onClick={toggleDarkMode}>
      {isDark ? (
        <img
          src="https://csimg.nyc3.digitaloceanspaces.com/Contact-Page/sun.svg"
          alt="Light Mode"
          width="24"
          height="24"
          style={{ filter: "invert(1)" }}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 480 480"
          width="24"
          height="24"
          fill="#f0f0f0"
        >
          <path d="M459.782 347.328c-4.288-5.28-11.488-7.232-17.824-4.96-17.76 6.368-37.024 9.632-57.312 9.632-97.056 0-176-78.976-176-176 0-58.4 28.832-112.768 77.12-145.472 5.472-3.712 8.096-10.4 6.624-16.832S285.638 2.4 279.078 1.44C271.59.352 264.134 0 256.646 0c-132.352 0-240 107.648-240 240s107.648 240 240 240c84 0 160.416-42.688 204.352-114.176 3.552-5.792 3.04-13.184-1.216-18.496z" />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;
