import PropTypes from 'prop-types'
import {
  Box, Typography,
} from '@mui/material'

//

export const LabelList = ({ labels }) => {
  if (!labels.length) {
    return 'no labels'
  }
  return (
    <Box>
      {
        labels
          .filter(label => typeof label === 'string')
          .sort((l, m) => l.toLowerCase() < m.toLowerCase() ? -1 : 1)
          .map(label => (
            <div key={ label }>
              <Typography variant="caption"> &bull; { label }</Typography>
            </div>
          ))
      }
    </Box>
  )
}

LabelList.propTypes = {
  labels: PropTypes.array.isRequired,
}

