import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { SessionContext } from "../contextApi/SessionContext";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";
import SessionIdModal from "../Utilities/SessionIdModal";

export default function Form() {
  const SESSION_ID = sessionStorage.getItem("sessionId");
  // State to hold form data
  const [decision_Data, setDecision_Data] = useState({
    userEmail: "",
    goal: "",
    currentLevel: "",
    goalLevel: "",
    timeCommitment: 1,
    verify: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [sessionIdModal, setSessionIdModal] = useState(true);

  const navigate = useNavigate();

  // Getting sessionId and BACKEND_API from contextApi
  const { sessionId, BACKEND_API } = useContext(SessionContext);

  // Function to handle input changes
  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setDecision_Data((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Function for handle submission of the form
  const handleSubmit = async () => {
    let isValid = true;

    // Object to hold error messages
    const newErrors = {};

    // Validation checks
    if (!decision_Data.goal) {
      newErrors.goal = "This field is required";
      isValid = false;
    }
    if (!decision_Data.currentLevel) {
      newErrors.currentLevel = "This field is required";
      isValid = false;
    }
    if (!decision_Data.goalLevel) {
      newErrors.goalLevel = "This field is required";
      isValid = false;
    }
    if (!decision_Data.timeCommitment) {
      newErrors.timeCommitment = "This field is required";
      isValid = false;
    }
    if (!decision_Data.userEmail) {
      newErrors.userEmail = "This field is required";
      isValid = false;
    }

    setErrors(newErrors);
    // If all validations pass, submit the form
    if (isValid) {
      // Send form data to backend
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_API}/api/decision/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": SESSION_ID,
          },
          body: JSON.stringify({ decision_Data }),
        });
        const data = await res.json();
        console.log(data);

        // Simulate loading time
        if (data.status === "success") {
          setIsLoading(false);
          navigate("/narration");
          resetForm();
        } else {
          setErrorModal(true);
          setIsLoading(false);
          resetForm();
        }
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    }
  };

  // Function to reset the form
  function resetForm() {
    setDecision_Data({
      userEmail: "",
      goal: "",
      currentLevel: "",
      goalLevel: "",
      timeCommitment: 1,
      verify: false,
    });
  }

  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="form-section">
          <header>
            <h1>Create Your Practice Profile</h1>
            <p>Start your mastery journey with personalized guidance.</p>
          </header>
          <form>
            <div className="field">
              <fieldset>
                <label htmlFor="goal">TARGET SKILL</label>
                <input
                  type="text"
                  placeholder="e.g, Quantum Physics, Learn React"
                  name="goal"
                  value={decision_Data.goal}
                  onChange={handleInputChange}
                />
              </fieldset>
              {errors.goal && <p className="errorMssg">{errors.goal}</p>}
            </div>

            <div className="field">
              <fieldset>
                <label htmlFor="currentLevel">CURRENT PROFICIENCY</label>
                <select
                  name="currentLevel"
                  value={decision_Data.currentLevel}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select your current level
                  </option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </fieldset>
              {errors.currentLevel && (
                <p className="errorMssg">{errors.currentLevel}</p>
              )}
            </div>

            <div className="field">
              <fieldset>
                <label htmlFor="goalLevel">GOAL LEVEL</label>
                <select
                  name="goalLevel"
                  value={decision_Data.goalLevel}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select your goal level
                  </option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </fieldset>
              {errors.goalLevel && (
                <p className="errorMssg">{errors.goalLevel}</p>
              )}
            </div>
            <div className="field">
              <fieldset>
                <label
                  htmlFor="timeCommitment"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  WEEKLY COMMITMENT:
                  <span style={{ color: "#ff6a1a", fontSize: "18px" }}>
                    {decision_Data.timeCommitment}
                    {decision_Data.timeCommitment === 1 ? "HOUR" : "HOURS"}
                  </span>
                </label>
                <input
                  name="timeCommitment"
                  type="range"
                  min="1"
                  max="40"
                  value={decision_Data.timeCommitment}
                  onChange={handleInputChange}
                />
                <divinput
                  className="footer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "-23px",
                    opacity: 0.5,
                    fontWeight: "bold",
                  }}
                >
                  <p>Casual(1h)</p>
                  <p>Intense(40h)</p>
                </divinput>
              </fieldset>
            </div>

            <div className="verify">
              <input
                type="checkbox"
                name="verify"
                checked={decision_Data.verify}
                onChange={handleInputChange}
              />
              <p>Would you like us remind you about your practice plan?</p>
            </div>

            {decision_Data.verify && (
              <div className="email_section">
                <fieldset >
                <label htmlFor="userEmail">EMAIL ADDRESS</label>
                <input
                  type="email"
                  name="userEmail"
                  value={decision_Data.userEmail}
                  onChange={handleInputChange}
                />
              </fieldset>

              {errors.userEmail  && <p className="errorMssg">{errors.userEmail}</p>}
              </div>
            )}
          </form>
          <button type="button" onClick={handleSubmit}>
            Create My Practice Plan <FiArrowRight />
          </button>
        </div>
        {sessionIdModal && (
          <SessionIdModal onClose={() => setSessionIdModal(false)} />
        )}
        {isLoading && <Loading />}
        {errorModal && (
          <div className="error_modal" onClick={() => setErrorModal(false)}>
            <div className="modal_content">
              <h2>Submission Failed</h2>
              <p>
                There was an issue submitting your form. Please try again later.
              </p>
              <button onClick={() => setErrorModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
