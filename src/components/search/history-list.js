import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Divider, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import { useLocalStorage } from '../../hooks'
import { Link } from '../link'
import TimeAgo from 'react-timeago'
import { useSearchContext } from './context'
import {
  Delete as DeleteIcon,
  DeleteSweep as DeleteAllIcon,
  Search as SearchIcon,
  AccessTime as HistoryIcon,
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  list: {
    maxHeight: '600px',
    overflow: 'scroll',
  }
}))

export const SearchHistoryList = () => {
  const classes = useStyles()
  const [searchHistory, setSearchHistory] = useLocalStorage('search-history')
  const { doSearch } = useSearchContext()

  const deleteHistoryItem = timestamp => () => {
    const index = searchHistory.findIndex(item => item.timestamp === timestamp)
    if (index === -1) {
      return
    }
    let newHistory = [...searchHistory]
    newHistory.splice(index, 1)
    setSearchHistory(newHistory)
  }

  return (
    <Card>
      <CardHeader
        avatar={ <HistoryIcon fontSize="medium" color="primary" /> }
        title="Search History"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <Divider />
      {
        searchHistory?.length
        ? (
          <List className={ classes.list }>
            {
              searchHistory.map(({ query, timestamp }) => (
                <ListItem button
                  key={ `history-${ query }-${ timestamp }`}
                  onClick={ () => doSearch(query) }
                >
                  <ListItemIcon size="small"><SearchIcon /></ListItemIcon>
                  <ListItemText
                    primary={ query }
                    secondary={ <TimeAgo date={ timestamp } /> }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={ deleteHistoryItem(timestamp) }>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            )
          }
        </List>
        ) : (
          <CardContent>
            <br />
            <Typography paragraph align="center">No search history!</Typography>
          </CardContent>
        )
      }
      <Divider />
      <CardActions>
        <Button
          fullWidth
          color="secondary"
          variant="outlined"
          aria-label="clear search history"
          onClick={ () => setSearchHistory([]) }
          disabled={ !searchHistory.length }
        >
          Clear History &nbsp; <DeleteAllIcon />
        </Button>
      </CardActions>
    </Card>

  )
}
