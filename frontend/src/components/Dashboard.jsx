import React from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const handleMssg = () => {
    alert("Just kidding my laptop is dead (:");
  };
  return (
    <div className="dashboard">
      <motion.p
        initial={{ x: "-400vw" }}
        animate={{ x: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      >
        This button will work when u click on it
      </motion.p>
      <button onClick={handleMssg}>Click on it </button>
    </div>
  );
}
