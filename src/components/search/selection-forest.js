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
    isSelectedTerm,
    selectedRoots,
    toggleRootSelection,
  } = useSearchContext()

  /**
   *
   * memoized array of tree objects,
   * each of which is rooted at a selected
   * term (from `selectedRoots`).
   *
   */
  const forest = useMemo(() => {
    return Object.keys(selectedRoots)
      .map(term => selectedRoots[term].tree)
  }, [selectedRoots])

  /**
   *
   * this callback determines which selected icon to show in
   * each node's selection checkbox -- a red x or green check.
   *
   */
  const selectionIcon = useCallback(termId => {
    const index = selectedTerms.findIndex(term => term.id === termId)
    if (index === -1) {
      return
    }
    if (selectedTerms[index].value === 2) {
      return <IgnoreTermIcon sx={{ color: '#966' }} />
    }
    return <SelectedTermIcon sx={{ color: '#696' }} />
  }, [selectedTerms])

  const renderTree = (node, level = 0) => {
    console.log(node)
    return (
      <TreeItem
        key={ `${ node.data.id }-${ level }` }
        nodeId={ node.data.id }
        label={
          <FormControlLabel
            label={ `${ node.data.id } (${ node.data.rootId })` }
            control={
              <Checkbox
                checked={ isSelectedTerm(node.data.id) }
                checkedIcon={ selectionIcon(node.data.id) }
                onClick={ event => event.stopPropagation() }
                onChange={ () => toggleTermSelection(node.data.id, node.data.rootId) }
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
            if (tree) {
              return (
                <Card key={ `tree-${ i }` }>
                  <CardHeader
                    title={ tree.data.id }
                    action={
                      <Tooltip title="Remove this term" placement="left">
                        <IconButton
                          aria-label="Remove this term"
                          onClick={ () => toggleRootSelection(selectedRoots[tree.data.id]) }
                        >
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

