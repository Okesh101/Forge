import React, { useState, useEffect } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Line, Scatter } from "react-chartjs-2";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { FiX } from "react-icons/fi";
import { Check } from "lucide-react";

ChartJS.defaults.font.size = 14;
ChartJS.defaults.color = "#666";

export default function Analytics() {
  // Demo data matching the image template

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const demoData = {
    summary: {
      total_sessions: 7,
      average_difficulty: 8.57,
      average_fatigue: 7.14,
      overload_detected: true,
    },
    sessions: [
      {
        date: "2024-01-23T14:00:00",
        duration_minutes: 90,
        difficulty_rating: 9,
        fatigue_level: 9,
      },
      {
        date: "2024-01-26T11:00:00",
        duration_minutes: 40,
        difficulty_rating: 8,
        fatigue_level: 7,
      },
      {
        date: "2024-01-28T10:30:00",
        duration_minutes: 75,
        difficulty_rating: 10,
        fatigue_level: 9,
      },
      {
        date: "2025-04-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
      {
        date: "2025-05-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
      {
        date: "2025-06-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
      {
        date: "2025-07-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
      {
        date: "2025-08-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
      {
        date: "2025-09-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
      {
        date: "2025-10-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
      {
        date: "2025-11-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
      {
        date: "2025-12-28T16:00:00",
        duration_minutes: 50,
        difficulty_rating: 9,
        fatigue_level: 8,
      },
    ],
  };

  // Chart 1: Practice Frequency (Line Chart)
  const practiceFrequencyData = {
    labels: demoData.sessions.map((d) => d.date.slice(0, 10)),
    datasets: [
      {
        label: "Practice Frequency",
        data: [2, 2, 1, 2, 5, 3, 2, 1, 3, 4, 5, 8],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        fill: true,
        tension: 0.5,
        pointRadius: 5,
        pointBackgroundColor: "#007bff",
        pointBorderColor: "#fff",
      },
    ],
  };

  // Chart 2: Duration per Session (Bar Chart)
  const durationPerSessionData = {
    labels: [
      "2024-01-20",
      "2024-01-23",
      "2024-01-26",
      "2024-01-28",
      "2025-01-28",
    ],
    datasets: [
      {
        label: "Avg Duration (min)",
        data: [52.5, 60, 40, 62.5, 42.5],
        backgroundColor: "#f7894e",
        borderColor: "#ff6a1a",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Chart 3: Difficulty Rating (Horizontal Bar)
  const difficultyData = {
    labels: [
      "2024-01-20",
      "2024-01-23",
      "2024-01-26",
      "2024-01-28",
      "2025-05-28",
      "2025-06-28",
    ],
    datasets: [
      {
        label: "Avg Difficulty",
        data: [8.5, 8.0, 8.0, 9.5, 10, 7],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
        borderColor: "#fff",
      },
    ],
  };

  // Chart 4: Fatigue Rating (Horizontal Bar)
  const fatigueData = {
    labels: ["2024-01-20", "2024-01-23", "2024-01-26", "2024-01-28"],
    datasets: [
      {
        label: "Avg Fatigue",
        data: [7.5, 7.5, 7.0, 8.5],
        backgroundColor: ["#e74a3b", "#f6c23e", "#1cc88a", "#4e73df"],
        borderColor: "#fff",
      },
    ],
  };

  // Chart 5: Session Duration vs Difficulty (Scatter Plot)
  const durationVsDifficultyData = {
    datasets: [
      {
        label: "Sessions",
        data: [
          { x: 45, y: 9 },
          { x: 60, y: 8 },
          { x: 30, y: 7 },
          { x: 90, y: 9 },
          { x: 40, y: 8 },
          { x: 75, y: 10 },
          { x: 50, y: 9 },
        ],
        backgroundColor: "#4e73df",
        borderColor: "#2e59d9",
        pointRadius: 4,
      },
    ],
  };

  // Chart 6: Session Duration vs Fatigue (Scatter Plot)
  const durationVsFatigueData = {
    datasets: [
      {
        label: "Sessions",
        data: [
          { x: 45, y: 8 },
          { x: 60, y: 7 },
          { x: 30, y: 6 },
          { x: 90, y: 9 },
          { x: 40, y: 7 },
          { x: 75, y: 9 },
          { x: 50, y: 8 },
        ],
        backgroundColor: "#e74a3b",
        borderColor: "#d52a1e",
        pointRadius: 4,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: isMobile ? 10 : 14,
            weight: "bold",
          },
          boxWidth: isMobile ? 10 : 15,
          padding: isMobile ? 5 : 10,
        },
      },
    },
  };

  const lineChartOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 10,
        ticks: {
          precision: 0,
          stepSize: 1.2,
          font: {
            size: isMobile ? 9 : 12,
          },
          maxTicksLimit: isMobile ? 6 : 10,
        },
        title: {
          display: !isMobile,
          text: "Number of Sessions",
          font: {
            size: isMobile ? 10 : 14,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: isMobile ? 8 : 12,
          },
          maxTicksLimit: isMobile ? 4 : 10,
        },
        title: {
          display: !isMobile,
          text: "Date",
          font: {
            size: isMobile ? 10 : 14,
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...commonOptions,
    indexAxis: "x",
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          font: {
            size: isMobile ? 9 : 12,
          },
          maxTicksLimit: isMobile ? 5 : 10,
        },
        title: {
          display: !isMobile,
          text: "Duration (minutes)",
          font: {
            size: isMobile ? 10 : 14,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: isMobile ? 8 : 12,
          },
          maxTicksLimit: isMobile ? 4 : 10,
        },
      },
    },
  };

  const horizontalBarOptions = {
    ...commonOptions,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        max: 10,
        ticks: {
          font: {
            size: isMobile ? 9 : 12,
          },
          maxTicksLimit: isMobile ? 5 : 10,
        },
        title: {
          display: !isMobile,
          text: "Rating",
          font: {
            size: isMobile ? 10 : 14,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: isMobile ? 8 : 12,
          },
        },
      },
    },
  };

  const scatterOptions = {
    ...commonOptions,
    scales: {
      x: {
        ticks: {
          font: {
            size: isMobile ? 9 : 12,
          },
          maxTicksLimit: isMobile ? 5 : 10,
        },
        title: {
          display: !isMobile,
          text: "Session Duration (min)",
          font: {
            size: isMobile ? 10 : 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          font: {
            size: isMobile ? 9 : 12,
          },
          maxTicksLimit: isMobile ? 6 : 10,
        },
        title: {
          display: !isMobile,
          text: "Difficulty/Fatigue",
          font: {
            size: isMobile ? 10 : 14,
          },
        },
      },
    },
  };

  const simplifiedPracticeFrequencyData = {
    ...practiceFrequencyData,
    datasets: practiceFrequencyData.datasets.map((dataset) => ({
      ...dataset,
      pointRadius: isMobile ? 3 : 5,
      pointHoverRadius: isMobile ? 5 : 7,
      borderWidth: isMobile ? 1.5 : 2,
    })),
  };

  const simplifiedDurationPerSessionData = {
    ...durationPerSessionData,
    datasets: durationPerSessionData.datasets.map((dataset) => ({
      ...dataset,
      borderRadius: isMobile ? 4 : 6,
      borderWidth: isMobile ? 0.5 : 1,
    })),
  };

  const simplifiedScatterData = (data, color) => ({
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      pointRadius: isMobile ? 3 : 4,
      pointHoverRadius: isMobile ? 5 : 6,
    })),
  });

  // Add this style for mobile scrolling
  const scrollableChartStyle = isMobile
    ? {
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        minWidth: "300px",
      }
    : {};

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
                {demoData.summary.total_sessions}
                <small>Total Sessions</small>
              </div>
              <div className="stat_item">
                {demoData.summary.average_difficulty}
                <small>Average Difficulty</small>
              </div>
              <div className="stat_item">
                {demoData.summary.average_fatigue}
                <small>Average Fatigue</small>
              </div>
              <div
                className="stat_item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {demoData.summary.overload_detected === true ? (
                  <Check />
                ) : (
                  <FiX />
                )}
                <small>Overload Detected</small>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-box">
                <h3>Practice Frequency</h3>
                <div className="chart-container" style={scrollableChartStyle}>
                  <Line
                    data={simplifiedPracticeFrequencyData}
                    options={lineChartOptions}
                  />
                </div>
              </div>

              <div className="chart-box">
                <h3>Duration per Session</h3>
                <div className="chart-container" style={scrollableChartStyle}>
                  <Bar
                    data={simplifiedDurationPerSessionData}
                    options={barChartOptions}
                  />
                </div>
              </div>

              <div className="chart-box">
                <h3>Difficulty Rating</h3>
                <div className="chart-container" style={scrollableChartStyle}>
                  <Bar data={difficultyData} options={horizontalBarOptions} />
                </div>
              </div>

              <div className="chart-box">
                <h3>Fatigue Rating</h3>
                <div className="chart-container" style={scrollableChartStyle}>
                  <Bar data={fatigueData} options={horizontalBarOptions} />
                </div>
              </div>
            </div>

            <div className="bottom-charts">
              <div className="chart-box">
                <h3>Session Duration (min) vs Difficulty</h3>
                <div className="chart-container" style={scrollableChartStyle}>
                  <Scatter
                    data={simplifiedScatterData(durationVsDifficultyData)}
                    options={scatterOptions}
                  />
                </div>
              </div>

              <div className="chart-box">
                <h3>Session Duration (min) vs Fatigue</h3>
                <div className="chart-container" style={scrollableChartStyle}>
                  <Scatter
                    data={simplifiedScatterData(durationVsFatigueData)}
                    options={scatterOptions}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
