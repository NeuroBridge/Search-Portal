import PropTypes from 'prop-types'
import { Box, IconButton, Tooltip } from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material'
import { useBasket } from './basket'

export const TermButtonGroup = ({ termId, stopEventPropagation, tooltipPlacement }) => {
  const basket = useBasket()
  const tip = basket.contains(termId) ? 'Remove term from workspace' : 'Add term to workspace'

  const handleClickToggleTermButton = event => {
    if (stopEventPropagation) {
      event.stopPropagation()
    }
    basket.toggle(termId)
  }

  return (
    <Box>
      <Tooltip title={ tip } placement={ tooltipPlacement }>
        <IconButton color="default" size="small" onClick={ handleClickToggleTermButton } >
          { basket.contains(termId) ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" /> }
        </IconButton>
      </Tooltip>
    </Box>
  )
}

TermButtonGroup.propTypes = {
  termId: PropTypes.string.isRequired,
  stopEventPropagation: PropTypes.bool.isRequired,
  tooltipPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
}

TermButtonGroup.defaultProps = {
  stopEventPropagation: false,
  tooltipPlacement: "top",
}
