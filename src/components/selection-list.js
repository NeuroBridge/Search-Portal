import PropTypes from 'prop-types'
import { Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  list: {
    maxWidth: '100%',
    margin: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: theme.spacing(1),
    position: 'relative',
  },
  clearButton: {
    position: 'absolute',
    top: -theme.spacing(1),
    right: -theme.spacing(1),
    backgroundColor: '#eee',
  },
}))

export const SelectionList = ({ items, onItemDelete, onItemClick }) => {
  const classes = useStyles()

  return (
    <div
      elevation={ 1 }
      className={ classes.list }
    >
      {
        items.map(item => (
          <Chip
            key={ `selected-${ item.label }` }
            label={ item.label }
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
