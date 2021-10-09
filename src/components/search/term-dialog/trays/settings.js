import {
  Divider,
  List, ListItem, ListItemIcon, ListItemText,
  Slider,
  Typography,
} from '@material-ui/core'
import { useDialogContext } from '../'
import { Tray } from '../tray'
import {
  FormatLineSpacing as LevelSeparationIcon,
  FiberManualRecord as NodeSizeIcon,
  Height as NodeSeparationIcon,
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
  const { openTray, graphSettings, setGraphSettings } = useDialogContext()

  const handleChangeNodeSize = (event, newValue) => setGraphSettings({ ...graphSettings, node: { ...graphSettings.node, size: newValue } })
  const handleChangeNodeSeparation = (event, newValue) => setGraphSettings({ ...graphSettings, node: { ...graphSettings.node, separation: newValue } })
  const handleChangeLevelSeparation = (event, newValue) => setGraphSettings({ ...graphSettings, level: { ...graphSettings.level, separation: newValue } })

  return (
    <Tray title="Graph Settings" align="bottom" visibility={ openTray === 'settings' }>

      <List className={ classes.list }>

        <ListItem>
          <ListItemIcon>
            <NodeSizeIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Node size</Typography>
            <Slider
              min={ 2 }
              max={ 20 }
              value={ graphSettings.node.size }
              aria-label="Node size"
              valueLabelDisplay="auto"
              onChange={ handleChangeNodeSize }
            />
          </ListItemText>
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <NodeSeparationIcon color="primary" />
          </ListItemIcon>
          <ListItemText>
            <Typography>Node Separation</Typography>
            <Slider
              min={ 25 }
              max={ 200 }
              value={ graphSettings.node.separation }
              aria-label="Node separation"
              valueLabelDisplay="auto"
              onChange={ handleChangeNodeSeparation }
            />
          </ListItemText>
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <LevelSeparationIcon color="primary" style={{ transform: 'rotate(90deg)' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography>Level Separation</Typography>
            <Slider
              min={ 50 }
              max={ 500 }
              value={ graphSettings.level.separation }
              aria-label="Level separation"
              valueLabelDisplay="auto"
              onChange={ handleChangeLevelSeparation }
            />
          </ListItemText>
        </ListItem>
        
      </List>

      <Divider />

    </Tray>
  )
}

