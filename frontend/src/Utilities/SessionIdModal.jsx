import React, { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

export default function SessionIdModal({ onClose }) {
  // Get session ID from session storage
  const SESSION_ID = sessionStorage.getItem("sessionId");

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(SESSION_ID);
    setCopied(true);
  };

  return (
    <div className="sessionModal">
      <div className="text">
        <FiX size={30} className="cancel-btn" onClick={onClose} />

        <p>Your Practice session has been created successfully.</p>
        <p>
          Use the session ID below to log in and return to your progress at any
          time.
        </p>
        {/* <span></span> */}
        <div className="session_field">
          <span>{SESSION_ID}</span>
          <button onClick={copyToClipboard}>
            {copied === true ? (
              <span>
                Copied <FiCheck />
              </span>
            ) : (
              "Copy Session ID"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// 369f2aea-0fe9-4064-a9d3-c4e2925a3b3d
