import React, { useContext, useState } from "react";
import { BsKey, BsKeyFill } from "react-icons/bs";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../contextApi/SessionContext";

export default function LogIn({ setShowLogin }) {
  const [showId, setShowId] = useState(false);
  const [session_Id, setSession_Id] = useState("");
  const [session_Id_Error, setSession_Id_Error] = useState("");
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const navigate = useNavigate();
  const { BACKEND_API } = useContext(SessionContext);

  const toggleIdVisibility = () => {
    setShowId((prev) => !prev);
  };

  // function to close login modal
  const onClose = () => {
    setShowLogin(false);
    setSession_Id("");
    setSession_Id_Error("");
  };
  const handleSubmit = async () => {
    let isValid = true;
    if (!session_Id) {
      setSession_Id_Error("This field is required");
      return;
    }
    // If session ID is valid, send login request to backend
    if (isValid) {
      // Set button to loading state
      setIsBtnClicked(true);

      
      try {
        const res = await fetch(`${BACKEND_API}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_Id }),
        });

        const data = await res.json();
        // If login is successful, store session ID in session storage and navigate to log session page
        if (data.status === "success") {
          sessionStorage.setItem("sessionId", session_Id);
          navigate("/logSession");
          setSession_Id_Error("");
        } else if (data.error) {
          setSession_Id_Error(data.error);
          setIsBtnClicked(false);
        }
      } catch (error) {
        console.log(error.message);
        setIsBtnClicked(false);
      }
    }
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
                type={showId === true ? "text" : "password"}
                placeholder="Enter your session ID"
                value={session_Id}
                onChange={(e) => setSession_Id(e.target.value)}
                autoComplete="new-password"
              />
              <button onClick={toggleIdVisibility}>
                {showId === false ? (
                  <FiEye size={24} />
                ) : (
                  <FiEyeOff size={24} />
                )}
              </button>
            </section>
            {session_Id_Error && (
              <small style={{ color: "red" }}>{session_Id_Error}</small>
            )}
          </fieldset>
          <button className="login_btn" onClick={handleSubmit}>
            {isBtnClicked === true ? (
              <>
                <div className="loader"></div>
                Logging In
              </>
            ) : (
              "Login"
            )}
          </button>
        </main>
      </div>
    </div>
  );
}
