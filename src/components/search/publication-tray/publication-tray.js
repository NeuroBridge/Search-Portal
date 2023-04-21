import { Clear, ClearAll, Close } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Tabs, Tab } from "@mui/material";
import PropTypes from "prop-types";
import { Publication } from "./publication";
import { useMemo } from "react";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

TabPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  children: PropTypes.node,
};

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

export const PublicationTray = ({
  setIsSidebarOpen,
  studyTabs,
  setStudyTabs,
  activeTab,
  setActiveTab,
  expandedAccordions,
  setExpandedAccordions,
}) => {
  const activeTabIndex = useMemo(
    () => studyTabs.findIndex((tab) => tab.study?.pmid === activeTab),
    [activeTab, studyTabs]
  );

  const handleChange = (event, newValue) => {
    setActiveTab(studyTabs[newValue].study.pmid);
  };

  const handleCloseTab = (closedTab) => (e) => {
    e.stopPropagation();
    setStudyTabs((prev) => prev.filter((tab) => tab !== closedTab));

    if (closedTab.study.pmid === activeTab) {
      if (studyTabs.length <= 1) {
        setActiveTab(null);
      } else {
        setActiveTab(studyTabs[0].study.pmid);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            sx={{
              pt: "1px",
              "& .MuiButtonBase-root": {
                minHeight: "3rem",
              },
            }}
            value={activeTabIndex}
            onChange={handleChange}
            aria-label="publication tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {studyTabs.map((tab) => (
              <Tooltip
                key={`pmid-${tab.study?.pmid}`}
                title={tab.study?.title}
                placement="top"
              >
                <Tab
                  icon={
                    <Close fontSize="small" onClick={handleCloseTab(tab)} />
                  }
                  iconPosition="end"
                  label={`${
                    typeof tab.study?.title === "string" &&
                    tab.study?.title?.split("").splice(0, 10).join("")
                  }...`}
                  {...a11yProps(tab.study?.pmid)}
                />
              </Tooltip>
            ))}
          </Tabs>
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
            <Tooltip title="Close all tabs" placement="top">
              <IconButton
                onClick={() => setStudyTabs([])}
                size="small"
                aria-label="Close all tabs"
                sx={{ borderRadius: 0, height: "100%", p: 1 }}
              >
                <ClearAll />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close publication view" placement="top">
              <IconButton
                onClick={() => setIsSidebarOpen(false)}
                size="small"
                aria-label="Close publication view"
                sx={{
                  borderRadius: 0,
                  height: "100%",
                  p: 1,
                  borderLeft: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Clear />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {studyTabs.map((tab, i) => (
          <TabPanel
            key={`tab-panel-${tab?.study?.pmid}`}
            value={activeTabIndex}
            index={i}
          >
            <Publication
              selectedRow={tab.study}
              expandedAccordions={expandedAccordions}
              setExpandedAccordions={setExpandedAccordions}
            />
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

PublicationTray.propTypes = {
  selectedRow: PropTypes.any,
  setIsSidebarOpen: PropTypes.any,
  studyTabs: PropTypes.any,
  setStudyTabs: PropTypes.any,
  activeTab: PropTypes.any,
  setActiveTab: PropTypes.any,
  expandedAccordions: PropTypes.any,
  setExpandedAccordions: PropTypes.any,
};
