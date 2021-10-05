import {
  Button,
  Collapse,
  Divider,
  List, ListItem, ListItemIcon, ListItemText, ListSubheader,
  MenuItem, Select, Slider, Switch,
  Typography,
} from '@material-ui/core'
import { useDialogContext } from '../'
import { Tray } from '../tray'
import {
  FlashOn as ForceIcon,
  FontDownload as LabelFontIcon,
  Height as LabelHeightIcon,
  FormatLineSpacing as LevelDistanceIcon,
  FiberManualRecord as NodeSizeIcon,
  Replay as ResetIcon,
  Settings as GraphModeIcon,
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  list: {
    paddingBottom: theme.spacing(2),
    '& li:not(:first-child)': {
      marginTop: theme.spacing(1),
    },
    '& li': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
  },
  listHeading: {
    backgroundColor: theme.palette.grey[400],
  },
}))

export const SettingsTray = () => {
  const classes = useStyles()
  const {
    openTray,
    resetGraph, graphModes,
    graphSettings, setGraphSettings,
  } = useDialogContext()

  const handleChangeGraphMode = event => setGraphSettings({ ...graphSettings, mode: event.target.value })
  const handleChangeforce = (event, newValue) => setGraphSettings({ ...graphSettings, force: newValue })
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
  const handleChangeNodeLabelFontSize = (event, newValue) => setGraphSettings({
    ...graphSettings,
    node: {
      ...graphSettings.node,
      labels: {
        ...graphSettings.node.labels,
        font: {
          ...graphSettings.node.labels.font,
          size: newValue,
        }
      },
    },
  })
  const handleChangeNodeLabelHeight = (event, newValue) => setGraphSettings({
    ...graphSettings,
    node: {
      ...graphSettings.node,
      labels: {
        ...graphSettings.node.labels,
        height: newValue,
      },
    },
  })
  const handleChangeNodeSize = (event, newValue) => setGraphSettings({ ...graphSettings, node: { ...graphSettings.node, size: newValue } })
  const handleChangeLevelDistance = (event, newValue) => setGraphSettings({ ...graphSettings, levelDistance: newValue })

  return (
    <Tray title="Graph Settings" align="bottom" visibility={ openTray === 'settings' }>

      <List
        className={ classes.list }
        subheader={
          <ListSubheader className={ classes.listHeading }>Graph Mode</ListSubheader>
        }
      >
        <ListItem>
          <ListItemIcon>
            <GraphModeIcon color="primary" />
          </ListItemIcon>
          <Select
            style={{ width: '100%' }}
            labelId="graph-mode"
            id="graph-mode-select"
            value={ graphSettings.mode }
            onChange={ handleChangeGraphMode }
          >
            {
              graphModes.map(mode => <MenuItem key={ mode.id } value={ mode.id }>{ mode.name }</MenuItem>)
            }
          </Select>
        </ListItem>
      </List>

      <List
        className={ classes.list }
        subheader={
          <ListSubheader
            style={{ display: 'flex' }}
            className={ classes.listHeading }
          >
            <span>Node Labels</span>
            <Switch
              edge="end"
              inputProps={{ 'aria-label': 'toggle node labels' }}
              checked={ graphSettings.node.labels.on }
              onChange={ handleToggleNodeLabelVisibility }
            />
          </ListSubheader>
        }
      >
        <Collapse in={ graphSettings.node.labels.on }>
          <ListItem>
            <ListItemIcon>
              <LabelFontIcon color="primary" />
            </ListItemIcon>
            <ListItemText>
              <Typography>Label font size</Typography>
              <Slider
                min={ 8 }
                max={ 20 }
                value={ graphSettings.node.labels.font.size }
                aria-label="Node label font size"
                valueLabelDisplay="auto"
                onChange={ handleChangeNodeLabelFontSize }
              />
            </ListItemText>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <LabelHeightIcon color="primary" />
            </ListItemIcon>
            <ListItemText>
              <Typography>Label height</Typography>
              <Slider
                min={ -10 }
                max={ 10 }
                value={ graphSettings.node.labels.height }
                aria-label="Node label vertical placement"
                valueLabelDisplay="auto"
                onChange={ handleChangeNodeLabelHeight }
              />
            </ListItemText>
          </ListItem>
        </Collapse>
      </List>

      <List
        className={ classes.list }
        subheader={
          <ListSubheader className={ classes.listHeading }>Miscellaneous</ListSubheader>
        }
      >
        <ListItem>
          <ListItemIcon>
            <NodeSizeIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Node size</Typography>
            <Slider
              min={ 1 }
              max={ 10 }
              value={ graphSettings.node.size }
              aria-label="Level distance"
              valueLabelDisplay="auto"
              onChange={ handleChangeNodeSize }
            />
          </ListItemText>
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <LevelDistanceIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Distance between levels</Typography>
            <Slider
              min={ 25 }
              max={ 250 }
              value={ graphSettings.levelDistance }
              aria-label="Rank distance"
              valueLabelDisplay="auto"
              onChange={ handleChangeLevelDistance }
            />
          </ListItemText>
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <ForceIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Force</Typography>
            <Slider
              min={ 20 }
              max={ 500 }
              value={ graphSettings.force }
              aria-label="Graph force"
              valueLabelDisplay="auto"
              onChange={ handleChangeforce }
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

