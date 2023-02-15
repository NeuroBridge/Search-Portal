import PropTypes from 'prop-types'
import {
  Box, IconButton, Tooltip, useTheme,
} from '@mui/material'

export const SelectionTreeMenu = ({ items }) => {
  const theme = useTheme();

  return (
    <Box ml='auto' sx={{ display: 'flex'}}>
      {
        items.map(({ key, action, icon, tooltip, color }) => (
          <Tooltip key={`term-action-${key}`} title={tooltip} placement="top">
            <IconButton
              onClick={action}
              size="small"
              sx={{
                '--delay': '250ms',
                color: theme.palette.primary,
                opacity: 0.4,
                transition: 'color var(--delay), opacity var(--delay)',
                '&:hover': { 
                  color, 
                  opacity: 1,
                  transition: 'color var(--delay), opacity var(--delay)',
                }}}>
              {icon}
              </IconButton>
          </Tooltip>
        ))
      }
    </Box>
  )
}

SelectionTreeMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.func.isRequired,
      icon: PropTypes.node.isRequired,
      tooltip: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
}
