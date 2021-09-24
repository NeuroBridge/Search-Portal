import { Card, CardActions, CardContent, CardHeader, Divider, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import { useLocalStorage } from '../../hooks'
import { Link } from '../link'
import TimeAgo from 'react-timeago'
import { useSearchContext } from './context'
import {
  Close as DeleteIcon,
  Search as SearchIcon,
} from '@material-ui/icons'

export const SearchHistoryList = () => {
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
      <CardHeader title="Recent Searches" />
      <Divider />
      {
        searchHistory.length
        ? (
          <List>
            {
              searchHistory.map(({ query, timestamp }) => (
                <ListItem button
                  key={ `history-${ query }-${ timestamp }`}
                  onClick={ () => doSearch(query) }
                >
                  <ListItemIcon><SearchIcon /></ListItemIcon>
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
          <Typography paragraph align="center">No search history!</Typography>
        </CardContent>
        )
      }
      <CardActions />
    </Card>

  )
}
