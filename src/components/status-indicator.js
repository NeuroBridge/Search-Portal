import { Circle } from "@mui/icons-material";
import { IconButton, Paper, Popover, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";

const PopoverPaper = styled(Paper)(({theme}) => ({
  '--gradient-overlay': 'linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))',
  
  padding: theme.spacing(2),
  filter: `drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3))`,
  backgroundImage: 'var(--gradient-overlay)',

  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: '-15px',
    left: '0',
    right: '0',
    margin: '0 auto',
    clipPath: "path('M 0 15 L 10 0 L 20 15 Z')",
    width: '20px',
    height: '15px',
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'var(--gradient-overlay)',
  }
}));

export const StatusIndicator = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Tooltip placement="bottom" title="All services are operational">
        <IconButton color="success" onClick={handleClick}>
          <Circle fontSize="xs" />
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
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ marginTop: '15px',
        '& .MuiPopover-paper': {overflowY: 'visible', overflowX: 'visible'} }}
        PaperProps={{ style: {boxShadow: 'none'}}}
      >
        <PopoverPaper>
          <Typography>Service 1: Operational</Typography>
          <Typography>Service 2: Operational</Typography>
          <Typography>Service 3: Operational</Typography>
        </PopoverPaper>
      </Popover>
    </>
  );
};
