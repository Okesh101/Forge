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
      score: 20,
      title: "Initial Strategy",
      summary: "Practice Blueprint created",
      details:
        "Forge generated the first practice blueprint based on the declared skill and available time. The strategy emphasized grounding core concepts before introducing  complexity",
      date: "04/23/2024",
    },
    {
      id: 2,
      week: "Week 2",
      score: 35,
      title: "Difficulty Increased",
      summary: "Early signs of consistent progress",
      details:
        "Practice intensity was raised after consistent execution was detected. No structural changes were made to the strategy",
      date: "04/29/2024",
    },
    {
      id: 3,
      week: "Week 3",
      score: 32,
      title: "Plateau Detected",
      summary: "Friction detected, growth stagnated",
      details:
        "Progress slowed and repeated errors appeared. Forge identified stagnation and paused further diffifculty increases.",
      date: "05/5/2024",
    },
    {
      id: 4,
      week: "Week 4",
      score: 45,
      title: "Strategy Revised",
      summary: "Adjusted focus areas to regain momentum",
      details:
        "The practice plan was rewritten to focus on previously unstable concepts. Session structure was simplified to restore momentum",
      date: "05/9/2024",
    },
    {
      id: 5,
      week: "Week 5",
      score: 60,
      title: "Guided Deepening",
      summary: "Skill base stabilized, advanced concepts introduced",
      details:
        "After recovery from the plateau, Forge introduced deeper variations while preserving the revised structure",
      date: "05/17/2024",
    },
  ];

  const options = {
    responsive: true,
  };
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dataset 1",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: "Dataset 2",
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ],
  };
  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="timeline-page">
          <Line options={options} data={data} />
        </div>
      </div>
    </>
  );
}

{
  /* <Line
  data={{
    labels: timeData.events.map((e) => e.time),
    datasets: [
      {
        label: "Strategy Evolution",
        data: timeData.events.map((e) => e.score),
        tension: 0.4,
        fill: false,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }}
  options={{
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      title: {
        text: "Practice Strategy Evolution",
        display: true,
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const event = timeData.events[context.dataIndex];
            return [`Summary: ${event.summary}`, `Details: ${event.details}`];
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        displayColors: false,
        bodySpacing: 5,
        boxWidth: 0,
        boxHeight: 0,
        caretPadding: 5,
        cornerRadius: 4,
        boxPadding: 5,
        bodyAlign: "left",
        bodySpacing: 5,
        maxWidth: 200,
        wordWrap: "break-word",
        textAlign: "justify",
      },
    },
  }}
/>; */
}
