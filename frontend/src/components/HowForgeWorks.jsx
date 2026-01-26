import React from "react";
import PageNav from "../Utilities/PageNav";
import SideBar from "../Utilities/SideBar";

export default function HowForgeWorks() {
  const helpItems = [
    {
      title: "1. Starting a Session",
      info: (
        <span>
          Click <strong>Start Forging</strong> on the landing page to begin. A
          unique Session ID is created to track your learning over time.
        </span>
      ),
    },
    {
      title: "2. Resuming Progress",
      info: (
        <span>
          If you already have a Session ID, log in to continue from where you
          stopped. New users are guided to start a new session.
        </span>
      ),
    },
    {
      title: "3. Initial Plan Generation",
      info: (
        <span>
          Forge breaks your chosen skills into sub-skills and creates an initial
          practice strategy based on your inputs.
        </span>
      ),
    },
    {
      title: "4. Logging Practice",
      info: (
        <span>
          Log what you practiced or add short reflections. Detailed explanations
          or uploads are not required.
        </span>
      ),
    },
    {
      title: "5. Autonomous Analysis",
      info: (
        <span>
          The system analyzes your practice history overtime, detecting
          improvement, stagnation, or recurring mistakes.
        </span>
      ),
    },
    {
      title: "6. Strategy Updates",
      info: (
        <span>
          Practice strategies are automatically adjusted. Difficulty, focus
          areas, and techniques evolve as needed.
        </span>
      ),
    },
    {
      title: "7. Narration & Timeline",
      info: (
        <span>
          Narration explains what to focus on next and why. The Timeline shows
          how your strategy changes overb time.
        </span>
      ),
    },
    {
      title: "8. Continuous Learning",
      info: (
        <span>
          No re-prompting or restrating is needed. Forge continues learning and
          adapting as time progresses.
        </span>
      ),
    },
  ];

  return (
    <>
      {/* <PageNav/> */}
      <SideBar />
      <div className="container">
        <PageNav />
        <div className="how_it_works">
          <h1>How Forge Works</h1>
          <div className="box">
            {helpItems.map((item, index) => (
              <div className="item" key={index}>
                <p>{item.title}: </p>
                <span> {item.info}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
