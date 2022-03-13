import PropTypes from 'prop-types'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { TermButtonGroup } from './term-button-group'
import { useBasket } from './basket'

const LabelList = ({ labels }) => {
  if (!labels.length) {
    return 'no labels'
  }
  return (
    <Box>
      {
        labels
          .filter(label => typeof label === 'string')
          .sort((l, m) => l.toLowerCase() < m.toLowerCase() ? -1 : 1)
          .map(label => {
            return (
              <div key={ label }> &bull; { label }</div>
            )
          })
      }
    </Box>
  )
}

LabelList.propTypes = {
  labels: PropTypes.array.isRequired,
}

export const TermCard = ({ term, selected, compact }) => {
  const basket = useBasket()

  return (
    <Card sx={{
      border: `1px solid #1976d2${ selected ? 'ff' : '11' }`,
      transition: 'border-color 250ms',
      '&:hover': {
        border: `1px solid #1976d2${ selected ? 'ff' : '66' }`,
        cursor: 'pointer',
      },
    }}>
      <CardActionArea onClick={ () => basket.toggle(term.id) } sx={{
        display: 'flex',
        alignItems: 'center',        
      }}>
        <CardContent sx={{ flex: 1 }}>
          <Typography>{ term.id }</Typography>
          { !compact && <LabelList labels={ term.labels } /> }
        </CardContent>
        <CardContent>
          <TermButtonGroup termId={ term.id} />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

TermCard.propTypes = {
  term: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  compact: PropTypes.bool.isRequired,
}

TermCard.defaultProps = {
  selected: false,
  compact: false,
}
