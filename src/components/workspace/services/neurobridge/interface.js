import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Box, Button, CardContent, Switch, Divider, List, ListItem, ListItemText, Select, MenuItem } from '@mui/material'
import { useBasket } from '../../../basket'

//

const API_URL = `https://neurobridges-ml.edc.renci.org:5000/nb_translator`
const AND = 'AND'
const OR = 'OR'

//

export const Interface = ({ searchWrapper }) => {
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

  const handleClickToggletermSelection = id => event => {
    const newSelections = { ...selections, [id]: event.target.checked}
    setSelections({ ...newSelections })
  }

  const handleClickQueryButton = () => {
    searchWrapper(async () => {
      try {
        const { data } = await axios.post(API_URL, { expression: query })
        if (!data) {
          throw new Error('An error occurred while fetching results.')
        }
        const results = Object.values(data).map(result => ({
          title: result.title[0],
          pmid: result.pmid,
          url: result.pmc_link,
        }))
        return results
      } catch (error) {
        return []
      }
    })
  }

  return (
    <Box>
      <CardContent>
        <Select
          value={ operator }
          onChange={ () => setOperator(operator === AND ? OR : AND) }
          sx={{ '.MuiSelect-select': { padding: '0.5rem' } }}
        >
          <MenuItem value={ AND }>{ AND }</MenuItem>
          <MenuItem value={ OR }>{ OR }</MenuItem>
        </Select>

        <List>
          {
            Object.keys(basket.contents)
              .filter(id => basket.contents[id])
              .map(id => (
                <ListItem key={ `basket-item=${ id }` }>
                  <Switch edge="start" checked={ id in selections && selections[id] } tabIndex={ -1 } onChange={ handleClickToggletermSelection(id) } />
                  <ListItemText>{ id }</ListItemText>
                </ListItem>
              ))
          }
        </List>
        <pre style={{ backgroundColor: '#eee', color: '#789', fontSize: '75%', margin: 0, padding: '0.5rem', whiteSpace: 'pre-wrap' }}>
          { JSON.stringify(query, null, 2) }
        </pre>
      </CardContent>

      <Divider />

      <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={ handleClickQueryButton }>Send Query</Button>
      </CardContent>
    </Box>
  )
}

Interface.propTypes = {
  searchWrapper: PropTypes.func.isRequired,
}
