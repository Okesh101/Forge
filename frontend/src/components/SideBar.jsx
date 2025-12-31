import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("/form");
  const location = useLocation();

  // Function to determine button class based on active state
  function buttonFunction(currentBtn) {
    if (activeButton === currentBtn) return "active";
    else return "";
  }

  // Function to handle side effects when activeButton changes
  useEffect(() => {
    switch (location.pathname) {
      case "/form":
        // Handle form button click
        setActiveButton("form");
        break;
      case "/narration":
        // Handle narration button click
        setActiveButton("narration");
        break;
      case "/analytics":
        // Handle analytics button click
        setActiveButton("analytics");
        break;
      case "/timeline":
        // Handle timeline button click
        setActiveButton("timeline");
        break;
      default:
        // Set default active button as form
        setActiveButton("form");
        break;
    }
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <button
        onClick={() => {
          navigate("/form");
          setActiveButton("form");
        }}
        className={buttonFunction("form")}
      >
        Strategy Builder
      </button>
      <button
        onClick={() => {
          navigate("/narration");
          setActiveButton("narration");
        }}
        className={buttonFunction("narration")}
      >
        Narration
      </button>
      <button
        onClick={() => {
          navigate("/analytics");
          setActiveButton("analytics");
        }}
        className={buttonFunction("analytics")}
      >
        Analytics
      </button>
      <button
        onClick={() => {
          navigate("/timeline");
          setActiveButton("timeline");
        }}
        className={buttonFunction("timeline")}
      >
        Timeline
      </button>
      <button onClick={() => navigate("/")}>Back to HomePage</button>
    </div>
  );
}
