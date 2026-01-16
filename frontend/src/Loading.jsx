import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  const text = "LOADING...";
  const letters = text.split(""); // Split text into individual characters

  return (
    <div className="loading-page">
      <div className="loadingMssg">
        <div className="loader">
          {letters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: index * 0.1, // Stagger animation for each character
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="letter"
            >
              {char}
            </motion.span>
          ))}
        </div>
        <p>Designing Your Strategy...</p>
      </div>
    </div>
  );
}
