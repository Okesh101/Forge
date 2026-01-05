import React from "react";
import { motion } from "framer-motion";

export default function PageNav() {
  return (
    <motion.div
      className="page-nav"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ delay: 0.1, duration: 0.4 }}
    >
      <motion.h1
        initial={{ x: "400px" }}
        animate={{ x: "10px" }}
        transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
      >
        Forge
      </motion.h1>
    </motion.div>
  );
}
