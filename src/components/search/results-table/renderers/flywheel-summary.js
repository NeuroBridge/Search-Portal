import { Box, Tooltip, tooltipClasses, styled } from "@mui/material";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    fontSize: 13,
  },
}))

export function renderFlywheelSummaryWithTooltip(params) {
  console.log(params);
  return (
    <StyledTooltip
      title={params.value?.[0] ?? ""}
      placement="top-start"
    >
      <Box>{params.value?.[0] ?? ""}</Box>
    </StyledTooltip>
  );
}
