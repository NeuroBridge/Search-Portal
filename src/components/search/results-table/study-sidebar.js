import { Clear, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, List, ListItem, Stack, Tooltip, Typography } from "@mui/material";
import studyConcepts from "../../../data/study-concepts.json";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";

export const SIDEBAR_CONFIG = {
  initialWidth: 350,
  minWidth: 200,
  maxWidth: 700,
}

const renderAbstract = (abstractElement) => {
  const result = [];

  const abstractTextEls = [...abstractElement.getElementsByTagName('AbstractText')];

  abstractTextEls.forEach((abstractText, index) => {
    if (abstractText.hasAttribute("Label")) {
      result.push(<Typography key={`abstract-text-${index}-heading`} sx={{ fontWeight: 'bold' }}>{abstractText.getAttribute("Label")}</Typography>)
    }
    result.push(<Typography key={`abstract-text-${index}-content`}>{abstractText.textContent}</Typography>)
  });

  return result;
};

export const StudySidebar = ({ selectedRow, setSelectedRow, sidebarWidth, setSidebarWidth }) => {
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

      setPubMedResponse({
        title: studyXML.getElementsByTagName('ArticleTitle')[0].textContent,
        abstract: studyXML.getElementsByTagName('Abstract')[0],
      })
    })();
  }, [selectedRow]);

  useEffect(() => {
    console.log(pubMedResponse);
  }, [pubMedResponse]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: sidebarWidth,
        position: "relative",
        paddingLeft: '3px',
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
          },
        }}
        onMouseDown={handleMouseDown}
        aria-hidden="true"
      ></Box>
      <Box
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
      
      <Accordion disableGutters elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
          <Typography>Title</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{!pubMedResponse ? "Loading" : pubMedResponse.title}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel2-content" id="panel2-header">
          <Typography>Abstract</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {pubMedResponse ? renderAbstract(pubMedResponse.abstract) : null}
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel3-content" id="panel3-header">
          <Typography>Concepts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {studyConcepts[selectedRow.pmcid.toLowerCase()].map(
              (concept, index) => (
                <ListItem key={index}>{concept}</ListItem>
              )
            )}
          </List>
        </AccordionDetails>
      </Accordion>

    </Box>
  );
};

StudySidebar.propTypes = {
  selectedRow: PropTypes.any,
  setSelectedRow: PropTypes.any,
  sidebarWidth: PropTypes.any,
  setSidebarWidth: PropTypes.any,
};
