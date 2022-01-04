import { Fragment, useMemo } from 'react'
import { useSearchContext } from './'
import { TreeView, TreeItem } from '@mui/lab'
import { Checkbox, CircularProgress, FormControlLabel, IconButton, Typography } from '@mui/material'
import {
  DeleteSweep as ClearSelectionIcon,
  ExpandLess as CollapseIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  drawerHeading: {
    color: theme.palette.primary.dark,
    padding: theme.spacing(2),
  },
  forestContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: `2px 0`,
    backgroundColor: theme.palette.primary.light,
    gap: '2px',
  },
  treeContainer: {
    backgroundColor: '#ccc',
  },
  loadingIndicator: {
    backgroundColor: '#aaa',
    padding: `${ theme.spacing(1.5) } ${ theme.spacing(4) }`,
    display: 'flex',
    gap: theme.spacing(2),
  },
}))

export const SelectionForest = () => {
  const classes = useStyles()
  const {
    selectedRootTerms,
    clearRootTermSelection,
    selectedTerms,
    clearTermSelection,
    toggleTermSelection,
  } = useSearchContext()

  const forest = useMemo(() => {
    return Object.keys(selectedRootTerms)
      .map(term => selectedRootTerms[term].tree)
  }, [selectedRootTerms])

  const handleToggleTermSelection = id => () => toggleTermSelection(id)

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
                checked={ selectedTerms.includes(node.data.id) }
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
    <Fragment>
      <div className={ classes.drawerHeading }>
        <Typography variant="h5">
          { Object.keys(selectedRootTerms).length } Root Term{ Object.keys(selectedRootTerms).length === 1 ? '' : 's' }
          <IconButton onClick={ clearRootTermSelection } disabled={ Object.keys(selectedRootTerms).length === 0 }>
            <ClearSelectionIcon />
          </IconButton>
        </Typography>
        <Typography variant="h6">
          { selectedTerms.length } selected term{ selectedTerms.length === 1 ? '' : 's'}
          <IconButton onClick={ clearTermSelection } disabled={ selectedTerms.length === 0 }>
            <ClearSelectionIcon />
          </IconButton>
        </Typography>
      </div>
      
      <TreeView
        aria-label="term selection"
        defaultCollapseIcon={ <CollapseIcon /> }
        defaultExpandIcon={ <ExpandIcon /> }
        defaultEndIcon={ '·' }
        classes={{ root: classes.forestContainer }}
        expanded={ selectedTerms }
      >
          {
            forest.map((tree, i) => {
              console.log(selectedTerms)
              if (tree) {
                return (
                  <div key={ `tree-${ i }` } className={ classes.treeContainer }>
                    { renderTree(tree) }
                  </div>
                )
              }
              return (
                <div key={ `tree-${ i }-loading` } className={ classes.loadingIndicator }>
                  <CircularProgress size={ 25 } />
                  <Typography sx={{ filter: 'opacity(0.5)' }}>Loading...</Typography>
                </div>
              )
            })
          }
      </TreeView>
    </Fragment>
  )
}

