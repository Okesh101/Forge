import React from "react";
import SideBar from "../Utilities/SideBar";
import PageNav from "../Utilities/PageNav";

export default function LogPracticeSession() {
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
                <label>FOCUS CONTENT</label>
                <input type="text" placeholder="What did you work on" />
              </fieldset>
              {/* {errors.goal && <p className="errorMssg">{errors.goal}</p>} */}
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
                  <label>DURATION (MIN)</label>
                  <input type="number" />
                </fieldset>
                {/* {errors.goal && <p className="errorMssg">{errors.goal}</p>} */}
              </div>
              <div className="field" style={{ width: "100%" }}>
                <fieldset>
                  <label>DIFFICULTY (1-10)</label>
                  <input type="number" />
                </fieldset>
                {/* {errors.goal && <p className="errorMssg">{errors.goal}</p>} */}
              </div>
            </section>

            <div className="field">
              <fieldset>
                <label>FATIGUE LEVEL (1-10)</label>
                <input type="range" min="1" max="10" />
              </fieldset>
            </div>
          </form>
          <button type="button">Submit Log</button>
        </div>
      </div>
    </>
  );
}
