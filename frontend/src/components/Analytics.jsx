import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { SessionContext } from "../contextApi/SessionContext";

export default function Analytics() {
  const SESSION_ID = sessionStorage.getItem("sessionId");
  const [analytics_Data, setAnalytics_Data] = useState({});
  // Getting and BACKEND_API from contextApi
  const { BACKEND_API } = useContext(SessionContext);
  const analyticsData = {
    summary: {
      totalWeeks: 5,
    },
    charts: {
      labels: ["Initial", "Progress", "Plateau", "Revision"],
      values: [1, 3, 1, 1],
    },
  };

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      const { top, width, left, height } = chartArea;

      ctx.save();

      ctx.font = "500 16px Times New Romans";
      ctx.fillStyle = "#ededed";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(
        `${analyticsData.summary.totalWeeks} Practice Weeks`,
        left + width / 2,
        top + height / 2
      );

      ctx.restore();
    },
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/analytics", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": SESSION_ID,
          },
        });
        const data = await res.json();
        setAnalytics_Data(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchAnalytics();
  }, []);
  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="analytics-page">
          <header>
            <h1>Analytics</h1>
            <p>
              Insight into your practice strategy's performance and evolution.
            </p>
          </header>
          <main>
            <div className="stats">
              <div className="stat_item">
                {analytics_Data.summary?.total_sessions}
                <small>Total Sessions</small>
              </div>
              <div className="stat_item">
                {analytics_Data.summary?.average_difficulty}
                <small>Average Difficulty</small>
              </div>
              <div className="stat_item">
                {analytics_Data.summary?.average_fatigue}
                <small>Average Fatigue</small>
              </div>
              <div className="stat_item">
                {analytics_Data.summary.overload_detected === true
                  ? "Yes"
                  : "No"}
                <small>Overload Detected</small>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
