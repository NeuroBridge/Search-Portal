import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Box, CardContent, Divider, List, ListItem, ListItemText, MenuItem, Select, Stack, Switch } from '@mui/material'
import { useBasket } from '../../../basket'
import { useWorkspace } from '../../workspace'


//

axios.defaults.timeout = 5000

//

const API_URL = `https://neurobridges-ml.renci.org/nb_translator`
const AND = 'AND'
const OR = 'OR'

//

export const Form = () => {
  const { register } = useWorkspace()
  const basket = useBasket()
  const [operator, setOperator] = useState(AND)
  const [selections, setSelections] = useState({})

  // this effect gets triggered when the basket contents update.
  // it handles updating the values this component holds in its state by
  // first starting with a base selection of "1" for all basket terms.
  useEffect(() => {
    const previousSelections = { ...selections }
    const baseValues = basket.ids.reduce((obj, term) => ({
      ...obj,
      [term]: true,
    }), {})
    setSelections({ ...baseValues, ...previousSelections })
  }, [basket.ids])


  const query = useMemo(() => ({
    [operator.toLowerCase()]: [
      ...Object.keys(selections)
        .filter(id => basket.contents[id])
        .map(id => selections[id] ? id : ({ not: id }) ),
    ]
  }), [operator, selections])

  const handleClickToggleTermSelection = id => event => {
    const newSelections = { ...selections, [id]: event.target.checked}
    setSelections({ ...newSelections })
  }

  useEffect(() => {
    const fetchResults = () => axios.post(
        API_URL,
        JSON.stringify({ query: { expression: query } }),
        { headers: { 'content-type': 'text/html;charset=utf-8' } },
      ).then(response => {
        if (!response?.data) {
          throw new Error('An error occurred while fetching NeuroBridge results.')
        }
        const results = Object.values(response.data).map(result => ({
          title: result.title,
          snippet: result.snippet,
          pmc_link: result.pmc_link,
          url: result.pmc_link,
          score: result.score,
          pmid: result.pmid,
          pmcid: result.pmcid,
        }))
        return results

      }).catch(error => {
        console.error(error)
      })
      register('nb1', fetchResults)
  }, [selections])

  return (
    <Box>
      <CardContent>
        <Stack
          direction="row"
          divider={ <Divider orientation="vertical" flexItem /> }
        >
          <Box sx={{ pr: 4 }}>
            <Select
              value={ operator }
              onChange={ () => setOperator(operator === AND ? OR : AND) }
              sx={{ '.MuiSelect-select': { padding: '0.5rem' }, width: '100px' }}
            >
              <MenuItem value={ AND }>{ AND }</MenuItem>
              <MenuItem value={ OR }>{ OR }</MenuItem>
            </Select>
          </Box>
          <List>
            {
              Object.keys(basket.contents)
                .filter(id => basket.contents[id])
                .map(id => (
                  <ListItem key={ `basket-item=${ id }` }>
                    <Switch edge="start" checked={ id in selections && selections[id] } tabIndex={ -1 } onChange={ handleClickToggleTermSelection(id) } />
                    <ListItemText>{ id }</ListItemText>
                  </ListItem>
                ))
            }
          </List>
        </Stack>
      </CardContent>
    </Box>
  )
}
