import PropTypes from 'prop-types'
import { Chip } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  '@keyframes fadeIn': {
    from: { filter: 'opacity(0.0)' },
    to: { filter: 'opacity(1.0)' },
  },
  list: {
    maxWidth: '100%',
    margin: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: '1rem',
    position: 'relative',
  },
  termChip: {
    borderRadius: theme.shape.borderRadius,
    padding: `8px`,
    height: 'unset',
    border: `1px solid ${ theme.palette.primary.dark }`,
    animation: '$fadeIn 350ms ease-in',
    backgroundColor: '#dde',
    transition: 'background-color 250ms',
    '&:hover': {
      backgroundColor: '#eee !important',
    },
  },
  chipLabelPrimary: {
    fontSize: '110%',
    textTransform: 'uppercase',
  },
  chipLabelSecondary: {
    fontStyle: 'italic',
    color: 'dimgrey',
  },
}))

const TermChip = ({ term, ...props }) => {
  const classes = useStyles()
  return (
    <Chip
      variant="outlined"
      color="primary"
      size="medium"
      className={ classes.termChip }
      label={
        <div className={ classes.chipLabel }>
          <div className={ classes.chipLabelPrimary }>{ term.label }</div>
          <div className={ classes.chipLabelSecondary }>{ term.short_form }</div>
        </div>
      }
      { ...props }
    />
  )
}

TermChip.propTypes = {
  term: PropTypes.object.isRequired,
}

export const SelectionList = ({ items, onItemDelete, onItemClick }) => {
  const classes = useStyles()

  return (
    <div className={ classes.list }>
      {
        items.map(item => (
          <TermChip
            key={ `selected-${ item.label }` }
            term={ item }
            onDelete={ () => onItemDelete(item) }
            onClick={ () => onItemClick(item) }
          />
        ))
      }
    </div>
  )
}

SelectionList.propTypes = {
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.func,
  onItemDelete: PropTypes.func,
  onDeleteSelection: PropTypes.func,
}
