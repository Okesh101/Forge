import { useEffect, useState } from "react";

export const useWindowSize = () => {
  // State to hold window size
  const [windowSize, setWindowSize] = useState({ width: undefined });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};
