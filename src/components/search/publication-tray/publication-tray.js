import { Clear, ExpandMore } from "@mui/icons-material";
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Skeleton as MuiSkeleton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import studyConcepts from "../../../data/study-concepts.json";
import PropTypes from "prop-types";
import { Link } from "../../link";
import { Link as MuiLink } from "@mui/material";
import { usePubMedAPI } from "./pubmed-api";
import { ErrorScreen } from "./error-screen";
import { useState } from "react";
import { AuthorModal } from "./author-modal";

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

const Skeleton = styled((props) => <MuiSkeleton {...props} />)(() => ({
  borderRadius: "6px",
}));

export const PublicationTray = ({
  selectedRow,
  setSelectedRow,
  expandedAccordions,
  setExpandedAccordions,
}) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const {
    error,
    loading,
    fetch,
    article: { title, abstract, authors, date, journal, articleIds },
  } = usePubMedAPI(selectedRow.pmid);

  const handleAccordionClicked = (panel) => () => {
    const nextState = new Set(expandedAccordions);

    if (nextState.has(panel)) {
      nextState.delete(panel);
    } else {
      nextState.add(panel);
    }

    setExpandedAccordions(nextState);
  };

  return (
    <Box>
      {Boolean(selectedAuthor) && (
        <AuthorModal
          author={selectedAuthor}
          handleClose={() => setSelectedAuthor(null)}
        />
      )}
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
          <Tooltip title="Close publication view" placement="left">
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

      <ErrorScreen error={error} onRetry={() => fetch()}>
        <Box p={2}>
          <Typography
            variant="body1"
            component="h3"
            sx={{ fontWeight: "bold" }}
          >
            {loading ? (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton width="50%" />
              </>
            ) : (
              title
            )}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {loading ? (
              <Skeleton width="75%" />
            ) : (
              authors?.reduce(
                (acc, cur, i) => [
                  ...acc,
                  <MuiLink
                    key={i}
                    component="button"
                    onClick={() => {
                      setSelectedAuthor(cur);
                    }}
                  >{`${cur.initials} ${cur.lastName}`}</MuiLink>,
                  i !== authors.length - 1 ? ", " : "",
                ],
                []
              )
            )}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
            {loading ? (
              <>
                <Skeleton
                  width="40px"
                  sx={{ display: "inline-block", mr: "2ch" }}
                />
                <Skeleton width="80px" sx={{ display: "inline-block" }} />
              </>
            ) : (
              `${date ? `${date} — ` : ""}${journal ? journal : ""}`
            )}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="body2"
            sx={{
              "& span:not(:last-of-type):not(.MuiSkeleton-root)::after": {
                content: '"•"',
                marginX: "1ch",
              },
              "& .MuiSkeleton-root:not(:last-of-type)": {
                mr: "2ch",
              },
            }}
          >
            {loading ? (
              <Skeleton width="8ch" sx={{ display: "inline-block" }} />
            ) : articleIds?.pubmed ? (
              <span>
                <Link
                  to={`https://pubmed.ncbi.nlm.nih.gov/${articleIds.pubmed}/`}
                >
                  {articleIds.pubmed}
                </Link>
              </span>
            ) : null}
            {loading ? (
              <Skeleton width="10ch" sx={{ display: "inline-block" }} />
            ) : articleIds?.pmc ? (
              <span>
                <Link
                  to={`https://www.ncbi.nlm.nih.gov/pmc/articles/${articleIds.pmc}/`}
                >
                  {articleIds.pmc}
                </Link>
              </span>
            ) : null}
            {loading ? (
              <Skeleton width="18ch" sx={{ display: "inline-block" }} />
            ) : articleIds?.doi ? (
              <span>
                <Link to={`https://doi.org/${articleIds.doi}`}>
                  {articleIds.doi}
                </Link>
              </span>
            ) : null}
          </Typography>
        </Box>

        <Accordion
          expanded={
            Array.isArray(abstract) && expandedAccordions.has("abstract-panel")
          }
          onChange={handleAccordionClicked("abstract-panel")}
        >
          <AccordionSummary
            aria-controls="abstract-panel-content"
            id="abstract-panel-header"
            disabled={!Array.isArray(abstract)}
          >
            <Typography>Abstract</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {loading
              ? [...new Array(3)].map((_, i) => (
                  <Box key={i} sx={{ "&:not(:last-of-type)": { mb: "1rem" } }}>
                    <Typography variant="body2" sx={{ mb: "0.5em" }}>
                      <Skeleton width="15ch" />
                    </Typography>
                    <Skeleton height="8em" sx={{ transform: "none" }} />
                  </Box>
                ))
              : Array.isArray(abstract) &&
                abstract.map((abstractSection, index) => (
                  <Box
                    key={index}
                    sx={{ "&:not(:last-of-type)": { mb: "1rem" } }}
                  >
                    {Boolean(abstractSection.heading) && (
                      <Typography
                        variant="body2"
                        component="h4"
                        sx={{ fontWeight: "bold", mb: "0.2rem" }}
                      >
                        {abstractSection.heading}
                      </Typography>
                    )}
                    <Typography>{abstractSection.text}</Typography>
                  </Box>
                ))}
          </AccordionDetails>
        </Accordion>
      </ErrorScreen>

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
          <Typography>
            Assessments
            {studyConcepts[selectedRow.pmcid?.toLowerCase()]
              ? ` (${studyConcepts[selectedRow.pmcid?.toLowerCase()]?.length})`
              : null}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <List dense>
            {Boolean(selectedRow.pmcid) &&
              selectedRow.pmcid.toLowerCase() in studyConcepts &&
              studyConcepts[selectedRow.pmcid.toLowerCase()].map(
                (concept, index) => {
                  return (
                    <ListItem
                      key={index}
                      // secondaryAction={
                      //   <Tooltip
                      //     title="Open concept in Ontology Viewer"
                      //     placement="left"
                      //     edge="end"
                      //   >
                      //     <IconButton
                      //       onClick={() => {}}
                      //       size="small"
                      //       sx={{
                      //         "--delay": "250ms",
                      //         color: "palette.primary",
                      //         opacity: 0.4,
                      //         transition:
                      //           "color var(--delay), opacity var(--delay)",
                      //         "&:hover": {
                      //           color: "info.main",
                      //           opacity: 1,
                      //           transition:
                      //             "color var(--delay), opacity var(--delay)",
                      //         },
                      //       }}
                      //     >
                      //       <InspectTermIcon
                      //         sx={{ transform: "rotate(-90deg)" }}
                      //       />
                      //     </IconButton>
                      //   </Tooltip>
                      // }
                    >
                      <Typography
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {concept}
                      </Typography>
                    </ListItem>
                  );
                }
              )}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

PublicationTray.propTypes = {
  selectedRow: PropTypes.any,
  setSelectedRow: PropTypes.any,
  expandedAccordions: PropTypes.any,
  setExpandedAccordions: PropTypes.any,
};
