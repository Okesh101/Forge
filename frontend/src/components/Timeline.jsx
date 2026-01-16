import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";

export default function Timeline() {
  const timelineData = [
    {
      id: 1,
      week: "Week 1",
      title: "Initial Strategy",
      summary: "Practice Blueprint created",
      details:
        "Forge generated the first practice blueprint based on the declared skill and available time. The strategy emphasized grounding core concepts before introducing  complexity",
      date: "04/23/2024",
    },
    {
      id: 2,
      week: "Week 2",
      title: "Difficulty Increased",
      summary: "Early signs of consistent progress",
      details:
        "Practice intensity was raised after consistent execution was detected. No structural changes were made to the strategy",
      date: "04/29/2024",
    },
    {
      id: 3,
      week: "Week 3",
      title: "Plateau Detected",
      summary: "Friction detected, growth stagnated",
      details:
        "Progress slowed and repeated errors appeared. Forge identified stagnation and paused further diffifculty increases.",
      date: "05/5/2024",
    },
    {
      id: 4,
      week: "Week 4",
      title: "Strategy Revised",
      summary: "Adjusted focus areas to regain momentum",
      details:
        "The practice plan was rewritten to focus on previously unstable concepts. Session structure was simplified to restore momentum",
      date: "05/9/2024",
    },
    {
      id: 5,
      week: "Week 5",
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
        <div className="timeline_page">
          <header>
            <h1>Timeline Page</h1>
            <p>See how your practice strategy has evolved over time.</p>
          </header>
          <div className="timeline_details">
            {timelineData.map((item) => (
              <div className="timeline_card" key={item.id}>
                <div className="circle-section">
                  <p>{item.week}</p>
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
                  <small>{item.week}</small>
                  <p>{item.title}</p>
                  <em>{item.details}</em>
                  <b>{item.date}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
