import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Collapse, Divider, IconButton, Stack, Tooltip, Typography, useTheme,
} from '@mui/material'
import {
  Power as OnIcon,
  PowerOff as OffIcon,
  Help as HelpIcon,
} from '@mui/icons-material'
import { Link } from '../link'
import { useWorkspace } from './workspace'
import { ToggleButton } from '../toggle-button'
import ReactMarkdown from 'react-markdown'

//

const markdownComponentMap = {
  a: props => <Link to={ props.href }>{ props.children }</Link>,
}

//

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
      {/* Heading */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2, py: 1,
      }}>
        <Stack direction="row" alignItems="center" gap={ 3 }>
          <Typography
            component="h2"
            variant="h6"
            color={ isDisabled ? '#999' : 'primary' }
            sx={{ transition: 'color 250ms' }}
          >{ ui.displayName }</Typography>
        </Stack>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, }}>
          <Tooltip placement="bottom" title={ `${ showHelp ? 'Hide' : 'Show' } help` }>
            <span><IconButton onClick={ () => setShowHelp(!showHelp) } size="small">
              <HelpIcon
                fontSize="small"
                sx={{
                  color: showHelp ? theme.palette.primary.main : theme.palette.grey[400],
                  transition: 'filter 250ms, transform 250ms',
                }}
              />
            </IconButton></span>
          </Tooltip>
          <Tooltip placement="bottom" title={ `${ isDisabled === false ? 'Disable' : 'Enable' } interface` }>
            <span><ToggleButton
              on={ isDisabled === false }
              onChange={ toggleInterface(ui.id) }
              OnIcon={ <OnIcon sx={{ backgroundColor: '#65c015', color: '#fff' }} /> }
              OffIcon={ <OffIcon sx={{ backgroundColor: theme.palette.grey[400], color: '#fff' }} /> }
            /></span>
          </Tooltip>
        </Box>
      </Box>

      {/* Help Text */}
      <Collapse in={ showHelp } sx={{ backgroundColor: theme.palette.grey[100] }}>
        <Divider />
        <Box sx={{ p: 2 }}>
        <ReactMarkdown components={ markdownComponentMap }>
          { ui.helpText }
        </ReactMarkdown>
        </Box>
      </Collapse>

      <Divider />
      
      {/* Form */}
      <Box sx={{
        flex: 1,
        p: 2,
        filter: isDisabled ? 'blur(3px) saturate(0.5) opacity(0.5)' : 'blur(0)',
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
