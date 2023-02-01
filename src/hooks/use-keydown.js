import { useEffect, useState } from "react";

export const useKeydown = (code) => {
  const [isKeyDown, setIsKeyDown] = useState(false);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore IME events
      if (e.isComposing || e.keyCode === 229) return;
  
      if(e.code === code) setIsKeyDown(true);
    }
    
    const handleKeyUp = (e) => {
      // Ignore IME events
      if (e.isComposing || e.keyCode === 229) return;
      
      if(e.code === code) setIsKeyDown(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    }
  }, []);

  return isKeyDown;
}