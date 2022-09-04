import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Collapse, Divider, IconButton, Stack, ToggleButton, Typography, useTheme,
} from '@mui/material'
import {
  RadioButtonUnchecked as OnIcon,
  HideSource as OffIcon,
  ExpandMore as HelpToggleIcon,
} from '@mui/icons-material'
import { useWorkspace } from './workspace'
// import { ToggleButton } from '../toggle-button'

export const Interface = ({ ui, active }) => {
  const theme = useTheme()
  const [showHelp, setShowHelp] = useState(false)
  const { disabledInterfaces, toggleInterface } = useWorkspace()

  const isDisabled = useMemo(() => disabledInterfaces.has(ui.id), [disabledInterfaces])

  return (
    <Stack
      sx={{ flex: 1, display: active ? 'flex' : 'none', }}
      role="tabpanel"
      id={ `tabpanel-${ ui.id }` }
      aria-labelledby={ `tab-${ ui.id }` }
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1, pl: 2,
      }}>
        <Stack direction="row" alignItems="center" gap={ 3 }>
          <Typography component="h2" variant="h6" color="primary">{ ui.displayName }</Typography>
          <ToggleButton
            value="check"
            selected={ !isDisabled }
            onChange={ toggleInterface(ui.id) }
            size="small"
          >
            { isDisabled ? <OffIcon fontSize="small" /> : <OnIcon color="primary" fontSize="small" /> }
          </ToggleButton>
        </Stack>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, }}>
          <Typography sx={{ fontSize: '75%', filter: 'opacity(0.5)', textTransform: 'uppercase' }}>
            { showHelp ? 'Hide' : 'Show' } Help
          </Typography>
          <IconButton onClick={ () => setShowHelp(!showHelp) } size="small">
            <HelpToggleIcon
              fontSize="small"
              sx={{
                color: theme.palette.primary.dark,
                filter: 'saturate(0.1) opacity(0.5)',
                transition: 'filter 250ms, transform 250ms',
                transform: showHelp ? 'rotate(180deg)' : 'rotate(0)',
                '&:hover': { filter: 'saturate(0.9) opacity(1)' },
              }}
            />
          </IconButton>
        </Box>
      </Box>
      <Collapse in={ showHelp } sx={{ backgroundColor: theme.palette.grey[100] }}>
        <Divider />
        <Box sx={{ p: 2 }}>{ ui.helpText }</Box>
      </Collapse>
      <Divider />
      <Box sx={{
        flex: 1,
        p: 2,
        filter: isDisabled ? 'blur(3px) brightness(0.9)' : 'blur(0)',
        transition: 'filter 250ms',
        pointerEvents: isDisabled ? 'none' : 'auto',
      }}>
        <ui.Form />
      </Box>
    </Stack>
  )
}

Interface.propTypes = {
  ui: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
}
