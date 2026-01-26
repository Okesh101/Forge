import React, { useState } from "react";
import { BsKey, BsKeyFill } from "react-icons/bs";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";

export default function LogIn({ setShowLogin }) {
  const [showId, setShowId] = useState(false);
  const [session_Id, setSession_Id] = useState("");

  const toggleIdVisibility = () => {
    setShowId((prev) => !prev);
  };

  // function to close login modal
  const onClose = () => {
    setShowLogin(false);
    setSession_Id("");
  };

  const handleSubmit = () => {
    console.log(session_Id);
    setSession_Id("");
  };
  return (
    <div className="login_page" onClick={onClose}>
      <div className="content" onClick={(e) => e.stopPropagation()}>
        <nav>
          <h1>Forge</h1>
          <FiX className="icon" size={30} onClick={onClose} />
        </nav>

        <header>
          <h2>Log In With Your Session ID</h2>
          <p>
            Enter your session ID to access your personalized practice session.
          </p>
        </header>

        <main>
          <fieldset>
            <label htmlFor="sessionId">Session ID</label>
            <section>
              <BsKeyFill size={30} style={{ color: "#df4e00" }} />
              <input
                type={showId === false ? "password" : "text"}
                placeholder="Enter your session ID"
                value={session_Id}
                onChange={(e) => setSession_Id(e.target.value)}
              />
              {/* <input type="text"  /> */}
              <button onClick={toggleIdVisibility}>
                {showId === false ? (
                  <FiEye size={24} />
                ) : (
                  <FiEyeOff size={24} />
                )}
              </button>
            </section>
          </fieldset>
          <button className="login_btn" onClick={handleSubmit}>
            Login
          </button>
        </main>
      </div>
    </div>
  );
}
