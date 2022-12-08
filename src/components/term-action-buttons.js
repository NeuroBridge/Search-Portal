import PropTypes from 'prop-types'
import { Box, IconButton, ToggleButton, Tooltip } from '@mui/material'
import {
  CheckBox as CheckedTermIcon,
  CheckBoxOutlineBlank as UncheckedTermIcon,
  ArrowDropDownCircle as ViewTermIcon,
} from '@mui/icons-material'
import { useBasket } from './basket'
import { useDrawer } from './drawer'

export const TermActionButtons = ({ termId, stopEventPropagation, tooltipPlacement, hideDrawerButton }) => {
  const basket = useBasket()
  const drawer = useDrawer()
  const tip = basket.contains(termId) ? 'Remove term from query builder' : 'Add term to query builder'

  const handleClickTermButton = button => event => {
    if (stopEventPropagation) {
      event.stopPropagation()
    }
    switch (button) {
      case 'basket':
        if (basket.contains(termId)) {
          basket.remove(termId)
        } else {
          basket.add(termId)
        }
        break
      case 'drawer':
        drawer.setTermId(termId)
        break
    }
    return
  }

  return (
    <Box
      className="term-action-buttons"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Tooltip title={ tip } placement={ tooltipPlacement }>
        <ToggleButton
          value="check"
          selected={ basket.contains(termId) }
          onChange={ handleClickTermButton('basket') }
          size="small"
          sx={{ transform: 'scale(0.75)', p: 0, border: 0 }}
        >
          {
            basket.contains(termId)
              ? <CheckedTermIcon sx={{ color: 'primary.light' }} />
              : <UncheckedTermIcon sx={{ color: 'primary.dark' }} />
          }
        </ToggleButton>
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
