import React, { useState } from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { useNavigate } from "react-router-dom";

export default function LogPracticeSession() {
  const [logSessionData, setLogSessionData] = useState({
    focusContent: "",
    duration: "",
    difficulty: "",
    fatigueLevel: 1,
  });
  const [fieldError, setFieldError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogSessionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    let isValid = true;
    const newErrors = {};
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
    }
    if (!logSessionData.difficulty) {
      newErrors.difficulty = "This field is required";
      isValid = false;
    } else if (isNaN(logSessionData.difficulty)) {
      newErrors.difficulty = "Numbers only";
      isValid = false;
    }

    if (isValid) {
      const processedData = {
        ...LogPracticeSession,
        duration: Number(logSessionData.duration),
        difficulty: Number(logSessionData.difficulty),
      };
      // navigate("/analytics");
      console.log(processedData);
    }
    setFieldError(newErrors);
  };
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
            >
              <div className="field" style={{ width: "100%" }}>
                <fieldset>
                  <label htmlFor="duration">DURATION (MINUTES)</label>
                  <input
                    type="text"
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
                    type="text"
                    value={logSessionData.difficulty}
                    name="difficulty"
                    inputMode="numeric"
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
                <label htmlFor="fatigueLevel">FATIGUE LEVEL (1-10)</label>
                <input
                  type="range"
                  value={logSessionData.fatigueLevel}
                  name="fatigueLevel"
                  min="1"
                  max="10"
                  onChange={handleChange}
                />
              </fieldset>
            </div>
          </form>
          <button type="button" onClick={handleSubmit}>
            Submit Log
          </button>
        </div>
      </div>
    </>
  );
}
