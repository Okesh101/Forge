import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // Get the current pathname using useLocation hook
  const { pathname } = useLocation();

  // Scroll to top whenever the pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
