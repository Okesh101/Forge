import React, { useEffect } from "react";
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
import SideBar from "./SideBar";

export default function Form() {
  const learningOptions = [
    { id: "practice", label: "Practicing" },
    { id: "explaining", label: "Explaining in my own words" },
    { id: "watching", label: "Watching examples" },
    { id: "reading", label: "Reading" },
    { id: "trial", label: "Trial and error" },
    { id: "teaching", label: "Teaching others" },
  ];
  const challengeOptions = [
    { id: "motivation", label: "I lose motivation" },
    { id: "confusion", label: "I get confused" },
    { id: "boredom", label: "I get bored" },
    { id: "inconsistent", label: "I'm inconsistent" },
    { id: "direction", label: "I don't know what to do next" },
    { id: "procrastination", label: "I avoid starting" },
  ];

  // Function for handle submission of the form
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/create_session");
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // goodluck is this where I'm sending the request for entering the
  // dashboard bcos i think am lost and will it be alongside the input values

  return (
    <>
      <SideBar />
      <div className="form-section">
        <header>
          <h1>Create Your Practice Profile</h1>
          <p>Start your mastery journey with personalized guidance.</p>
        </header>
        <form>
          <section>
            <fieldset>
              <label>
                <FiTarget /> What do you want to build?
              </label>
              <select required>
                <option value="">Select an option</option>
                <option value="skill">Acquire a new skill</option>
                <option value="habit">Form a new habit</option>
                <option value="improve">Improve existing skill</option>
              </select>
            </fieldset>

            <fieldset>
              <label>
                <FiUser /> What is the skill or habit?
              </label>
              <input
                type="text"
                placeholder="e.g., Learn React, Meditate daily, Play guitar"
                required
              />
            </fieldset>
          </section>

          <section>
            <fieldset>
              <label>
                <FiTrendingUp /> How would you describe your current level?
              </label>
              <select>
                <option value="beginner">Beginner</option>
                <option value="some experience">Some Experience</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="not-sure">Not sure</option>
              </select>
            </fieldset>

            <fieldset>
              <label>
                <FiClock /> How much time can you realistically commit?
              </label>
              <select required>
                <option value="">Select time commitment</option>
                <option value="10-15">10-15 minutes/day</option>
                <option value="30">30 minutes/day</option>
                <option value="60">1 hour/day</option>
                <option value="flexible">Flexible / inconsistent</option>
                <option value="not-sure">Not sure yet</option>
              </select>
            </fieldset>
          </section>

          <fieldset>
            <label>
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
                  <input type="radio" name="learning-style" id={option.id} />
                  <p>{option.label}</p>
                </motion.div>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <label>
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
                  <input type="radio" name="challenge" id={option.id} />
                  <p>{option.label}</p>
                </motion.div>
              ))}
            </div>
          </fieldset>

          <section>
            <fieldset>
              <label>
                <FiHeart /> When you fail or stop, what usually happens next?
              </label>
              <select required>
                <option value="">Select your typical response</option>
                <option value="restart">I restart from scratch</option>
                <option value="break">I take a long break</option>
                <option value="expectation">I lower my expectations</option>
                <option value="quit">I quit silently</option>
                <option value="try-again">I try again with a new method</option>
              </select>
            </fieldset>

            <fieldset>
              <label>How do you want this system to treat you?</label>
              <select required>
                <option value="">Select coaching style</option>
                <option value="gentle">Gentle and supportive</option>
                <option value="direct">Direct and honest</option>
                <option value="strict">Strict and challenging</option>
              </select>
            </fieldset>
          </section>
        </form>
        <button onClick={handleSubmit}>
          Create My Practice Plan <FiArrowRight />
        </button>
      </div>
    </>
  );
}
