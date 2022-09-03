import { Fragment, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box, Checkbox, FormControlLabel, useTheme } from '@mui/material'
import { TreeItem, TreeView } from '@mui/lab'
import {
  ChevronRight as CollapseIcon,
  ExpandMore as ExpandIcon,
  AddCircle as TermSelectedIcon,
  RemoveCircle as TermUnselectedIcon,
  Circle as TermNeutralIcon,
} from '@mui/icons-material'
import { arrayToTree } from 'performant-array-to-tree'
import { useOntology } from '../../../ontology'
import { useInterfaceContext } from './form'

export const SelectionTree = ({ rootTermId }) => {
  const theme = useTheme()
  const ontology = useOntology()
  const { toggleTermSelection } = useInterfaceContext()
  const { values } = useInterfaceContext()

  // to play nicely with `arrayToTree`, we'll set
  // our root term to have no parent so that it doesn't
  // expect to find and render the term's parent.
  const descendants = [
    {
      id: rootTermId,
      parentId: null,
    },
    ...ontology.descendantsOf(rootTermId),
  ]

  // this function aids in generating a tree object
  // suitable for the MUI TreeView component.
  const reduceTree = node => {
    return ({
      id: node.data.id,
      parentId: node.data.parentId,
      children: node.children.map(reduceTree),
    })
  }

  // this is the tree, ready for MUI's TreeView.
  const tree = reduceTree(arrayToTree(descendants)[0])

  // this function returns the apropriate icon to render,
  // based on the user's selection.
  const selectionIcon = useCallback(value => [
    <TermNeutralIcon sx={{ color: '#ccc', }} key={ `icon-0` } />,
    <TermSelectedIcon sx={{ color: theme.palette.primary.light, }} key={ `icon-1` } />,
    <TermUnselectedIcon sx={{ color: 'darkred' }} key={ `icon-2` } />,
  ][value], [])

  // this recursive function handles rendering the nesting of tree list items
  // to create the tree of descendants for each term.
  const renderSelectionTree = useCallback(node => {
    return (
      <TreeItem
        key={ node.id }
        nodeId={ node.id }
        label={
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <FormControlLabel
              label={ node.id }
              control={
                <Checkbox
                  checked={ true }
                  checkedIcon={ selectionIcon(values[node.id]) }
                  onClick={ event => event.stopPropagation() }
                  onChange={ toggleTermSelection(node.id) }
                />
              }
            />
          </Box>
        }
      >
        {
          Array.isArray(node.children)
            ? node.children.map(n => renderSelectionTree(n))
            : null
        }
      </TreeItem>
    )
  })

  return (
    <Fragment>
      <TreeView
        sx={{ flexGrow: 1, width: '100%', overflowY: 'auto', }}
        defaultCollapseIcon={ <ExpandIcon /> }
        defaultExpandIcon={ <CollapseIcon /> }
        disabledItemsFocusable
        disableSelection
      >
        { renderSelectionTree(tree) }
      </TreeView>
    </Fragment>
  )
}

SelectionTree.propTypes = {
  rootTermId: PropTypes.string.isRequired,
}

//

