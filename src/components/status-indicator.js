import { Circle, Refresh } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";

const STATUS_URLS = [
  {
    name: "NeuroQuery",
    url: "https://neurobridges.renci.org:13374/query?searchTerms=abstinence",
    method: "GET",
  },
  {
    name: "NeuroBridge",
    url: "https://neurobridges-ml.renci.org/nb_translator",
    method: "POST",
    body: {
      query: {
        expression: {
          OR: ["Abstinent"],
        },
        max_res: 100,
      },
    },
  },
  {
    name: "NB-NQ Translator",
    url: "https://neurobridges.apps.renci.org/healthz",
    method: "GET",
  },
];

const PopoverPaper = styled(Paper)(({ theme }) => ({
  "--gradient-overlay":
    "linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))",

  padding: theme.spacing(2),
  filter: `drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3))`,
  backgroundImage: "var(--gradient-overlay)",

  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    top: "-15px",
    left: "0",
    right: "0",
    margin: "0 auto",
    clipPath: "path('M 0 15 L 10 0 L 20 15 Z')",
    width: "20px",
    height: "15px",
    backgroundColor: theme.palette.background.paper,
    backgroundImage: "var(--gradient-overlay)",
  },
}));

export const StatusIndicator = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [statuses, setStatuses] = useState(
    STATUS_URLS.reduce((acc, curr) => ({ ...acc, [curr.name]: "loading" }), {})
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const refreshStatuses = () => {
    setStatuses(
      STATUS_URLS.reduce(
        (acc, curr) => ({ ...acc, [curr.name]: "loading" }),
        {}
      )
    );

    STATUS_URLS.forEach(({ name, url, method, body }) => {
      fetch(url, { method, body: JSON.stringify(body) })
        .then((response) => ({
          [name]: response.status === 200 ? "success" : "error",
        }))
        .then((serviceStatus) =>
          setStatuses((prev) => ({ ...prev, ...serviceStatus }))
        )
        .catch(() => setStatuses((prev) => ({ ...prev, [name]: "error" })));
    });
  };

  useEffect(() => {
    refreshStatuses();
  }, []);

  const numberOfErrors = Object.values(statuses).reduce(
    (sum, currentStatus) => (currentStatus === "error" ? sum + 1 : sum),
    0
  );

  const tooltipText = () => {
    if (numberOfErrors > 0) {
      return `${numberOfErrors} service${numberOfErrors > 1 ? "s" : ""} down`;
    }
    if (Object.values(statuses).some((status) => status === "loading")) {
      return "Checking services...";
    }
    return "All services are operational";
  };

  const iconButtonColor = numberOfErrors > 0 ? "error" : "success";

  return (
    <>
      <Tooltip placement="bottom" title={tooltipText()}>
        <IconButton color={iconButtonColor} onClick={handleClick}>
          {Object.values(statuses).some((status) => status === "loading") ? (
            <CircularProgress size="24px" />
          ) : (
            <Circle fontSize="xs" />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          marginTop: "15px",
          "& .MuiPopover-paper": { overflowY: "visible", overflowX: "visible" },
        }}
        PaperProps={{ style: { boxShadow: "none" } }}
      >
        <PopoverPaper>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="h3">
              Status
            </Typography>
            <IconButton size="small" onClick={refreshStatuses}>
              <Refresh />
            </IconButton>
          </Box>
          <Divider sx={{ margin: "6px 0 10px 0" }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {Object.entries(statuses).map(([name, status], index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "3ch",
                }}
              >
                <Typography variant="body1">{name}</Typography>
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "15px",
                  }}
                >
                  {status === "loading" ? (
                    <CircularProgress size="15px" />
                  ) : (
                    <Circle fontSize="inherit" color={status} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </PopoverPaper>
      </Popover>
    </>
  );
};
