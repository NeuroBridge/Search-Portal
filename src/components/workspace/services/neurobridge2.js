import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, CardContent, Checkbox, Divider, FormControlLabel, Stack, useTheme } from '@mui/material'
import { TreeItem, TreeView } from '@mui/lab'
import {
  ChevronRight as CollapseIcon,
  ExpandMore as ExpandIcon,
  DisabledByDefault as IgnoreTermIcon,
  Cancel as RemoveTermIcon,
  AddCircle as TermSelectedIcon,
  RemoveCircle as TermUnselectedIcon,
  Circle as TermNeutralIcon,
} from '@mui/icons-material'
import { useBasket } from '../../basket'
import { useOntology } from '../../ontology'
import { arrayToTree } from 'performant-array-to-tree'

export const SelectionTreeList = ({ rootTermId }) => {
  const theme = useTheme()
  const basket = useBasket()
  const ontology = useOntology()
  const [values, setValues] = useState({})
  
  useEffect(() => {
    let baseValues = {}
    Object.keys(basket.contents).forEach(id => {
      const descendants = [id, ...ontology.descendantsOf(id)]
      baseValues = {
        ...baseValues,
        ...descendants.map(d => d.id)
          .reduce((obj, id) => ({ ...obj, [id]: 0 }), {}),
      }
    })
    setValues({ ...baseValues, ...values })
  }, [basket.ids])

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

  // this function cleans up and flattens the tree data
  // to make browsing on this view a little simpler.
  const reduceTree = node => {
    return {
      id: node.data.id,
      parentId: node.data.parentId,
      children: node.children.map(reduceTree),
    }
  }

  const tree = reduceTree(arrayToTree(descendants)[0])

  const toggleTermSelection = id => () => {
    const newValue = (values[id] + 1) % 3
    const newValues = { ...values, [id]: newValue }
    setValues(newValues)
  }

  const selectionIcon = value => [
    <TermNeutralIcon key={ 0 } sx={{ color: '#ccc', }} />,
    <TermSelectedIcon key={ 1 } sx={{ color: theme.palette.primary.light, }} />,
    <TermUnselectedIcon key={ 2 } sx={{ color: 'darkred' }} />,
  ][value]

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
            padding: '0.5rem',
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
        sx={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}
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

SelectionTreeList.propTypes = {
  rootTermId: PropTypes.string.isRequired,
}

//

export const NeuroBridge2ServiceInterface = ({ doSearch }) => {
  const basket = useBasket()

  const query = useMemo(() => {
    return 'query query query'
  }, [basket.ids])

  const handleClickQueryButton = () => {
    doSearch(async () => {
      return [
        { title: 'a', pubmed_url: 'https://google.com', pmid: '1234' },
        { title: 'few', pubmed_url: 'https://google.com', pmid: '1235' },
        { title: 'sample', pubmed_url: 'https://google.com', pmid: '1236' },
        { title: 'results', pubmed_url: 'https://google.com', pmid: '1237' },
      ]
    })
  }

  return (
    <Box>
      <CardContent>
        <Stack divider={ <Divider /> }>
          {
            basket.ids.map(id => (
              <SelectionTreeList
                key={ `${ id }-selection-tree` }
                rootTermId={ id }
              />
            ))
          }
        </Stack>
      </CardContent>

      <Divider />

      <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={ handleClickQueryButton }>Send Query</Button>
      </CardContent>
    </Box>
  )
}

NeuroBridge2ServiceInterface.propTypes = {
  doSearch: PropTypes.func.isRequired,
}
