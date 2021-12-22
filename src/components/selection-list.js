import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  '@keyframes fadeIn': {
    from: { filter: 'opacity(0.0)' },
    to: { filter: 'opacity(1.0)' },
  },
  list: {
    maxWidth: '100%',
    margin: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: theme.spacing(1),
    position: 'relative',
  },
  termChip: {
    borderRadius: '2px',
    padding: `${ theme.spacing(1) }px ${ theme.spacing(1) / 2 }px`,
    height: 'unset',
    borderLeft: '4px solid #272f41',
    animation: '$fadeIn 350ms ease-in',
  },
  chipLabelPrimary: {
    fontSize: '110%',
    textTransform: 'uppercase',
  },
  chipLabelSecondary: {
    fontStyle: 'italic',
    color: 'dimgrey',
  },
  clearButton: {
    position: 'absolute',
    top: -theme.spacing(1),
    right: -theme.spacing(1),
    backgroundColor: '#eee',
  },
}))

const ChipLabel = ({ term }) => {
  const classes = useStyles()
  return (
    <Fragment>
      <div className={ classes.chipLabelPrimary }>{ term.label }</div>
      <div className={ classes.chipLabelSecondary }>{ term.short_form }</div>
    </Fragment>
  )
}

ChipLabel.propTypes = {
  term: PropTypes.object.isRequired,
}

export const SelectionList = ({ items, onItemDelete, onItemClick }) => {
  const classes = useStyles()

  return (
    <div className={ classes.list }>
      {
        items.map(item => (
          <Chip
            key={ `selected-${ item.label }` }
            className={ classes.termChip }
            label={ <ChipLabel term={ item } /> }
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
