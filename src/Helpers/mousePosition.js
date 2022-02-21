//Custom hook for locating mouse position
//Code taken from https://gist.github.com/whoisryosuke/99f23c9957d90e8cc3eb7689ffa5757c
import { useState, useEffect } from "react";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  const updateMousePosition = (e) => {
    setMousePosition({ mouseX: e.clientX, mouseY: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
};

export default useMousePosition;
