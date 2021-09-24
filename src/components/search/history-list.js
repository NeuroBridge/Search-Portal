import { Card, CardActions, CardContent, CardHeader, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { useLocalStorage } from '../../hooks'
import { Link } from '../link'
import TimeAgo from 'react-timeago'
import { useSearchContext } from './context'
import { Search as SearchIcon } from '@material-ui/icons'

export const SearchHistoryList = () => {
  const [searchHistory, ] = useLocalStorage('search-history')
  const { doSearch } = useSearchContext()

  return (
    <Card>
      <CardHeader title="Recent Searches" />

      <List>
        {
          searchHistory && searchHistory.map(({ query, timestamp }) => (
            <ListItem key={ `history-${ query }-${ timestamp }`} button onClick={ () => doSearch(query) }>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText
                primary={ query }
                secondary={ <TimeAgo date={ timestamp } /> }
              />
            </ListItem>
          ))
        }
      </List>

      <CardActions />

    </Card>

  )
}
