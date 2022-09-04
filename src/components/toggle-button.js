import PropTypes from 'prop-types'
import { ToggleButton as MuiToggleButton } from '@mui/material'

export const ToggleButton = ({ on, onChange, OnIcon, OffIcon }) => {
  return (
    <MuiToggleButton
      value="check"
      selected={ on }
      onChange={ onChange }
      size="small"
      sx={{ p: 0 }}
    >
      { on ? OnIcon : OffIcon }
    </MuiToggleButton>
  )
}

ToggleButton.propTypes = {
  on: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  OnIcon: PropTypes.node.isRequired,
  OffIcon: PropTypes.node.isRequired,
}

