import React, { useContext, useEffect, useState } from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { motion } from "framer-motion";
import { SessionContext } from "../contextApi/SessionContext";

export default function Narration() {
  const SESSION_ID = sessionStorage.getItem("sessionId");
  // State to hold narration data
  const [narrationData, setNarrationData] = useState({});

  // Fetch narration data from the backend API
  useEffect(() => {
    if (!SESSION_ID) return;
    const fetchNarrationData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/decision/get", {
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
            <h1>Narration</h1>
            <p>
              <span>Goal summary:</span>
              {narrationData.static?.goal_summary}
            </p>
            <p>
              <span>Learning Philosophy:</span>
              {narrationData.static?.learning_philosophy}
            </p>
          </header>
          <div className="card_container">
            {narrationData.dynamic?.map((item) => (
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
                <h3>Week: {item.current_phase.weeks} WEEKS</h3>
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
                          <li>
                            <small>{item.this_week_plan.primary.details}</small>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <p>
                          <em>Task: </em>
                          <small> {item.this_week_plan.secondary.task} </small>
                        </p>
                        <ul>
                          <li>
                            <small>
                              {item.this_week_plan.secondary.details}
                            </small>
                          </li>
                        </ul>
                      </li>
                    </ol>
                    {/* <span>{item.current_phase.summary}</span> */}
                    <small style={{ fontSize: "14px" }}>
                      {item.what_to_focus_on}
                    </small>
                    {/* <small> {item.how_to_measure_progress} </small> */}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
