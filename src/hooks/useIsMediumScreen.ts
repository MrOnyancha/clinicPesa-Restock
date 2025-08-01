import { useEffect, useState } from "react";

export const useIsMediumScreen = () => {
  const [isMedium, setIsMedium] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsMedium(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMedium;
};
