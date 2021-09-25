import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, Divider, FormControl, FormGroup, FormControlLabel, Grow, InputLabel, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, ListSubheader, MenuItem, Select, Switch, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from '../'
import { Tray } from '../tray'
import {
  Label as LabelsOnIcon,
  LabelOff as LabelsOffIcon,
} from '@material-ui/icons'

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

      <List subheader={ <ListSubheader>Graph Settings</ListSubheader> } className={classes.root}>
        <ListItem>
          <ListItemText>MODE</ListItemText>
          <ListItemSecondaryAction>
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
          </ListItemSecondaryAction>
        </ListItem>

        <br />

        <ListItem>
          <ListItemIcon>
            { nodeLabelVisibility ? <LabelsOnIcon color="secondary" /> : <LabelsOffIcon color="primary" /> }
          </ListItemIcon>
          <ListItemText>NODE LABELS</ListItemText>
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              inputProps={{ 'aria-label': 'toggle node labels' }}
              checked={ nodeLabelVisibility }
              onChange={ () => setNodeLabelVisibility(!nodeLabelVisibility) }
            />
          </ListItemSecondaryAction>
        </ListItem>
        
        <br />

      </List>


      <Divider />

    </Tray>
  )
}

