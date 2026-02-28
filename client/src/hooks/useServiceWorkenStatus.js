import { useEffect, useState } from "react";

export const useServiceWorkerStatus = () => {
    const [isActive, setIsActive] = useState(null);
  
    useEffect(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then(() => setIsActive(true))
          .catch(() => setIsActive(false));
      } else {
        setIsActive(false);
      }
    }, []);
  
    return isActive;
  };