import { Clear } from "@mui/icons-material";
import { Box, IconButton, List, ListItem, Stack, Tooltip } from "@mui/material";
import studyConcepts from "../../../data/study-concepts.json";
import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";

const SIDEBAR_CONFIG = {
  initialWidth: 350,
  minWidth: 200,
  maxWidth: 700,
}

export const StudySidebar = ({ selectedRow, setSelectedRow }) => {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_CONFIG.initialWidth);
  const containerRef = useRef(null);

  const handleMouseDown = (event) => {
    event.preventDefault();
    console.log('mousedown');
    document.addEventListener("mouseup", handleMouseUp, true)
    document.addEventListener("mousemove", handleMouseMove, true)
  }
  
  const handleMouseUp = (event) => {
    event.preventDefault();
    console.log('mouseup');
    document.removeEventListener("mouseup", handleMouseUp, true)
    document.removeEventListener("mousemove", handleMouseMove, true)
  }

  const handleMouseMove = useCallback(event => {
    if(!containerRef.current) return;
    
    const newWidth = containerRef.current.offsetLeft + containerRef.current.offsetWidth - event.clientX
    if (SIDEBAR_CONFIG.minWidth < newWidth && newWidth < SIDEBAR_CONFIG.maxWidth) {
      setSidebarWidth(newWidth)
    }
  }, [])

  return (
    <Box
      ref={containerRef}
      sx={{
        width: sidebarWidth,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "4px",
          backgroundColor: "divider",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: '-2px',
          cursor: 'ew-resize',
          transistion: 'width 2500ms, left 2500ms',

          '&:hover': {
            transistion: 'width 2500ms, left 2500ms',
            width: '6px',
            left: '-3px',
          }
        }}
        onMouseDown={handleMouseDown}
      ></Box>
      <Box
        aria-aria-hidden="true"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: 2,
            fontSize: `0.875rem`,
            lineHeight: "1.5",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          {selectedRow.pmcid}
        </Box>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          className="results-action-buttons"
          sx={{
            p: "0 1 0 0",
            borderLeft: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tooltip title="Close study concepts view" placement="left">
            <IconButton
              onClick={() => setSelectedRow(null)}
              size="small"
              aria-label="Clear all results"
              sx={{ borderRadius: 0, height: "100%", p: 1 }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <List>
        {studyConcepts[selectedRow.pmcid.toLowerCase()].map(
          (concept, index) => (
            <ListItem key={index}>{concept}</ListItem>
          )
        )}
      </List>
    </Box>
  );
};

StudySidebar.propTypes = {
  selectedRow: PropTypes.any,
  setSelectedRow: PropTypes.any,
};
