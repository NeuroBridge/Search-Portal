import PropTypes from 'prop-types'
import {
  Box, Card, CardActionArea, CardContent, Typography,
} from '@mui/material'
import {
  AccessTime as HistoryIcon,
} from '@mui/icons-material'
import TimeAgo from 'react-timeago'
import { TermActionButtons } from '../term-action-buttons'

//

export const HistoryItemCard = ({ termId, timestamp, onClick }) => {
  return (
    <Card sx={{
      border: `1px solid #1976d211`,
      display: 'flex',
    }}>
      <CardActionArea onClick={ onClick } >
        <CardContent sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <HistoryIcon />
          <Box>
            <Typography>{ termId }</Typography>
            <Typography variant="caption">
              <TimeAgo date={ timestamp } />
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardContent>
        <TermActionButtons termId={ termId } />
      </CardContent>
    </Card>
  )
}

HistoryItemCard.propTypes = {
  termId: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  onClick: PropTypes.func,
}
