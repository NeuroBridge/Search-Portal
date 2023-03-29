import { Clear } from "@mui/icons-material";
import { Box, IconButton, List, ListItem, Stack, Tooltip } from "@mui/material";
import studyConcepts from "../../../data/study-concepts.json";
import PropTypes from "prop-types";

export const StudySidebar = ({ selectedRow, setSelectedRow }) => {
  return (
    <Box
      sx={{
        borderLeft: "3px solid",
        borderColor: "divider",
      }}
    >
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
            lineHeight: "1.43",
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
