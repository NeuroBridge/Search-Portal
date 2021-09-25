import { forwardRef } from 'react'
import {
  Card, CardContent, CardHeader,
  Divider,
  Grow,
  List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, ListSubheader,
  MenuItem, Select, Slider, Switch,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from '../'
import { Tray } from '../tray'
import {
  Label as LabelsOnIcon,
  LabelOff as LabelsOffIcon,
  FormatLineSpacing as RankDistanceIcon,
} from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
}))

export const SettingsTray = () => {
  const { openTray, selectionPalette, nodeLabelVisibility, setNodeLabelVisibility, graphModes, graphMode, setGraphMode, graphRankDistance, setGraphRankDistance } = useDialogContext()
  const classes = useStyles()

  const handleChangeGraphMode = event => setGraphMode(event.target.value)
  const handleChangeRankDistance = (event, newValue) => setGraphRankDistance(newValue)

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

        <ListItem>
          <ListItemIcon>
            <RankDistanceIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography gutterBottom>Distance between levels</Typography>
            <Slider
              min={ 25 }
              max={ 100 }
              value={ graphRankDistance }
              aria-label="Rank distance"
              valueLabelDisplay="auto"
              onChange={ handleChangeRankDistance }
            />
          </ListItemText>
        </ListItem>
        
        <br />

      </List>


      <Divider />

    </Tray>
  )
}

