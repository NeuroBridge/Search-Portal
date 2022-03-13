import PropTypes from 'prop-types'
import { Box, IconButton, Tooltip } from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  MenuOpen as ViewTermIcon,
} from '@mui/icons-material'
import { useBasket } from './basket'
import { useDrawer } from './drawer'

export const TermActionButtons = ({ termId, stopEventPropagation, tooltipPlacement, hideDrawerButton }) => {
  const basket = useBasket()
  const drawer = useDrawer()
  const tip = basket.contains(termId) ? 'Remove term from workspace' : 'Add term to workspace'

  const handleClickTermButton = button => event => {
    if (stopEventPropagation) {
      event.stopPropagation()
    }
    switch (button) {
      case 'basket':
        basket.toggle(termId)
        break
      case 'drawer':
        drawer.setTermId(termId)
        break
    }
    return
  }

  return (
    <Box>
      <Tooltip title={ tip } placement={ tooltipPlacement }>
        <IconButton color="default" size="small" onClick={ handleClickTermButton('basket') }>
          { basket.contains(termId) ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" /> }
        </IconButton>
      </Tooltip>
      {
        !hideDrawerButton && (
          <Tooltip title="View term details" placement={ tooltipPlacement }>
            <IconButton color="default" size="small" onClick={ handleClickTermButton('drawer') }>
              <ViewTermIcon fontSize="small" sx={{ transform: 'scale(-1, 1)' }} />
            </IconButton>
          </Tooltip>
        )
      }
    </Box>
  )
}

TermActionButtons.propTypes = {
  termId: PropTypes.string.isRequired,
  stopEventPropagation: PropTypes.bool.isRequired,
  tooltipPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
  hideDrawerButton: PropTypes.bool.isRequired,
}

TermActionButtons.defaultProps = {
  stopEventPropagation: false,
  tooltipPlacement: "top",
  hideDrawerButton: false,
}
