import React, { useEffect, useState } from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { motion } from "framer-motion";

export default function Narration() {
  // goal_summary, learning_philosophy, current_phase.title,
  // this_week_plan, what_to_focus_on, how_to_measure_progress

  // State to hold narration data
  const [narrationData, setNarrationData] = useState(null);

  // Fetch narration data from the backend API
  useEffect(() => {
    const fetchNarrationData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/decision/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
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
        {narrationData.map((data) => {
          <motion.div
            className="narration-page"
            initial={{ y: "3000vh" }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 25,
              damping: 11,
              mass: 1.5,
            }}
          >
            <header>
              <h1>Narration</h1>
              <p>
                {/* Goal summary */}
                {data.goal_summary}
              </p>
            </header>
            <div className="response">
              <p>{data.learning_philosophy}</p>
              <em>Current Strategy Overview</em>
              <div className="response-card">
                <h3>{data.current_phase.title}</h3>
                <p>{data.current_phase.why_this_phase}</p>

                <span className="sub-title">
                  {/* This week plan */}
                  Weekly Objectives
                </span>
                <ul>
                  <li>
                    <span>
                      <strong>Task:</strong>
                      {data.this_week_plan.task}
                    </span>
                    <span>
                      <strong>Details:</strong>
                      {data.this_week_plan.details}
                    </span>
                  </li>
                  <li>{data.what_to_focus_on}</li>
                  <li>{data.how_to_measure_progress}</li>
                </ul>
              </div>
            </div>
          </motion.div>;
        })}
      </div>
    </>
  );
}
