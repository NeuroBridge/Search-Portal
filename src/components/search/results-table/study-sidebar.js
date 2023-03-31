import { ArrowDropDownCircle as InspectTermIcon, Clear, ExpandMore } from "@mui/icons-material";
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import studyConcepts from "../../../data/study-concepts.json";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from '../../link'

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  backgroundColor: "transparent",
  "&:not(:last-of-type)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ExpandMore />} {...props} />
))(({ theme }) => ({
  backgroundColor: "#0001",
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,

  "& .MuiTypography-root": {
    color: "inherit",
    textTransform: "uppercase",
    fontSize: `0.875rem`,
    lineHeight: "1.5",
  },

  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "inherit",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const SIDEBAR_CONFIG = {
  initialWidth: 350,
  minWidth: 200,
  maxWidth: 700,
};

const renderAbstract = (abstractElement) => {
  const result = [];

  const abstractTextEls = [
    ...abstractElement.getElementsByTagName("AbstractText"),
  ];

  abstractTextEls.forEach((abstractText, index) => {
    if (abstractText.hasAttribute("Label")) {
      result.push(
        <Typography
          key={`abstract-text-${index}-heading`}
          variant="body2"
          sx={{ fontWeight: "bold", mb: "0.2rem" }}
        >
          {abstractText.getAttribute("Label")}
        </Typography>
      );
    }
    result.push(
      <Typography
        key={`abstract-text-${index}-content`}
        sx={{ "&:not(:last-of-type)": { marginBottom: "1rem" } }}
      >
        {abstractText.textContent}
      </Typography>
    );
  });

  return result;
};

const getDate = (pubDateEl) => {
  if (pubDateEl === undefined) return undefined;

  const month = pubDateEl.getElementsByTagName("Month")?.[0]?.textContent;
  const day = pubDateEl.getElementsByTagName("Day")?.[0]?.textContent;
  const year = pubDateEl.getElementsByTagName("Year")?.[0]?.textContent;

  let result = "";
  if (month) {
    result += `${month}. `;
  }
  if (day) {
    result += `${day}, `;
  }
  if (year) {
    result += year;
  }
  return result;
};

export const StudySidebar = ({
  selectedRow,
  setSelectedRow,
  sidebarWidth,
  setSidebarWidth,
  expandedAccordions,
  setExpandedAccordions,
}) => {
  const [pubMedResponse, setPubMedResponse] = useState(null);
  const containerRef = useRef(null);

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
      SIDEBAR_CONFIG.minWidth < newWidth &&
      newWidth < SIDEBAR_CONFIG.maxWidth
    ) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleAccordionClicked = (panel) => () => {
    const nextState = new Set(expandedAccordions);

    if (nextState.has(panel)) {
      nextState.delete(panel);
    } else {
      nextState.add(panel);
    }

    setExpandedAccordions(() => nextState);
  };

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
      const studyXML = new window.DOMParser().parseFromString(text, "text/xml");

      setPubMedResponse({
        title: studyXML.getElementsByTagName("ArticleTitle")?.[0].textContent,
        abstract: studyXML.getElementsByTagName("Abstract")?.[0],
        authors: [...studyXML.getElementsByTagName("Author")].map(
          (authorEl) =>
            `${authorEl
              .getElementsByTagName("Initials")[0]
              .textContent.split("")
              .join(".")}. ${
              authorEl.getElementsByTagName("LastName")[0].textContent
            }`
        ),
        date: getDate(studyXML.getElementsByTagName("PubDate")?.[0]),
        journal:
          studyXML.getElementsByTagName("ISOAbbreviation")?.[0]?.textContent,
        pmid: studyXML.getElementsByTagName('PMID')?.[0].textContent,
        doi: studyXML.querySelector('ELocationID[EIdType="doi"]')?.textContent,
      });
    })();
  }, [selectedRow]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: sidebarWidth,
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
          PubMed: {selectedRow.pmid}
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

      <Box p={2}>
        <Typography variant="body1" component="h3" sx={{ fontWeight: "bold" }}>
          {!pubMedResponse ? "Loading" : pubMedResponse.title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {!pubMedResponse ? "Loading" : pubMedResponse.authors.join(", ")}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          {`${pubMedResponse?.date ? `${pubMedResponse.date} — ` : ""}${
            pubMedResponse?.journal ? pubMedResponse.journal : ""
          }`}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" sx={{
          '& span:not(:last-of-type):after': {
            content: '"•"',
            marginX: '1ch',
          }
        }}>
          {pubMedResponse?.pmid ? <span><Link to={`https://pubmed.ncbi.nlm.nih.gov/${pubMedResponse.pmid}/`}>{pubMedResponse.pmid}</Link></span> : null}
          {pubMedResponse?.doi ? <span><Link to={`https://doi.org/${pubMedResponse.doi}`}>{pubMedResponse.doi}</Link></span> : null}
        </Typography>
      </Box>

      <Accordion
        expanded={expandedAccordions.has("abstract-panel")}
        onChange={handleAccordionClicked("abstract-panel")}
      >
        <AccordionSummary
          aria-controls="abstract-panel-content"
          id="abstract-panel-header"
        >
          <Typography>Abstract</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {pubMedResponse ? renderAbstract(pubMedResponse.abstract) : null}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={
          !(
            !selectedRow.pmcid ||
            !(selectedRow.pmcid.toLowerCase() in studyConcepts)
          ) && expandedAccordions.has("concepts-panel")
        }
        onChange={handleAccordionClicked("concepts-panel")}
      >
        <AccordionSummary
          aria-controls="concepts-panel-content"
          id="concepts-panel-header"
          disabled={
            !selectedRow.pmcid ||
            !(selectedRow.pmcid.toLowerCase() in studyConcepts)
          }
        >
          <Typography>Concepts</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <List dense>
            {Boolean(selectedRow.pmcid) &&
              selectedRow.pmcid.toLowerCase() in studyConcepts &&
              studyConcepts[selectedRow.pmcid.toLowerCase()].map(
                (concept, index) => {
                  return (
                    <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{concept}</Typography>
                      
                      <Tooltip title="Open concept in Ontology Viewer" placement="left">
                        <IconButton
                          onClick={() => {}}
                          size="small"
                          sx={{
                            '--delay': '250ms',
                            color: 'palette.primary',
                            opacity: 0.4,
                            transition: 'color var(--delay), opacity var(--delay)',
                            '&:hover': { 
                              color: 'info.main', 
                              opacity: 1,
                              transition: 'color var(--delay), opacity var(--delay)',
                            }}}>
                          <InspectTermIcon sx={{ transform: 'rotate(-90deg)' }} />
                        </IconButton>
                    </Tooltip>
                    </ListItem>
                  )
                }
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
  expandedAccordions: PropTypes.any,
  setExpandedAccordions: PropTypes.any,
};
