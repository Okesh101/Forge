import React, { useState, useEffect, useContext } from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { SessionContext } from "../contextApi/SessionContext";

export default function LogPracticeSession() {
  // State to hold log practice session data
  const [logSessionData, setLogSessionData] = useState({
    focusContent: "",
    duration: "",
    difficulty: "",
    fatigueLevel: 1,
  });
  const [logHistory, setLogHistory] = useState([]);

  // Get loading and setLoading function from context
  const { isLoading, setIsLoading } = useContext(SessionContext);

  // State for field errors
  const [fieldError, setFieldError] = useState({});

  // Backend API URL
  const BACKEND_API = "https://forgev1.onrender.com";

  // Get session ID from session storage
  const SESSION_ID = sessionStorage.getItem("sessionId");

  // Function handling input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogSessionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function handling form submission
  const handleSubmit = async () => {
    let isValid = true;

    // Object to hold error message
    const newErrors = {};

    // Validation checks
    if (!logSessionData.focusContent) {
      newErrors.focusContent = "This field is required";
      isValid = false;
    }
    if (!logSessionData.duration) {
      newErrors.duration = "This field is required";
      isValid = false;
    } else if (isNaN(logSessionData.duration)) {
      newErrors.duration = "Numbers only";
      isValid = false;
    } else if (logSessionData.duration < 1) {
      newErrors.duration = "Must not be less than 1";
      isValid = false;
    } else if (logSessionData.duration > 60) {
      newErrors.duration = "Must not be greater than 60min";
      isValid = false;
    }
    if (!logSessionData.difficulty) {
      newErrors.difficulty = "This field is required";
      isValid = false;
    } else if (isNaN(logSessionData.difficulty)) {
      newErrors.difficulty = "Numbers only";
      isValid = false;
    } else if (logSessionData.difficulty > 10) {
      newErrors.difficulty = "Must not be greater than 10";
      isValid = false;
    } else if (logSessionData.difficulty < 1) {
      newErrors.difficulty = "Must not be less than 1";
      isValid = false;
    }

    // If all validations pass, submit the form
    if (isValid) {
      // Send form data to backend
      try {
        const res = await fetch(`${BACKEND_API}/api/practice/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": SESSION_ID,
          },
          body: JSON.stringify({ logSessionData }),
        });
        const data = await res.json();
        if (data.status === "success") {
          await fetchLogHistory();
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    setFieldError(newErrors);
  };

  // Function to fetch log history from backend
  const fetchLogHistory = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${BACKEND_API}/api/practice/logs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": SESSION_ID,
        },
      });
      const data = await res.json();
      if (!data.error && data) {
        setLogHistory(data);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if session ID or backend API URL is missing, do not attempt to fetch log history
    if (!SESSION_ID || !BACKEND_API) return;

    fetchLogHistory();
  }, [SESSION_ID, BACKEND_API]);

  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="logSession-page">
          <header>
            <h1>Log Practice Session</h1>
          </header>
          <form>
            <div className="field">
              <fieldset>
                <label htmlFor="focusContent">FOCUS CONTENT</label>
                <input
                  type="text"
                  value={logSessionData.focusContent}
                  name="focusContent"
                  placeholder="What did you work on"
                  onChange={handleChange}
                />
              </fieldset>
              {fieldError.focusContent && (
                <p className="errorMssg">{fieldError.focusContent}</p>
              )}
            </div>
            <section
              style={{
                display: "flex",
                width: "100%",
                margin: "20px 0",
                gap: "18px",
              }}
              className="field_container"
            >
              <div className="field" style={{ width: "100%" }}>
                <fieldset>
                  <label htmlFor="duration">DURATION (MINUTES)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={logSessionData.duration}
                    name="duration"
                    inputMode="numeric"
                    onChange={handleChange}
                  />
                </fieldset>
                {fieldError.duration && (
                  <p className="errorMssg">{fieldError.duration}</p>
                )}
              </div>
              <div className="field" style={{ width: "100%" }}>
                <fieldset>
                  <label htmlFor="difficulty">DIFFICULTY (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={logSessionData.difficulty}
                    name="difficulty"
                    inputMode="numeric"
                    placeholder="1"
                    onChange={handleChange}
                  />
                </fieldset>
                {fieldError.difficulty && (
                  <p className="errorMssg">{fieldError.difficulty}</p>
                )}
              </div>
            </section>
            <div className="field">
              <fieldset>
                <label
                  htmlFor="fatigueLevel"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  FATIGUE LEVEL:{" "}
                  <span style={{ color: "#ff6a1a", fontSize: "18px" }}>
                    {logSessionData.fatigueLevel}
                  </span>
                </label>
                <input
                  type="range"
                  value={logSessionData.fatigueLevel}
                  name="fatigueLevel"
                  min="1"
                  max="10"
                  onChange={handleChange}
                />
                <div
                  className="footer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "-23px",
                    opacity: 0.5,
                    fontWeight: "bold",
                  }}
                >
                  <p>Energetic(1)</p>
                  <p>Burnout(10)</p>
                </div>
              </fieldset>
            </div>
          </form>
          <button type="button" onClick={handleSubmit}>
            Submit Log
          </button>

          <div className="logSession_list">
            <h3>Log Practice History</h3>
            {isLoading ? (
              <div className="loading">
                <p>Loading practice history...</p>
              </div>
            ) : logHistory.length === 0 ? (
              <div className="no_log">
                <Activity className="icon" size={60} height={80} />
                <p>Activity Overview</p>
              </div>
            ) : (
              [...logHistory].reverse().map((item, index) => (
                <div className="logPracticeCard" key={index}>
                  <b style={{ color: "rgba(250, 92, 7, 0.81)" }}>{item.date}</b>
                  <em>{item.focusContent}</em>
                  <small>
                    <span>DURATION: </span>
                    {item.duration}
                  </small>
                  <small>
                    <span>DIFFICULTY: </span>
                    {item.difficulty}
                  </small>
                  <small>
                    <span>FATIGUE LEVEL: </span>
                    {item.fatigueLevel}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
