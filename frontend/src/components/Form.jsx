import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiTarget,
  FiClock,
  FiHeart,
  FiUser,
  FiTrendingUp,
  FiBook,
  FiZap,
  FiMessageCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { SessionContext } from "../contextApi/SessionContext";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";

export default function Form() {
  // Options for learning styles
  const learningOptions = [
    { id: "practice", label: "Practicing" },
    { id: "explaining", label: "Explaining in my own words" },
    { id: "watching", label: "Watching examples" },
    { id: "reading", label: "Reading" },
    { id: "trial", label: "Trial and error" },
    { id: "teaching", label: "Teaching others" },
  ];
  // Options for challenges faced
  const challengeOptions = [
    { id: "motivation", label: "I lose motivation" },
    { id: "confusion", label: "I get confused" },
    { id: "boredom", label: "I get bored" },
    { id: "inconsistent", label: "I'm inconsistent" },
    { id: "direction", label: "I don't know what to do next" },
    { id: "procrastination", label: "I avoid starting" },
  ];

  const [decision_Data, setDecision_Data] = useState({
    goal: "",
    currentLevel: "",
    goalLevel: "",
    learningStyle: "",
    timeCommitment: 1,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Getting sessionId from contextApi
  const { sessionId } = useContext(SessionContext);

  // Function to handle input changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    setDecision_Data((prev) => ({
      ...prev,
      [name]: value,
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
    if (!decision_Data.skillOrHabit) {
      newErrors.skillOrHabit = "This field is required";
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

    setErrors(newErrors);
    // If all validations pass, submit the form
    if (isValid) {
      // Send form data to backend
      setIsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:5000/api/decision/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": sessionId,
          },
          body: JSON.stringify({ decision_Data }),
        });
        const data = await res.json();
        console.log(data);

        // Simulate loading time
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        if (data.status === "success") {
          setIsLoading(false);
          navigate("/narration");
        }
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    }
  };

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
                <label htmlFor="timeCommitment">
                  WEEKLY COMMITMENT: {decision_Data.timeCommitment}
                </label>
                <input
                  name="timeCommitment"
                  type="range"
                  min="1"
                  max="40"
                  value={decision_Data.timeCommitment}
                  onChange={handleInputChange}
                />
              </fieldset>
              {errors.goalLevel && (
                <p className="errorMssg">{errors.goalLevel}</p>
              )}
            </div>
          </form>
          <button type="button" onClick={handleSubmit}>
            Create My Practice Plan <FiArrowRight />
          </button>
        </div>
        {isLoading && <Loading />}
      </div>
    </>
  );
}

{
  /* <div className="field">
<fieldset>
  <label htmlFor="timeCommitment">
    <FiClock /> How much time can you realistically commit?
  </label>
  <select
    name="timeCommitment"
    value={decision_Data.timeCommitment}
    onChange={handleInputChange}
  >
    <option value="" disabled>
      Select time commitment
    </option>
    <option value="10-15">10-15 minutes/day</option>
    <option value="30">30 minutes/day</option>
    <option value="60">1 hour/day</option>
    <option value="flexible">Flexible / inconsistent</option>
    <option value="not-sure">Not sure yet</option>
  </select>
</fieldset>
{errors.timeCommitment && (
  <p className="errorMssg">{errors.timeCommitment}</p>
)}
</div> */
}
{
  /* <select name="goal" value={decision_Data.goal} onChange={handleInputChange}>
  <option value="" disabled>
    Select an option
  </option>
  <option value="skill">Acquire a new skill</option>
  <option value="habit">Form a new habit</option>
  <option value="improve">Improve existing skill</option>
</select>; */
}
{
  /* <div className="field">
  <fieldset>
    <label htmlFor="learningStyle">
      <FiBook /> How do you learn best?
    </label>
    <div className="radio-group">
      {learningOptions.map((option) => (
        <motion.div
          className="option"
          key={option.id}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <input
            type="radio"
            name="learningStyle"
            value={option.id}
            checked={decision_Data.learningStyle === option.id}
            onChange={handleInputChange}
          />
          <p>{option.label}</p>
        </motion.div>
      ))}
    </div>
  </fieldset>
  {errors.learningStyle && (
    <p className="errorMssg">{errors.learningStyle}</p>
  )}
</div>

<div className="field">
  <fieldset>
    <label htmlFor="challenges">
      <FiZap />
      What usually slows you down or stops you?
    </label>
    <div className="radio-group">
      {challengeOptions.map((option) => (
        <motion.div
          className="option"
          key={option.id}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <input
            type="radio"
            name="challenge"
            value={option.id}
            checked={decision_Data.challenge === option.id}
            onChange={handleInputChange}
          />
          <p>{option.label}</p>
        </motion.div>
      ))}
    </div>
  </fieldset>
  {errors.challenge && (
    <p className="errorMssg">{errors.challenge}</p>
  )}
</div>

<section>
  <div className="field">
    <fieldset>
      <label htmlFor="failureResponse">
        <FiAlertTriangle /> When you fail or stop, what usually
        happens next?
      </label>
      <select
        name="failureResponse"
        value={decision_Data.failureResponse}
        onChange={handleInputChange}
      >
        <option value="" disabled>
          Select your typical response
        </option>
        <option value="restart">I restart from scratch</option>
        <option value="break">I take a long break</option>
        <option value="expectation">I lower my expectations</option>
        <option value="quit">I quit silently</option>
        <option value="try-again">
          I try again with a new method
        </option>
      </select>
    </fieldset>
    {errors.failureResponse && (
      <p className="errorMssg">{errors.failureResponse}</p>
    )}
  </div>

  <div className="field">
    <fieldset>
      <label htmlFor="coachingStyle">
        <FiMessageCircle /> How do you want this system to treat
        you?
      </label>
      <select
        name="coachingStyle"
        value={decision_Data.coachingStyle}
        onChange={handleInputChange}
      >
        <option value="" disabled>
          Select coaching style
        </option>
        <option value="gentle">Gentle and supportive</option>
        <option value="direct">Direct and honest</option>
        <option value="strict">Strict and challenging</option>
      </select>
    </fieldset>
    {errors.coachingStyle && (
      <p className="errorMssg">{errors.coachingStyle}</p>
    )}
  </div>
</section> */
}
