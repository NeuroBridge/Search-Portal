import { Clear } from "@mui/icons-material";
import { Box, IconButton, List, ListItem, Stack, Tooltip } from "@mui/material";
import studyConcepts from "../../../data/study-concepts.json";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";

const SIDEBAR_CONFIG = {
  initialWidth: 350,
  minWidth: 200,
  maxWidth: 700,
}

export const StudySidebar = ({ selectedRow, setSelectedRow }) => {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_CONFIG.initialWidth);
  const [pubMedResponse, setPubMedResponse] = useState(null);
  const containerRef = useRef(null);

  const handleMouseDown = (event) => {
    event.preventDefault();
    document.addEventListener("mouseup", handleMouseUp, true)
    document.addEventListener("mousemove", handleMouseMove, true)
  }
  
  const handleMouseUp = (event) => {
    event.preventDefault();
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

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${selectedRow.pmid}`,
        {
          method: "GET",
          headers: {
            Accept: "application/xml",
          },
        }
      );
      const text = await response.text();
      const studyXML = (new window.DOMParser().parseFromString(text, 'text/xml'));
      console.log(studyXML);

      setPubMedResponse({
        title: studyXML.getElementsByTagName('ArticleTitle')[0].textContent
      })
    })();
  }, []);

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

          '&:hover': {
            width: '6px',
            left: '-3px',
          }
        }}
        onMouseDown={handleMouseDown}
      ></Box>
      <Box
        aria-hidden="true"
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
      <Box>
        {!pubMedResponse ? "Loading" : pubMedResponse.title}
      </Box>
    </Box>
  );
};

StudySidebar.propTypes = {
  selectedRow: PropTypes.any,
  setSelectedRow: PropTypes.any,
};
