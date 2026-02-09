import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { FileX, MessageCircleOff } from "lucide-react";
import { SessionContext } from "../contextApi/SessionContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Timeline() {
  // Get session ID from session storage
  const SESSION_ID = sessionStorage.getItem("sessionId");

  // Backend API URL
  const BACKEND_API = "https://forgev1.onrender.com";

  const { handleNavigation, isLoading, setIsLoading } =
    useContext(SessionContext);

  // State to hold time line data
  const [timeline_data, setTimeline_Data] = useState([]);

  // Navigate function from react-router-dom to programmatically navigate to other pages
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    // Fetch timeline data from backend
    const fetchTimeLine = async () => {
      try {
        const res = await fetch(`${BACKEND_API}/api/timeline`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": SESSION_ID,
          },
        });
        const data = await res.json();
        if (data) {
          setTimeline_Data(data.timeline);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeLine();
  }, []);

  // Check if user is logged in based on presence of session ID in session storage
  let isLoggedIn = true;
  if (SESSION_ID) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <motion.div
          className="timeline_page"
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
            <h1>Timeline Page</h1>
            <p>See how your practice strategy has evolved over time.</p>
          </header>
          { isLoading ? (
              <div className="loading">
                <p>Loading timeline data...</p>
              </div>
            ) :timeline_data?.length > 0 ? (
            <div className="timeline_details">
              {timeline_data?.map((item) => (
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
        </motion.div>
      </div>
    </>
  );
}
