import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useRef, useState } from 'react';

export const TRAY_CONFIG = {
  initialWidth: 350,
  minWidth: 200,
  maxWidth: 600,
};

export const DraggableTray = ({ children, width, setWidth }) => {
  const containerRef = useRef(null);

  if(width === undefined || setWidth === undefined) {
    [width, setWidth] = useState(TRAY_CONFIG.initialWidth);
  }
  
  const handleMouseDown = (event) => {
    event.preventDefault();
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseMove = useCallback((event) => {
    if (!containerRef.current) return;

    const newWidth =
      containerRef.current.offsetLeft +
      containerRef.current.offsetWidth -
      event.clientX;
    if (
      TRAY_CONFIG.minWidth < newWidth &&
      newWidth < TRAY_CONFIG.maxWidth
    ) {
      setWidth(newWidth);
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width,
        position: "relative",
        paddingLeft: "3px",
      }}
    >
      <Box
        sx={{
          width: "4px",
          backgroundColor: "divider",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "-2px",
          cursor: "ew-resize",

          "&:hover": {
            width: "6px",
            left: "-3px",
          },
        }}
        onMouseDown={handleMouseDown}
        aria-hidden="true"
      ></Box>
      {children}
    </Box>
  )
};

DraggableTray.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number,
  setWidth: PropTypes.func,
};
