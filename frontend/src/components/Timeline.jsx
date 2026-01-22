import React, { useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";

export default function Timeline() {
  // Get session ID from session storage
  const SESSION_ID = sessionStorage.getItem("sessionId");
  const BACKEND_API = "http://localhost:5000";

  // State to hold time line data
  const [timeline_data, setTimeline_Data] = useState([]);
  useEffect(() => {
    // Fetch timeline data from backend
    const fetchTimeLine = async () => {
      // "http://localhost:5000/api/timeline"
      try {
        const res = await fetch(`${BACKEND_API}/api/timeline`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": SESSION_ID,
          },
        });
        const data = await res.json();
        setTimeline_Data(data.timeline);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchTimeLine();
  }, []);

  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="timeline_page">
          <header>
            <h1>Timeline Page</h1>
            <p>See how your practice strategy has evolved over time.</p>
          </header>
          <div className="timeline_details">
            {timeline_data.map((item) => (
              <div className="timeline_card" key={item.id}>
                <div className="circle-section">
                  <p>{item.timestamp.slice(0, 10)}</p>
                  <div className="circle"></div>
                </div>
                <div
                  className="card_details"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <small>{item.displayTime}</small>
                  <p>{item.title}</p>
                  <em>{item.summary}</em>
                  <b>{item.details.reason}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
