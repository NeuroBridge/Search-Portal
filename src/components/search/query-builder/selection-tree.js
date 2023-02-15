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
import { useDrawer } from '../../drawer'
import { useQueryBuilder } from './context'
import { SelectionTreeMenu } from './selection-tree-menu'

export const SelectionTree = ({ term }) => {
  const theme = useTheme()
  const drawer = useDrawer()
  const { removeTerm, toggleTermState, query } = useQueryBuilder()

  // this function returns the apropriate icon to render,
  // based on the user's selection.
  const selectionIcon = useCallback(value => ({
    'neutral': <TermNeutralIcon sx={{ color: 'concept.neutral', }} key={ `icon-0` } />,
    'positive': <TermSelectedIcon sx={{ color: 'concept.positive', }} key={ `icon-1` } />,
    'negative': <TermUnselectedIcon sx={{ color: 'concept.negative' }} key={ `icon-2` } />,
  }[value]), [])

  // this recursive function handles rendering the nesting of tree list items
  // to create the tree of descendants for each term.
  const renderSelectionTree = useCallback(node => {
    return (
      <TreeItem
        key={ node.name }
        nodeId={ node.name }
        sx={{
          borderLeft: term.name === node.name
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
              label={ node.name }
              control={
                <Checkbox
                  checked={ true }
                  checkedIcon={ selectionIcon(node.state) }
                  onClick={ event => event.stopPropagation() }
                  onChange={ () => toggleTermState(node.path) }
                />
              }
            />
            {
              term.name === node.name && (
                <SelectionTreeMenu items={[
                  {
                    key: 'remove',
                    icon: <RemoveTermIcon />,
                    color: theme.palette.warning.main,
                    action: handleClickRemoveTerm,
                    tooltip: 'Remove Term',
                  },
                  {
                    key: 'inspect',
                    icon: <InspectTermIcon sx={{ transform: 'rotate(-90deg)' }}/> ,
                    color: theme.palette.info.main,
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
  }, [query])

  const handleClickRemoveTerm = () => {
    removeTerm(term.name)
  }

  const handleClickInspectTerm = () => {
    drawer.setTermId(term.name)
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
        { renderSelectionTree(term) }
      </TreeView>
    </Stack>
  )
}

SelectionTree.propTypes = {
  term: PropTypes.object.isRequired,
}
