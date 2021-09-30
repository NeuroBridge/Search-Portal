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
  FiberManualRecord as NodeSizeIcon,
} from '@material-ui/icons'

export const SettingsTray = () => {
  const {
    openTray,
    selectionPalette,
    resetGraph, graphModes,
    graphSettings, setGraphSettings,
  } = useDialogContext()

  const handleChangeGraphMode = event => setGraphSettings({ ...graphSettings, mode: event.target.value })
  const handleChangeGraphForce = (event, newValue) => setGraphSettings({ ...graphSettings, graphForce: newValue })
  const handleToggleNodeLabelVisibility = () => setGraphSettings({
    ...graphSettings,
    node: {
      ...graphSettings.node,
      labels: {
        ...graphSettings.node.labels,
        on: !graphSettings.node.labels.on,
      },
    },
  })
  const handleChangeNodeSize = (event, newValue) => setGraphSettings({ ...graphSettings, nodeSize: newValue })
  const handleChangeRankDistance = (event, newValue) => setGraphSettings({ ...graphSettings, graphRankDistance: newValue })

  return (
    <Tray title="Graph Settings" align="bottom" visibility={ openTray === 'settings' }>

      <List>
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
        <Divider />
        <br />

        <ListItem>
          <ListItemIcon>
            <NodeSizeIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography>NODE SIZE</Typography>
            <Slider
              min={ 1 }
              max={ 10 }
              value={ graphSettings.nodeSize }
              aria-label="Rank distance"
              valueLabelDisplay="auto"
              onChange={ handleChangeNodeSize }
            />
          </ListItemText>
        </ListItem>
        
        <br />

        <ListItem>
          <ListItemIcon>
            <RankDistanceIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography>DISTANCE BETWEEN LEVELS</Typography>
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
            <Typography>FORCE</Typography>
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

