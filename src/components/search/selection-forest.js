import { useCallback, useMemo } from 'react'
import { useSearchContext } from './'
import { TreeView, TreeItem } from '@mui/lab'
import { Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material'
import {
  ExpandLess as CollapseIcon,
  ExpandMore as ExpandIcon,
  DisabledByDefault as IgnoreTermIcon,
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
  treeContainer: {
    backgroundColor: '#f3f6f9',
    transition: 'border-color 250ms',
    border: `1px solid #afb9c099`,
    padding: theme.spacing(2),
    '&:hover': {
      borderColor: theme.palette.secondary.main,
    },
  },
  treeRootName: {
    padding: 0,
    marginBottom: theme.spacing(1),
  },
  loadingIndicator: {
    backgroundColor: '#f0f3f6',
    border: `1px solid #afb9c099`,
    padding: `${ theme.spacing(3) } ${ theme.spacing(4) }`,
    display: 'flex',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
    width: '100%',
  },
}))

export const SelectionForest = () => {
  const classes = useStyles()
  const {
    selectedRootTerms,
    selectedTerms,
    toggleTermSelection,
  } = useSearchContext()

  const forest = useMemo(() => {
    return Object.keys(selectedRootTerms)
      .map(term => selectedRootTerms[term].tree)
  }, [selectedRootTerms])

  const handleToggleTermSelection = id => () => {
    toggleTermSelection(id)
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
            if (tree) {
              return (
                <div key={ `tree-${ i }` }>
                  <Typography variant="h3" className={ classes.treeRootName }>
                    { tree.data.id }
                  </Typography>
                  <div className={ classes.treeContainer }>
                    { renderTree(tree) }
                  </div>
                </div>
              )
            }
            return (
              <div key={ `tree-${ i }-loading` }>
                <h3 className={ classes.treeRootName } style={{ backgroundColor: '#eee' }}>
                  &nbsp;
                </h3>
                <div className={ classes.loadingIndicator }>
                  <CircularProgress size={ 25 } />
                  <Typography sx={{ filter: 'opacity(0.5)' }}>Loading...</Typography>
                </div>
              </div>
            )
          })
        }
    </TreeView>
  )
}

