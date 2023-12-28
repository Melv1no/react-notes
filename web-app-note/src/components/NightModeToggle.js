import React, { useState, useEffect } from "react";

const NightModeToggle = () => {
    const [isNightMode, setIsNightMode] = useState(() => {
      // Retrieve night mode preference from local storage or default to true
      return localStorage.getItem("nightMode") === "true" || true;
    });

    useEffect(() => {
        applyNightModeStyles();
      }, [isNightMode]);
      
  const applyNightModeStyles = () => {
    const body = document.body;
    const side = document.querySelector(".Side");
    const noteboxes = document.querySelectorAll(".Notebox"); // Updated selector

    if (isNightMode) {
      body.classList.add("night-mode");
      if (side) {
        side.classList.add("night-mode");
      }
      if (noteboxes) {
        noteboxes.forEach((notebox) => {
          notebox.classList.add("night-mode");
        });
      }
    } else {
      body.classList.remove("night-mode");
      if (side) {
        side.classList.remove("night-mode");
      }
      if (noteboxes) {
        noteboxes.forEach((notebox) => {
          notebox.classList.remove("night-mode");
        });
      }
    }
  };

  const toggleNightMode = () => {
    const newNightMode = !isNightMode;
    localStorage.setItem("nightMode", newNightMode);
    setIsNightMode(newNightMode);
  };

  return (
    <div className='toggle-switch' onClick={toggleNightMode}>
      <input type='checkbox' checked={isNightMode} onChange={() => {}} />
      <label className='slider' />
    </div>
  );
};

export default NightModeToggle;
