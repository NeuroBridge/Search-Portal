import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, Divider, Grow, List, ListItem, Switch, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'
import { Tray } from './tray'

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1),
  },
}))

export const SettingsTray = () => {
  const { openTray, selectionPalette, nodeLabelVisibility, setNodeLabelVisibility } = useDialogContext()
  const classes = useStyles()

  return (
    <Tray title="Settings" align="bottom" visibility={ openTray === 'settings' }>
      <List dense>
        <ListItem className={ classes.listItem }>
          Graph Mode
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

