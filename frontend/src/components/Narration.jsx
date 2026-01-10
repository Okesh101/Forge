import React from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";
import { motion } from "framer-motion";

export default function Narration() {
  return (
    <>
      <SideBar />
      <div className="container">
        <PageNav />
        <motion.div
          className="narration-page"
          initial={{ y: "3000vh" }}
          animate={{ y: 0 }}
          transition={{
            type: "spring",
            stiffness: 25,
            damping: 11,
            mass: 1.5,
          }}
        >
          <header>
            <h1>Narration</h1>
            <p>
              Based on your goal to learn [goal] as a [level] with
              [timeComitted] commitment.
            </p>
          </header>
          <div className="response">
            <h3>Core Learning Philosophy for React</h3>
            <p>
              React requires understaning both conceptual thinking and pratical
              implementation. You'II learn best by connecting abstract concepts
              (components, state, props) with tangible results you can see in
              the browser
            </p>
            <em>Current Strategy Overview</em>
            <div className="response-card">
              <h3>Phase 1: Foundation(Weeks 1-2)</h3>
              <p>Objective: Establish consistent internal representations.</p>

              <span className="sub-title">Rationale:</span>
              <ul>
                <li>Visual feedback reduces early confusion</li>
                <li>
                  Treating components as isolated units lowers perceived
                  complexity.
                </li>
                <li>Delaying advanced logic prevents premature abstraction.</li>
              </ul>
            </div>

            <div className="response-card">
              <h3>Phase 2: Interactive Understanding</h3>
              <p>
                Objective: Link code changes to observable system behaviour.
              </p>
              <span className="sub-title">Rationale:</span>
              <ul>
                <li>
                  State-driven systems require explicit cause-effect
                  understanding.
                </li>
                <li>
                  Awareness of component reactivity preced architectural
                  decisions.
                </li>
                <li>
                  Interaction reveals structural misunderstandings earlier than
                  theory.
                </li>
              </ul>
            </div>
            <div className="response-card">
              <h3>Your Specific Adaptation Logic</h3>
              <div className="child-card">
                <b>For your challenge [challenge]</b>
                <ul>
                  <li>
                    When confusion is detected, strategies shift toward visual
                    comparison
                  </li>
                  <li>
                    Abstract concepts are paired with side-by-side behavioral
                    outcomes
                  </li>
                </ul>
              </div>
              <div className="child-card">
                <b>For your failure response [failureResponse]</b>
                <span>
                  This strategy is not fixed. Forge continously evaluates.
                </span>
                <ul>
                  <li>Practice consistency</li>
                  <li>Difficulty trends</li>
                  <li>Error patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
