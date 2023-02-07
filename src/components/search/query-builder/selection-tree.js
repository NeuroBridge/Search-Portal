import { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Checkbox, FormControlLabel,
  Stack, useTheme,
} from '@mui/material'
import { TreeItem, TreeView } from '@mui/lab'
import {
  ChevronRight as CollapseIcon,
  ExpandMore as ExpandIcon,
  ArrowDropDownCircle as InspectTermIcon,
  Delete as RemoveTermIcon,
  AddCircle as TermSelectedIcon,
  RemoveCircle as TermUnselectedIcon,
  Circle as TermNeutralIcon,
} from '@mui/icons-material'
import { arrayToTree } from 'performant-array-to-tree'
import { useDrawer } from '../../drawer'
import { useOntology } from '../../ontology'
import { useQueryBuilder } from './query-builder'
import { SelectionTreeMenu } from './selection-tree-menu'

export const SelectionTree = ({ rootTermId }) => {
  const theme = useTheme()
  const drawer = useDrawer()
  const ontology = useOntology()
  const { removeTerm, toggleTermSelection, values } = useQueryBuilder()

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
    <TermNeutralIcon sx={{ color: 'concept.neutral', }} key={ `icon-0` } />,
    <TermSelectedIcon sx={{ color: 'concept.positive', }} key={ `icon-1` } />,
    <TermUnselectedIcon sx={{ color: 'concept.negative' }} key={ `icon-2` } />,
  ][value], [])

  // this recursive function handles rendering the nesting of tree list items
  // to create the tree of descendants for each term.
  const renderSelectionTree = useCallback(node => {
    return (
      <TreeItem
        key={ node.id }
        nodeId={ node.id }
        sx={{
          borderLeft: rootTermId === node.id
            ? 0
            : `2px solid ${ theme.palette.background.default }`,
          '&:last-child': { borderBottomLeftRadius: '0.75rem' },
        }}
        label={
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 2,
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
            {
              rootTermId === node.id && (
                <SelectionTreeMenu items={[
                  {
                    key: 'remove',
                    icon: <RemoveTermIcon color="warning" />,
                    action: handleClickRemoveTerm,
                    tooltip: 'Remove Term',
                  },
                  {
                    key: 'inspect',
                    icon: <InspectTermIcon color="info" sx={{ transform: 'rotate(-90deg)' }}/> ,
                    action: handleClickInspectTerm,
                    tooltip: 'View Ontology Context',
                  },
                ]} />
              )
            }
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

  const handleClickRemoveTerm = () => {
    removeTerm(rootTermId)
  }

  const handleClickInspectTerm = () => {
    drawer.setTermId(rootTermId)
  }

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      gap={ 1 }
      sx={{
        width: '100%',
      }}
    >
      <TreeView
        sx={{
          flex: 1,
          width: '100%',
          overflowY: 'auto',
          border: `2px solid ${ theme.palette.background.default }`,
          borderBottomLeftRadius: '0.75rem',
        }}
        defaultCollapseIcon={ <ExpandIcon color="secondary" /> }
        defaultExpandIcon={ <CollapseIcon /> }
        disabledItemsFocusable
        disableSelection
      >
        { renderSelectionTree(tree) }
      </TreeView>
    </Stack>
  )
}

SelectionTree.propTypes = {
  rootTermId: PropTypes.string.isRequired,
}
