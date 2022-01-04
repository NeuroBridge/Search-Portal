import { Button, Card, CardActions, CardContent, CardHeader, Divider, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material'
import TimeAgo from 'react-timeago'
import { useSearchContext } from './context'
import {
  Delete as DeleteIcon,
  DeleteSweep as DeleteAllIcon,
  Search as SearchIcon,
  AccessTime as HistoryIcon,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  list: {
    maxHeight: '600px',
    overflow: 'scroll',
  }
}))

export const SearchHistoryList = () => {
  const classes = useStyles()
  const { doSearch, searchHistory, deleteSearchHistoryItem, clearSearchHistory } = useSearchContext()

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
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={ deleteSearchHistoryItem(timestamp) }
                      size="large">
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
          onClick={ clearSearchHistory }
          disabled={ !searchHistory || !searchHistory.length }
        >
          Clear History &nbsp; <DeleteAllIcon />
        </Button>
      </CardActions>
    </Card>
  );
}
