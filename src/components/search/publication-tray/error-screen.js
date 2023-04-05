import { Error } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

export const ErrorScreen = ({ children, error, onRetry }) => {
  if (!error) return children;

  return (
    <Box
      sx={{
        backgroundColor: "error.background",
        padding: 4,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Error fontSize="large" sx={{ color: "error.main" }} />
      <Typography
        variant="body1"
        sx={{ color: "error.main", maxWidth: "20ch", textAlign: "center" }}
      >
        {error.message}. Check your internet connection and retry.
      </Typography>
      <Button variant="outlined" color="error" onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );
};

ErrorScreen.propTypes = {
  children: PropTypes.node,
  error: PropTypes.object,
  onRetry: PropTypes.func.isRequired,
};
