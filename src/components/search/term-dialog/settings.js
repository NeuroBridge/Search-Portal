import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, Divider, Grow, List, ListItem, MenuItem, Select, Switch, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'
import { Tray } from './tray'

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1),
  },
}))

export const SettingsTray = () => {
  const { openTray, selectionPalette, nodeLabelVisibility, setNodeLabelVisibility, graphModes, graphMode, setGraphMode } = useDialogContext()
  const classes = useStyles()

  const handleChangeGraphMode = event => {
    setGraphMode(event.target.value)
  }

  console.log(graphMode)

  return (
    <Tray title="Settings" align="bottom" visibility={ openTray === 'settings' }>
      <List dense>
        <ListItem className={ classes.listItem }>
          Graph Mode
          <Select
            labelId="graph-mode"
            id="graph-mode-select"
            value={ graphMode }
            onChange={ handleChangeGraphMode }
          >
            {
              graphModes.map((mode, i) => <MenuItem key={ mode.id } value={ mode.id }>{ mode.name }</MenuItem>)
            }
          </Select>
        </ListItem>
        <ListItem className={ classes.listItem }>
          Node Labels
          <Switch
            name="node-labels"
            inputProps={{ 'aria-label': 'toggle node labels' }}
            checked={ nodeLabelVisibility }
            onChange={ () => setNodeLabelVisibility(!nodeLabelVisibility) }
          />
        </ListItem>
      </List>
      <Divider />
    </Tray>
  )
}

