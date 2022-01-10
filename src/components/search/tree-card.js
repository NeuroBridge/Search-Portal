import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TreeItem } from '@mui/lab'
import {
  Card, CardHeader, CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Skeleton,
  Tooltip,
} from '@mui/material'
import {
  DisabledByDefault as IgnoreTermIcon,
  Cancel as RemoveTermIcon,
  CheckBox as SelectedTermIcon,
} from '@mui/icons-material'
import { makeStyles, useTheme } from '@mui/styles'
import { useSearchContext } from './'
import { arrayToTree } from 'performant-array-to-tree'

const useStyles = makeStyles(theme => ({
  forestContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
  },
  treeCardHeader: {
    backgroundColor: theme.palette.grey[200],
    padding: `${ theme.spacing(1) } ${ theme.spacing(2) }`,
  },
  treeCardContent: {
    padding: '0 !important',
  },
}))

export const TreeCard = ({ root }) => {
  const classes = useStyles()
  const theme = useTheme()
  // the relations need to be transformed into
  // a tree structure for the TreeView component.
  const [tree, setTree] = useState(null)
  const {
    toggleRootSelection,
    toggleTermSelection,
    rootHasTermSelected,
    rootSelectedTermsCount,
    termValue,
  } = useSearchContext()
  const count = rootSelectedTermsCount(root.short_form)

  // construct the tree when the given root's relations changes
  useEffect(() => {
    if (root.relations && root.relations.length) {
      const [tree] = arrayToTree(root.relations)
      setTree(tree)
    }
  }, [root.relations])
  
  const selectionIcon = useCallback(value => {
    return [
      <span key={ 0 } />,
      <SelectedTermIcon key={ 1 } sx={{ color: theme.palette.secondary.main }} />,
      <IgnoreTermIcon key={ 2 } sx={{ color: theme.palette.danger }} />,
    ][value]
  }, [])

  const handleChange = (rootId, id) => event => {
    const ctrlKeyDown = event?.nativeEvent?.ctrlKey
    // the last argument passed below defines whether to
    // `cascade` the `newValue` to all descendants,
    // which the user prevents by pressing the ctrl key
    toggleTermSelection(rootId, id, !ctrlKeyDown)
  }

  const renderSelectionTree = (option, level = 0) => {
    option.data.rootId = root.short_form
    const { id, rootId } = option.data

    return (
      <TreeItem
        key={ `${ option.data.id }-${ level }` }
        nodeId={ option.data.id }
        label={
          <FormControlLabel
            label={ id }
            control={
              <Checkbox
                checked={ rootHasTermSelected(rootId, id) }
                checkedIcon={ selectionIcon(termValue(rootId, id)) }
                onClick={ event => event.stopPropagation() }
                onChange={ handleChange(rootId, id) }
              />
            }
          />
        }
      >
        {
          Array.isArray(option.children)
            ? option.children.map(child => renderSelectionTree(child, level + 1))
            : null
        }
      </TreeItem>
    )
  }

  if (!tree) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="rectangular" width={ 250 } height={ 20 } />
        </CardContent>
        <CardContent>
          <Skeleton variant="rectangular" width={ 600 } height={ 40 } />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="outlined">
      <CardHeader
        disableTypography
        title={ <span>{ tree.data.id } { count > 0 ? `(${ count } selections)` : '' }</span> }
        className={ classes.treeCardHeader }
        action={
          <Tooltip title="Remove this term" placement="left">
            <IconButton
              aria-label="Remove this term"
              onClick={ () => toggleRootSelection(root) }
              sx={{ '&:hover': { color: theme.palette.danger } }}
            >
              <RemoveTermIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent className={ classes.treeCardContent }>
        { renderSelectionTree(tree) }
      </CardContent>
    </Card>
  )
}

TreeCard.propTypes = {
  root: PropTypes.object.isRequired,
}