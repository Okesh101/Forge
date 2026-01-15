import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";

export default function Analytics() {
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
  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="analytics-page">
          <div className="header">
            <h2>Analytics</h2>
            <p>
              Insight into your practice strategy's performance and evolution.
            </p>
          </div>
          <div className="box">
            <div className="chart">
              <Doughnut
                data={{
                  labels: analyticsData.charts.labels,
                  datasets: [
                    {
                      data: analyticsData.charts.values,
                      backgroundColor: [
                        "#ff8c42",
                        "#4caf50",
                        "#e53935",
                        "#9e9e9e",
                      ],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      align: "start",
                      labels: {
                        color: "#bdbdbd",
                        padding: 16,
                        font: {
                          size: 14,
                        },
                      },
                    },
                  },
                }}
                plugins={[centerTextPlugin]}
              />
            </div>
            <div className="highlight-section">
              <h1>Highlights</h1>
              <ul>
                <li>60% of your total sessions led to productive outcomes</li>
                <li>One strategic adjustment was made to restore momentum</li>
                <li>Plateau detected after three weeks of linear growth</li>
                <li>Recovery strategy stabilized progression</li>
                <li>
                  Over a 5-week period, the strategy was revised 1 time, had 3
                  weeks of progression, and encountered 1 plateau moment.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
