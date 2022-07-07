import PropTypes from 'prop-types'
import {
  Card, CardActionArea, CardContent, Typography,
} from '@mui/material'
import { LabelList } from './label-list'
import { TermActionButtons } from '../term-action-buttons'

//

export const TermCard = ({ term, selected, compact, onClick }) => {
  return (
    <Card sx={{
      border: `1px solid #1976d2${ selected ? 'ff' : '11' }`,
      transition: 'border-color 250ms',
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        border: `1px solid #1976d2${ selected ? 'ff' : '66' }`,
        cursor: 'pointer',
      },
    }}>
      <CardActionArea onClick={ onClick } sx={{ flex: 1 }}>
        <CardContent>
          <Typography>{ term.id }</Typography>
          { !compact && <LabelList labels={ term.labels } /> }
        </CardContent>
      </CardActionArea>
      <CardContent>
        <TermActionButtons termId={ term.id} />
      </CardContent>
    </Card>
  )
}

TermCard.propTypes = {
  term: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  compact: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

TermCard.defaultProps = {
  selected: false,
  compact: false,
}

