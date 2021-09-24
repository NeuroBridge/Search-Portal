import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from '@material-ui/core'
import { useLocalStorage } from '../../hooks'
import { Link } from '../link'
import TimeAgo from 'react-timeago'

export const SearchHistoryList = () => {
  const [searchHistory, ] = useLocalStorage('search-history')

  return (
    <Card>
      <CardHeader title="Recent Searches" />
      <List>
        {
          searchHistory && searchHistory.map(({ query, timestamp }) => (
            <ListItem key={ `history-${ query }-${ timestamp }`}>
              <ListItemText
                primary={ query }
                secondary={ <TimeAgo date={ timestamp } /> }
              />
            </ListItem>
          ))
        }
      </List>
    </Card>

  )
}
