import PropTypes from 'prop-types'
import {
  Box, IconButton, Tooltip,
} from '@mui/material'

//

export const SelectionTreeMenu = ({ items }) => {
  return (
    <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>
      {
        items.map(({ key, action, icon, tooltip }) => (
          <Tooltip key={`term-action-${key}`} title={tooltip} placement="top">
            <IconButton onClick={action} size="small">{icon}</IconButton>
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
    })
  ).isRequired,
}
