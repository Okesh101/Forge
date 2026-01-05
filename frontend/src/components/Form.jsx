import React, { useEffect, useState } from "react";
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
} from "react-icons/fi";
import SideBar from "./Utilities/SideBar";
import PageNav from "./Utilities/PageNav";

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

  // State variable for form inputs
  const [goal, setGoal] = useState("");
  const [skillOrHabit, setSkillOrHabit] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [failureResponse, setFailureResponse] = useState("");
  const [coachingStyle, setCoachingStyle] = useState("");
  const [errors, setErrors] = useState({});

  // Renamed the generic setState function to handleInputChange to avoid conflicts
  function handleInputChange(e, setStateFunction) {
    setStateFunction(e.target.value);
  }

  // Function for handle submission of the form
  const handleSubmit = async () => {
    let isValid = true;

    // Object to hold error messages
    const newErrors = {};

    // Validation checks
    if (!goal) {
      newErrors.goal = "This field is required";
      isValid = false;
    }
    if (!skillOrHabit) {
      newErrors.skillOrHabit = "This field is required";
      isValid = false;
    }
    if (!currentLevel) {
      newErrors.currentLevel = "This field is required";
      isValid = false;
    }
    if (!timeCommitment) {
      newErrors.timeCommitment = "This field is required";
      isValid = false;
    }
    if (!learningStyle) {
      newErrors.learningStyle = "This field is required";
      isValid = false;
    }
    if (!challenge) {
      newErrors.challenge = "This field is required";
      isValid = false;
    }
    if (!failureResponse) {
      newErrors.failureResponse = "This field is required";
      isValid = false;
    }
    if (!coachingStyle) {
      newErrors.coachingStyle = "This field is required";
      isValid = false;
    }
    // If all validations pass, submit the form
    if (isValid) {
      // Collect all form values
      const values = {
        goal,
        skillOrHabit,
        currentLevel,
        timeCommitment,
        learningStyle,
        challenge,
        failureResponse,
        coachingStyle,
      };
      // Send form data to backend
      try {
        const res = await fetch("http://127.0.0.1:5000/decision/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    setErrors(newErrors);
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
            <section>
              <div className="field">
                <fieldset>
                  <label htmlFor="goal">
                    <FiTarget /> What do you want to build?
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => handleInputChange(e, setGoal)}
                  >
                    <option value="">Select an option</option>
                    <option value="skill">Acquire a new skill</option>
                    <option value="habit">Form a new habit</option>
                    <option value="improve">Improve existing skill</option>
                  </select>
                </fieldset>
                {errors.goal && <p className="errorMssg">{errors.goal}</p>}
              </div>

              <div className="field">
                <fieldset>
                  <label htmlFor="skillOrHabit">
                    <FiUser /> What is the skill or habit?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Learn React, Meditate daily, Play guitar"
                    value={skillOrHabit}
                    onChange={(e) => handleInputChange(e, setSkillOrHabit)}
                  />
                </fieldset>
                {errors.skillOrHabit && (
                  <p className="errorMssg">{errors.skillOrHabit}</p>
                )}
              </div>
            </section>

            <section>
              <div className="field">
                <fieldset>
                  <label htmlFor="currentLevel">
                    <FiTrendingUp /> How would you describe your current level?
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => handleInputChange(e, setCurrentLevel)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="some experience">Some Experience</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="not-sure">Not sure</option>
                  </select>
                </fieldset>
                {errors.currentLevel && (
                  <p className="errorMssg">{errors.currentLevel}</p>
                )}
              </div>

              <div className="field">
                <fieldset>
                  <label htmlFor="timeCommitment">
                    <FiClock /> How much time can you realistically commit?
                  </label>
                  <select
                    value={timeCommitment}
                    onChange={(e) => handleInputChange(e, setTimeCommitment)}
                  >
                    <option value="">Select time commitment</option>
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
              </div>
            </section>

            <div className="field">
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
                        name="learning-style"
                        value={option.id}
                        checked={learningStyle === option.id}
                        onChange={(e) => handleInputChange(e, setLearningStyle)}
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
                        name="challenges"
                        value={option.id}
                        checked={challenge === option.id}
                        onChange={(e) => handleInputChange(e, setChallenge)}
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
                    <FiHeart /> When you fail or stop, what usually happens
                    next?
                  </label>
                  <select
                    value={failureResponse}
                    onChange={(e) => handleInputChange(e, setFailureResponse)}
                  >
                    <option value="">Select your typical response</option>
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
                    How do you want this system to treat you?
                  </label>
                  <select
                    value={coachingStyle}
                    onChange={(e) => handleInputChange(e, setCoachingStyle)}
                  >
                    <option value="">Select coaching style</option>
                    <option value="gentle">Gentle and supportive</option>
                    <option value="direct">Direct and honest</option>
                    <option value="strict">Strict and challenging</option>
                  </select>
                </fieldset>
                {errors.coachingStyle && (
                  <p className="errorMssg">{errors.coachingStyle}</p>
                )}
              </div>
            </section>
          </form>
          <button type="button" onClick={handleSubmit}>
            Create My Practice Plan <FiArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}
