import React, { useContext, useEffect, useState } from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { motion } from "framer-motion";
import { SessionContext } from "../contextApi/SessionContext";
import { FileX, MessageCircleOff } from "lucide-react";
import { FiPenTool } from "react-icons/fi";
import { BiPen, BiPencil } from "react-icons/bi";
import { BsPen, BsPencil } from "react-icons/bs";
import { FaPencil } from "react-icons/fa6";

export default function Narration() {
  const SESSION_ID = sessionStorage.getItem("sessionId");
  // State to hold narration data
  const [narrationData, setNarrationData] = useState({});

  // Get BACKEND_API, handleNavigation, isLoading, setIsLoading function from context
  const { BACKEND_API, handleNavigation, isLoading, setIsLoading } = useContext(SessionContext);
  // Fetch narration data from the backend API
  useEffect(() => {
    if (!SESSION_ID) return;
    const fetchNarrationData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${BACKEND_API}/api/decision/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": SESSION_ID,
          },
        });
        const data = await res.json();
        console.log("Fetched narration data:", data);
        setNarrationData(data);
      } catch (error) {
        console.error("Error fetching narration data:", error);
      } finally{
        setIsLoading(false)
      }
    };

    fetchNarrationData();
  }, []);

  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <motion.div
          className="narration-page"
          initial={{ y: "3000vh" }}
          animate={{ y: 0 }}
          transition={{
            type: "spring",
            stiffness: 29,
            damping: 11,
            mass: 1.4,
            duration: 2,
          }}
        >
          <header>
            {narrationData.agent_available === true ? (
              <div className="agent_insight">
                <div
                  className="heading"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <BiPencil />
                  <span style={{ fontSize: "11px", fontWeight: "bold" }}>
                    AI ADAPTATION NOTE
                  </span>
                </div>

                <p>{narrationData.agent_insights}</p>
              </div>
            ) : (
              ""
            )}

            <h1>Narration</h1>
            {narrationData?.agent_version ? (
              <div className="version">
                <strong>
                  v<span>{narrationData?.agent_version}</span>
                </strong>
              </div>
            ) : (
              ""
            )}
            {narrationData?.static?.goal_summary && (
              <p>
                <span>Goal summary:</span>
                {narrationData.static?.goal_summary}
              </p>
            )}
            {narrationData.static?.learning_philosophy && (
              <p>
                <span>Learning Philosophy:</span>
                {narrationData.static?.learning_philosophy}
              </p>
            )}
          </header>
          <div className="card_container">
            { isLoading ? (
              <div className="loading">
                <p>Loading narration data ...</p>
              </div>
            ) :narrationData.dynamic ? (
              narrationData.dynamic?.map((item) => (
                <motion.div
                  className="item_card"
                  key={item.current_cycle_index}
                  whileHover={{
                    scale: 1.023,
                    borderColor: "rgba(255, 106, 26, 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 200 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <h3>Duration: {item.current_phase.weeks} WEEKS</h3>
                  <b>{item.current_phase.title}</b>
                  <small>{item.current_phase.why_this_phase}</small>

                  {item.current_cycle_index === 1 && (
                    <>
                      <ol>
                        <li>
                          <p>
                            <em>Task: </em>
                            <small> {item.this_week_plan.primary.task} </small>
                          </p>
                          <ul>
                            {item.this_week_plan.primary.details.map(
                              (detail, index) => (
                                <li key={index}>
                                  <small>{detail}</small>
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                        <li>
                          <p>
                            <em>Task: </em>
                            <small>{item.this_week_plan.secondary.task}</small>
                          </p>
                          <ul>
                            {item.this_week_plan.secondary.details.map(
                              (detail, index) => (
                                <li key={index}>
                                  <small>{detail}</small>
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                      </ol>
                      <small style={{ fontSize: "14px" }}>
                        {item.what_to_focus_on}
                      </small>
                    </>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="error">
                <MessageCircleOff size={70} height={80} />
                <span>
                  Start Forging to view narration.{" "}
                  <em onClick={handleNavigation}>Back to Homepage</em>{" "}
                </span>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
