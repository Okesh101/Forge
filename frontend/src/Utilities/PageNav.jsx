import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWindowSize } from "../hook/useWindowSize";
import { FiMenu, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

export default function PageNav() {
  const { width } = useWindowSize();

  const [showSideBar, setShowSideBar] = useState(false);

  const SESSION_ID = sessionStorage.getItem("sessionId");

  const navigate = useNavigate();
  const [activeMobileBtn, setActiveMobileBtn] = useState("form");
  const location = useLocation();
  const isMobile = width <= 883;

  // Function to determine button class based on active state
  function buttonFunction(currentBtn) {
    if (activeMobileBtn === currentBtn) return "active";
    else return "";
  }

  // Function to handle side effects when activeMobileBtn changes
  useEffect(() => {
    switch (location.pathname) {
      case "/form":
        // Handle form button click
        setActiveMobileBtn("form");
        break;
      case "/logSession":
        // Handle logSession button click
        setActiveMobileBtn("logSession");
        break;
      case "/narration":
        // Handle narration button click
        setActiveMobileBtn("narration");
        break;
      case "/analytics":
        // Handle analytics button click
        setActiveMobileBtn("analytics");
        break;
      case "/timeline":
        // Handle timeline button click
        setActiveMobileBtn("timeline");
        break;
      case "/how-it-works":
        // Handle how-it-works button click
        setActiveMobileBtn("how-it-works");
        break;
      default:
        // Set default active button as form
        setActiveMobileBtn("form");
        break;
    }
  }, [location.pathname]);
  return (
    <>
      {!isMobile && (
        <div className="page-nav">
          <motion.span
            className="session_id"
            initial={{ x: "-1800px" }}
            animate={{ x: "0px" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 50 }}
          >
            {SESSION_ID ? (
              <>
                <strong>Session Id</strong> : {SESSION_ID}
              </>
            ) : (
              <div className="no_ID">Start Forging to get a Session ID</div>
            )}
          </motion.span>
          <motion.h1
            initial={{ x: "400px" }}
            animate={{ x: "10px" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 50 }}
          >
            Forge
          </motion.h1>
        </div>
      )}

      {isMobile && (
        <div className="mobile_nav">
          <div className="page-nav">
            <section>
              <motion.h1
                initial={{ x: "400px" }}
                animate={{ x: "10px" }}
                transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
              >
                Forge
              </motion.h1>
              {SESSION_ID ? (
                <>
                  <strong>Session Id</strong> : {SESSION_ID}
                </>
              ) : (
                <div className="no_ID">Start Forging to get a Session ID</div>
              )}
            </section>

            <motion.button
              initial={{ x: "-400px" }}
              animate={{ x: "0px" }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              onClick={() => setShowSideBar(true)}
            >
              <FiMenu className="menu-icon" size={30} />
            </motion.button>
          </div>

          {showSideBar && (
            <motion.div
              className="mobile_sidebar"
              initial={{ x: "-400px" }}
              animate={{ x: 0 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 70,
                originX: 0,
              }}
            >
              <FiX
                onClick={() => setShowSideBar(false)}
                className="cancel_btn"
                size={30}
              />
              <div className="mobile_btns">
                {location.pathname === "/form" ? (
                  <button
                    onClick={() => {
                      navigate("/form");
                      setActiveMobileBtn("form");
                    }}
                    className={buttonFunction("form")}
                  >
                    Strategy Builder
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/logSession");
                      setActiveMobileBtn("logSession");
                    }}
                    className={buttonFunction("logSession")}
                  >
                    Log Practice Session
                  </button>
                )}

                <button
                  onClick={() => {
                    navigate("/narration");
                    setActiveMobileBtn("narration");
                  }}
                  className={buttonFunction("narration")}
                >
                  Narration
                </button>
                <button
                  onClick={() => {
                    navigate("/analytics");
                    setActiveMobileBtn("analytics");
                  }}
                  className={buttonFunction("analytics")}
                >
                  Analytics
                </button>
                <button
                  onClick={() => {
                    navigate("/timeline");
                    setActiveMobileBtn("timeline");
                  }}
                  className={buttonFunction("timeline")}
                >
                  Timeline
                </button>
                <button
                  onClick={() => {
                    navigate("/how-it-works");
                    setActiveMobileBtn("how-it-works");
                  }}
                  className={buttonFunction("how-it-works")}
                >
                  How It Works
                </button>
                <button onClick={() => navigate("/")}>Back to HomePage</button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}
