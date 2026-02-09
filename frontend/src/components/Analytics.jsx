import React, { useState, useEffect, useContext } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Line, Scatter } from "react-chartjs-2";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { FiX } from "react-icons/fi";
import { Check, MessageCircleOff } from "lucide-react";
import { SessionContext } from "../contextApi/SessionContext";
import { useNavigate } from "react-router-dom";

ChartJS.defaults.font.size = 14;
ChartJS.defaults.color = "#666";

export default function Analytics() {
  // State to track screen size for responsive chart options
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth <= 768,
    isSmallMobile: window.innerWidth <= 398,
    isVerySmallMobile: window.innerWidth <= 320,
    isTablet: window.innerWidth > 769 && window.innerWidth <= 894,
  });

  // Navigate function for redirection
  const navigate = useNavigate();

  // State to force re-render of charts on screen resize for better responsiveness
  const [chartKey, setChartKey] = useState(0);
  // Get session ID from session storage
  const SESSION_ID = sessionStorage.getItem("sessionId");
  // State to hold analytics data
  const [analytics_Data, setAnalytics_Data] = useState({});

  // Getting and BACKEND_API and handle navigation function from contextApi
  const { BACKEND_API, handleNavigation, isLoading, setIsLoading } = useContext(SessionContext);

  // Determine whether analytics contains meaningful data
  const hasData = (() => {
    if (!analytics_Data) return false;
    return (
      analytics_Data.dateCounts && analytics_Data.dateCounts.length > 0 ||
      analytics_Data.durationCounts && analytics_Data.durationCounts.length > 0 ||
      analytics_Data.difficultyCounts && analytics_Data.difficultyCounts.length > 0 ||
      analytics_Data.fatigueCounts && analytics_Data.fatigueCounts.length > 0
    );
  })();

  // Fetch analytics data from backend API on component mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
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
      } finally{
        setIsLoading(false)
      }
    };

    fetchAnalytics();
  }, []);

  // Handle window resize to update screen size state for responsive chart options
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth <= 768,
        isSmallMobile: window.innerWidth <= 398,
        isVerySmallMobile: window.innerWidth <= 320,
        isTablet: window.innerWidth <= 769 && window.innerWidth <= 894,
      });

      setChartKey((prev) => prev + 1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if user is logged in based on presence of session ID in session storage
  let isLoggedIn = true;
  if (SESSION_ID) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  // Chart 1: Practice Frequency (Line Chart)
  const practiceFrequencyData = {
    labels: analytics_Data.dateCounts?.map((d) => d.date),
    datasets: [
      {
        label: "Practice Frequency",
        data: analytics_Data.dateCounts?.map((n) => n.number),
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
    labels: analytics_Data.durationCounts?.map((d) => d.date),
    datasets: [
      {
        label: "Avg Duration (min)",
        data: analytics_Data.durationCounts?.map((du) => du.duration),
        backgroundColor: "#f7894e",
        borderColor: "#ff6a1a",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Chart 3: Difficulty Rating (Horizontal Bar)
  const difficultyData = {
    labels: analytics_Data.difficultyCounts?.map((di) => di.date),
    datasets: [
      {
        label: "Avg Difficulty",
        data: analytics_Data.difficultyCounts?.map((di) => di.difficulty),
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
        borderColor: "#fff",
      },
    ],
  };

  // Chart 4: Fatigue Rating (Horizontal Bar)
  const fatigueData = {
    labels: analytics_Data.fatigueCounts?.map((f) => f.date),
    datasets: [
      {
        label: "Avg Fatigue",
        data: analytics_Data.fatigueCounts?.map((f) => f.fatigue),
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
        data: analytics_Data.sessions?.map((session) => ({
          x: session.duration_minutes,
          y: session.difficulty_rating,
        })),
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
        data: analytics_Data.sessions?.map((session) => ({
          x: session.duration_minutes,
          y: session.fatigue_level,
        })),
        backgroundColor: "#e74a3b",
        borderColor: "#d52a1e",
        pointRadius: 4,
      },
    ],
  };

  // Common chart options with responsive adjustments based on screen size
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
            weight: "bold",
          },
          boxWidth: screenSize.isSmallMobile
            ? 8
            : screenSize.isMobile
            ? 10
            : 15,
          padding: screenSize.isSmallMobile ? 3 : screenSize.isMobile ? 5 : 10,
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
            size: screenSize.isVerySmallMobile
              ? 7
              : screenSize.isSmallMobile
              ? 8
              : screenSize.isMobile
              ? 9
              : 12,
          },
          maxTicksLimit: screenSize.isSmallMobile
            ? 4
            : screenSize.isMobile
            ? 6
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Number of Sessions",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: screenSize.isVerySmallMobile
              ? 6
              : screenSize.isSmallMobile
              ? 7
              : screenSize.isMobile
              ? 8
              : 12,
          },
          maxTicksLimit: screenSize.isVerySmallMobile
            ? 2
            : screenSize.isSmallMobile
            ? 3
            : screenSize.isMobile
            ? 4
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Date",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
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
          precision: 0,
          stepSize: 1.2,
          font: {
            size: screenSize.isVerySmallMobile
              ? 7
              : screenSize.isSmallMobile
              ? 8
              : screenSize.isMobile
              ? 9
              : 12,
          },
          maxTicksLimit: screenSize.isSmallMobile
            ? 4
            : screenSize.isMobile
            ? 6
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Duration (minutes)",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: screenSize.isVerySmallMobile
              ? 6
              : screenSize.isSmallMobile
              ? 7
              : screenSize.isMobile
              ? 8
              : 12,
          },
          maxTicksLimit: screenSize.isVerySmallMobile
            ? 2
            : screenSize.isSmallMobile
            ? 3
            : screenSize.isMobile
            ? 4
            : 10,
        },
      },
    },
  };

  const horizontalBarOptionsDifficulty = {
    ...commonOptions,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        max: 10,
        ticks: {
          font: {
            size: screenSize.isVerySmallMobile
              ? 6
              : screenSize.isSmallMobile
              ? 7
              : screenSize.isMobile
              ? 8
              : 12,
          },
          maxTicksLimit: screenSize.isVerySmallMobile
            ? 2
            : screenSize.isSmallMobile
            ? 3
            : screenSize.isMobile
            ? 4
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Difficulty Rating",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
          },
        },
      },
      y: {
        ticks: {
          precision: 0,
          stepSize: 1.2,
          font: {
            size: screenSize.isVerySmallMobile
              ? 7
              : screenSize.isSmallMobile
              ? 8
              : screenSize.isMobile
              ? 9
              : 12,
          },
          maxTicksLimit: screenSize.isSmallMobile
            ? 4
            : screenSize.isMobile
            ? 6
            : 10,
        },
      },
    },
  };
  const horizontalBarOptionsFatigue = {
    ...commonOptions,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        max: 10,
        ticks: {
          font: {
            size: screenSize.isVerySmallMobile
              ? 6
              : screenSize.isSmallMobile
              ? 7
              : screenSize.isMobile
              ? 8
              : 12,
          },
          maxTicksLimit: screenSize.isVerySmallMobile
            ? 2
            : screenSize.isSmallMobile
            ? 3
            : screenSize.isMobile
            ? 4
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Fatigue Rating",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
          },
        },
      },
      y: {
        ticks: {
          precision: 0,
          stepSize: 1.2,
          font: {
            size: screenSize.isVerySmallMobile
              ? 7
              : screenSize.isSmallMobile
              ? 8
              : screenSize.isMobile
              ? 9
              : 12,
          },
          maxTicksLimit: screenSize.isSmallMobile
            ? 4
            : screenSize.isMobile
            ? 6
            : 10,
        },
      },
    },
  };

  const scatterOptionsDifficulty = {
    ...commonOptions,
    scales: {
      x: {
        ticks: {
          font: {
            size: screenSize.isVerySmallMobile
              ? 6
              : screenSize.isSmallMobile
              ? 7
              : screenSize.isMobile
              ? 8
              : 12,
          },
          maxTicksLimit: screenSize.isVerySmallMobile
            ? 2
            : screenSize.isSmallMobile
            ? 3
            : screenSize.isMobile
            ? 4
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Session Duration (min)",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 11,
        ticks: {
          precision: 0,
          stepSize: 1.2,
          font: {
            size: screenSize.isVerySmallMobile
              ? 7
              : screenSize.isSmallMobile
              ? 8
              : screenSize.isMobile
              ? 9
              : 12,
          },
          maxTicksLimit: screenSize.isSmallMobile
            ? 4
            : screenSize.isMobile
            ? 6
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Difficulty",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
          },
        },
      },
    },
  };
  const scatterOptionsFatigue = {
    ...commonOptions,
    scales: {
      x: {
        ticks: {
          font: {
            size: screenSize.isVerySmallMobile
              ? 6
              : screenSize.isSmallMobile
              ? 7
              : screenSize.isMobile
              ? 8
              : 12,
          },
          maxTicksLimit: screenSize.isVerySmallMobile
            ? 2
            : screenSize.isSmallMobile
            ? 3
            : screenSize.isMobile
            ? 4
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Session Duration (min)",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 11,
        ticks: {
          precision: 0,
          stepSize: 1.2,
          font: {
            size: screenSize.isVerySmallMobile
              ? 7
              : screenSize.isSmallMobile
              ? 8
              : screenSize.isMobile
              ? 9
              : 12,
          },
          maxTicksLimit: screenSize.isSmallMobile
            ? 4
            : screenSize.isMobile
            ? 6
            : 10,
        },
        title: {
          display: !screenSize.isMobile,
          text: "Fatigue",
          font: {
            size: screenSize.isSmallMobile ? 8 : screenSize.isMobile ? 10 : 14,
          },
        },
      },
    },
  };

  const simplifiedPracticeFrequencyData = {
    ...practiceFrequencyData,
    datasets: practiceFrequencyData.datasets.map((dataset) => ({
      ...dataset,
      pointRadius: screenSize.isVerySmallMobile
        ? 2
        : screenSize.isSmallMobile
        ? 2.5
        : screenSize.isMobile
        ? 3
        : 5,
      pointHoverRadius: screenSize.isVerySmallMobile
        ? 3
        : screenSize.isSmallMobile
        ? 4
        : screenSize.isMobile
        ? 5
        : 7,
      borderWidth: screenSize.isSmallMobile ? 1 : screenSize.isMobile ? 1.5 : 2,
    })),
  };

  const simplifiedDurationPerSessionData = {
    ...durationPerSessionData,
    datasets: durationPerSessionData.datasets.map((dataset) => ({
      ...dataset,
      borderRadius: screenSize.isMobile ? 4 : 6,
      borderWidth: screenSize.isMobile ? 0.5 : 1,
    })),
  };

  const simplifiedScatterData = (data, color) => ({
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      pointRadius: screenSize.isMobile ? 3 : 4,
      pointHoverRadius: screenSize.isMobile ? 5 : 6,
    })),
  });

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

          { isLoading ? (
              <div className="loading">
                <p>Loading analytics data...</p>
              </div>
            ) :hasData ? (
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
                <div
                  className="stat_item"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {analytics_Data.summary?.overload_detected === true ? (
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
                  <div className="chart-container">
                    <Line
                      key={chartKey}
                      data={simplifiedPracticeFrequencyData}
                      options={lineChartOptions}
                    />
                  </div>
                </div>

                <div className="chart-box">
                  <h3>Duration per Day</h3>
                  <div className="chart-container">
                    <Bar
                      key={chartKey}
                      data={simplifiedDurationPerSessionData}
                      options={barChartOptions}
                    />
                  </div>
                </div>

                <div className="chart-box">
                  <h3>Difficulty Rating</h3>
                  <div className="chart-container">
                    <Bar
                      key={chartKey}
                      data={difficultyData}
                      options={horizontalBarOptionsDifficulty}
                    />
                  </div>
                </div>

                <div className="chart-box">
                  <h3>Fatigue Rating</h3>
                  <div className="chart-container">
                    <Bar
                      key={chartKey}
                      data={fatigueData}
                      options={horizontalBarOptionsFatigue}
                    />
                  </div>
                </div>
              </div>

              <div className="bottom-charts">
                <div className="chart-box">
                  <h3>Session Duration (min) vs Difficulty</h3>
                  <div className="chart-container">
                    <Scatter
                      key={chartKey}
                      data={simplifiedScatterData(durationVsDifficultyData)}
                      options={scatterOptionsDifficulty}
                    />
                  </div>
                </div>

                <div className="chart-box">
                  <h3>Session Duration (min) vs Fatigue</h3>
                  <div className="chart-container">
                    <Scatter
                      key={chartKey}
                      data={simplifiedScatterData(durationVsFatigueData)}
                      options={scatterOptionsFatigue}
                    />
                  </div>
                </div>
              </div>
            </main>
          ) : (
            <p className="error">
              <MessageCircleOff size={70} height={80} />
              <span>
                {isLoggedIn ? (
                  <>
                    Log a practice session to view your analytics.{" "}
                    <em onClick={() => navigate("/logSession")}>
                      Navigate to Log Practice Page
                    </em>
                  </>
                ) : (
                  <>
                    Start Forging to view your analytics.{" "}
                    <em onClick={handleNavigation}>Back to Homepage</em>
                  </>
                )}
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
