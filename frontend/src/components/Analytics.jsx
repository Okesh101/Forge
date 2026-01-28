import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { SessionContext } from "../contextApi/SessionContext";

export default function Analytics() {
  const SESSION_ID = sessionStorage.getItem("sessionId");
  const [analytics_Data, setAnalytics_Data] = useState({});
  // Getting and BACKEND_API from contextApi
  const { BACKEND_API } = useContext(SessionContext);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${BACKEND_API}/api/analytics`, {
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
                {analytics_Data.summary?.overload_detected === true
                  ? "Yes"
                  : "No"}
                <small>Overload Detected</small>
              </div>
            </div>
            <Line
              data={{
                labels: analytics_Data.sessions?.map((session) =>
                  session.date.slice(0, 10)
                ),
                datasets: [
                  {
                    label: "Practice Progress",
                    data: analytics_Data.sessions?.map((_, index) => index + 1),
                    borderColor: "#007bff",
                    backgroundColor: "#007bff",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    min: 1,
                    max: 10,
                  },
                },
              }}
            />
          </main>
        </div>
      </div>
    </>
  );
}
