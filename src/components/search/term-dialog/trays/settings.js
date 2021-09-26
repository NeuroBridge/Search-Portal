import { forwardRef } from 'react'
import {
  Button,
  Card, CardContent, CardHeader,
  Divider,
  Grow,
  List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, ListSubheader,
  MenuItem, Select, Slider, Switch,
  Typography,
} from '@material-ui/core'
import { useDialogContext } from '../'
import { Tray } from '../tray'
import {
  FlashOn as ForceIcon,
  Label as LabelsOnIcon,
  LabelOff as LabelsOffIcon,
  FormatLineSpacing as RankDistanceIcon,
  Replay as ResetIcon,
} from '@material-ui/icons'

export const SettingsTray = () => {
  const {
    openTray,
    selectionPalette,
    resetGraph, graphModes,
    graphSettings, setGraphSettings,
  } = useDialogContext()

  const handleChangeGraphMode = event => setGraphSettings({ ...graphSettings, mode: event.target.value })
  const handleChangeRankDistance = (event, newValue) => setGraphSettings({ ...graphSettings, graphRankDistance: newValue })
  const handleChangeGraphForce = (event, newValue) => setGraphSettings({ ...graphSettings, graphForce: newValue })
  const handleToggleNodeLabelVisibility = () => setGraphSettings({ ...graphSettings, nodeLabels: !graphSettings.nodeLabels })

  return (
    <Tray title="Settings" align="bottom" visibility={ openTray === 'settings' }>

      <List subheader={ <ListSubheader>Graph Settings</ListSubheader> }>
        <ListItem>
          <ListItemText>GRAPH MODE</ListItemText>
          <ListItemSecondaryAction>
            <Select
              labelId="graph-mode"
              id="graph-mode-select"
              value={ graphSettings.mode }
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
            { graphSettings.nodeLabels ? <LabelsOnIcon color="secondary" /> : <LabelsOffIcon color="primary" /> }
          </ListItemIcon>
          <ListItemText>NODE LABELS</ListItemText>
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              inputProps={{ 'aria-label': 'toggle node labels' }}
              checked={ graphSettings.nodeLabels }
              onChange={ handleToggleNodeLabelVisibility }
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
              max={ 250 }
              value={ graphSettings.graphRankDistance }
              aria-label="Rank distance"
              valueLabelDisplay="auto"
              onChange={ handleChangeRankDistance }
            />
          </ListItemText>
        </ListItem>
        
        <br />

        <ListItem>
          <ListItemIcon>
            <ForceIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography gutterBottom>Force</Typography>
            <Slider
              min={ 20 }
              max={ 500 }
              value={ graphSettings.graphForce }
              aria-label="Graph force"
              valueLabelDisplay="auto"
              onChange={ handleChangeGraphForce }
            />
          </ListItemText>
        </ListItem>
        
      </List>

      <Divider />

      <List>
        <ListItem>
          <Button fullWidth variant="outlined" color="primary" onClick={ resetGraph }>
            <ResetIcon /> &nbsp; Reset Graph
          </Button>
        </ListItem>
      </List>

      <Divider />

    </Tray>
  )
}

