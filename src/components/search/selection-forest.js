import { useCallback, useMemo } from 'react'
import { useSearchContext } from './'
import { TreeView, TreeItem } from '@mui/lab'
import { Card, CardHeader, CardContent, Checkbox, FormControlLabel, IconButton, Skeleton, Tooltip } from '@mui/material'
import {
  ExpandLess as CollapseIcon,
  ExpandMore as ExpandIcon,
  DisabledByDefault as IgnoreTermIcon,
  Cancel as RemoveTermIcon,
  CheckBox as SelectedTermIcon,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  forestContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(4),
  },
}))

export const SelectionForest = () => {
  const classes = useStyles()
  const {
    selectedTerms,
    toggleTermSelection,
    selectedRootTerms,
    toggleRootTermSelection,
  } = useSearchContext()

  /**
   *
   * memoized array of tree objects,
   * each of which is rooted at a selected
   * term (from `selectedRootTerms`).
   *
   */
  const forest = useMemo(() => {
    return Object.keys(selectedRootTerms)
      .map(term => selectedRootTerms[term].tree)
  }, [selectedRootTerms])

  const handleToggleTermSelection = id => () => {
    toggleTermSelection(id)
  }

  const handleToggleRootTermSelection = term => () => {
    toggleRootTermSelection(term)
  }

  const selectionIcon = useCallback(termId => {
    if (selectedTerms[termId] === 2) {
      return <IgnoreTermIcon sx={{ color: '#966' }} />
    }
    return <SelectedTermIcon sx={{ color: '#696' }} />
  }, [selectedTerms])

  const renderTree = (node, level = 0) => {
    return (
      <TreeItem
        key={ `${ node.data.id }-${ level }` }
        nodeId={ node.data.id }
        label={
          <FormControlLabel
            label={ node.data.id }
            control={
              <Checkbox
                checked={ node.data.id in selectedTerms && selectedTerms[node.data.id] ? true : false }
                checkedIcon={ selectionIcon(node.data.id) }
                onClick={ event => event.stopPropagation() }
                onChange={ handleToggleTermSelection(node.data.id) }
              />
            }
          />
        }
      >
        {
          Array.isArray(node.children)
            ? node.children.map(child => renderTree(child, level + 1))
            : null
        }
      </TreeItem>
    )
  }

  return (
    <TreeView
      aria-label="term selection"
      defaultCollapseIcon={ <CollapseIcon /> }
      defaultExpandIcon={ <ExpandIcon /> }
      defaultEndIcon={ '·' }
      classes={{ root: classes.forestContainer }}
    >
        {
          forest.map((tree, i) => {
            console.log(tree)
            if (tree) {
              return (
                <Card key={ `tree-${ i }` }>
                  <CardHeader
                    title={ tree.data.id }
                    action={
                      <Tooltip title="Remove this term" placement="left">
                        <IconButton aria-label="Remove this term" onClick={ handleToggleRootTermSelection(selectedRootTerms[tree.data.id]) }>
                          <RemoveTermIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <CardContent>
                    { renderTree(tree) }
                  </CardContent>
                </Card>
              )
            }
            return (
              <Card key={ `tree-${ i }-loading` }>
                <CardContent>
                  <Skeleton variant="rectangular" width={ 250 } height={ 20 } />
                </CardContent>
                <CardContent>
                  <Skeleton variant="rectangular" width={ 600 } height={ 40 } />
                </CardContent>
              </Card>
            )
          })
        }
    </TreeView>
  )
}

