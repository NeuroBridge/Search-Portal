import PropTypes from 'prop-types'
import { Box, ToggleButton, Tooltip } from '@mui/material'
import {
  CheckBox as CheckedTermIcon,
  CheckBoxOutlineBlank as UncheckedTermIcon,
} from '@mui/icons-material'
import { useBasket } from './'

export const TermToggler = ({ termId, tooltipPlacement }) => {
  const basket = useBasket()
  const tip = basket.contains(termId) ? 'Remove term from query builder' : 'Add term to query builder'

  const handleClickToggleTerm = event => {
    event.stopPropagation()
    if (basket.contains(termId)) {
      basket.remove(termId)
      return
    }
    basket.add(termId)
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
          onChange={ handleClickToggleTerm }
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
    </Box>
  )
}

TermToggler.propTypes = {
  termId: PropTypes.string.isRequired,
  tooltipPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
}

TermToggler.defaultProps = {
  tooltipPlacement: "top",
}
