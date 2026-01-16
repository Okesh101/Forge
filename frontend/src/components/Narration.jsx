import React, { useContext, useEffect, useState } from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { motion } from "framer-motion";
import { SessionContext } from "../contextApi/SessionContext";

export default function Narration() {
  const SESSION_ID = sessionStorage.getItem("sessionId");
  // State to hold narration data
  const [narrationData, setNarrationData] = useState({});

  // Getting sessionId from contextApi
  const { sessionId } = useContext(SessionContext);

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
  }, [SESSION_ID]);

  const timelineData = [
    {
      id: 1,
      week: "Week 1",
      title: "Difficulty Increased",
      summary: "Early signs of consistent progress",
      details:
        "Practice intensity was raised after consistent execution was detected. No structural changes were made to the strategy",
      date: "04/29/2024",
    },
    {
      id: 2,
      week: "Week 2",
      title: "Plateau Detected",
      summary: "Friction detected, growth stagnated",
      details:
        "Progress slowed and repeated errors appeared. Forge identified stagnation and paused further diffifculty increases.",
      date: "05/5/2024",
    },
    {
      id: 3,
      week: "Week 3",
      title: "Strategy Revised",
      summary: "Adjusted focus areas to regain momentum",
      details:
        "The practice plan was rewritten to focus on previously unstable concepts. Session structure was simplified to restore momentum",
      date: "05/9/2024",
    },
    {
      id: 4,
      week: "Week 4",
      title: "Guided Deepening",
      summary: "Skill base stabilized, advanced concepts introduced",
      details:
        "After recovery from the plateau, Forge introduced deeper variations while preserving the revised structure",
      date: "05/17/2024",
    },
  ];

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
              Goal summary: 
              {narrationData.static?.goal_summary} 
            </p>
            <p>
              Learning Philosophy:
              {narrationData.static?.learning_philosophy}
            </p>
          </header>
          <div className="card_container">
            {narrationData.dynamic?.map((item) => (
              <motion.div
                className="item_card"
                key={item.current_cycle_index}
                whileHover={{
                  scale: 1.04,
                  borderColor: "rgba(255, 106, 26, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 200 }}
              style={{display: "flex", flexDirection: "column", gap: "10px"}}
              >
                <h3>{item.current_phase.weeks} WEEKS</h3>
                <b>{item.current_phase.title}</b>
                <small>{item.current_phase.why_this_phase}</small>
                <small> {item.this_week_plan.primary.task} </small>
                <small> {item.this_week_plan.primary.details}</small>
                <small> {item.this_week_plan.secondary.task} </small>
                <small> {item.this_week_plan.secondary.details} </small>
                {/* <span>{item.current_phase.summary}</span> */}
                <small> {item.what_to_focus_on} </small>
                <small> {item.how_to_measure_progress} </small>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

//  {narrationData.map((data) => {
//           <motion.div
//             className="narration-page"
//
//             transition={{ {narrationData.map((data) => {
//           <motion.div
//             className="narration-page"
//             initial={{ y: "3000vh" }}
//             animate={{ y: 0 }}
//
//           >
//
//             <div className="response">
//               <p>{data.static.learning_philosophy}</p>
//               <em>Current Strategy Overview</em>
//               <div className="response-card">
//                 <h3>{data.current_phase.title}</h3>
//                 <p>{data.current_phase.why_this_phase}</p>

//                 <span className="sub-title">
//                   {/* This week plan */}
//                   Weekly Objectives
//                 </span>
//                 <ul>
//                   <li>
//                     <span>
//                       <strong>Task:</strong>
//                       {data.this_week_plan.task}
//                     </span>
//                     <span>
//                       <strong>Details:</strong>
//                       {data.this_week_plan.details}
//                     </span>
//                   </li>
//                   <li>{data.what_to_focus_on}</li>
//                   <li>{data.how_to_measure_progress}</li>
//                 </ul>
//               </div>
//             </div>
//           </motion.div>;
//         })}

//               type: "spring",
//               stiffness: 25,
//               damping: 11,
//               mass: 1.5,
//             }}
//           >
//             <header>
//               <h1>Narration</h1>
//               <p>
//                 {/* Goal summary */}
//                 {data.static.goal_summary}
//               </p>
//             </header>
//             <div className="response">
//               <p>{data.static.learning_philosophy}</p>
//               <em>Current Strategy Overview</em>
//               <div className="response-card">
//                 <h3>{data.current_phase.title}</h3>
//                 <p>{data.current_phase.why_this_phase}</p>

//                 <span className="sub-title">
//                   {/* This week plan */}
//                   Weekly Objectives
//                 </span>
//                 <ul>
//                   <li>
//                     <span>
//                       <strong>Task:</strong>
//                       {data.this_week_plan.task}
//                     </span>
//                     <span>
//                       <strong>Details:</strong>
//                       {data.this_week_plan.details}
//                     </span>
//                   </li>
//                   <li>{data.what_to_focus_on}</li>
//                   <li>{data.how_to_measure_progress}</li>
//                 </ul>
//               </div>
//             </div>
//           </motion.div>;
//         })}
