import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, Divider, FormControl, FormGroup, FormControlLabel, Grow, InputLabel, List, ListItem, MenuItem, Select, Switch, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from '../'
import { Tray } from '../tray'

const useStyles = makeStyles(theme => ({
  formGroup: {
    padding: `${ theme.spacing(2) }px ${ theme.spacing(1) }px`,
    gap: theme.spacing(2),
  },
}))

export const SettingsTray = () => {
  const { openTray, selectionPalette, nodeLabelVisibility, setNodeLabelVisibility, graphModes, graphMode, setGraphMode } = useDialogContext()
  const classes = useStyles()

  const handleChangeGraphMode = event => {
    setGraphMode(event.target.value)
  }

  return (
    <Tray title="Settings" align="bottom" visibility={ openTray === 'settings' }>
      <FormGroup className={ classes.formGroup }>
        <FormControl>
          <InputLabel htmlFor="graph-mode-select">Graph Mode</InputLabel>
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
        </FormControl>

        <br />

        <FormControlLabel
          label="Node Labels"
          control={
            <Switch
              name="node-labels"
              inputProps={{ 'aria-label': 'toggle node labels' }}
              checked={ nodeLabelVisibility }
              onChange={ () => setNodeLabelVisibility(!nodeLabelVisibility) }
            />
          }
        />
      </FormGroup>

      <Divider />

    </Tray>
  )
}

